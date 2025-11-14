import { PaymentStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import Stripe from "stripe";

// Create payment
const stripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
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
        await prisma.payment.updateMany({
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
