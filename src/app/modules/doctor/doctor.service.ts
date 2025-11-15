import { Doctor, Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";
import paginationHelper from "../../utils/paginationHelper";
import { IPagination } from "../user/user.interface";
import { IDoctor, IUpdateDoctor } from "./doctor.interface";
import openai from "../../config/openAI";

// Get all doctors
const getAllDoctors = async (
  paginationOptions: IPagination,
  filterOptions: Record<string, unknown>
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Filter options
  const { searchTerm, doctorSpecialties, ...filterableFields } = filterOptions;
  const searchableFields = ["name", "email"];

  const andConditions: Prisma.DoctorWhereInput[] = [];
  // Search by term
  if (searchTerm) {
    andConditions.push({
      OR: searchableFields?.map((field) => ({
        [field]: {
          contains: (searchTerm as string) || "",
          mode: "insensitive",
        },
      })),
    });
  }

  // Search by doctor specialties
  if (doctorSpecialties) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: (doctorSpecialties as string) || "",
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  // Other exact match filters
  if (Object.keys(filterableFields).length > 0) {
    andConditions.push({
      ...filterableFields,
    });
  }

  // 🧩 Final where condition
  const where: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Find posts
  const result = await prisma.doctor.findMany({
    take: limit,
    skip,
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  // pagination data
  const total = await prisma.doctor.count();
  const meta = {
    limit,
    page,
    total,
  };

  return { data: result, meta };
};

// Get single doctor
const getSingleDoctor = async (doctorId: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },

    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },

      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
    },
  });

  return result;
};

// Create doctor
const createDoctor = async (
  payload: IDoctor,
  password: string
): Promise<Doctor> => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt);

  // Create doctor within a transaction
  const result = await prisma.$transaction(async (transactionId) => {
    // Create user
    await transactionId.user.create({
      data: {
        email: payload?.email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
      },
    });

    // Create doctor
    return await transactionId.doctor.create({
      data: payload,
    });
  });

  return result;
};

// Doctor ai suggestion
const doctorAiSuggestion = async (payload: { symptoms: string }) => {
  if (!payload?.symptoms) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Symptoms are required for AI suggestions"
    );
  }

  const doctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  // Construct the AI prompt
  const prompt = `
    You are an advanced Medical Recommendation Assistant AI.

    A patient has reported the following symptoms:
    "${payload.symptoms}"

    Below is a list of available doctors and their specialties (in JSON):
    ${JSON.stringify(doctors, null, 2)}

    Your task:
    1. Analyze the patient's symptoms.
    2. Identify and rank the top 3 most relevant doctors who are best suited to diagnose or treat these symptoms.
    3. For each recommended doctor, provide a clear medical reasoning for why they are a good fit.
    4. Include the *full doctor data* (exactly as stored in the database) for each selected doctor.

    Return the result in *valid JSON format only* as shown below:
    {
      "recommended_doctors": [
        {
          "doctor_data": { /* full doctor record from DB */ },
          "reasoning": "Detailed explanation of suitability."
        }
      ]
    }

    Ensure the JSON is syntactically valid and contains no extra commentary.
    `;

  // Call the AI model
  const completion = await openai.chat.completions.create({
    model: "mistralai/ministral-8b",
    messages: [
      {
        role: "system",
        content:
          "You are a precise and medically knowledgeable AI that recommends doctors based on symptoms.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
  });

  // Clean completion + parse JSON
  const aiResponse = completion.choices[0].message?.content || "";
  const cleaned = aiResponse.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Invalid AI response format"
    );
  }

  // Extract all doctor_data + reasoning
  const recommendedDoctors = parsed.recommended_doctors.map((item: any) => ({
    doctorData: item.doctor_data,
    reasoning: item.reasoning,
  }));

  return recommendedDoctors;
};

// Update doctor
const updateDoctor = async (
  payload: Partial<IUpdateDoctor>,
  doctorId: string
) => {
  const { specialties, ...doctorInfo } = payload;

  const result = prisma.$transaction(async (transactionId) => {
    // Update specialties info
    if (specialties) {
      // Remove deleted specialties from the doctor
      const deletableSpecialties = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const deleteSpecialty of deletableSpecialties) {
        await transactionId.doctorSpecialties.deleteMany({
          where: {
            doctorId,
            specialtiesId: deleteSpecialty.specialtiesId,
          },
        });
      }

      // Add new specialties to the doctor
      const addableSpecialties = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const addSpecialty of addableSpecialties) {
        await transactionId.doctorSpecialties.create({
          data: {
            doctorId,
            specialtiesId: addSpecialty.specialtiesId,
          },
        });
      }
    }

    // Update doctor info
    const updatedData = await transactionId.doctor.update({
      where: {
        id: doctorId,
      },
      data: doctorInfo,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });

    return updatedData;
  });

  return result;
};

// Doctor service object
const DoctorService = {
  getAllDoctors,
  getSingleDoctor,
  createDoctor,
  doctorAiSuggestion,
  updateDoctor,
};

export default DoctorService;
