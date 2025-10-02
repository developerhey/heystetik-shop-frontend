import { z } from "zod";
import { BaseResponseDataSchema } from "~/shared/schemas/base-response-schema";

const MediaSchema = z.object({
    id: z.number().nullish(),
    filename: z.string().nullish(),
    ext: z.string().nullish(),
    size: z.number().nullish(),
    mime: z.string().nullish(),
    path: z.string().nullish(),
    destination: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
});

const MediaPaymentMethodSchema = z.object({
    id: z.number().nullish(),
    media_id: z.number().nullish(),
    payment_method_id: z.number().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    media: MediaSchema.nullish(),
});

const HowToPaySchema = z.object({
    id: z.number().nullish(),
    payment_method_id: z.number().nullish(),
    name: z.string().nullish(),
    steps: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
});

const PaymentMethodSchema = z.object({
    id: z.number().nullish(),
    name: z.string().nullish(),
    method: z.string().nullish(),
    payment_gateway: z.string().nullish(),
    type: z.string().nullish(),
    channel_code: z.string().nullish(),
    transaction_fee_type: z.string().nullish(),
    transaction_fee_percentage: z.number().nullish(),
    transaction_fee_fix_amount: z.number().nullish(),
    platform_fee_amount: z.number().nullish(),
    platform_max_transaction_amount: z.number().nullish(),
    account_number: z.number().nullish(),
    segment: z.string().nullish(),
    description: z.string().nullish(),
    is_active: z.boolean().nullish(),
    is_displayed: z.boolean().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    media_payment_method: MediaPaymentMethodSchema.nullish(),
    how_to_pays: z.array(HowToPaySchema).nullish(),
});

export type Media = z.infer<typeof MediaSchema>;
export type MediaPaymentMethod = z.infer<typeof MediaPaymentMethodSchema>;
export type HowToPay = z.infer<typeof HowToPaySchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export const PaymentMethodListResponseSchema = BaseResponseDataSchema(
    z.array(PaymentMethodSchema)
);
export type PaymentMethodListResponse = z.infer<
    typeof PaymentMethodListResponseSchema
>;
export {
    MediaSchema,
    MediaPaymentMethodSchema,
    HowToPaySchema,
    PaymentMethodSchema,
};
