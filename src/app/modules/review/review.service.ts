import prisma from "../../config/prisma";
import httpStatus from "http-status";
import AppError from "../../error/AppError";

// Create review
const createReview = async (
  userEmail: string,
  payload: {
    appointmentId: string;
    rating: number;
    comment?: string;
  }
) => {
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: payload?.appointmentId },
    include: {
      patient: true,
    },
  });

  if (userEmail !== appointment?.patient?.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to review this appointment"
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // create review for the appointment
    const review = await tx.review.create({
      data: {
        appointmentId: appointment?.id,
        patientId: appointment?.patientId,
        doctorId: appointment?.doctorId,
        rating: Number(payload?.rating),
        comment: payload?.comment,
      },
    });

    // get average rating of the doctor
    const avgRating = await tx.review.aggregate({
      where: {
        doctorId: appointment?.doctorId,
      },
      _avg: {
        rating: true,
      },
    });

    // update doctor's average rating
    await tx.doctor.update({
      where: { id: appointment?.doctorId },
      data: {
        averageRating: avgRating?._avg?.rating as number,
      },
    });

    return review;
  });

  return result;
};

// Review service object
const ReviewService = {
  createReview,
};

export default ReviewService;
