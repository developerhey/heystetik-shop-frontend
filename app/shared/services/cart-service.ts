import { request } from "~/lib/request";
import {
    AddCartResponseSchema,
    CartListResponseSchema,
    type AddCartResponse,
    type CartListResponse,
} from "~/shared/schemas/cart-response-schema";
const path = "user-cart";

interface AddToCartParams {
    product_id: number;
    qty: number;
    notes?: string;
}

interface GetCartListParams {
    page: number;
    take?: number;
}

export const addItemToCart = (token: string, params: AddToCartParams) => {
    return request<AddCartResponse>(
        {
            url: path,
            method: "POST",
            data: params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddCartResponseSchema
    );
};

export const getCartList = (token: string, params: GetCartListParams) => {
    const { page = 1, take = 8 } = params;

    const queryParams: Record<string, any> = {
        page,
        take,
    };

    return request<CartListResponse>(
        {
            url: path,
            method: "GET",
            params: queryParams,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        CartListResponseSchema
    );
};
