import type { Route } from "./+types/login";
import { data } from "react-router";
import { loginByGoogle } from "~/features/auth/services/auth-service";
import { commitSession, getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const token = formData.get("googleToken") as string;

    try {
        const response = await loginByGoogle({ token });
        // Get current session
        const session = await getSession(request.headers.get("Cookie"));
        // Store credentials in session
        session.set("access_token", response.data?.token ?? "");
        session.set("user", {
            email: response?.data?.user?.email ?? "",
            name: response?.data?.user?.fullname ?? "",
            id: response?.data?.user?.id?.toString() ?? "",
        });
        await commitSession(session);

        return data(
            {
                success: true,
                message: "Login berhasil",
                data: {
                    loginWithSocmed: true,
                },
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
            { error: error.message || "Login gagal" },
            { status: error.status || 500 }
        );
    }
}
