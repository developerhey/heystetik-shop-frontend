import type { Route } from "./+types/delete-wishlist";
import { data } from "react-router";
import { getSession } from "~/sessions.server";
import { deleteItemFromWishlist } from "~/shared/services/wishlist-service";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const props = {
        wishlistId: formData.get("wishlistId") as string,
    };

    try {
        await deleteItemFromWishlist(accessToken, props.wishlistId);

        return data(
            {
                success: true,
                message: "Berhasil mengahapus item dari wishlist",
                data: "",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return data(
            {
                error: error.message || "Gagal menghapus item dari wishlist",
            },
            { status: error.status || 500 }
        );
    }
}
