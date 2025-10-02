import type { Route } from "./+types/register-email-otp";
import { data } from "react-router";
import { RegisterStepEmailParam } from "~/features/auth/schemas/login-param-schema";
import { registerStepEmailOtp } from "~/features/auth/services/auth-service";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const parsed = RegisterStepEmailParam.safeParse({
        email: formData.get("email"),
        otpEmail: formData.get("otp"),
    });

    if (!parsed.success) {
        return data({ error: "Invalid input data" }, { status: 400 });
    }

    const userId = formData.get("userId") as string;

    const { email, otpEmail } = parsed.data;

    try {
        await registerStepEmailOtp({ email, otp: otpEmail, userId });

        return data(
            {
                success: true,
                message: "Email validation successful",
                data: "",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return data(
            {
                error:
                    error.message ||
                    "Email validation failed. Please try again.",
            },
            { status: error.status || 500 }
        );
    }
}
