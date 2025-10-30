import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import type { ProductListUI } from "~/shared/schemas/product-ui-schema";
import { useCart } from "../hooks/useCart";
import { LoadingOverlay } from "~/components/ui/loading";
import { CartMobile } from "../components";
import { CheckoutMobile } from "../components/checkout/CheckoutMobile";
import { MapPin, Percent, Wallet, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { type AddressResponse } from "~/features/address/schemas/address-response.schema";
import { VoucherDialog } from "../components/VoucherDialog";
import { Combobox } from "~/components/ui/combobox";
import { PaymentMethodDialog } from "../components/PaymentMethodDialog";
import { type PaymentMethod } from "../schemas/payment-method-response-schema";
import type { Voucher } from "../schemas/voucher-response-schema";
import { formatPriceIDR } from "~/lib/utils";
import { toast } from "sonner";

export function CartPageMobile({
    token,
    carts,
    userAddress,
    paymentMethods,
    vouchers,
}: {
    token: string;
    carts: ProductListUI;
    userAddress: AddressResponse;
    paymentMethods: PaymentMethod[];
    vouchers: Voucher[];
}) {
    const navigate = useNavigate();
    const {
        handleDeleteFromCart,
        handleDeleteSelected,
        loading,
        updateQty,
        updateNotes,
        localNotes,
        localQty,
        selectedItems,
        toggleItemSelection,
        toggleSelectAll,
        isAllSelected,
        isSomeSelected,
        step,
        setStep,
        getSelectedCarts,
        setSelectedShippingMethodId,
        selectedShippingMethodId,
        loadingClientRequest,
        shippingMethods,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        openPaymentMethod,
        setOpenPaymentMethod,
        setOpenVouchers,
        openVouchers,
        selectedVoucherId,
        setSelectedVoucherId,
        displaySummary,
        getTotalPrice,
        getButtonDisabledState,
        getVoucherDiscountText,
        selectedShippingMethod,
        handlePayment,
        getStockValidationMessage,
        getAvailableItemsCount,
    } = useCart({ token, carts, userAddress, vouchers, paymentMethods });

    return (
        <div className="min-h-screen bg-muted pb-20">
            {/* Header */}
            <div className="bg-white p-4 border-b sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    {step === "checkout" ? (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setStep("cart")}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-lg font-semibold">Checkout</h1>
                            <div className="w-9" /> {/* Spacer for balance */}
                        </>
                    ) : (
                        <>
                            <h1 className="text-lg font-semibold">Keranjang</h1>
                            {carts.length > 0 && (
                                <div className="flex items-center gap-2">
                                    {/* Select All Checkbox */}
                                    <div className="flex items-center space-x-1">
                                        <Checkbox
                                            id="select-all-mobile"
                                            checked={isAllSelected}
                                            onCheckedChange={toggleSelectAll}
                                            aria-label="Pilih semua item yang tersedia"
                                            className="h-4 w-4"
                                        />
                                        <label
                                            htmlFor="select-all-mobile"
                                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
                                        >
                                            Pilih Semua
                                        </label>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Delete Selected Button for Mobile - Show in header when items selected */}
                {/* {step === "cart" && selectedItems.size > 0 && (
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                            {selectedItems.size} item dipilih dari {getAvailableItemsCount()} tersedia
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteSelected}
                            disabled={loading}
                            className="text-xs h-7"
                        >
                            Hapus
                        </Button>
                    </div>
                )} */}
            </div>

            {/* Cart Step */}
            {step === "cart" && (
                <div className="p-4 space-y-3">
                    {/* Product List */}
                    {carts.map((cart, key) => {
                        const qty =
                            localQty[cart.cartId.toString()] ?? cart.qty;
                        const notes =
                            localNotes[cart.cartId.toString()] ?? cart.notes;
                        const isSelected = selectedItems.has(
                            cart.cartId.toString()
                        );
                        const isAvailable = cart.stock > 0 && qty <= cart.stock;

                        return (
                            <div key={key}>
                                <CartMobile
                                    cart={cart}
                                    qty={qty}
                                    notes={notes}
                                    isSelected={isSelected}
                                    onToggleSelection={() => {
                                        if (!isAvailable) {
                                            toast.error(
                                                "Stok tidak mencukupi",
                                                { duration: 1500 }
                                            );
                                        } else {
                                            toggleItemSelection(
                                                cart.cartId.toString()
                                            );
                                        }
                                    }}
                                    isAvailable={isAvailable}
                                    onDecrement={() => {
                                        if (qty > 1) {
                                            updateQty(
                                                cart.cartId.toString(),
                                                qty - 1,
                                                notes
                                            );
                                        }
                                    }}
                                    onIncrement={() =>
                                        updateQty(
                                            cart.cartId.toString(),
                                            qty + 1,
                                            notes
                                        )
                                    }
                                    onDelete={() =>
                                        handleDeleteFromCart(
                                            cart.cartId.toString()
                                        )
                                    }
                                    onUpdateNotes={(notes) =>
                                        updateNotes(
                                            cart.cartId.toString(),
                                            qty,
                                            notes
                                        )
                                    }
                                />
                            </div>
                        );
                    })}

                    {carts.length === 0 && (
                        <Card className="shadow-none rounded-md">
                            <CardContent className="pt-6 text-center">
                                <p className="text-muted-foreground">
                                    Tidak ada produk dalam keranjang
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Checkout Step */}
            {step === "checkout" && (
                <div className="p-4 space-y-4">
                    {/* Shipping Address */}
                    <Card className="shadow-none rounded-md">
                        <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-sm text-muted-foreground">
                                    Alamat Pengiriman
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary text-xs h-auto p-0"
                                    onClick={() => navigate("/user/address")}
                                >
                                    {userAddress?.id
                                        ? "Ubah Alamat"
                                        : "Tambah Alamat"}
                                </Button>
                            </div>
                            <div className="flex items-start gap-2">
                                {userAddress?.id ? (
                                    <>
                                        <MapPin
                                            size={14}
                                            className="text-primary mt-0.5 shrink-0"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm">
                                                    {userAddress?.label_address}
                                                </span>
                                                <span className="font-bold">
                                                    •
                                                </span>
                                                <span className="font-bold text-sm">
                                                    {
                                                        userAddress?.recipient_name
                                                    }
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {userAddress?.complete_address}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {userAddress?.recipient_phone}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-xs">
                                        Kamu belum memiliki alamat, silahkan
                                        tambah alamat baru.
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card className="shadow-none rounded-md">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-muted-foreground">
                                Detail Produk
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {getSelectedCarts(carts).map((cart, key) => (
                                <CheckoutMobile key={key} cart={cart} />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Shipping & Payment Options */}
                    <Card className="shadow-none rounded-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">
                                Pengiriman & Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            <Combobox
                                selectText="Pilih pengiriman"
                                value={selectedShippingMethodId}
                                onValueChange={setSelectedShippingMethodId}
                                listData={
                                    shippingMethods?.map((method) => ({
                                        value: method.id.toString(),
                                        label: method.name,
                                        description: method.description,
                                        isActive: method.is_active,
                                    })) || []
                                }
                            />

                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                    if (!selectedShippingMethod) {
                                        toast.error(
                                            "Silahkan pilih metode pengiriman terlebih dahulu"
                                        );
                                    } else {
                                        setOpenVouchers(true);
                                    }
                                }}
                            >
                                <Percent className="text-primary mr-2 h-4 w-4" />
                                {selectedVoucherId
                                    ? vouchers?.find(
                                          (voucher) =>
                                              voucher?.id?.toString() ===
                                              selectedVoucherId
                                      )?.name
                                    : "Pakai Promo"}
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setOpenPaymentMethod(true)}
                            >
                                <Wallet className="text-primary mr-2 h-4 w-4" />
                                {selectedPaymentMethod
                                    ? paymentMethods?.find(
                                          (method) =>
                                              method?.id?.toString() ===
                                              selectedPaymentMethod
                                      )?.name
                                    : "Pilih Metode Pembayaran"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Summary Card - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                <Card className="shadow-none border-0">
                    <CardContent className="p-0">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Total</span>
                            <span className="font-semibold">
                                {formatPriceIDR(
                                    Math.max(
                                        0,
                                        Math.round(getTotalPrice() ?? 0)
                                    )
                                )}
                            </span>
                        </div>

                        {selectedItems.size > 0 && (
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>{selectedItems.size} item dipilih</span>
                                <span>
                                    {formatPriceIDR(
                                        displaySummary.subtotal ?? 0
                                    )}
                                </span>
                            </div>
                        )}

                        {selectedShippingMethod && (
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Pengiriman</span>
                                <span>
                                    {formatPriceIDR(
                                        selectedShippingMethod?.price ?? 0
                                    )}
                                </span>
                            </div>
                        )}

                        {selectedVoucherId && (
                            <div className="flex justify-between text-xs text-destructive mb-1">
                                <span>Diskon</span>
                                <span>
                                    -
                                    {formatPriceIDR(
                                        Math.round(
                                            getVoucherDiscountText() ?? 0
                                        )
                                    )}
                                </span>
                            </div>
                        )}

                        {selectedPaymentMethod && (
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Biaya Transaksi</span>
                                <span>
                                    {formatPriceIDR(
                                        paymentMethods?.filter(
                                            (method) =>
                                                method?.id?.toString() ==
                                                selectedPaymentMethod
                                        )[0]?.platform_fee_amount ?? 0
                                    )}
                                </span>
                            </div>
                        )}

                        <Button
                            disabled={getButtonDisabledState()}
                            className="w-full mt-2"
                            onClick={handlePayment}
                            size="lg"
                        >
                            {step === "cart"
                                ? selectedItems.size > 0
                                    ? `Beli (${selectedItems.size})`
                                    : "Beli"
                                : "Bayar Sekarang"}
                        </Button>

                        {getStockValidationMessage() && (
                            <div className="w-full text-center mt-2">
                                <p className="text-destructive text-xs font-medium">
                                    {getStockValidationMessage()}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialogs */}
            <VoucherDialog
                subtotal={displaySummary.subtotal}
                setOpen={setOpenVouchers}
                open={openVouchers}
                vouchers={vouchers}
                onSelected={(value) => setSelectedVoucherId(value)}
            />
            <PaymentMethodDialog
                setOpen={setOpenPaymentMethod}
                open={openPaymentMethod}
                paymentMethods={paymentMethods}
                onSelected={(value) => setSelectedPaymentMethod(value)}
            />

            <LoadingOverlay show={loading || loadingClientRequest} />
        </div>
    );
}
