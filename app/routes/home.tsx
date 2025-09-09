import type { Route } from "./+types/home";
import Hero from "~/features/home/components/Hero";
import CategoryList from "~/features/home/components/category-list";
import RecommendedForYou from "~/features/home/components/recommended-for-you";
import { getBanners } from "~/features/home/services/banner-service";
import { mapBannerListResponseToUI } from "~/features/home/mappers/banner-mapper";
import { getCategoryProductList } from "~/shared/services/lookup-service";
import { getSkincareList } from "~/shared/services/solution-service";
import { mapCategoryProductListResponseToUI } from "~/shared/schemas/category-mapper";
import { mapProductListResponseToUI } from "~/shared/schemas/product-mapper";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Heystetik" },
        { name: "description", content: "Welcome to Heystetik!" },
    ];
}

export async function loader() {
    const [bannerList, categoryProductList, skincareList] = await Promise.all([
        getBanners(),
        getCategoryProductList(),
        getSkincareList({ take: 4 }),
    ]);
    return {
        bannerList: mapBannerListResponseToUI(bannerList),
        categoryProductList:
            mapCategoryProductListResponseToUI(categoryProductList),
        skincareList: mapProductListResponseToUI(skincareList),
    };
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { bannerList, categoryProductList, skincareList } = loaderData;
    return (
        <div className="flex flex-col items-center justify-center">
            <Hero slides={bannerList} interval={2000} />
            <CategoryList categories={categoryProductList} />
            <RecommendedForYou products={skincareList} />
        </div>
    );
}
