import { use } from "react";
import { request } from "~/lib/request";
import {
    ShippingMethodListResponseSchema,
    type ShippingMethodListResponse,
} from "~/features/cart/schemas/shipping-response-schema";
const path = "shipping/method";

export const getShippingMethod = (token: string, requestData: {
    user_address_id: number;
    product_item: Array<{
        product_id: number;
        qty: number;
    }>;
}) => {
    return request<ShippingMethodListResponse>(
        {
            url: path,
            method: "POST",
            data: requestData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        ShippingMethodListResponseSchema
    );
};
