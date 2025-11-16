import { PaymentStatus } from "@prisma/client";
import Stripe from "stripe";
import prisma from "../../config/prisma";

// Create payment
const stripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    // Handle successful checkout session
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;
      const paymentStatus = session.payment_status;

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
      const { doctorId, scheduleId, appointmentId, paymentId } =
        session.metadata;

      // Release booked slot
      if (doctorId && scheduleId && appointmentId && paymentId) {
        await prisma.$transaction(async (tx) => {
          // Delete appointment record
          await tx.appointment.delete({
            where: {
              id: appointmentId,
              paymentStatus: PaymentStatus.UNPAID,
            },
          });

          // Delete payment record
          await tx.payment.delete({
            where: {
              id: paymentId,
              paymentStatus: PaymentStatus.UNPAID,
            },
          });

          // Update isBooked status
          await tx.doctorSchedule.update({
            where: {
              scheduleId_doctorId: { doctorId, scheduleId },
            },
            data: { isBooked: false },
          });
        });
      }
      break;
    }

    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { paymentReceived: true };
};

// payment service object
const PaymentService = {
  stripeWebhook,
};

export default PaymentService;
