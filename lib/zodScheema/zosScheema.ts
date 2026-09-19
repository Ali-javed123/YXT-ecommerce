import { z } from "zod";

const registerFields = z.object({
  email: z.email("Invalid email address"),
username: z
  .string()
  .trim()
  .min(2, "name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters"),
});

export const registerSchema = registerFields.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),

  password: z
    .string()
    .min(3, "Password is required"),
  

});
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
      email: z
    
    .email("Please enter a valid email address"),

});


export const updatePasswordSchema = z
  .object({
    email: z.email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );
