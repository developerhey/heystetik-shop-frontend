import z from "zod";

export const AddAddressParamSchema = z.strictObject({
    fullName: z.string().nonempty(),
    fullAddress: z.string().nonempty(),
    phoneRecepient: z.string().nonempty(),
    pinpointAddress: z.string().nonempty(),
    zipCode: z.number(),
    province: z.string().nonempty(),
    city: z.string().nonempty(),
    subdistrict: z.string().nonempty(),
    labelAddress: z.string().nonempty(),
    lat: z.number().nonoptional(),
    lng: z.number().nonoptional(),
    notes: z.string().optional(),
});

export type AddAddressParam = z.infer<typeof AddAddressParamSchema>;
export type AddressField = keyof AddAddressParam;
