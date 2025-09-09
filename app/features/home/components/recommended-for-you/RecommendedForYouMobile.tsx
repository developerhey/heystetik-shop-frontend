import Product from "~/features/product/components/product"
import type { RecommendedForYouProps } from "."
import { Link } from "react-router"
export default function RecommendedForYouMobile({ products }: RecommendedForYouProps) {
    return (
        <section className="w-full mt-4 pb-4 px-4 bg-primary">
            <h2 className="text-lg font-bold text-center my-8 text-white">Rekomendasi Untukmu</h2>
            <div className="grid grid-cols-2 gap-4">
                {products.map((item, key) => {
                    return (
                        <Product key={key} product={item} />
                    )
                })}
            </div>
            <div className="text-md text-center text-white mt-8 mb-4">
                <Link to="/search" className="cursor-pointer underline cursor-pointer">Lihat semua</Link>
            </div>
        </section>
    )
}