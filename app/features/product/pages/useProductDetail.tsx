// hooks/useProductDetail.ts
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

export function useProductDetail(productId: number, minOrder: number) {
    const [qty, setQty] = useState(1);
    const fetcher = useFetcher();
    const loading =
        fetcher.state === "submitting" || fetcher.state === "loading";

    const handleQtyChange = (newQty: number) => setQty(newQty);

    const handleAddToCart = () => {
        // if (qty < minOrder) return;
        fetcher.submit(
            { productId, qty },
            { method: "post", action: "/api/add-to-cart" }
        );
    };

    useEffect(() => {
        if (fetcher.data?.success && !loading) {
            toast.success(fetcher.data.message, { duration: 1500 });
        }

        if (fetcher.data?.error && !loading) {
            toast.error(fetcher.data.error, { duration: 1500 });
        }
    }, [fetcher.data, loading]);

    return {
        qty,
        loading,
        setQty: handleQtyChange,
        addToCart: handleAddToCart,
    };
}
