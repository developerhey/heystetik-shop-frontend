import z from "zod"

const phoneRegex = /^[0-9]{10,15}$/
export const LoginParamSchema = z.strictObject({
    emailOrPhoneNumber: z.string().refine(
        (val) => z.string().email().safeParse(val).success || phoneRegex.test(val),
        { message: "Must be a valid email or phone number" }
    ),
    otp: z.string().min(6, "OTP must be at least 6 characters long"),
})

export type LoginParam = z.infer<typeof LoginParamSchema>
export type LoginField = keyof LoginParam // "emailOrPhoneNumber" | "otp"