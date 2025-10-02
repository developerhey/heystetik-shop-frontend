import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import type { PaymentMethod } from "../schemas/payment-method-response-schema";
import { formatPriceIDR } from "~/lib/utils";

type PaymentOption = {
    id: string;
    label: string;
    logo: string;
};

export function PaymentMethodDialog({
    setOpen,
    open,
    paymentMethods,
    onSelected,
}: {
    setOpen: (value: boolean) => void;
    open: boolean;
    paymentMethods: PaymentMethod[];
    onSelected: (value: string) => void;
}) {
    const [selected, setSelected] = useState<string>("");
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[400px] pr-2">
                    <RadioGroup value={selected} onValueChange={setSelected}>
                        <h1>Virtual Account</h1>
                        <div className="space-y-3">
                            {paymentMethods
                                .filter((method) => method.is_active)
                                .filter(
                                    (method) =>
                                        method?.method == "VIRTUAL_ACCOUNT"
                                )
                                .map((method) => (
                                    <Label
                                        key={method.id}
                                        htmlFor={method?.id?.toString()}
                                        className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-muted"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    import.meta.env
                                                        .VITE_API_URL_FILES +
                                                    method?.media_payment_method
                                                        ?.media?.path
                                                }
                                                alt={method?.name ?? ""}
                                                className="h-4 w-8"
                                            />
                                            <div className="flex flex-col">
                                                <span>{method.name}</span>

                                                <span className="text-xs text-muted-foreground">
                                                    Biaya transaksi:{" "}
                                                    {formatPriceIDR(
                                                        method.platform_fee_amount ??
                                                            0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <RadioGroupItem
                                            id={method?.id?.toString()}
                                            value={method?.id?.toString() ?? ""}
                                        />
                                    </Label>
                                ))}
                        </div>
                        <h1>QR Code</h1>
                        <div className="space-y-3">
                            {paymentMethods
                                .filter((method) => method.is_active)
                                .filter((method) => method?.method == "QR_CODE")
                                .map((method) => (
                                    <Label
                                        key={method.id}
                                        htmlFor={method?.id?.toString()}
                                        className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-muted"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    import.meta.env
                                                        .VITE_API_URL_FILES +
                                                    method?.media_payment_method
                                                        ?.media?.path
                                                }
                                                alt={method?.name ?? ""}
                                                className="h-6 w-6"
                                            />
                                            <div className="flex flex-col">
                                                <span>{method.name}</span>

                                                <span className="text-xs text-muted-foreground">
                                                    Biaya transaksi:{" "}
                                                    {formatPriceIDR(
                                                        method.platform_fee_amount ??
                                                            0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <RadioGroupItem
                                            id={method?.id?.toString()}
                                            value={method?.id?.toString() ?? ""}
                                        />
                                    </Label>
                                ))}
                        </div>
                    </RadioGroup>
                </ScrollArea>

                <div className="flex justify-end mt-4">
                    <Button
                        disabled={!selected}
                        onClick={() => {
                            onSelected(selected);
                            setOpen(false);
                        }}
                    >
                        Pilih pembayaran
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
