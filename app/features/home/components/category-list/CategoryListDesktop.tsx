import type { CategoryProductUI } from "~/shared/schemas/category-ui-schema";
import type { CategoryListProps } from ".";
import { Link } from "react-router";

export default function CategoryListDesktop({ categories }: CategoryListProps) {
    function CategoryItem({ category }: { category: CategoryProductUI }) {
        return (
            <Link
                to={`/search?category=${category.text}`}
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
            >
                <img
                    src={category.image}
                    alt={category.alt}
                    className="w-full h-100 object-center rounded-md"
                    loading="lazy"
                />
                <span className="mt-2 text-center">{category.text}</span>
            </Link>
        );
    }

    return (
        <section className="w-full flex flex-col mt-12 px-54">
            <hr />
            <div className="text-2xl font-semibold my-4 text-center">
                Kategori Skincare
            </div>
            <hr />
            <div className="grid grid-cols-3 gap-4 my-12">
                {categories.map((item, key) => {
                    return <CategoryItem key={key} category={item} />;
                })}
            </div>
        </section>
    );
}
