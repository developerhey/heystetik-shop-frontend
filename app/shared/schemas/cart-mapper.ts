import type { CartListResponse, CartResponse } from "./cart-response-schema";
import type {
    ProductListUI,
    ProductUI,
} from "~/shared/schemas/product-ui-schema";
import { mapProductResponseToUI } from "./product-mapper";

export function mapCartResponseToProductUI(
    response?: CartResponse | null | undefined
): ProductUI {
    const productUi = mapProductResponseToUI(
        response?.product,
        response?.qty ?? 0
    );
    return productUi;
}

export function mapCartListResponseToUI(
    response?: CartListResponse
): ProductListUI {
    return (
        response?.data?.data?.map((data) => mapCartResponseToProductUI(data)) ??
        []
    );
}
