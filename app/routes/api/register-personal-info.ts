import type { Route } from "./+types/register-personal-info";
import { data } from "react-router";
import { RegisterStepPersonalInfoParam } from "~/features/auth/schemas/login-param-schema";
import { registerStepPersonalInfo } from "~/features/auth/services/auth-service";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();

    const parsed = RegisterStepPersonalInfoParam.safeParse({
        fullName: formData.get("fullName"),
        gender: formData.get("gender"),
        province: formData.get("province"),
        city: formData.get("city"),
        pin: formData.get("pin"),
        userId: formData.get("userId"),
    });

    if (!parsed.success) {
        return data({ error: "Invalid input data" }, { status: 400 });
    }

    const { fullName, gender, province, city, pin, userId } = parsed.data;
    const avatarUrl = formData.get("avatarUrl") as string;

    try {
        let file: File | undefined;

        if (avatarUrl && avatarUrl.startsWith("data:image")) {
            try {
                const response = await fetch(avatarUrl);
                const blob = await response.blob();

                const matches = avatarUrl.match(
                    /^data:(image\/[a-zA-Z]*);base64,/
                );
                const mimeType = matches ? matches[1] : "image/jpeg";
                const fileExtension = mimeType.split("/")[1];

                file = new File([blob], `avatar.${fileExtension}`, {
                    type: mimeType,
                });
            } catch (error) {
                console.error("Error converting base64 to file:", error);
                // Continue without file if conversion fails
            }
        }

        const response = await registerStepPersonalInfo({
            userId,
            gender,
            province,
            fullname: fullName,
            city,
            password: pin,
            file: file!, // Use non-null assertion since file is optional in service
        });

        return data(
            {
                success: true,
                message: "Registrasi sukses, silahkan login.",
                userId: response.data?.id ?? userId,
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return data(
            {
                error: error.message || "Registrasi gagal.",
            },
            { status: error.status || 500 }
        );
    }
}
