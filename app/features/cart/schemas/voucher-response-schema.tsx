import { z } from "zod";
import { BaseResponseSchema } from "~/shared/schemas/base-response-schema";

export const VoucherSchema = z.object({
    id: z.number().nullish(),
    type: z.string().nullish(),
    name: z.string().nullish(),
    description: z.string().nullish(),
    period_start: z.string().nullish(),
    period_end: z.string().nullish(),
    repeat_next_month: z.boolean().nullish(),
    repeat_throughout: z.string().nullish(),
    target_voucher: z.string().nullish(),
    code: z.string().nullish(),
    promotion_type: z.string().nullish(),
    free_shipping_amount: z.number().nullish(),
    discount_type: z.string().nullish(),
    discount_fix_amount: z.number().nullish(),
    discount_percentage: z.number().nullish(),
    discount_percentage_maximum_amount: z.number().nullish(),
    minimum_purchase: z.number().nullish(),
    quota: z.number().nullish(),
    target_buyer: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
});

export type Voucher = z.infer<typeof VoucherSchema>;
export const VoucherListResponseSchema = BaseResponseSchema(
    z.array(VoucherSchema)
);
export type VoucherListResponse = z.infer<typeof VoucherListResponseSchema>;
