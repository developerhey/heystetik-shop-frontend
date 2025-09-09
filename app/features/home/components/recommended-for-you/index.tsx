import type { ProductListUI } from "~/shared/schemas/product-ui-schema";
import type { ContextType } from '~/root';
import { useOutletContext } from 'react-router';
import RecommendedForYouMobile from "./RecommendedForYouMobile";
import RecommendedForYouDesktop from "./RecommendedForYouDesktop";

export interface RecommendedForYouProps {
    products: ProductListUI
}

export default function RecommendedForYou({ products }: RecommendedForYouProps) {
    const { isMobile } = useOutletContext<ContextType>()
    return isMobile ? <RecommendedForYouMobile products={products} /> : <RecommendedForYouDesktop products={products} />
}