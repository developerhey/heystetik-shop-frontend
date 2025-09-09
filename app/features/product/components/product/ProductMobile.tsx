import type { ProductUI } from "~/shared/schemas/product-ui-schema";

export default function ProductMobile({ product }: {product: ProductUI}) {
    return (
        <div className="shadow-sm bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform duration-300 rounded-md pb-4">
            <img src={product.images[0].path} alt={product.title} className="w-full h-[8.75rem] rounded-t-md" loading="lazy" />
            {/* <span className="text-sm px-4 bg-primary text-white rounded-lg mt-4">Serum</span> */}
            <span className="text-sm mt-2 text-black font-semibold line-clamp-1 px-4">{product.brand}</span>
            <span className="text-xs text-gray-500 px-4 line-clamp-1">{product.title}</span>
            <span className="text-xs font-bold text-black px-4 mt-4">{product.formattedPrice}</span>
        </div>
    )
}