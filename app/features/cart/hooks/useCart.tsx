import { useFetcher } from "react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type ProductListUI } from "~/shared/schemas/product-ui-schema";

export function useCart({ carts }: { carts: ProductListUI }) {
    const [localQty, setLocalQty] = useState<Record<string, number>>(() =>
        Object.fromEntries(carts.map((c) => [c.cartId.toString(), c.qty]))
    );

    const [localNotes, setLocalNotes] = useState<Record<string, string>>(() =>
        Object.fromEntries(carts.map((c) => [c.cartId.toString(), c.notes]))
    );

    const updateQty = (cartId: string, newQty: number, notes = "") => {
        setLocalQty((prev) => ({ ...prev, [cartId]: newQty })); // update UI instantly
        handleUpdateCart(newQty, cartId, notes); // debounce API call
    };

    const updateNotes = (cartId: string, newQty: number, notes = "") => {
        setLocalNotes((prev) => ({ ...prev, [cartId]: notes })); // update UI instantly
        handleUpdateCart(newQty, cartId, notes); // debounce API call
    };

    const summary = carts.reduce(
        (acc, cart) => {
            const qty = cart.qty; // ambil dari remote
            const price = cart.discountedPrice ?? cart.price;
            acc.items += qty;
            acc.subtotal += price * qty;
            return acc;
        },
        { items: 0, subtotal: 0 }
    );

    const fetcher = useFetcher();
    const loading =
        fetcher.state === "submitting" || fetcher.state === "loading";

    // store timeout per product
    const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

    useEffect(() => {
        if (fetcher.data?.success && !loading) {
            toast.success(fetcher.data.message, { duration: 1500 });
        }

        if (fetcher.data?.error && !loading) {
            toast.error(fetcher.data.error, { duration: 1500 });
        }
    }, [fetcher.data, loading]);

    const handleUpdateCart = (
        qty: number,
        productId: string,
        notes: string
    ) => {
        // clear previous timer if exists
        if (debounceTimers.current[productId]) {
            clearTimeout(debounceTimers.current[productId]);
        }

        // start a new debounce timer
        debounceTimers.current[productId] = setTimeout(() => {
            fetcher.submit(
                { productId, notes, qty },
                { method: "post", action: "/api/update-cart" }
            );
            delete debounceTimers.current[productId]; // cleanup
        }, 800); // ⏳ adjust debounce delay (ms) like Tokopedia style
    };

    const handleDeleteFromCart = (productId: string) => {
        // if (qty < minOrder) return;
        fetcher.submit(
            { productId },
            { method: "post", action: "/api/delete-from-cart" }
        );
    };
    return {
        loading,
        handleDeleteFromCart,
        handleUpdateCart,
        updateQty,
        updateNotes,
        summary,
        localQty,
        localNotes,
    };
}
