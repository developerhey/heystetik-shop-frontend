import { z } from "zod"
import { BaseResponseSchema } from "~/shared/schemas/base-response-schema"
import { MediaResponseSchema } from "~/shared/schemas/media-response-schema"

const MediaBannerSchema = z.object({
    media: MediaResponseSchema.nullish()
})

const BannerSchema = z.object({
    id: z.number().int().nonnegative().nullish(),
    title: z.string().nullish(),
    type: z.string().nullish(),
    status: z.string().nullish(),
    media_banner: MediaBannerSchema.nullish()
})

const BannerListSchema = z.array(BannerSchema)

export const BannerListResponseSchema = BaseResponseSchema(BannerListSchema)
export type BannerListResponse = z.infer<typeof BannerListResponseSchema>
export type BannerResponse = z.infer<typeof BannerSchema>