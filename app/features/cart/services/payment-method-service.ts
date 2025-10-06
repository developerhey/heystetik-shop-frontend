import { request } from "~/lib/request";
import {
    PaymentMethodDetailResponseSchema,
    type PaymentMethodListResponse,
    PaymentMethodListResponseSchema,
    type PaymentMethodDetailResponse,
} from "../schemas/payment-method-response-schema";
const path = "payment-method";

export const getPaymentMethod = (token: string) => {
    return request<PaymentMethodListResponse>(
        {
            url: path,
            method: "GET",
            params: {
                "method[]": ["VIRTUAL_ACCOUNT", "QR_CODE"],
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        PaymentMethodListResponseSchema
    );
};

export const getPaymentMethodById = (token: string, id: string) => {
    return request<PaymentMethodDetailResponse>(
        {
            url: path + "/" + id,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        PaymentMethodDetailResponseSchema
    );
};
