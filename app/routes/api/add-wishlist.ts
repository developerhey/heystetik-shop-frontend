import type { Route } from "./+types/add-wishlist";
import { data } from "react-router";
import { getSession } from "~/sessions.server";
import { addItemToWishlist } from "~/shared/services/wishlist-service";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const props = {
        productId: parseInt(formData.get("productId") as string),
    };

    try {
        await addItemToWishlist(accessToken, props.productId);

        return data(
            {
                success: true,
                message: "Berhasil menambahkan item ke wishlist",
                data: "",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return data(
            {
                error: error.message || "Gagal menambahkan item ke wishlist",
            },
            { status: error.status || 500 }
        );
    }
}
