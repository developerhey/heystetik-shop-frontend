import { request } from "~/lib/request";
import {
    TransactionResponseSchema,
    type TransactionResponse,
} from "../schemas/transaction-response-schema";
import {
    TransactionHistoryResponseSchema,
    type TransactionHistoryResponse,
} from "../schemas/transaction-history-response-schema";

const path = "transaction";
export interface ProductItem {
    product_id: number;
    qty: number;
    note?: string | null;
}

export interface OrderProductRequest {
    product_item: ProductItem[];
    payment_method: string;
    payment_type: string;
    shipping_method_id: number;
    user_address_id: number;
    voucher_id?: number | null;
    total_price: number;
    delivery_fee: number;
    total_discount: number;
    tax: number;
    transaction_fee: number;
    total_paid: number;
}

export const orderProduct = (token: string, orderData: OrderProductRequest) =>
    request<TransactionResponse>(
        {
            url: path + "/product/order",
            method: "POST",
            data: orderData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        TransactionResponseSchema
    );

export const getTransactionHistory = (token: string) =>
    request<TransactionHistoryResponse>(
        {
            url: path,
            method: "GET",
            params: {
                order: "desc",
                "transaction_type[]": ["PRODUCT"],
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        TransactionHistoryResponseSchema
    );
