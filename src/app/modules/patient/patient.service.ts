import { Patient } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../config";
import prisma from "../../config/prisma";
import { IPatient } from "./patient.interface";

// Create patient
const createPatient = async (
  payload: IPatient,
  password: string
): Promise<Patient> => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt);

  // Create patient within a transaction
  const result = await prisma.$transaction(async (transactionId) => {
    // Create user
    await transactionId.user.create({
      data: {
        email: payload?.email,
        password: hashedPassword,
      },
    });

    // Create patient
    return await transactionId.patient.create({
      data: payload,
    });
  });

  return result;
};

// Update patient
const updatePatient = async (userEmail: string, payload: any) => {
  const { healthRecord, medicalReport, ...patientData } = payload;

  // Find patient by email
  const patient = await prisma.patient.findUniqueOrThrow({
    where: { email: userEmail },
  });

  // Convert dateOfBirth to Date object if present
  if (healthRecord?.dateOfBirth) {
    healthRecord.dateOfBirth = new Date(healthRecord.dateOfBirth);
  }

  const result = await prisma.$transaction(async (tx) => {
    // Update patient data
    await tx.patient.update({
      where: { id: patient.id, isDeleted: false },
      data: patientData,
    });

    // Update or create health record and medical report
    if (healthRecord) {
      await tx.healthRecord.upsert({
        where: { patientId: patient.id },
        update: healthRecord,
        create: {
          patientId: patient.id,
          ...healthRecord,
        },
      });
    }

    // Create medical report if provided
    if (medicalReport) {
      await tx.medicalReport.create({
        data: {
          patientId: patient.id,
          ...medicalReport,
        },
      });
    }

    // Fetch and return the updated patient with relations
    const updatedPatiend = await tx.patient.findUniqueOrThrow({
      where: { id: patient.id },
      include: {
        healthRecords: true,
        medicalReports: true,
      },
    });

    return updatedPatiend;
  });

  return result;
};

// Patient service object
const PatientService = {
  createPatient,
  updatePatient,
};

export default PatientService;
