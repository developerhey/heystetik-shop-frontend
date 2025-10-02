import { X } from "lucide-react";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import type { ProductListUI } from "~/shared/schemas/product-ui-schema";
import { useWishlist } from "~/shared/hooks/useWishlist";
import { LoadingOverlay } from "../ui/loading";

export default function WishlistSidebar({
    wishlist,
}: {
    wishlist: ProductListUI;
}) {
    const { isOpenWishlist, setOpenWishlist } = useDialogStore();
    const { loading, handleAddToCart, handleRemoveFromWishlist } =
        useWishlist();

    return (
        <>
            {/* Overlay */}
            {isOpenWishlist && (
                <div
                    className="fixed inset-0 bg-black/30 z-999"
                    onClick={() => setOpenWishlist(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-999 transform transition-transform duration-300 
        ${isOpenWishlist ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Wishlist</h2>
                    <button
                        className="cursor-pointer"
                        onClick={() => setOpenWishlist(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Wishlist Items */}
                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
                    {wishlist.length === 0 && (
                        <p className="text-gray-500 text-sm">
                            Tidak ada skincare di wishlist
                        </p>
                    )}

                    {wishlist.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start gap-3 border-b pb-3 last:border-0"
                        >
                            <img
                                src={item.images[0].path}
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 text-sm">
                                <h3 className="text-md font-bold leading-snug">
                                    {item.brand}
                                </h3>
                                <h4 className="text-gray-600 text-xs mb-2">
                                    {item.title}
                                </h4>
                                {!item.formattedPriceWithDiscount ? (
                                    <p className="text-gray-800">
                                        {item.formattedPrice}
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-xs text-muted-foreground line-through">
                                            {item.formattedPrice}
                                        </p>
                                        <p className="font-semibold text-destructive">
                                            {item.formattedPriceWithDiscount}
                                        </p>
                                    </>
                                )}
                                <button
                                    className="text-xs text-blue-600 font-medium cursor-pointer hover:underline mt-2"
                                    onClick={() => handleAddToCart(item.id)}
                                >
                                    TAMBAH KE KERANJANG
                                </button>
                            </div>
                            <button
                                className="cursor-pointer"
                                onClick={() =>
                                    handleRemoveFromWishlist(item.id)
                                }
                            >
                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <LoadingOverlay show={loading} />
        </>
    );
}
