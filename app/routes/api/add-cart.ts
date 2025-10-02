import { addItemToCart } from "~/shared/services/cart-service";
import type { Route } from "./+types/add-cart";
import { data, redirect } from "react-router";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const props = {
        qty: parseInt(formData.get("qty") as string),
        productId: parseInt(formData.get("productId") as string),
    };

    const isRedirect = formData.get("isRedirect") === "true";

    try {
        await addItemToCart(accessToken, {
            qty: props.qty,
            product_id: props.productId,
        });

        if (isRedirect) {
            return redirect("/cart");
        } else {
            data(
                {
                    success: true,
                    message: "Berhasil menambahkan item ke keranjang",
                    data: "",
                },
                {
                    status: 200,
                }
            );
        }
    } catch (error: any) {
        return data(
            {
                error: error.message || "Gagal menambahkan item ke keranjang",
            },
            { status: error.status || 500 }
        );
    }
}
