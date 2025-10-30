import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import type { ProductListUI } from "~/shared/schemas/product-ui-schema";
import { useCart } from "../hooks/useCart";
import { LoadingOverlay } from "~/components/ui/loading";
import { CartDesktop } from "../components";
import { MapPin, Percent, Wallet } from "lucide-react";
import { useNavigate } from "react-router";
import { CheckoutDesktop } from "../components/checkout/CheckoutDesktop";
import { type AddressResponse } from "~/features/address/schemas/address-response.schema";
import { VoucherDialog } from "../components/VoucherDialog";
import { Combobox } from "~/components/ui/combobox";
import { PaymentMethodDialog } from "../components/PaymentMethodDialog";
import { type PaymentMethod } from "../schemas/payment-method-response-schema";
import type { Voucher } from "../schemas/voucher-response-schema";
import { formatPriceIDR } from "~/lib/utils";
import { toast } from "sonner";

export function CartPageDesktop({
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
        summary,
        selectedItems,
        toggleItemSelection,
        toggleSelectAll,
        isAllSelected,
        isSomeSelected,
        selectedSummary,
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
        <div className="w-full px-54 py-12 grid grid-cols-3 gap-6 bg-muted">
            {step == "cart" && (
                <div className="col-span-2 bg-white rounded-md p-6 border border-gray-200">
                    <div className="flex flex-col  mb-4">
                        <h2 className="text-xl font-semibold">Keranjang</h2>
                        {carts.length > 0 && (
                            <div className="flex items-center gap-4">
                                {/* Select All Checkbox */}
                                <div className="flex items-center space-x-2 mt-4">
                                    <Checkbox
                                        id="select-all"
                                        checked={isAllSelected}
                                        onCheckedChange={toggleSelectAll}
                                        aria-label="Pilih semua item yang tersedia"
                                    />
                                    <label
                                        htmlFor="select-all"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Pilih Semua ({getAvailableItemsCount()}{" "}
                                        tersedia)
                                    </label>
                                </div>

                                {/* Delete Selected Button */}
                                {/* {selectedItems.size > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDeleteSelected}
                                        disabled={loading}
                                    >
                                        Hapus yang dipilih ({selectedItems.size})
                                    </Button>
                                )} */}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-6 border-b pb-2 text-sm font-medium text-gray-500">
                        <div className="col-span-2 items-center flex gap-x-4">
                            Produk
                        </div>
                        <div></div>
                        <div className="text-center">Harga</div>
                        <div className="text-start">Jumlah</div>
                        <div className="text-right">Total</div>
                    </div>

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
                            <div key={key} className={`flex items-center py-4`}>
                                {/* Checkbox for individual item */}
                                <div className="pr-4 self-start mt-4">
                                    <Checkbox
                                        id={`cart-${cart.cartId}`}
                                        checked={isSelected}
                                        onCheckedChange={() => {
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
                                        disabled={!isAvailable}
                                        aria-label={`Pilih ${cart.title}`}
                                    />
                                </div>

                                {/* Cart item content */}
                                <div className="flex-1">
                                    <CartDesktop
                                        cart={cart}
                                        qty={qty}
                                        notes={notes}
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
                            </div>
                        );
                    })}

                    {carts.length === 0 && (
                        <p className="mt-4 min-h-[23vh]">
                            Tidak ada produk dalam keranjang
                        </p>
                    )}
                </div>
            )}

            {/* Rest of the component remains the same */}
            {step == "checkout" && (
                <div className="col-span-2 bg-white rounded-md p-6 border border-gray-200 flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <h1 className="text-muted-foreground font-semibold text-xl">
                                Alamat Pengiriman
                            </h1>
                            {userAddress?.id ? (
                                <>
                                    <div className="flex flex-row gap-x-2 items-center text-md mt-2">
                                        <MapPin size={14} />
                                        <span className="font-bold">
                                            {userAddress?.label_address}
                                        </span>
                                        <span className="font-bold">•</span>
                                        <span className="font-bold">
                                            {userAddress?.recipient_name}
                                        </span>
                                    </div>
                                    <div className="text-sm mt-2">
                                        {userAddress?.complete_address}
                                        <br />
                                        {userAddress?.recipient_phone}
                                    </div>
                                </>
                            ) : (
                                <span className="text-sm">
                                    Kamu belum memiliki alamat, silahkan tambah
                                    alamat baru.
                                </span>
                            )}
                        </div>
                        <Button
                            variant={"outline"}
                            className="text-primary"
                            onClick={() => {
                                navigate("/user/address");
                            }}
                        >
                            {userAddress?.id ? "Ubah Alamat" : "Tambah Alamat"}
                        </Button>
                    </div>
                    <hr className="my-4" />
                    <div className="flex flex-col">
                        <h1 className="text-muted-foreground font-semibold text-xl">
                            Detail Produk
                        </h1>
                        {getSelectedCarts(carts).map((cart, key) => {
                            return <CheckoutDesktop cart={cart} key={key} />;
                        })}
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {step == "checkout" && (
                    <Card className="w-full max-w-sm shadow-none gap-y-4 rounded-md">
                        <CardHeader>
                            <CardTitle className="font-semibold">
                                Pilih Pengiriman & Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-y-2">
                            <div>
                                <Combobox
                                    selectText="Pilih pengiriman"
                                    value={selectedShippingMethodId}
                                    onValueChange={(value) => {
                                        setSelectedShippingMethodId(value);
                                    }}
                                    listData={
                                        shippingMethods?.map((method) => ({
                                            value: method.id.toString(),
                                            label: method.name,
                                            description: method.description,
                                            isActive: method.is_active,
                                        })) || []
                                    }
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="!justify-start"
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
                                <Percent className="text-primary" />
                                {selectedVoucherId
                                    ? vouchers?.filter(
                                          (voucher) =>
                                              voucher?.id?.toString() ==
                                              selectedVoucherId
                                      )[0].name
                                    : "Pakai Promo"}
                            </Button>
                            <Button
                                className="!justify-start"
                                variant={"outline"}
                                onClick={() => setOpenPaymentMethod(true)}
                            >
                                <Wallet className="text-primary" />
                                {selectedPaymentMethod
                                    ? paymentMethods?.filter(
                                          (method) =>
                                              method?.id?.toString() ==
                                              selectedPaymentMethod
                                      )[0].name
                                    : "Pilih Metode Pembayaran"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Card className="w-full max-w-sm shadow-none gap-y-4 rounded-md">
                    <CardHeader>
                        <CardTitle className="font-semibold">
                            Ringkasan Belanja
                            {selectedItems.size > 0 && (
                                <span className="text-sm font-normal text-green-600 ml-2">
                                    ({selectedItems.size} item dipilih)
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Total Harga Produk</span>
                            <span>
                                Rp{" "}
                                {displaySummary.subtotal.toLocaleString(
                                    "id-ID"
                                )}
                            </span>
                        </div>
                        {selectedShippingMethod && (
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Biaya Pengiriman</span>
                                <span>
                                    {formatPriceIDR(
                                        selectedShippingMethod?.price ?? 0
                                    )}
                                </span>
                            </div>
                        )}
                        {selectedVoucherId && (
                            <div className="flex justify-between text-sm text-destructive">
                                <span>Diskon Voucher</span>
                                <span>
                                    {formatPriceIDR(
                                        Math.round(
                                            getVoucherDiscountText() ?? 0
                                        )
                                    )}
                                </span>
                            </div>
                        )}
                        {selectedPaymentMethod && (
                            <div className="flex justify-between text-sm text-gray-500">
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
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Pajak</span>
                            <span>Rp 0</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>
                                {formatPriceIDR(
                                    Math.max(
                                        0,
                                        Math.round(getTotalPrice() ?? 0)
                                    )
                                )}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button
                            disabled={getButtonDisabledState()}
                            className="w-full"
                            onClick={handlePayment}
                        >
                            {selectedItems.size > 0
                                ? `Beli (${selectedItems.size})`
                                : "Beli"}
                        </Button>
                        {getStockValidationMessage() && (
                            <div className="w-full text-center mt-4">
                                <p className="text-destructive text-sm font-medium">
                                    {getStockValidationMessage()}
                                </p>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
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
