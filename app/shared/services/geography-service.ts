import { request } from "~/lib/request";
import {
    type GeographyListResponse,
    GeographyListResponseSchema,
} from "~/shared/schemas/geography-response-schema";
const path = "geography";

export const getProvinces = () => {
    return request<GeographyListResponse>(
        {
            url: path + "/provinces?take=999",
            method: "GET",
        },
        GeographyListResponseSchema
    );
};

export const getCities = (provinceId: string) => {
    return request<GeographyListResponse>(
        {
            url: path + "/kota-kabupatens?take=999&province_id=" + provinceId,
            method: "GET",
        },
        GeographyListResponseSchema
    );
};
