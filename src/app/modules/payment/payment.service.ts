import { PaymentStatus } from "@prisma/client";
import Stripe from "stripe";
import prisma from "../../config/prisma";

// Create payment
const stripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    // Handle completed checkout session
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;
      const paymentStatus = session?.payment_status;

      if (paymentId && appointmentId) {
        // Update appointment records
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            paymentStatus:
              paymentStatus === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });

        // Update payment records
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            paymentGateway: session,
            paymentStatus:
              paymentStatus === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });
      }
      break;
    }

    // Handle expired checkout session
    case "checkout.session.expired": {
      const session = event.data.object as any;
      const doctorId = session.metadata?.doctorId;
      const scheduleId = session.metadata?.scheduleId;
      const paymentId = session.metadata?.paymentId;
      const appointmentId = session.metadata?.appointmentId;

      // Release booked slot
      await prisma.$transaction(async (tx) => {
        // Delete payment record
        if (paymentId) {
          await tx.payment.delete({
            where: {
              id: paymentId,
            },
          });
        }

        // Delete appointment record
        if (appointmentId) {
          await tx.appointment.delete({
            where: {
              id: appointmentId,
            },
          });
        }

        // Update isBooked status
        if (doctorId && scheduleId) {
          await tx.doctorSchedule.update({
            where: {
              scheduleId_doctorId: { doctorId, scheduleId },
            },
            data: { isBooked: false },
          });
        }
      });

      break;
    }

    // Handle other event types
    default:
      break;
  }

  return { paymentReceived: true };
};

// payment service object
const PaymentService = {
  stripeWebhook,
};

export default PaymentService;
