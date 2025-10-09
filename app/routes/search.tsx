import type { Route } from "../routes/+types/search";
import type { ContextType } from "~/root";
import type { ShouldRevalidateFunctionArgs } from "react-router";
// import { getSession } from "~/sessions.server";
import { getConcernList } from "~/shared/services/concern-service";
import {
    getCategoryProductList,
    getSkinTypeList,
} from "~/shared/services/lookup-service";
import { getSkincareList } from "~/shared/services/solution-service";
import { mapConcernListResponseToUI } from "~/shared/schemas/concern-mapper";
import { mapCategoryProductListResponseToUI } from "~/shared/schemas/category-mapper";
import { useOutletContext } from "react-router";
import { SearchDesktop, SearchMobile } from "~/features/search/pages";
import { mapProductListResponseToUI } from "~/shared/schemas/product-mapper";

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const skinType = url.searchParams.get("skinType");
    const concern = url.searchParams.get("concern");
    const q = url.searchParams.get("q");

    // const cookieHeader = request.headers.get("Cookie");
    // const session = await getSession(cookieHeader);

    const [concerns, categoriesSkincare, skinTypes, skincareList] =
        await Promise.all([
            getConcernList(),
            getCategoryProductList(),
            getSkinTypeList(),
            getSkincareList({
                category: category ? [category] : null,
                display: skinType ? [skinType] : null,
                concern: concern ? [concern] : null,
                q: q ? q : null,
                take: 16,
            }),
        ]);

    return {
        concerns: mapConcernListResponseToUI(concerns),
        categoriesSkincare:
            mapCategoryProductListResponseToUI(categoriesSkincare),
        skinTypes: mapCategoryProductListResponseToUI(skinTypes),
        skincares: mapProductListResponseToUI(skincareList),
        hasNextPage: skincareList.data?.meta?.hasNextPage ?? false,
        // currentPage: page,
        filters: { category, skinType, concern },
    };
}

export function meta() {
  return [
    { title: "Cari Skincare" },
    {
      property: "og:title",
      content: "Cari skincare",
    },
  ];
}

export default function Search({ loaderData }: Route.ComponentProps) {
    const { isMobile } = useOutletContext<ContextType>();
    return isMobile ? (
        <SearchMobile
            categoriesSkinCare={loaderData.categoriesSkincare}
            concerns={loaderData.concerns}
            skinTypes={loaderData.skinTypes}
            skincareList={loaderData.skincares}
            initialHasNextPage={loaderData.hasNextPage}
        />
    ) : (
        <SearchDesktop
            categoriesSkinCare={loaderData.categoriesSkincare}
            concerns={loaderData.concerns}
            skinTypes={loaderData.skinTypes}
            skincareList={loaderData.skincares}
            initialHasNextPage={loaderData.hasNextPage}
        />
    );
}

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
    const { currentUrl, nextUrl } = arg;
    return currentUrl.search !== nextUrl.search;
}
