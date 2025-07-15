import * as z from "zod";


export const registerUserSchema = z.object({
  userName: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
})


export const loginUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(1, { message: "Password is required" })
})


export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;