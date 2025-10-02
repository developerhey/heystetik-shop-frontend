import z from "zod";
import { BaseResponseSchema } from "~/shared/schemas/base-response-schema";

const GeographySchema = z.object({
    id: z.number().nullish(),
    name: z.string().nullish(),
});

export const GeographyListResponseSchema = BaseResponseSchema(
    z.array(GeographySchema)
);
export type GeographyListResponse = z.infer<typeof GeographyListResponseSchema>;

export type GeographyResponse = z.infer<typeof GeographySchema>;
