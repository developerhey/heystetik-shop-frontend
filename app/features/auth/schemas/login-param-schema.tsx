import z from "zod";

const phoneRegex = /^(\+?[0-9]{1,4}[-.\s]?)?[0-9]{8,15}$/;
export const LoginParamSchema = z.strictObject({
    emailOrPhoneNumber: z
        .string()
        .refine(
            (val) =>
                z.string().email().safeParse(val).success ||
                phoneRegex.test(val),
            { message: "Must be a valid email or phone number" }
        ),
    otp: z.string().min(6, "OTP must be at least 6 characters long"),
});

export const RegisterStepPhoneParam = z.strictObject({
    phoneNumber: z.string().refine((val) => phoneRegex.test(val), {
        message: "Must be a valid phone number",
    }),
    otpPhone: z.string().min(5, "OTP must be at least 5 characters long"),
});

export const RegisterStepEmailParam = z.strictObject({
    email: z
        .string()
        .refine((val) => z.string().email().safeParse(val).success, {
            message: "Must be a valid email",
        }),
    otpEmail: z.string().min(5, "OTP must be at least 5 characters long"),
});

export const RegisterStepPersonalInfoParam = z.strictObject({
    userId: z.string(), // Add userId to schema since it's required
    fullName: z.string().min(1, "Full name is required"),
    gender: z.string().min(1, "Gender is required"),
    province: z.string().min(1, "Province is required"),
    city: z.string().min(1, "City is required"),
    pin: z
        .string()
        .min(6, "PIN must be 6 digits")
        .max(6, "PIN must be 6 digits"),
    avatarUrl: z.string().optional(), // Optional avatar URL
});

export const ForgotPasswordParam = z.strictObject({
    emailForgotPassword: z
        .string()
        .refine((val) => z.string().email().safeParse(val).success, {
            message: "Must be a valid email",
        }),
});

export type LoginParam = z.infer<typeof LoginParamSchema>;
export type AuthStep =
    | "emailOrPhoneNumber"
    | "otp"
    | "register-phone"
    | "register-phone-otp"
    | "register-email"
    | "register-email-otp"
    | "forgot-password"
    | "register-personal-info";
export type ForgotPasswordField = "emailForgotPassword";
export type LoginField = "emailOrPhoneNumber" | "otp";
export type RegisterStepPhoneField = "phoneNumber" | "otpPhone";
export type RegisterStepEmailField = "email" | "otpEmail";
export type RegisterStepEmailPersonalInfo =
    | "fullName"
    | "gender"
    | "province"
    | "city"
    | "avatarUrl"
    | "pin";
