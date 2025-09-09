import { type ProductUI } from "~/shared/schemas/product-ui-schema";
import { Link } from "react-router";
export default function ProductDesktop({ product }: { product: ProductUI }) {
    return (
        <Link to={`/product/${product.id}`}>
            <div className="shadow-sm bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform duration-300 rounded-md pb-4">
                <img
                    src={product.images[0].path || ""}
                    alt={product.title}
                    className="w-full h-[12.5rem] rounded-t-md"
                    loading="lazy"
                />
                <span className="text-md mt-2 text-black font-semibold line-clamp-1 px-4">
                    {product.brand}
                </span>
                <span className="text-sm text-gray-500 px-4 line-clamp-1">
                    {product.title}
                </span>
                {!product.formattedPriceWithDiscount && (
                    <span className="text-sm font-bold text-black px-4 mt-4">
                        {product.formattedPrice}
                    </span>
                )}
                {product.formattedPriceWithDiscount && (
                    <>
                        <span className="text-xs line-through text-muted-foreground px-4 mt-4">
                            {product.formattedPrice}
                        </span>
                        <span className="text-sm font-bold text-destructive px-4">
                            {product.formattedPriceWithDiscount}
                        </span>
                    </>
                )}
            </div>
        </Link>
    );
}
