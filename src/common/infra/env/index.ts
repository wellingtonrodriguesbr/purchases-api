import "dotenv/config";
import { z } from "zod";

import { AppError } from "@/common/domain/errors/app-error";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3333),
  API_URL: z.string().default("http://localhost:3333"),
});

export const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  throw new AppError("Invalid environment variables");
}

export const env = _env.data;
