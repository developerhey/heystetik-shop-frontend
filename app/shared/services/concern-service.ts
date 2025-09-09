import { request } from "~/lib/request";
import {
    type ConcernListResponse,
    ConcernListResponseSchema,
} from "~/shared/schemas/concern-response-schema";

const path = "concern";
export const getConcernList = () =>
    request<ConcernListResponse>(
        {
            url: path,
            method: "GET",
            params: {
                order: "desc",
                page: "1",
                take: "100",
            },
        },
        ConcernListResponseSchema
    );
