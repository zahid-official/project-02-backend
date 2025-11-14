import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import stripe from "../../config/stripe";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import PaymentService from "./payment.service";

// Create stripe payment webhook
const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req?.headers["stripe-signature"];
  const webhookSecret = config.stripe.webhook_secret;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      webhookSecret as string
    );
  } catch (err: any) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send(
        `Stripe webhook signature verification failed error: ${err.message}`
      );
  }

  // Pass event to service
  const result = await PaymentService.stripeWebhook(event);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Webhook request processed successfully",
    data: result,
  });
});

// Payment controller object
const PaymentController = {
  stripeWebhook,
};

export default PaymentController;
