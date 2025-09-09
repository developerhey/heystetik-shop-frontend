import type {
    ConcernListResponse,
    ConcernListResponseSchema,
    ConcernResponse,
} from "~/shared/schemas/concern-response-schema";
import type {
    ConcernListUI,
    ConcernUI,
} from "~/shared/schemas/concern-ui-schema";

function mapConcernResponseToUI(response?: ConcernResponse): ConcernUI {
    return {
        id: response?.id?.toString() ?? "",
        text: response?.name ?? "",
        segment: response?.segment ?? "",
    };
}

export function mapConcernListResponseToUI(
    response?: ConcernListResponse
): ConcernListUI {
    return response?.data?.data?.map(mapConcernResponseToUI) ?? [];
}
