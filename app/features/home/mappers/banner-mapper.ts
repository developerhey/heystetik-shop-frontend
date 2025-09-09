import type { BannerListResponse, BannerResponse } from "~/features/home/services/banner-schema";
import type { BannerListUI, BannerUI } from "~/features/home/schemas/banner-ui-schema";

function mapBannerResponseToUI(response?: BannerResponse | null): BannerUI {
    return {
        alt: response?.title ?? "",
        image: import.meta.env.VITE_API_URL_FILES + response?.media_banner?.media?.path
    }
}

export function mapBannerListResponseToUI(response?: BannerListResponse | null): BannerListUI {
    return response?.data?.data?.map(mapBannerResponseToUI) ?? []
}