import z from "zod";
import {
    BaseResponseDataSchema,
    BaseResponseSchema,
} from "~/shared/schemas/base-response-schema";
import { ProductSchema } from "./product-response-schema";

const WishlistSchema = z.object({
    id: z.number().int().nonnegative().nullish(),
    user_id: z.number().int().nonnegative().nullish(),
    product_id: z.number().int().nonnegative().nullish(),
    product: ProductSchema.nullish(),
});

export const AddWishlistResponseSchema = BaseResponseDataSchema(WishlistSchema);
export type AddWishlistResponse = z.infer<typeof AddWishlistResponseSchema>;

export const WishlistListResponseSchema = BaseResponseSchema(
    z.array(WishlistSchema)
);
export type WishlistListResponse = z.infer<typeof WishlistListResponseSchema>;

export type WishlistResponse = z.infer<typeof WishlistSchema>;
