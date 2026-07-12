import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: z.string().trim().email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100)
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(100)
});
