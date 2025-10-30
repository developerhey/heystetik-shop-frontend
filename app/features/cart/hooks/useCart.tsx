import { useFetcher } from "react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type ProductListUI } from "~/shared/schemas/product-ui-schema";
import { getShippingMethod } from "~/features/cart/services/shipping-service";
import { type AddressResponse } from "~/features/address/schemas/address-response.schema";
import { type ShippingMethodResponse } from "~/features/cart/schemas/shipping-response-schema";
import type { Voucher } from "../schemas/voucher-response-schema";
import type { PaymentMethod } from "../schemas/payment-method-response-schema";

export function useCart({
    token,
    carts,
    userAddress,
    vouchers,
    paymentMethods,
}: {
    token: string;
    carts: ProductListUI;
    userAddress: AddressResponse;
    vouchers: Voucher[];
    paymentMethods: PaymentMethod[];
}) {
    const [localQty, setLocalQty] = useState<Record<string, number>>(() =>
        Object.fromEntries(carts.map((c) => [c.cartId.toString(), c.qty]))
    );

    const [localNotes, setLocalNotes] = useState<Record<string, string>>(() =>
        Object.fromEntries(carts.map((c) => [c.cartId.toString(), c.notes]))
    );

    const [selectedItems, setSelectedItems] = useState<Set<string>>(
        () => new Set()
    );
    const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
    const [openVouchers, setOpenVouchers] = useState(false);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [isSomeSelected, setIsSomeSelected] = useState(false);
    const [step, setStep] = useState<"cart" | "checkout">("cart");
    const [loadingClientRequest, setLoadingClientRequest] = useState(false);
    const [selectedVoucherId, setSelectedVoucherId] = useState("");
    const [selectedShippingMethodId, setSelectedShippingMethodId] =
        useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [shippingMethods, setShippingMethods] =
        useState<ShippingMethodResponse[]>();

    const getSelectedCarts = (allCarts: ProductListUI) => {
        return allCarts.filter((cart) =>
            selectedItems.has(cart.cartId.toString())
        );
    };

    useEffect(() => {
        if (step === "checkout" && carts && userAddress.id) {
            const selectedCarts = getSelectedCarts(carts);
            const productItems = selectedCarts.map((cartItem) => ({
                product_id: cartItem.id,
                qty: cartItem.qty,
            }));

            setLoadingClientRequest(true);
            getShippingMethod(token, {
                user_address_id: userAddress.id,
                product_item: productItems,
            })
                .then((res) => {
                    setLoadingClientRequest(false);
                    setShippingMethods(res.data as ShippingMethodResponse[]);
                })
                .catch((e) => {
                    toast.error(e.message);
                });
        }
    }, [step]);

    // Update the useEffect that calculates selection states
    useEffect(() => {
        const totalAvailableItems = getAvailableItemsCount();
        const selectedCount = selectedItems.size;

        // Only consider available items when calculating "all selected"
        const availableCartIds = getAvailableCartIds();
        const allAvailableSelected =
            availableCartIds.every((id) => selectedItems.has(id)) &&
            selectedCount > 0;

        setIsAllSelected(allAvailableSelected);
        setIsSomeSelected(
            selectedCount > 0 && selectedCount < totalAvailableItems
        );
    }, [selectedItems, carts, localQty]);

    // Toggle individual item selection
    const toggleItemSelection = (cartId: string) => {
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            if (newSelected.has(cartId)) {
                newSelected.delete(cartId);
            } else {
                newSelected.add(cartId);
            }
            return newSelected;
        });
    };

    // Get available items (in stock and quantity <= stock)
    const getAvailableItems = () => {
        return carts.filter((cart) => {
            const qty = localQty[cart.cartId.toString()] ?? cart.qty;
            return cart.stock > 0 && qty <= cart.stock;
        });
    };

    // Get count of available items
    const getAvailableItemsCount = () => {
        return getAvailableItems().length;
    };

    // Get available cart IDs
    const getAvailableCartIds = () => {
        return getAvailableItems().map((cart) => cart.cartId.toString());
    };

    // Toggle select all - only select available items
    const toggleSelectAll = () => {
        if (isAllSelected) {
            // Deselect all
            setSelectedItems(new Set());
        } else {
            // Select only available items
            const availableCartIds = getAvailableCartIds();
            setSelectedItems(new Set(availableCartIds));
        }
    };

    // Get summary for selected items only
    const selectedSummary = carts.reduce(
        (acc, cart) => {
            if (selectedItems.has(cart.cartId.toString())) {
                const qty = cart.qty;
                const price = cart.discountedPrice ?? cart.price;
                acc.items += qty;
                acc.subtotal += price * qty;
            }
            return acc;
        },
        { items: 0, subtotal: 0 }
    );

    // Your existing methods remain the same...
    const updateQty = (cartId: string, newQty: number, notes = "") => {
        setLocalQty((prev) => ({ ...prev, [cartId]: newQty }));
        handleUpdateCart(newQty, cartId, notes);
    };

    const updateNotes = (cartId: string, newQty: number, notes = "") => {
        setLocalNotes((prev) => ({ ...prev, [cartId]: notes }));
        handleUpdateCart(newQty, cartId, notes);
    };

    const summary = carts.reduce(
        (acc, cart) => {
            const qty = cart.qty;
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
        if (debounceTimers.current[productId]) {
            clearTimeout(debounceTimers.current[productId]);
        }

        debounceTimers.current[productId] = setTimeout(() => {
            fetcher.submit(
                { productId, notes, qty },
                { method: "post", action: "/api/update-cart" }
            );
            delete debounceTimers.current[productId];
        }, 800);
    };

    const handleDeleteFromCart = (productId: string) => {
        // Remove from selected items if it's currently selected
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            newSelected.delete(productId);
            return newSelected;
        });

        fetcher.submit(
            { productId },
            { method: "post", action: "/api/delete-from-cart" }
        );
    };

    const handleDeleteSelected = () => {
        selectedItems.forEach((productId) => {
            handleDeleteFromCart(productId);
        });
        setSelectedItems(new Set());
    };

    const getButtonDisabledState = () => {
        if (step === "cart") {
            // In cart step, check if no items selected OR any item has insufficient stock
            // OR if all selected items have been deleted
            return selectedItems.size === 0 || hasInsufficientStock();
        } else if (step === "checkout") {
            // In checkout step, check all conditions including stock and deleted items
            return (
                selectedItems.size === 0 ||
                hasInsufficientStock() ||
                !selectedPaymentMethod ||
                selectedPaymentMethod === "" ||
                !selectedShippingMethodId ||
                selectedShippingMethodId === ""
            );
        }

        return true;
    };

    // Determine which summary to display
    const displaySummary =
        selectedItems.size > 0 ? selectedSummary : { items: 0, subtotal: 0 };

    const selectedVoucher = vouchers?.filter(
        (voucher) => voucher?.id?.toString() === selectedVoucherId
    )[0];

    const selectedShippingMethod = shippingMethods?.filter(
        (shippingMethod) =>
            shippingMethod?.id?.toString() === selectedShippingMethodId
    )[0];

    const getVoucherDiscountText = () => {
        if (selectedVoucher?.promotion_type == "Free Shipping") {
            const shippingFee = selectedShippingMethod?.price ?? 0;
            const freeShippingAmount =
                selectedVoucher.free_shipping_amount ?? 0;
            if (shippingFee < freeShippingAmount) return -shippingFee;
            else return shippingFee - freeShippingAmount;
        } else if (selectedVoucher?.promotion_type == "Discount") {
            if (selectedVoucher.discount_type == "Fix Amount") {
                return (selectedVoucher?.discount_fix_amount ?? 0) >
                    displaySummary.subtotal
                    ? -displaySummary.subtotal
                    : -(selectedVoucher?.discount_fix_amount ?? 0);
            } else {
                return (
                    (-displaySummary.subtotal *
                        (selectedVoucher.discount_percentage ?? 0)) /
                    100
                );
            }
        } else 0;
    };

    const getTotalPrice = () => {
        return (
            (displaySummary.subtotal ?? 0) +
            (getVoucherDiscountText() ?? 0) +
            (selectedShippingMethod?.price ?? 0) +
            (paymentMethods?.filter(
                (method) => method?.id?.toString() == selectedPaymentMethod
            )[0]?.platform_fee_amount ?? 0)
        );
    };

    // Update the stock validation to handle cases where items might be deleted
    const hasInsufficientStock = () => {
        if (selectedItems.size === 0) return false;

        const selectedCarts = getSelectedCarts(carts);

        // If no carts are found but we have selected items,
        // it means some items were deleted but selection wasn't cleared
        if (selectedCarts.length === 0 && selectedItems.size > 0) {
            // Clear the selection since all selected items are gone
            setSelectedItems(new Set());
            return true;
        }

        // Check if any selected item has insufficient stock
        return selectedCarts.some((cart) => {
            const currentQty = localQty[cart.cartId.toString()] ?? cart.qty;
            return cart.stock === 0 || currentQty > cart.stock;
        });
    };

    // Add this function to get stock validation messages
    const getStockValidationMessage = () => {
        if (selectedItems.size === 0) return null;

        const selectedCarts = getSelectedCarts(carts);
        const outOfStockItems = selectedCarts.filter(
            (cart) => cart.stock === 0
        );
        const overStockItems = selectedCarts.filter((cart) => {
            const currentQty = localQty[cart.cartId.toString()] ?? cart.qty;
            return cart.stock > 0 && currentQty > cart.stock;
        });

        if (outOfStockItems.length > 0) {
            return `${outOfStockItems.length} produk habis stok`;
        }

        if (overStockItems.length > 0) {
            return `${overStockItems.length} produk melebihi stok`;
        }

        return null;
    };

    const handlePayment = async () => {
        // Double-check stock before proceeding to payment
        if (hasInsufficientStock()) {
            toast.error(
                "Beberapa produk memiliki masalah stok. Silakan periksa kembali.",
                {
                    duration: 3000,
                }
            );
            return;
        }

        if (step === "cart") {
            setStep("checkout");
            return;
        }

        const selectedCarts = getSelectedCarts(carts);

        // Final stock validation before API call
        const invalidStockItems = selectedCarts.filter((cart) => {
            const currentQty = localQty[cart.cartId.toString()] ?? cart.qty;
            return cart.stock === 0 || currentQty > cart.stock;
        });

        if (invalidStockItems.length > 0) {
            toast.error(
                "Stok produk berubah. Silakan periksa kembali keranjang Anda.",
                {
                    duration: 3000,
                }
            );
            return;
        }

        const productItems = selectedCarts.map((cart) => ({
            product_id: cart.id,
            qty: localQty[cart.cartId.toString()] ?? cart.qty,
            note: localNotes[cart.cartId.toString()] ?? cart.notes,
        }));

        const paymentMethod = paymentMethods?.filter(
            (method) => method?.id?.toString() == selectedPaymentMethod
        )[0];

        const formData = new FormData();
        formData.append("product_item", JSON.stringify(productItems));
        formData.append("payment_method", paymentMethod?.method ?? "");
        formData.append("payment_type", paymentMethod?.type ?? "");
        formData.append("shipping_method_id", selectedShippingMethodId);
        formData.append("user_address_id", userAddress.id.toString());
        formData.append("voucher_id", selectedVoucherId || "");
        formData.append("total_price", displaySummary.subtotal.toString());
        let shippingFee = 0;
        if (selectedVoucher?.promotion_type == "Free Shipping") {
            shippingFee =
                (selectedShippingMethod?.price ?? 0) +
                (getVoucherDiscountText() ?? 0);
        } else {
            shippingFee = selectedShippingMethod?.price ?? 0;
        }
        formData.append("delivery_fee", shippingFee.toString());
        formData.append(
            "total_discount",
            (getVoucherDiscountText() ?? 0).toString()
        );
        formData.append("tax", "0");
        formData.append(
            "transaction_fee",
            (
                paymentMethods?.filter(
                    (method) => method?.id?.toString() === selectedPaymentMethod
                )[0]?.platform_fee_amount ?? 0
            ).toString()
        );
        formData.append("total_paid", getTotalPrice().toString());

        fetcher.submit(formData, {
            method: "post",
            action: "/api/order-product",
        });
    };

    return {
        loading,
        handleDeleteFromCart,
        handleDeleteSelected, // New method
        handleUpdateCart,
        updateQty,
        updateNotes,
        summary,
        selectedSummary, // New summary for selected items
        localQty,
        localNotes,
        // Checkbox related states and methods
        selectedItems,
        toggleItemSelection,
        toggleSelectAll,
        isAllSelected,
        isSomeSelected,
        setStep,
        step,
        getSelectedCarts,
        loadingClientRequest,
        shippingMethods,
        setSelectedShippingMethodId,
        selectedShippingMethodId,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        openPaymentMethod,
        setOpenPaymentMethod,
        setOpenVouchers,
        openVouchers,
        selectedVoucherId,
        setSelectedVoucherId,
        getTotalPrice,
        getButtonDisabledState,
        selectedShippingMethod,
        displaySummary,
        getVoucherDiscountText,
        handlePayment,
        getStockValidationMessage,
        getAvailableItemsCount,
    };
}
