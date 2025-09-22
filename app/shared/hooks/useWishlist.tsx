import { useFetcher } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
export function useWishlist() {
    const fetcher = useFetcher();
    const loading =
        fetcher.state === "submitting" || fetcher.state === "loading";

    useEffect(() => {
        if (fetcher.data?.success && !loading) {
            toast.success(fetcher.data.message, { duration: 1500 });
        }

        if (fetcher.data?.error && !loading) {
            toast.error(fetcher.data.error, { duration: 1500 });
        }
    }, [fetcher.data, loading]);

    const handleAddToCart = (productId: number) => {
        fetcher.submit(
            { productId, qty: 1 },
            { method: "post", action: "/api/add-to-cart" }
        );
    };

    const handleAddToWishlist = (productId: number) => {
        fetcher.submit(
            { productId },
            { method: "post", action: "/api/add-to-wishlist" }
        );
    };

    const handleRemoveFromWishlist = (wishlistId: number) => {
        fetcher.submit(
            { wishlistId },
            { method: "post", action: "/api/delete-from-wishlist" }
        );
    };

    return {
        handleAddToCart,
        handleRemoveFromWishlist,
        handleAddToWishlist,
        loading,
    };
}
