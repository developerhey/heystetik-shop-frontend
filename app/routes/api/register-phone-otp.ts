import type { Route } from "./+types/register-phone-otp";
import { data } from "react-router";
import {
    RegisterStepPhoneParam,
} from "~/features/auth/schemas/login-param-schema";
import {
    registerStepPhoneOtp,
} from "~/features/auth/services/auth-service";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const parsed = RegisterStepPhoneParam.safeParse({
        phoneNumber: formData.get("phoneNumber"),
        otpPhone: formData.get("otp"),
    });

    if (!parsed.success) {
        return data({ error: "Invalid input data" }, { status: 400 });
    }

    const { phoneNumber, otpPhone } = parsed.data;

    try {
        const response = await registerStepPhoneOtp({ phoneNumber, otp: otpPhone });

        return data(
            {
                success: true,
                message: "Phone number validation successful",
                userId: response.data?.id ?? "",
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
                    "Phone number validation failed. Please try again.",
            },
            { status: error.status || 500 }
        );
    }
}
