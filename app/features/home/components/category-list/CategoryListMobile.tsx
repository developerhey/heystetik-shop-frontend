import type { CategoryProductUI } from "~/shared/schemas/category-ui-schema";
import type { CategoryListProps } from ".";
import { Link } from "react-router";

export default function CategoryListMobile({ categories }: CategoryListProps) {
    function CategoryItem({ category }: { category: CategoryProductUI }) {
        return (
            <Link
                to={`/search?category=${category.text}`}
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
            >
                <img
                    src={category.image}
                    alt={category.alt}
                    className="w-full h-35 object-center rounded-md"
                    loading="lazy"
                />
                <span className="mt-2 text-center text-sm">
                    {category.text}
                </span>
            </Link>
        );
    }

    return (
        <section className="w-full flex flex-col mt-4 px-4 gap-y-4">
            <hr />
            <div className="text-lg font-semibold text-center">
                Kategori Skincare
            </div>
            <hr />
            <div className="grid grid-cols-3 gap-4">
                {categories.map((item, key) => {
                    return <CategoryItem key={key} category={item} />;
                })}
            </div>
        </section>
    );
}
