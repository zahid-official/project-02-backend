import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt: Number(process.env.BCRYPT_SALT),

  defaultAdmin: {
    email: process.env.DEFULT_ADMIN_EMAIL,
    password: process.env.DEFULT_ADMIN_PASSWORD,
  },

  cloudinary: {
    cloud: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  jwt: {
    access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    access_expiresin: process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
    refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refresh_expiresin: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,
  },

  open_router: {
    api_key: process.env.OPENROUTER_API_KEY,
  },

  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    success_url: process.env.STRIPE_SUCCESS_FRONTEND_URL,
    cancel_url: process.env.STRIPE_CANCELED_FRONTEND_URL,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET_KEY,
  },
};
