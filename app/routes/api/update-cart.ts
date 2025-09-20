import { updateItemToCart } from "~/shared/services/cart-service";
import type { Route } from "./+types/add-cart";
import { data } from "react-router";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const props = {
        qty: parseInt(formData.get("qty") as string),
        productId: parseInt(formData.get("productId") as string),
        notes: formData.get("notes") as string,
    };

    try {
        await updateItemToCart(accessToken, {
            qty: props.qty,
            product_id: props.productId,
            notes: props.notes,
        });

        return data(
            {
                success: true,
                message: "Berhasil memperbarui item di keranjang",
                data: "",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return data(
            {
                error: error.message || "Gagal memperbarui item ke keranjang",
            },
            { status: error.status || 500 }
        );
    }
}
