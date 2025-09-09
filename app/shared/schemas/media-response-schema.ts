import z from "zod"

export const MediaResponseSchema = z.object({
    id: z.number().int().nonnegative().nullish(),
    filename: z.string().nullish(),
    ext: z.string().nullish(),
    size: z.number().int().nonnegative().nullish(),
    mime: z.string().nullish(),
    path: z.string().nullish(),
    destination: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
})