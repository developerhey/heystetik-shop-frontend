import type { Route } from "./+types/register-email";
import { data } from "react-router";
import { registerStepEmail } from "~/features/auth/services/auth-service";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const isResendOtp = formData.get("isResendOtp") as string === "true";
    try {
        await registerStepEmail({ email });
        return data(
            {
                success: true,
                message: "Send email verification code successful",
                isResendOtp: isResendOtp
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
                    "Send email verification code failed. Please try again.",
            },
            { status: error.status || 500 }
        );
    }
}
