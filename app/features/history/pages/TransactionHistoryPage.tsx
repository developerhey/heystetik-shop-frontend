import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Package, CreditCard } from "lucide-react";
import type { DataTransactionHistoryResponse } from "~/shared/schemas/transaction-history-response-schema";
import { formatPriceIDR } from "~/lib/utils";
import { useNavigate } from "react-router";

const filters = [
    { text: "Semua", value: "ALL" },
    { text: "Menunggu Pembayaran", value: "MENUNGGU_PEMBAYARAN" },
    { text: "Pesanan Diproses", value: "DIPROSES" },
    { text: "Dikirim", value: "DIKIRIM" },
    { text: "Terkirim", value: "TERKIRIM" },
    { text: "Selesai", value: "SELESAI" },
    { text: "Pembayaran Expired", value: "PEMBAYARAN_EXPIRED" },
];

// Helper function to get status badge color
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
        case "PEMBAYARAN_EXPIRED":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

// Helper function to get status display text
const getStatusDisplayText = (status: string) => {
    const statusMap: Record<string, string> = {
        MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
        DIPROSES: "Pesanan Diproses",
        DIKIRIM: "Dikirim",
        TERKIRIM: "Terkirim",
        SELESAI: "Selesai",
        PEMBAYARAN_EXPIRED: "Pembayaran Expired",
        NEW_ORDER: "Pesanan Baru",
    };
    return statusMap[status] || status;
};

export function TransactionHistoryPage({
    transactionHistory,
}: {
    transactionHistory: DataTransactionHistoryResponse[];
}) {
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState("ALL");

    // Transform and filter transactions
    const filteredTransactions = transactionHistory
        .filter((tx) => {
            if (activeFilter === "ALL") return true;

            const status = tx.detail?.status;
            if (activeFilter === "DIPROSES") {
                return status === "DIPROSES" || status === "NEW_ORDER";
            }
            return status === activeFilter;
        })
        .map((tx) => ({
            id: tx.transaction_id,
            invoiceNumber: tx.detail?.invoice_number,
            status: tx.detail?.status,
            orderStatus: tx.detail?.order_status,
            paymentStatus: tx.detail?.payment_status,
            totalPrice: tx.detail?.total_price || 0,
            deliveryFee: tx.detail?.delivery_fee || 0,
            totalPaid: tx.detail?.total_paid || 0,
            createdAt: tx.detail?.created_at,
            paymentExpiryTime: tx.detail?.payment_expiry_time,
            items: tx.detail?.transaction_product_items || [],
            shipping: tx.detail?.shipping_product,
            paymentMethod: tx.detail?.payment_method,
            store: tx.detail?.shipping_product?.shipper?.name || "Apotek",
        }));

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 min-h-screen space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Riwayat Transaksi
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                    Kelola dan lacak pesanan Anda
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="sticky top-0 bg-white z-10 pb-4 border-b">
                <div className="flex flex-wrap gap-2 justify-center">
                    {filters.map((filter) => (
                        <Button
                            key={filter.value}
                            variant={
                                activeFilter === filter.value
                                    ? "default"
                                    : "outline"
                            }
                            className={`rounded-full px-4 py-2 text-sm transition-all ${
                                activeFilter === filter.value
                                    ? "bg-primary text-white"
                                    : "hover:bg-gray-50 border-gray-300"
                            }`}
                            onClick={() => setActiveFilter(filter.value)}
                        >
                            {filter.text}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                    <Card className="p-8 text-center !shadow-none">
                        <div className="space-y-2">
                            <Package className="w-12 h-12 text-gray-400 mx-auto" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Tidak ada transaksi
                            </h3>
                            <p className="text-gray-600">
                                {activeFilter === "ALL"
                                    ? "Belum ada transaksi yang dilakukan"
                                    : `Tidak ada transaksi dengan status "${filters.find((f) => f.value === activeFilter)?.text}"`}
                            </p>
                        </div>
                    </Card>
                ) : (
                    filteredTransactions.map((tx) => (
                        <Card
                            key={tx.id}
                            className="p-4 sm:p-6 rounded-xl border hover:shadow-md transition-all duration-200 !shadow-none"
                        >
                            {/* Header Section */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="font-medium text-gray-900">
                                            {tx.invoiceNumber}
                                        </span>
                                        <Badge
                                            className={getStatusBadgeColor(
                                                tx.status || ""
                                            )}
                                        >
                                            {getStatusDisplayText(
                                                tx.status || ""
                                            )}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <CreditCard className="w-3 h-3" />
                                        <span>
                                            {tx.paymentMethod?.name ||
                                                "Virtual Account"}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {new Date(
                                                tx.createdAt || ""
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        Total Belanja
                                    </p>
                                    <p className="font-bold text-lg text-gray-900">
                                        {formatPriceIDR(tx.totalPaid)}
                                    </p>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Products Section */}
                                <div className="flex-1 space-y-4">
                                    {tx.items.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <img
                                                src={
                                                    import.meta.env
                                                        .VITE_API_URL_FILES +
                                                        item.product
                                                            ?.media_products?.[0]
                                                            ?.media?.path ||
                                                    "/placeholder-product.jpg"
                                                }
                                                alt={item.product?.name ?? ""}
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0 border"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                                    {item.product?.name}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                    {
                                                        item.product
                                                            ?.skincare_detail
                                                            ?.brand
                                                    }
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                                                    <span>
                                                        {item.qty} barang
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {formatPriceIDR(
                                                            item.price || 0
                                                        )}
                                                    </span>
                                                    {item.note && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-gray-400">
                                                                Catatan:{" "}
                                                                {item.note}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
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
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-4 border-t">
                                <div className="text-sm text-gray-500">
                                    {tx.items.length} barang • Total:{" "}
                                    {formatPriceIDR(tx.totalPrice)}
                                    {tx.deliveryFee > 0 &&
                                        ` + Ongkir: ${formatPriceIDR(tx.deliveryFee)}`}
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    <Button variant="outline" size="sm" onClick={() => {
                                        navigate("/user/transaction-history/" + tx.id)
                                    }}>
                                        Lihat Detail
                                    </Button>
                                    {tx.status === "MENUNGGU_PEMBAYARAN" && (
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                navigate("/user/payment/" + tx.id)
                                            }}
                                        >
                                            Bayar Sekarang
                                        </Button>
                                    )}
                                    {tx.status === "SELESAI" && (
                                        <Button size="sm" variant="default">
                                            Beli Lagi
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
