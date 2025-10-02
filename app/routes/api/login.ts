import type { Route } from "./+types/login";
import { data } from "react-router";
import { LoginParamSchema } from "~/features/auth/schemas/login-param-schema";
import { login } from "~/features/auth/services/auth-service";
import { commitSession, getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const parsed = LoginParamSchema.safeParse({
        emailOrPhoneNumber: formData.get("emailOrPhoneNumber"),
        otp: formData.get("otp"),
    });

    if (!parsed.success) {
        return data({ error: "Invalid input data" }, { status: 400 });
    }

    const { emailOrPhoneNumber, otp } = parsed.data;

    try {
        const response = await login({ emailOrPhoneNumber, password: otp });
        // Get current session
        const session = await getSession(request.headers.get("Cookie"));
        // Store credentials in session
        session.set("access_token", response.data?.token ?? "");
        session.set("user", {
            email: response?.data?.user?.email ?? "",
            name: response?.data?.user?.fullname ?? "",
        });
        await commitSession(session);

        return data(
            {
                success: true,
                message: "Login successful",
                data: "",
            },
            {
                status: 200,
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            }
        );
    } catch (error: any) {
        return data(
            { error: error.message || "Login failed. Please try again." },
            { status: error.status || 500 }
        );
    }
}
