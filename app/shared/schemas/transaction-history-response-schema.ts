import { z } from "zod";
import {
    BaseResponseDataSchema,
    BaseResponseSchema,
} from "./base-response-schema";

// Media schema
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

// Media Product schema
const MediaProductSchema = z.object({
    id: z.number().nullish(),
    media_id: z.number().nullish(),
    product_id: z.number().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    media: MediaSchema.nullish(),
});

// Media Payment Method schema
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

// Payment Method schema
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
    account_number: z.string().nullish(),
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
});

// Shipper schema
const ShipperSchema = z.object({
    id: z.number().nullish(),
    name: z.string().nullish(),
    phone: z.string().nullish(),
    email: z.string().nullish(),
    latitude: z.string().nullish(),
    longitude: z.string().nullish(),
    province: z.string().nullish(),
    city: z.string().nullish(),
    subdistrict: z.string().nullish(),
    zip_code: z.string().nullish(),
    address: z.string().nullish(),
    origin_code: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
});

// Shipping Method schema
const ShippingMethodSchema = z.object({
    id: z.number().nullish(),
    name: z.string().nullish(),
    provider: z.string().nullish(),
    description: z.string().nullish(),
    type: z.string().nullish(),
    provider_service_code: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
});

// Shipping Product schema
const ShippingProductSchema = z.object({
    id: z.number().nullish(),
    user_id: z.number().nullish(),
    transaction_product_id: z.string().nullish(),
    shipping_method_id: z.number().nullish(),
    shipper_id: z.number().nullish(),
    recipient_name: z.string().nullish(),
    recipient_phone: z.string().nullish(),
    recipient_latitude: z.string().nullish(),
    recipient_longitude: z.string().nullish(),
    recipient_province: z.string().nullish(),
    recipient_city: z.string().nullish(),
    recipient_subdistrict: z.string().nullish(),
    recipient_zip_code: z.string().nullish(),
    recipient_address: z.string().nullish(),
    recipient_note: z.string().nullish(),
    delivery_fee: z.number().nullish(),
    insurance_fee: z.number().nullish(),
    delivery_status: z.string().nullish(),
    waybill: z.string().nullish(),
    live_tracking_url: z.string().nullish(),
    pod_receiver: z.string().nullish(),
    pod_url: z.string().nullish(),
    driver_id: z.string().nullish(),
    driver_name: z.string().nullish(),
    driver_phone: z.string().nullish(),
    driver_photo: z.string().nullish(),
    cancelled_by: z.string().nullish(),
    cancelled_reason: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    shipper: ShipperSchema.nullish(),
    shipping_method: ShippingMethodSchema.nullish(),
});

// Skincare Detail schema
const SkincareDetailSchema = z.object({
    id: z.number().nullish(),
    product_id: z.number().nullish(),
    brand: z.string().nullish(),
    description: z.string().nullish(),
    specification_texture: z.string().nullish(),
    specification_bpom: z.string().nullish(),
    specification_netto: z.number().nullish(),
    specification_netto_type: z.string().nullish(),
    specification_expired: z.string().nullish(),
    specification_packaging_type: z.string().nullish(),
    specification_ingredients: z.string().nullish(),
    specification_how_to_use: z.string().nullish(),
    specification_storage_advice: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
});

// Product schema
const ProductSchema = z.object({
    id: z.number().nullish(),
    name: z.string().nullish(),
    type: z.string().nullish(),
    category: z.string().nullish(),
    display: z.string().nullish(),
    requires_prescription: z.boolean().nullish(),
    has_variant: z.boolean().nullish(),
    min_order: z.number().nullish(),
    price: z.number().nullish(),
    discount_is_active: z.boolean().nullish(),
    discount_type: z.string().nullish(),
    discount_percentage: z.number().nullish(),
    discount_fix_amount: z.number().nullish(),
    product_is_active: z.boolean().nullish(),
    product_stock: z.number().nullish(),
    product_threshold: z.string().nullish(),
    product_sku: z.string().nullish(),
    rating: z.number().nullish(),
    shipping_product_weight: z.number().nullish(),
    shipping_product_weight_type: z.string().nullish(),
    shipping_product_size_length_type: z.string().nullish(),
    shipping_product_size_width_type: z.string().nullish(),
    shipping_product_size_height_type: z.string().nullish(),
    shipping_product_size_length: z.number().nullish(),
    shipping_product_size_width: z.number().nullish(),
    shipping_product_size_height: z.number().nullish(),
    shipping: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    skincare_detail: SkincareDetailSchema.nullish(),
    drug_detail: z.null().nullish(),
    media_products: z.array(MediaProductSchema).nullish(),
});

// Transaction Product Item schema
const TransactionProductItemSchema = z.object({
    id: z.number().nullish(),
    transaction_product_id: z.string().nullish(),
    product_id: z.number().nullish(),
    qty: z.number().nullish(),
    price_original: z.number().nullish(),
    price: z.number().nullish(),
    discount: z.number().nullish(),
    subtotal: z.number().nullish(),
    note: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    product: ProductSchema.nullish(),
    product_review: z.null().nullish(),
});

// User schema
const UserSchema = z.object({
    id: z.number().nullish(),
    fullname: z.string().nullish(),
    username: z.string().nullish(),
    email: z.string().nullish(),
    password: z.string().nullish(),
    no_phone: z.string().nullish(),
    department: z.string().nullish(),
    gender: z.string().nullish(),
    address: z.string().nullish(),
    photo_profile: z.string().nullish(),
    referral_code: z.string().nullish(),
    user_code: z.string().nullish(),
    roleId: z.number().nullish(),
    verification_code_phone: z.string().nullish(),
    verification_code_email: z.string().nullish(),
    provinceId: z.number().nullish(),
    cityId: z.number().nullish(),
    dob: z.string().nullish(),
    bio: z.string().nullish(),
    finish_register: z.boolean().nullish(),
    verified_email_at: z.string().nullish(),
    verified_phone_at: z.string().nullish(),
    verified_account_at: z.string().nullish(),
    education: z.string().nullish(),
    practice_location: z.string().nullish(),
    join_date: z.string().nullish(),
    title: z.string().nullish(),
    sip: z.string().nullish(),
    str: z.string().nullish(),
    ktp_no: z.string().nullish(),
    ktp_image: z.string().nullish(),
    npwp_no: z.string().nullish(),
    npwp_image: z.string().nullish(),
    specialist: z.string().nullish(),
    rating: z.number().nullish(),
    status_schedule: z.string().nullish(),
    since: z.string().nullish(),
    start: z.string().nullish(),
    until: z.string().nullish(),
    doctor_schedule_status: z.string().nullish(),
    doctor_schedule_resting_start_date: z.string().nullish(),
    doctor_schedule_resting_end_date: z.string().nullish(),
    doctor_schedule_resting_time: z.string().nullish(),
    doctor_schedule_onleave_start_date: z.string().nullish(),
    doctor_schedule_onleave_end_date: z.string().nullish(),
    is_active: z.boolean().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    refresh_token: z.string().nullish(),
});

// Main Transaction Detail schema
const TransactionDetailSchema = z.object({
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
    transaction_product_items: z.array(TransactionProductItemSchema).nullish(),
    shipping_product: ShippingProductSchema.nullish(),
    product_invoice: z.null().nullish(),
    user: UserSchema.nullish(),
    transaction_product_voucher_applieds: z.array(z.unknown()).nullish(),
});

// Main Response schema
export const DataTransactionHistoryResponseSchema = z.object({
    transaction_id: z.string().nullish(),
    transaction_type: z.string().nullish(),
    transaction_status: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    detail: TransactionDetailSchema.nullish(),
});
export type TransactionHistoryResponse = z.infer<
    typeof TransactionHistoryResponseSchema
>;
export type TransactionDetail = z.infer<typeof TransactionDetailSchema>;
export type TransactionProductItem = z.infer<
    typeof TransactionProductItemSchema
>;
export type Product = z.infer<typeof ProductSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type ShippingProduct = z.infer<typeof ShippingProductSchema>;
export type User = z.infer<typeof UserSchema>;

export const TransactionHistoryResponseSchema = BaseResponseSchema(
    z.array(DataTransactionHistoryResponseSchema)
);

export const TransactionHistoryDetailResponseSchema = BaseResponseDataSchema(
    TransactionDetailSchema
);

export type TransactionHistoryDetailResponse = z.infer<
    typeof TransactionHistoryDetailResponseSchema
>;

export type DataTransactionHistoryResponse = z.infer<
    typeof DataTransactionHistoryResponseSchema
>;
