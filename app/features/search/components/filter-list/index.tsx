export * from "./FilterListDesktop";
export * from "./FilterListMobile";
import type { CategoryProductListUI } from "~/shared/schemas/category-ui-schema";
import type { ConcernListUI } from "~/shared/schemas/concern-ui-schema";

export interface FilterListProps {
    className?: string;
    concerns: ConcernListUI;
    categoriesSkinCare: CategoryProductListUI;
    skinTypes: CategoryProductListUI;
}
