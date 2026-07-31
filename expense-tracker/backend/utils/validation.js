import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  isAdmin: z.boolean().optional().default(false),
  balance: z.number().min(0, "Balance cannot be negative").optional().default(0)
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  passwords: z.string().min(1, "Password is required")
});

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().optional()
});
