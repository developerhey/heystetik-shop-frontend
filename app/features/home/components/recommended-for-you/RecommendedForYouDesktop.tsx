import Product from "~/features/product/components/product/ProductDesktop"
import type { RecommendedForYouProps } from "."
import { Link } from "react-router"

export default function RecommendedForYouDesktop({ products }: RecommendedForYouProps) {
    return (
        <section className="w-full mt-12 pb-12 px-54 bg-primary">
            <h2 className="text-2xl font-bold text-center my-12 text-white">Rekomendasi Untukmu</h2>
            <div className="grid grid-cols-4 gap-4">
                {products.map((item, key) => {
                    return (
                        <Product key={key} product={item} />
                    )
                })}
            </div>
            <div className="text-md text-center text-white mt-12">
                <Link to="/search" className="underline cursor-pointer">Lihat semua</Link>
            </div>
        </section>
    )
}