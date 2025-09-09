import { request } from "~/lib/request";
import {
    type ProductBaseResponse,
    type ProductListResponse,
    ProductListResponseSchema,
    ProductResponseSchema,
} from "~/shared/schemas/product-response-schema";

const path = "solution";
const pathSkincare = `${path}/skincare`;

interface GetSkincareListParams {
    page?: number | null; // optional, default can be 1
    take?: number | null; // optional, default can be 10
    display?: string[] | null; // optional array of strings
    q?: string | null; // optional search string
    category?: string[] | null; // optional array of strings
    concern?: string[] | null; // optional array of strings
    signal?: AbortSignal | undefined;
}

export const getSkincareList = (params: GetSkincareListParams) => {
    const {
        page = 1,
        take = 8,
        display,
        q,
        category,
        concern,
        signal,
    } = params;

    const queryParams: Record<string, any> = {
        page,
        take,
    };

    if (display) queryParams["display[]"] = display;
    if (concern) queryParams["concern_ids[]"] = concern;
    if (q) queryParams.search = q;
    if (category) queryParams["category[]"] = category;

    return request<ProductListResponse>(
        {
            url: pathSkincare,
            method: "GET",
            params: queryParams,
            signal: signal,
        },
        ProductListResponseSchema
    );
};

export const getSkincareById = (token: string, id: string) => {
    return request<ProductBaseResponse>(
        {
            url: pathSkincare + `/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        ProductResponseSchema
    );
};
