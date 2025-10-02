import type { Route } from "./+types/add-address";
import { data } from "react-router";
import { getSession } from "~/sessions.server";
import { AddAddressParamSchema } from "~/features/address/schemas/address-param-schema";
import { addUserAddress } from "~/features/address/services/address-services";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";

    const parsed = AddAddressParamSchema.safeParse({
        fullName: formData.get("fullName"),
        phoneRecepient: formData.get("phoneNumber"),
        lat: parseFloat(formData.get("lat") as string),
        lng: parseFloat(formData.get("lng") as string),
        fullAddress: formData.get("fullAddress"),
        pinpointAddress: formData.get("pinpointAddress"),
        zipCode: parseInt(formData.get("zipCode") as string),
        province: formData.get("province"),
        city: formData.get("city"),
        subdistrict: formData.get("subdistrict"),
        notes: formData.get("notes"),
        labelAddress: formData.get("labelAddress"),
    });

    if (!parsed.success) {
        return data({ error: "Invalid input data" }, { status: 400 });
    }

    try {
        await addUserAddress({
            token: accessToken,
            param: parsed.data,
        });
        return data(
            {
                success: true,
                message: "Berhasil menambahkan alamat",
                data: "",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return data(
            {
                error: error.message || "Gagal menambahkan alamat",
            },
            { status: error.status || 500 }
        );
    }
}
