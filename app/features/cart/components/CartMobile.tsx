import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Trash } from "lucide-react";
import { type CartProps } from ".";
import { Textarea } from "~/components/ui/textarea";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { toast } from "sonner";

interface CartMobileProps extends CartProps {
    isSelected?: boolean;
    onToggleSelection?: () => void;
    isAvailable?: boolean;
}

export function CartMobile({
    cart,
    qty,
    notes,
    onDecrement,
    onDelete,
    onIncrement,
    onUpdateNotes,
    isSelected = false,
    onToggleSelection,
    isAvailable,
}: CartMobileProps) {
    const navigate = useNavigate();
    const [inputNotes, setInputNotes] = useState(notes);

    const handleIncrement = () => {
        if (qty >= cart.stock) {
            toast.error(`Stok tidak mencukupi. Stok tersedia: ${cart.stock}`, {
                duration: 1500,
            });
            return;
        }
        onIncrement();
    };

    const handleDecrement = () => {
        if (qty > 1) {
            onDecrement();
        }
    };

    const handleDelete = () => {
        onDelete();
    };

    const handleToggleSelection = () => {
        if (cart.stock === 0) {
            toast.error("Stok tidak mencukupi", { duration: 1500 });
        } else if (cart.stock < qty) {
            toast.error("Stok tidak mencukupi", { duration: 1500 });
        } else {
            onToggleSelection?.();
        }
    };

    return (
        <Card className="shadow-none rounded-md">
            <CardContent className="space-y-3 pt-4">
                {/* First row: Checkbox and Product Info */}
                <div className="flex gap-3">
                    {/* Checkbox */}
                    <div className="flex items-start">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={onToggleSelection}
                            disabled={!isAvailable}
                            aria-label={`Pilih ${cart.title}`}
                            className={!isAvailable ? "opacity-50" : ""}
                        />
                    </div>

                    {/* Product Info - Clickable */}
                    <div
                        className="flex gap-3 cursor-pointer flex-1"
                        onClick={() => navigate(`/product/${cart.id}`)}
                    >
                        <img
                            src={cart.images[0]?.path || ""}
                            alt={cart.title}
                            className="w-16 h-16 rounded-md object-cover border"
                        />
                        <div className="flex-1">
                            <p className="font-semibold text-sm">
                                {cart.brand}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {cart.title}
                            </p>
                            {/* Stock Info */}
                            <p
                                className={`text-xs font-bold ${cart.stock > 0 ? "text-green-600" : "text-destructive"}`}
                            >
                                Stok: {cart.stock}
                            </p>
                            {qty > cart.stock && cart.stock > 0 && (
                                <p className="text-destructive text-xs font-bold">
                                    Jumlah melebihi stok!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center">
                    {cart.formattedPriceWithDiscount ? (
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 line-through">
                                {cart.formattedPrice}
                            </span>
                            <span className="font-semibold text-red-600 text-sm">
                                {cart.formattedPriceWithDiscount}
                            </span>
                        </div>
                    ) : (
                        <span className="font-semibold text-sm">
                            {cart.formattedPrice}
                        </span>
                    )}
                    <span className="font-semibold text-gray-800 text-sm">
                        {cart.totalFormattedPrice}
                    </span>
                </div>

                {/* Counter & Delete */}
                <div className="flex items-center justify-between">
                    {cart.stock > 0 ? (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleDecrement}
                                disabled={qty <= 1}
                            >
                                -
                            </Button>
                            <span
                                className={`w-6 text-center text-sm ${qty > cart.stock ? "text-destructive font-bold" : ""}`}
                            >
                                {qty}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleIncrement}
                                disabled={qty >= cart.stock}
                            >
                                +
                            </Button>
                        </div>
                    ) : (
                        <p className="text-destructive text-sm font-bold">
                            Stok Habis
                        </p>
                    )}

                    <Trash
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                        size={18}
                        onClick={handleDelete}
                    />
                </div>

                {/* Notes */}
                <Textarea
                    value={inputNotes}
                    onChange={(e) => {
                        setInputNotes(e.target.value);
                        onUpdateNotes(e.target.value);
                    }}
                    placeholder="Catatan"
                    className="text-sm"
                />
            </CardContent>
        </Card>
    );
}
