import z from "zod";
import { BaseResponseSchema } from "~/shared/schemas/base-response-schema";

const CategorySchema = z.object({
    id: z.number().int().nonnegative().nullish(),
    value: z.string().nullish(),
    category: z.string().nullish(),
    description: z.string().nullish()
})

const CategoryListSchema = z.array(CategorySchema)

export const CategoryListResponseSchema = BaseResponseSchema(CategoryListSchema)
export type CategoryListResponse = z.infer<typeof CategoryListResponseSchema>
export type CategoryResponse = z.infer<typeof CategorySchema>