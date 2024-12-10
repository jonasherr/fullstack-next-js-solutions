import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
});

export const env = EnvSchema.parse(process.env);
