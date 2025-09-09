import { request } from "~/lib/request"
import { type BannerListResponse, BannerListResponseSchema } from "~/features/home/services/banner-schema"

const path = "banner"
export const getBanners = () =>
    request<BannerListResponse>({
        url: path, method: "GET"
    }, BannerListResponseSchema)