import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import config from "./app/config";
import ModuleRouter from "./app/routes";
import cookieParser from "cookie-parser";
import PaymentController from "./app/modules/payment/payment.controller";

// Express application
const app: Application = express();

// Stripe webhook route
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook
);

// Middlewares
app.use(
  cors({
    origin: [`${config.frontend_url}`],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));

// routes middleware
app.use("/api/v1", ModuleRouter);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Server is running..",
    environment: config.node_env,
    uptime: process.uptime().toFixed(2) + " sec",
    timeStamp: new Date().toISOString(),
  });
});

// Handle global & not found error
app.use(globalErrorHandler);
app.use(notFound);

export default app;
