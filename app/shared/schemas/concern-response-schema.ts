import z from "zod";
import { BaseResponseSchema } from "~/shared/schemas/base-response-schema";

const ConcernSchema = z.object({
    id: z.number().int().nonnegative().nullish(),
    name: z.string().nullish(),
    segment: z.string().nullish(),
});

const ConcernListSchema = z.array(ConcernSchema);

export const ConcernListResponseSchema = BaseResponseSchema(ConcernListSchema);
export type ConcernListResponse = z.infer<typeof ConcernListResponseSchema>;
export type ConcernResponse = z.infer<typeof ConcernSchema>;
