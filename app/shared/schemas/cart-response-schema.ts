import z from "zod";
import {
    BaseResponseDataSchema,
    BaseResponseSchema,
} from "~/shared/schemas/base-response-schema";
import { ProductSchema } from "./product-response-schema";

const CartSchema = z.object({
    id: z.number().int().nonnegative().nullish(),
    user_id: z.number().int().nonnegative().nullish(),
    product_id: z.number().int().nonnegative().nullish(),
    qty: z.number().int().nonnegative().nullish(),
    product: ProductSchema.nullish(),
});

export const AddCartResponseSchema = BaseResponseDataSchema(CartSchema);
export type AddCartResponse = z.infer<typeof AddCartResponseSchema>;

export const CartListResponseSchema = BaseResponseSchema(z.array(CartSchema));
export type CartListResponse = z.infer<typeof CartListResponseSchema>;

export type CartResponse = z.infer<typeof CartSchema>;
