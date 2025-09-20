import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { CartPageDesktop, CartPageMobile } from "~/features/cart/pages";
import { getCartList } from "~/shared/services/cart-service";
import type { Route } from "./+types/cart";
import { mapCartListResponseToUI } from "~/shared/schemas/cart-mapper";
import { getSession } from "~/sessions.server";
export async function loader({ request }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const carts = await getCartList(accessToken);
    return {
        carts: mapCartListResponseToUI(carts),
    };
}

export default function Cart({ loaderData }: Route.ComponentProps) {
    const { carts } = loaderData;
    const { isMobile } = useOutletContext<ContextType>();
    return isMobile ? (
        <CartPageMobile carts={carts} />
    ) : (
        <CartPageDesktop carts={carts} />
    );
}
