import { request } from "~/lib/request";
import {
    type PaymentMethodListResponse,
    PaymentMethodListResponseSchema,
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
