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

export const updateItemToCart = (token: string, params: AddToCartParams) => {
    return request<AddCartResponse>(
        {
            url: path + "/" + params.product_id,
            method: "PATCH",
            data: {
                qty: params.qty,
                notes: params.notes,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddCartResponseSchema
    );
};

export const deleteItemFromCart = (token: string, id: string) => {
    return request<AddCartResponse>(
        {
            url: path + "/" + id,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddCartResponseSchema
    );
};

export const getCartList = (token: string) => {
    // const { page, take = 8 } = params;
    // const queryParams: Record<string, any> = {
    //     page,
    //     take,
    // };

    return request<CartListResponse>(
        {
            url: path,
            method: "GET",
            params: {
                order: "desc"
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        CartListResponseSchema
    );
};
