import { request } from "~/lib/request";
import {
    VoucherListResponseSchema,
    type VoucherListResponse,
} from "../schemas/voucher-response-schema";
const path = "voucher/available";

export const getAvailableVoucher = (token: string) => {
    return request<VoucherListResponse>(
        {
            url: path,
            method: "GET",
            params: {
                "type[]": ["All Solution Voucher"],
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        VoucherListResponseSchema
    );
};
