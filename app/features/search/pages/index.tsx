import type { CategoryProductListUI } from "~/shared/schemas/category-ui-schema";
import type { ConcernListUI } from "~/shared/schemas/concern-ui-schema";
import type { ProductListUI } from "~/shared/schemas/product-ui-schema";

export * from "~/features/search/pages/SearchDesktop";
export * from "~/features/search/pages/SearchMobile";

export interface SearchProps {
    concerns: ConcernListUI;
    categoriesSkinCare: CategoryProductListUI;
    skinTypes: CategoryProductListUI;
    skincareList: ProductListUI;
    initialHasNextPage: boolean;
}
