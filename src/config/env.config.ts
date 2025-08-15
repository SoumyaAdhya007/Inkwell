import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.string(),
  CORS_ORIGIN: z.string(),
  MONGO_URI: z.string(),
  DB_NAME: z.string(),
  BCRYPT_SALT: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string(),
  APIKEY_TOKEN_SECRET: z.string(),
  APIKEY_TOKEN_EXPIRY: z.string(),
  MAILTRAP_SMTP_HOST: z.string(),
  MAILTRAP_SMTP_PORT: z.string(),
  MAILTRAP_SMTP_USERNAME: z.string(),
  MAILTRAP_SMTP_PASSWORD: z.string(),
  FORGOT_PASSWORD_REDIRECT_URL: z.string(),
});

const env = envSchema.parse(process.env);
export default env;
