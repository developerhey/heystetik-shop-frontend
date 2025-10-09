import { getSkincareById } from "~/shared/services/solution-service";
import type { Route } from "./+types/product-detail";
import { mapProductResponseToUI } from "~/shared/schemas/product-mapper";
import { getSession } from "~/sessions.server";
import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import {
    ProductDetailDesktop,
    ProductDetailMobile,
} from "~/features/product/pages";

export async function loader({ request, params }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const [skincareDetail] = await Promise.all([
        getSkincareById(accessToken, params.id),
    ]);
    return {
        skincareDetail: mapProductResponseToUI(skincareDetail.data),
    };
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: data?.skincareDetail?.title ?? "Detil Produk" },
        {
            property: "og:title",
            content: data?.skincareDetail?.title ?? "Detil Produk",
        },
    ];
}

export default function Product({ loaderData }: Route.ComponentProps) {
    const { isMobile } = useOutletContext<ContextType>();
    return isMobile ? (
        <ProductDetailMobile product={loaderData.skincareDetail} />
    ) : (
        <ProductDetailDesktop product={loaderData.skincareDetail} />
    );
}
