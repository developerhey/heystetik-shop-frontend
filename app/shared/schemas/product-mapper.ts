import { formatPriceIDR } from "~/lib/utils";
import type {
    ProductListResponse,
    ProductResponse,
} from "~/shared/schemas/product-response-schema";
import type {
    ProductListUI,
    ProductUI,
} from "~/shared/schemas/product-ui-schema";

export function mapProductResponseToUI(
    response?: ProductResponse | null | undefined,
    qty?: number | null | undefined,
    notes?: string | null | undefined,
    cartId?: number | null | undefined,
    wishlishId?: number | null | undefined
): ProductUI {
    const price = response?.price ?? 0;

    // Calculate discounted price
    let discountedPrice = price;
    if (response?.discount_is_active) {
        if (
            response.discount_type === "Fix Amount" &&
            response.discount_fix_amount
        ) {
            discountedPrice = Math.max(price - response.discount_fix_amount, 0);
        } else if (
            response.discount_type === "Percentage" &&
            response.discount_percentage
        ) {
            discountedPrice = Math.max(
                price - (price * response.discount_percentage) / 100,
                0
            );
        }
    }

    // qty fallback ke 1 biar totalPrice tidak 0 kalau qty kosong
    const finalQty = qty ?? 1;

    // Hitung total berdasarkan diskon
    const totalPrice =
        discountedPrice > 0 ? discountedPrice * finalQty : price * finalQty;

    return {
        id: response?.skincare_detail?.product_id ?? 0,
        cartId: cartId ?? 0,
        wishlishId: wishlishId ?? 0,
        title: response?.name ?? "",
        brand: response?.skincare_detail?.brand ?? "",
        description: response?.skincare_detail?.description ?? "",
        discountedPrice:
            discountedPrice > 0 && discountedPrice < price
                ? Math.round(discountedPrice)
                : 0,
        formattedPrice: formatPriceIDR(price),
        formattedPriceWithDiscount:
            discountedPrice > 0 && discountedPrice < price
                ? formatPriceIDR(Math.round(discountedPrice))
                : "",
        totalFormattedPrice: formatPriceIDR(Math.round(totalPrice)),
        howTo: response?.skincare_detail?.specification_how_to_use ?? "",
        ingredients: response?.skincare_detail?.specification_ingredients ?? "",
        price: price,
        type: response?.type ?? "",
        category: response?.category ?? "",
        display: response?.display ?? "",
        texture: response?.skincare_detail?.specification_texture ?? "",
        sachet: response?.skincare_detail?.specification_packaging_type ?? "",
        bpom: response?.skincare_detail?.specification_bpom ?? "",
        stock: response?.product_stock ?? 0,
        minOrder: response?.min_order ?? 0,
        qty: qty ?? 0,
        notes: notes ?? "",
        needConsult: response?.requires_prescription ?? false,
        images: (response?.media_products ?? [])
            .map((mp) => mp.media?.path)
            .filter((path): path is string => !!path)
            .map((path) => ({
                path: import.meta.env.VITE_API_URL_FILES + path,
            })),
    };
}

export function mapProductListResponseToUI(
    response?: ProductListResponse
): ProductListUI {
    return (
        response?.data?.data?.map((data) => mapProductResponseToUI(data)) ?? []
    );
}
