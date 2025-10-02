import type { Route } from "./+types/delete-address";
import { data } from "react-router";
import { getSession } from "~/sessions.server";
import { deleteUserAddress } from "~/features/address/services/address-services";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";

    const id = formData.get("id") as string ?? "";

    try {
        await deleteUserAddress({
            token: accessToken,
            id: id
        });
        return data(
            {
                success: true,
                message: "Berhasil menghapus alamat",
                data: "",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return data(
            {
                error: error.message || "Gagal menghapus alamat",
            },
            { status: error.status || 500 }
        );
    }
}
