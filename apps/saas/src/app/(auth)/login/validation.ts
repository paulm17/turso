import { z } from "zod";

export const Login = z.object({
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim()),
  password: z.string(),
});
