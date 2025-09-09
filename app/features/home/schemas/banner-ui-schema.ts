import z from "zod";

const BannerUISchema = z.strictObject({
    alt: z.string(),
    image: z.string(),
})

const BannerListUISchema = z.array(BannerUISchema)
export type BannerListUI = z.infer<typeof BannerListUISchema>
export type BannerUI = z.infer<typeof BannerUISchema>