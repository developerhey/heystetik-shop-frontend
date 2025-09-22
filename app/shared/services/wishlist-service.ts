import { request } from "~/lib/request";
import {
    AddWishlistResponseSchema,
    WishlistListResponseSchema,
    type AddWishlistResponse,
    type WishlistListResponse,
} from "~/shared/schemas/wishlist-response-schema";
const path = "user-wishlist";

interface GetWishlistParams {
    page: number;
    take?: number;
}

export const addItemToWishlist = (token: string, id: number) => {
    return request<AddWishlistResponse>(
        {
            url: path,
            method: "POST",
            data: {
                product_id: id,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddWishlistResponseSchema
    );
};

export const deleteItemFromWishlist = (token: string, id: string) => {
    return request<AddWishlistResponse>(
        {
            url: path + "/" + id,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddWishlistResponseSchema
    );
};

export const getWishlistList = (token: string) => {
    // const { page, take = 8 } = params;
    // const queryParams: Record<string, any> = {
    //     page,
    //     take,
    // };

    return request<WishlistListResponse>(
        {
            url: path,
            method: "GET",
            params: {
                order: "desc",
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        WishlistListResponseSchema
    );
};
