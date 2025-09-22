import type {
    WishlistListResponse,
    WishlistResponse,
} from "./wishlist-response-schema";
import type {
    ProductListUI,
    ProductUI,
} from "~/shared/schemas/product-ui-schema";
import { mapProductResponseToUI } from "./product-mapper";

export function mapWishlistResponseToProductUI(
    response?: WishlistResponse | null | undefined
): ProductUI {
    const productUi = mapProductResponseToUI(
        response?.product,
        null,
        null,
        null,
        response?.id
    );
    return productUi;
}

export function mapWishlistListResponseToUI(
    response?: WishlistListResponse
): ProductListUI {
    return (
        response?.data?.data?.map((data) =>
            mapWishlistResponseToProductUI(data)
        ) ?? []
    );
}
