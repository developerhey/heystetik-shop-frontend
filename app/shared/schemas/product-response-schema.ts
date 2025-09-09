import z from "zod";
import {
    BaseResponseSchema,
    BaseResponseDataSchema,
} from "~/shared/schemas/base-response-schema";
import { MediaResponseSchema } from "~/shared/schemas/media-response-schema";

const MediaProductSchema = z.object({
    id: z.number().int().nonnegative().nullish(),
    media_id: z.number().int().nonnegative().nullish(),
    product_id: z.number().int().nonnegative().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    media: MediaResponseSchema.nullish(),
});

const SkincareDetailSchema = z.object({
    id: z.number().nonnegative().nullish(),
    product_id: z.number().nonnegative().nullish(),
    brand: z.string().nullish(),
    description: z.string().nullish(),
    specification_texture: z.string().nullish(),
    specification_bpom: z.string().nullish(),
    specification_netto: z.number().nonnegative().nullish(),
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

export const ProductSchema = z.object({
    id: z.number().int().nonnegative().nullish(),
    name: z.string().nullish(),
    type: z.string().nullish(),
    category: z.string().nullish(),
    display: z.string().nullish(),
    requires_prescription: z.boolean().nullish(),
    has_variant: z.boolean().nullish(),
    min_order: z.number().int().nonnegative().nullish(),
    price: z.number().int().nonnegative().nullish(),
    discount_is_active: z.boolean().nullish(),
    discount_type: z.string().nullish(),
    discount_percentage: z.number().nonnegative().nullish(),
    discount_fix_amount: z.number().nonnegative().nullish(),
    product_is_active: z.boolean().nullish(),
    product_stock: z.number().int().nonnegative().nullish(),
    product_threshold: z.string().nullish(),
    product_sku: z.string().nullish(),
    rating: z.number().int().nonnegative().nullish(),
    shipping_product_weight: z.number().int().nonnegative().nullish(),
    shipping_product_weight_type: z.string().nullish(),
    shipping_product_size_length_type: z.string().nullish(),
    shipping_product_size_width_type: z.string().nullish(),
    shipping_product_size_height_type: z.string().nullish(),
    shipping_product_size_length: z.number().nonnegative().nullish(),
    shipping_product_size_width: z.number().nonnegative().nullish(),
    shipping_product_size_height: z.number().nonnegative().nullish(),
    shipping: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    media_products: z.array(MediaProductSchema).nullish(),
    skincare_detail: SkincareDetailSchema.nullish(),
});

const ProductListSchema = z.array(ProductSchema);

export const ProductResponseSchema = BaseResponseDataSchema(ProductSchema);
export const ProductListResponseSchema = BaseResponseSchema(ProductListSchema);
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
export type ProductResponse = z.infer<typeof ProductSchema>;
export type ProductBaseResponse = z.infer<typeof ProductResponseSchema>;
