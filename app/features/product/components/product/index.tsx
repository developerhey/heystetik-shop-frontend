import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import type { ProductUI } from "~/shared/schemas/product-ui-schema";
import ProductDesktop from "./ProductDesktop";
import ProductMobile from "./ProductMobile";

export default function Product({ product }: { product: ProductUI }) {
    const { isMobile } = useOutletContext<ContextType>()

    return isMobile ? <ProductMobile product={product} /> : <ProductDesktop product={product} />
}