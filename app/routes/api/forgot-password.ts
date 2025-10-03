import type { Route } from "./+types/forgot-password";
import { data } from "react-router";
import { LoginParamSchema } from "~/features/auth/schemas/login-param-schema";
import { forgotPassword } from "~/features/auth/services/auth-service";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const email = formData.get("email") as string;

    try {
        const response = await forgotPassword({ email });

        return data({
            success: true,
            message:
                "Silahkan periksa email anda untuk melakukan reset password",
            data: "",
        });
    } catch (error: any) {
        return data(
            { error: error.message || "Gagal melakukan reset password" },
            { status: error.status || 500 }
        );
    }
}
