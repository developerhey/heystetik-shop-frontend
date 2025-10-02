import type { ProductUI } from "~/shared/schemas/product-ui-schema";
export function CheckoutDesktop({ cart }: { cart: ProductUI }) {
    return (
        <div className="flex flex-col border-b py-4">
            <div className="flex flex-row justify-between gap-x-4">
                {/* Produk */}
                <div className="flex items-center gap-3 cursor-pointer max-w-[400px]">
                    <img
                        src={cart.images[0]?.path || ""}
                        alt={cart.title}
                        className="w-16 h-16 object-fill border rounded-md shrink-0"
                    />
                    <div>
                        <p className="font-medium">{cart.brand}</p>
                        <p className="text-gray-500 line-clamp-2">
                            {cart.title}
                        </p>
                        {cart.notes && <span className="text-sm">Catatan: {cart.notes}</span>}
                    </div>
                </div>

                {/* Harga */}
                <div className="text-right">
                    {cart.formattedPriceWithDiscount ? (
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 line-through">
                                {cart.formattedPrice}
                            </span>
                            <div className="font-semibold text-red-600">
                                <span className="text-black">
                                    {cart.qty} x{" "}
                                </span>
                                {cart.formattedPriceWithDiscount}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-700">
                            <span className="text-black">{cart.qty} x </span>
                            {cart.formattedPrice}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
