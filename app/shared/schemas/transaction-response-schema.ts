import { z } from "zod";
import { BaseResponseDataSchema } from "./base-response-schema";
import { PaymentMethodSchema } from "~/features/cart/schemas/payment-method-response-schema";

const VaNumberSchema = z.object({
    bank: z.string().nullish(),
    va_number: z.string().nullish(),
});

const PaymentSchema = z.object({
    status_code: z.string().nullish(),
    status_message: z.string().nullish(),
    transaction_id: z.string().nullish(),
    order_id: z.string().nullish(),
    merchant_id: z.string().nullish(),
    gross_amount: z.string().nullish(),
    currency: z.string().nullish(),
    payment_type: z.string().nullish(),
    transaction_time: z.string().nullish(),
    transaction_status: z.string().nullish(),
    fraud_status: z.string().nullish(),
    va_numbers: z.array(VaNumberSchema).nullish(),
    expiry_time: z.string().nullish(),
});

const TransactionSchema = z.object({
    id: z.string().nullish(),
    user_id: z.number().nullish(),
    consultation_id: z.string().nullish(),
    invoice_number: z.string().nullish(),
    total_price: z.number().nullish(),
    delivery_fee: z.number().nullish(),
    transaction_fee: z.number().nullish(),
    tax: z.number().nullish(),
    total_discount: z.number().nullish(),
    total_paid: z.number().nullish(),
    payment_method_id: z.number().nullish(),
    order_id: z.string().nullish(),
    payment_external_id: z.string().nullish(),
    payment_status: z.string().nullish(),
    payment_expiry_time: z.string().nullish(),
    payment_settlement_time: z.string().nullish(),
    va_number: z.string().nullish(),
    bill_key: z.string().nullish(),
    biller_code: z.string().nullish(),
    qr_string: z.string().nullish(),
    status: z.string().nullish(),
    order_status: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    payment_method: PaymentMethodSchema.nullish(),
});

const DataTransactionResponseSchema = z.object({
    transaction: TransactionSchema,
    payment: PaymentSchema,
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type VaNumber = z.infer<typeof VaNumberSchema>;
export const TransactionResponseSchema = BaseResponseDataSchema(
    DataTransactionResponseSchema
);
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;
