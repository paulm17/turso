import { z } from "zod";

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim());

export const password = z
  .string()
  .min(5)
  .max(100)
  .transform((str) => str.trim());

export const Signup = z.object({
  email,
  password,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().optional(),
});
