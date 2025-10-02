import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import type { Voucher } from "../schemas/voucher-response-schema";
import { formatPriceIDR } from "~/lib/utils";
import { Info } from "lucide-react";
type VoucherOption = {
    id: string;
    label: string;
    description: string;
};

export function VoucherDialog({
    subtotal,
    setOpen,
    open,
    vouchers,
    onSelected,
}: {
    subtotal: number;
    setOpen: (value: boolean) => void;
    open: boolean;
    vouchers: Voucher[];
    onSelected: (value: string) => void;
}) {
    const [selected, setSelected] = useState<string>("");

    function calculateDaysRemaining(periodEnd: string): string {
        const endDate = new Date(periodEnd);
        const currentDate = new Date();

        const timeDifference = endDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) {
            return "Voucher telah kedaluwarsa";
        } else if (daysRemaining === 0) {
            return "Berakhir hari ini";
        } else if (daysRemaining === 1) {
            return "Berakhir 1 hari lagi";
        } else {
            return `Berakhir ${daysRemaining} hari lagi`;
        }
    }
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Pakai Promo</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[400px] pr-2">
                    <RadioGroup value={selected} onValueChange={setSelected}>
                        <div className="space-y-3">
                            {vouchers.map((voucher) => (
                                <Label
                                    key={voucher.id}
                                    htmlFor={voucher?.id?.toString()}
                                    className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-muted"
                                >
                                    <div className="flex flex-col gap-y-2">
                                        <span className="font-semibold">
                                            {voucher.name}
                                        </span>

                                        <span className="text-muted-foreground">
                                            Minimum transaksi:{" "}
                                            {formatPriceIDR(
                                                voucher.minimum_purchase ?? 0
                                            )}
                                        </span>

                                        <div className="flex flex-row text-xs text-destructive gap-x-2">
                                            <Info size={14} />
                                            {calculateDaysRemaining(
                                                voucher.period_end ?? ""
                                            )}
                                        </div>
                                    </div>
                                    <RadioGroupItem
                                        disabled={subtotal < (voucher.minimum_purchase ?? 0)}
                                        id={voucher?.id?.toString()}
                                        value={voucher?.id?.toString() ?? ""}
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
                        Pilih voucher
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
