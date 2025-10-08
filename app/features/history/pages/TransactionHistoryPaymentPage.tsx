import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { QRCodeSVG } from "qrcode.react";
import {
    Copy,
    Clock,
    CreditCard,
    CheckCircle2,
    Smartphone,
    QrCode,
    Scan,
    ChevronDown,
    ChevronUp,
    Laptop,
    Monitor,
} from "lucide-react";
import { formatPriceIDR } from "~/lib/utils";
import { toast } from "sonner";
import { useRevalidator } from "react-router";
import type { TransactionDetail } from "~/shared/schemas/transaction-history-response-schema";
import type { HowToPay } from "~/features/cart/schemas/payment-method-response-schema";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible";

interface PaymentPageProps {
    transaction: TransactionDetail;
    howToPays: HowToPay[];
}

function HowToPaySection({ howToPays }: { howToPays: HowToPay[] }) {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());

    const toggleItem = (id: number) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
        } else {
            newOpenItems.add(id);
        }
        setOpenItems(newOpenItems);
    };

    const getMethodIcon = (name: string) => {
        switch (name.toUpperCase()) {
            case "ATM":
                return <CreditCard className="w-5 h-5" />;
            case "IBANKING":
                return <Laptop className="w-5 h-5" />;
            case "MBANKING":
                return <Smartphone className="w-5 h-5" />;
            case "INTERBANK":
                return <Monitor className="w-5 h-5" />;
            default:
                return <CreditCard className="w-5 h-5" />;
        }
    };

    const getMethodColor = (name: string) => {
        switch (name.toUpperCase()) {
            case "ATM":
                return "bg-blue-50 border-blue-200";
            case "IBANKING":
                return "bg-green-50 border-green-200";
            case "MBANKING":
                return "bg-purple-50 border-purple-200";
            case "INTERBANK":
                return "bg-orange-50 border-orange-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    if (!howToPays || howToPays.length === 0) {
        return (
            <Card className="p-6">
                <div className="text-center text-gray-500">
                    <p>No payment instructions available</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Cara Bayar</h2>

            <div className="space-y-3">
                {howToPays.map((method) => (
                    <Collapsible
                        key={method.id}
                        open={openItems.has(method.id ?? 0)}
                        onOpenChange={() => toggleItem(method.id ?? 0)}
                        className={`border px-2 rounded-lg transition-all duration-200 ${getMethodColor(method.name ?? "")}`}
                    >
                        <CollapsibleTrigger asChild className="!border-none">
                            <Button
                                variant="ghost"
                                className="my-2 w-full flex items-center justify-between p-4 hover:bg-transparent"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        {getMethodIcon(method.name ?? "")}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900">
                                            {method.name || "Payment Method"}
                                        </h3>
                                    </div>
                                </div>
                                {openItems.has(method.id ?? 0) ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                            <Separator className="mb-4" />
                            <div className="space-y-3">
                                {method.steps?.split("\n").map(
                                    (step, index) =>
                                        step?.trim() && (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 p-3 bg-white rounded-lg border"
                                            >
                                                <div className="w-6 h-6 bg-primary text-white rounded-full text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {step.trim()}
                                                </p>
                                            </div>
                                        )
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </Card>
    );
}

function QRCodeDisplay({
    qrString,
    amount,
}: {
    qrString: string | null | undefined;
    amount: number;
}) {
    if (!qrString) {
        return (
            <Card className="p-6">
                <div className="text-center p-6">
                    <p className="text-gray-500">QR code tidak tersedia</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                    QRIS Payment
                </h2>
                <p className="text-gray-600">
                    Scan dengan aplikasi e-wallet atau mobile banking
                </p>
                <div className="mt-2 bg-primary inline-flex items-center gap-2 px-3 py-1 rounded-full">
                    <Scan className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                        Dapat digunakan di semua aplikasi yang mendukung QRIS
                    </span>
                </div>
            </div>

            {/* QR Code Container */}
            <div className="bg-white rounded-xl p-6 mb-6 border-2">
                {/* Amount Display */}
                <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatPriceIDR(amount)}
                    </p>
                </div>

                {/* QR Code Image */}
                <div className="flex justify-center">
                    <QRCodeSVG
                        value={qrString}
                        className="w-[50%] h-[50%]"
                    />
                </div>
            </div>
        </Card>
    );
}

function PaymentOrderSummary({ detail }: { detail: TransactionDetail }) {
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

                {/* Additional Payment Info */}
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <p>• Pastikan jumlah transfer sesuai</p>
                    <p>• Pembayaran diproses otomatis</p>
                    <p>• Simpan bukti transfer Anda</p>
                </div>
            </div>
        </Card>
    );
}
export function PaymentPage({ transaction, howToPays }: PaymentPageProps) {
    const revalidator = useRevalidator();
    const paymentExpiryTime = transaction?.payment_expiry_time;
    const vaNumber = transaction?.va_number;
    const qrString = transaction?.qr_string;
    const paymentMethod = transaction?.payment_method;
    const invoiceNumber = transaction?.invoice_number;
    const totalPaid = transaction?.total_paid || 0;

    const copyToClipboard = (text: string | null | undefined) => {
        if (!text) {
            toast.error("Tidak ada teks untuk disalin");
            return;
        }
        navigator.clipboard.writeText(text);
        toast.success("Berhasil disalin");
    };

    const handlePaymentConfirm = () => {
        revalidator.revalidate();
    };

    if (!transaction) {
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Pembayaran
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {invoiceNumber || "No Invoice Number"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2/3 width on desktop */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payment Timer */}
                        {paymentExpiryTime && (
                            <Card className="p-6 bg-yellow-50 border-yellow-200">
                                <div className="flex items-center justify-center gap-3">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                    <div className="text-center">
                                        <p className="font-semibold text-yellow-800">
                                            Selesaikan Pembayaran Sebelum
                                        </p>
                                        <p className="text-yellow-700 font-medium">
                                            {new Date(
                                                paymentExpiryTime
                                            ).toLocaleString("id-ID", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Virtual Account Section */}
                        {paymentMethod?.method === "VIRTUAL_ACCOUNT" && (
                            <Card className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Virtual Account
                                    </h2>
                                    <p className="text-gray-600">
                                        {paymentMethod.type ||
                                            "Virtual Account"}
                                    </p>
                                </div>

                                {/* VA Number */}
                                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                                    <p className="text-sm text-gray-600 text-center mb-3">
                                        Nomor Virtual Account
                                    </p>
                                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-blue-200">
                                        <code className="font-mono text-md md:text-2xl font-bold text-gray-900 tracking-wider">
                                            {vaNumber || "Tidak tersedia"}
                                        </code>
                                        {vaNumber && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    copyToClipboard(vaNumber)
                                                }
                                                className="hover:bg-blue-100"
                                            >
                                                <Copy className="w-5 h-5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* QR Code Section */}
                        {paymentMethod?.method === "QR_CODE" && (
                            <QRCodeDisplay
                                qrString={qrString}
                                amount={totalPaid}
                            />
                        )}

                        {/* How to Pay Section - Now using backend data */}
                        <HowToPaySection howToPays={howToPays} />
                    </div>

                    {/* Sidebar - 1/3 width on desktop */}
                    <div className="space-y-6">
                        {/* Ringkasan Belanja */}
                        <PaymentOrderSummary detail={transaction} />

                        {/* Payment Confirmation */}
                        <Card className="p-6">
                            <div className="text-center">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Smartphone className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Sudah Melakukan Pembayaran?
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Konfirmasi pembayaran Anda untuk mempercepat
                                    proses verifikasi
                                </p>
                                <Button
                                    className="w-full"
                                    onClick={handlePaymentConfirm}
                                    size="lg"
                                >
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Ya, Saya Sudah Bayar
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
