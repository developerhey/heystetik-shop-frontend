import z from "zod";
import { BaseResponseDataSchema } from "../../../shared/schemas/base-response-schema";

const ShippingMethodResponseSchema = z.strictObject({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    info: z.string(),
    provider: z.string(),
    price: z.number(),
    is_active: z.boolean(),
});

export const ShippingMethodListResponseSchema = BaseResponseDataSchema(
    z.array(ShippingMethodResponseSchema)
);

export type ShippingMethodListResponse = z.infer<
    typeof ShippingMethodListResponseSchema
>;

export type ShippingMethodResponse = z.infer<typeof ShippingMethodResponseSchema>;
