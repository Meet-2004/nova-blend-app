import { z } from "zod";

export const phoneSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
});

export const otpSchema = z.object({
  otp: z.string().length(4, "Enter the 4-digit OTP"),
});

export const tableCodeSchema = z.object({
  code: z.string().min(1, "Enter your table code"),
});
