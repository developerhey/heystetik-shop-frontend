import type { Route } from "./+types/register-phone";
import { data } from "react-router";
import { registerStepPhone } from "~/features/auth/services/auth-service";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const phoneNumber = formData.get("phoneNumber") as string;
    const isResendOtp = (formData.get("isResendOtp") as string) === "true";
    try {
        await registerStepPhone({ phoneNumber });
        return data(
            {
                success: true,
                message: "Send phone number verification code successful",
                isResendOtp: isResendOtp,
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
                    "Send phone number verification code failed. Please try again.",
            },
            { status: error.status || 500 }
        );
    }
}
