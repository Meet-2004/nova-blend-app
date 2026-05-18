import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Enter a valid 10-digit mobile number")
    .regex(/^[0-9]{10}$/, "Must be exactly 10 digits"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "Enter the complete 4-digit OTP")
    .regex(/^[0-9]{4}$/, "Must be exactly 4 digits"),
});

export const tableCodeSchema = z.object({
  code: z.string().min(1, "Enter a table code"),
});
