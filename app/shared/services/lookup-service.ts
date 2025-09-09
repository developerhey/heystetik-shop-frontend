import { request } from "~/lib/request";
import {
    type CategoryListResponse,
    CategoryListResponseSchema,
} from "~/shared/schemas/category-response-schema";

const path = "lookup";
export const getCategoryProductList = () =>
    request<CategoryListResponse>(
        {
            url: path,
            method: "GET",
            params: {
                order: "asc",
                "category[]": ["SKINCARE_CATEGORY"],
            },
        },
        CategoryListResponseSchema
    );

export const getSkinTypeList = () =>
    request<CategoryListResponse>(
        {
            url: path,
            method: "GET",
            params: {
                order: "asc",
                "category[]": ["PRODUCT_DISPLAY"],
            },
        },
        CategoryListResponseSchema
    );