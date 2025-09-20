import { deleteItemFromCart } from "~/shared/services/cart-service";
import type { Route } from "./+types/delete-cart";
import { data } from "react-router";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const props = {
        productId: formData.get("productId") as string,
    };

    try {
        const response = await deleteItemFromCart(accessToken, props.productId);

        return data(
            {
                success: true,
                message: "Berhasil mengahapus item dari keranjang",
                data: "",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return data(
            {
                error: error.message || "Gagal menghapus item dari keranjang",
            },
            { status: error.status || 500 }
        );
    }
}
