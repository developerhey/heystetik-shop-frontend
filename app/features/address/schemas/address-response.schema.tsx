import z from "zod";
import { BaseResponseDataSchema } from "~/shared/schemas/base-response-schema";

const AddressSchema = z.object({
    id: z.number().int().nonnegative(),
    user_id: z.number().int().nonnegative(),
    recipient_name: z.string(),
    recipient_phone: z.string(),
    province: z.string(),
    city: z.string(),
    subdistrict: z.string(),
    village: z.string().nullish(),
    zip_code: z.string(),
    pinpoint_latitude: z.number(),
    pinpoint_longitude: z.number(),
    pinpoint_address: z.string(),
    label_address: z.string(),
    complete_address: z.string(),
    note_for_courier: z.string(),
    main_address: z.boolean(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullish(),
});

const AddressListSchema = z.array(AddressSchema);

export const AddressListResponseSchema =
    BaseResponseDataSchema(AddressListSchema);
export type AddressListResponse = z.infer<typeof AddressListResponseSchema>;
export type AddressResponse = z.infer<typeof AddressSchema>;
export const AddressDataResponseSchema = BaseResponseDataSchema(AddressSchema)
export type AddressDataResponse = z.infer<typeof AddressDataResponseSchema>;
