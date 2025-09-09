import type {
    CategoryListResponse,
    CategoryResponse,
} from "~/shared/schemas/category-response-schema";
import type {
    CategoryProductListUI,
    CategoryProductUI,
} from "~/shared/schemas/category-ui-schema";

const categoryProduct = [
    { name: "Moisturizer", path: "/images/moisturizer_lookup.png" },
    { name: "Cleanser", path: "/images/cleanser_lookup.png" },
    { name: "Serum", path: "/images/serum_lookup.png" },
    { name: "Toner", path: "/images/tonner_lookup.png" },
    { name: "Eye Cream", path: "/images/eye_cream_lookup.png" },
    { name: "Sunscreen", path: "/images/sunscreen_lookup.png" },
    { name: "Exfoliant", path: "/images/exfoliant_lookup.png" },
    { name: "Mask", path: "/images/mask_lookup.png" },
    { name: "Treatment", path: "/images/treatment_lookup.png" },
];

function mapCategoryProductResponseToUI(
    isConcern: boolean,
    response?: CategoryResponse
): CategoryProductUI {
    const image =
        categoryProduct.find(
            (item) =>
                item.name.toLowerCase() ===
                (response?.value ?? "").toLowerCase()
        )?.path ?? "";
    return {
        alt: response?.value ?? "",
        image: image,
        text: response?.value ?? "",
        id: response?.value ?? "",
    };
}

export function mapCategoryProductListResponseToUI(
    response?: CategoryListResponse
): CategoryProductListUI {
    return (
        response?.data?.data?.map((data) =>
            mapCategoryProductResponseToUI(false, data)
        ) ?? []
    );
}
