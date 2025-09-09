
import type { ContextType } from '~/root';
import type { CategoryProductListUI } from '~/shared/schemas/category-ui-schema';
import { useOutletContext } from 'react-router';
import CategoryListMobile from './CategoryListMobile';
import CategoryListDesktop from './CategoryListDesktop';

export interface CategoryListProps {
    categories: CategoryProductListUI
}

export default function CategoryList({ categories }: CategoryListProps) {
    const { isMobile } = useOutletContext<ContextType>()

    return (
        isMobile ? <CategoryListMobile categories={categories} /> : <CategoryListDesktop categories={categories} />
    )
}