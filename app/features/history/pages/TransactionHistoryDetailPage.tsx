import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
    Clock,
    MapPin,
    Store,
    Truck,
    CreditCard,
    ArrowLeft,
} from "lucide-react";
import { formatPriceIDR } from "~/lib/utils";
import { Link } from "react-router";
import type { TransactionDetail } from "~/shared/schemas/transaction-history-response-schema";

interface TransactionHistoryDetailPageProps {
    detail: TransactionDetail;
}

// Ringkasan Belanja Component
function OrderSummary({ detail }: { detail: TransactionDetail }) {
    const totalPrice = detail?.total_price || 0;
    const deliveryFee = detail?.delivery_fee || 0;
    const transactionFee = detail?.transaction_fee || 0;
    const tax = detail?.tax || 0;
    const totalDiscount = detail?.total_discount || 0;
    const totalPaid = detail?.total_paid || 0;
    const transactionItems = detail?.transaction_product_items || [];

    return (
        <Card className="w-full shadow-none gap-y-4 rounded-md">
            <div className="p-6">
                <h2 className="font-semibold text-lg mb-4">
                    Ringkasan Belanja
                    {transactionItems.length > 0 && (
                        <span className="text-sm font-normal text-green-600 ml-2">
                            ({transactionItems.length} item)
                        </span>
                    )}
                </h2>

                <div className="flex flex-col gap-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Total Harga Produk</span>
                        <span>{formatPriceIDR(totalPrice)}</span>
                    </div>

                    {/* Delivery Fee */}
                    {deliveryFee > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Biaya Pengiriman</span>
                            <span>{formatPriceIDR(deliveryFee)}</span>
                        </div>
                    )}

                    {/* Transaction Fee */}
                    {transactionFee > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Biaya Transaksi</span>
                            <span>{formatPriceIDR(transactionFee)}</span>
                        </div>
                    )}

                    {/* Tax */}
                    {tax > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Pajak</span>
                            <span>{formatPriceIDR(tax)}</span>
                        </div>
                    )}

                    {/* Discount */}
                    {totalDiscount > 0 && (
                        <div className="flex justify-between text-sm text-destructive">
                            <span>Diskon</span>
                            <span>-{formatPriceIDR(totalDiscount)}</span>
                        </div>
                    )}

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between font-semibold text-base">
                        <span>Total</span>
                        <span>{formatPriceIDR(totalPaid)}</span>
                    </div>
                </div>

                {/* Payment Method */}
                {detail?.payment_method && (
                    <>
                        <Separator className="my-4" />
                        <div>
                            <h3 className="font-semibold mb-2 text-sm">
                                Metode Pembayaran
                            </h3>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">
                                    {detail.payment_method.method ===
                                    "VIRTUAL_ACCOUNT"
                                        ? `Virtual Account ${detail.payment_method.type}`
                                        : detail.payment_method.type}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}

export function TransactionHistoryDetailPage({
    detail,
}: TransactionHistoryDetailPageProps) {
    // Safe data access with null checks
    const transactionStatus = detail?.status || "";
    const paymentExpiryTime = detail?.payment_expiry_time;
    const invoiceNumber = detail?.invoice_number;
    const transactionItems = detail?.transaction_product_items || [];
    const shippingProduct = detail?.shipping_product;

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "MENUNGGU_PEMBAYARAN":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "DIPROSES":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "DIKIRIM":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "TERKIRIM":
            case "SELESAI":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
            DIPROSES: "Pesanan Diproses",
            DIKIRIM: "Dikirim",
            TERKIRIM: "Terkirim",
            SELESAI: "Selesai",
        };
        return statusMap[status] || status;
    };

    // Check if data is available
    if (!detail) {
        return (
            <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
                <Card className="p-8 text-center">
                    <p className="text-gray-600">
                        Data transaksi tidak tersedia
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Detail Transaksi
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {invoiceNumber}
                            </p>
                        </div>
                        {transactionStatus === "MENUNGGU_PEMBAYARAN" && (
                            <Link
                                to={`/user/payment/${detail.id}`}
                                className="mt-4 sm:mt-0"
                            >
                                <Button>
                                    Lanjutkan Pembayaran
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2/3 width on desktop */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <Card className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <Badge
                                        className={`${getStatusBadgeColor(transactionStatus)} text-sm font-medium`}
                                    >
                                        {getStatusText(transactionStatus)}
                                    </Badge>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {transactionStatus ===
                                        "MENUNGGU_PEMBAYARAN"
                                            ? "Selesaikan pembayaran sebelum waktu habis"
                                            : "Pesanan sedang diproses"}
                                    </p>
                                </div>
                                {transactionStatus === "MENUNGGU_PEMBAYARAN" &&
                                    paymentExpiryTime && (
                                        <div className="flex items-center gap-2 text-yellow-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-medium">
                                                Batas:{" "}
                                                {new Date(
                                                    paymentExpiryTime
                                                ).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    )}
                            </div>
                        </Card>

                        {/* Products */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Produk Dipesan
                            </h2>
                            <div className="space-y-4">
                                {transactionItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 pb-4 border-b last:border-b-0"
                                    >
                                        <img
                                            src={
                                                import.meta.env
                                                    .VITE_API_URL_FILES +
                                                    item.product
                                                        ?.media_products?.[0]
                                                        ?.media?.path ||
                                                "/placeholder-product.jpg"
                                            }
                                            alt={
                                                item.product?.name || "Product"
                                            }
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900">
                                                {item.product?.name ||
                                                    "Nama produk tidak tersedia"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {item.product?.skincare_detail
                                                    ?.brand || ""}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
                                                <span>{item.qty} barang</span>
                                                <span>•</span>
                                                <span>
                                                    {formatPriceIDR(
                                                        item.price || 0
                                                    )}
                                                </span>
                                            </div>
                                            {item.note && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Catatan: {item.note}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatPriceIDR(
                                                    item.subtotal || 0
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Shipping Information */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Informasi Pengiriman
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Store className="w-4 h-4 text-green-600" />
                                        <span className="font-medium">
                                            Dikirim dari
                                        </span>
                                    </div>
                                    <p className="font-semibold">
                                        {shippingProduct?.shipper?.name ||
                                            "Tidak tersedia"}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {shippingProduct?.shipper?.address ||
                                            ""}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Truck className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium">
                                            Metode Pengiriman
                                        </span>
                                    </div>
                                    <p className="font-semibold">
                                        {shippingProduct?.shipping_method
                                            ?.name || "Tidak tersedia"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {formatPriceIDR(
                                            detail?.delivery_fee || 0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width on desktop */}
                    <div className="space-y-6">
                        {/* Ringkasan Belanja */}
                        <OrderSummary detail={detail} />

                        {/* Customer Information */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Informasi Penerima
                            </h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">
                                        {shippingProduct?.recipient_name ||
                                            "Tidak tersedia"}
                                    </span>
                                </div>
                                <p className="text-gray-600">
                                    {shippingProduct?.recipient_phone || ""}
                                </p>
                                <p className="text-gray-600">
                                    {shippingProduct?.recipient_address || ""}
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
