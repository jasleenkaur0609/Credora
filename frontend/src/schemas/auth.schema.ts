import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email address is required.")
      .max(320, "Email address is too long.")
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(1, "Password is required.")
      .max(128, "Password is too long."),
  })
  .strict();

export type LoginFormData = z.infer<typeof loginSchema>;