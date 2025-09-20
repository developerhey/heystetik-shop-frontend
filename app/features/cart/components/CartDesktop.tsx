import { type CartProps } from ".";
import { Button } from "~/components/ui/button";
import { Trash } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { useNavigate } from "react-router";
import { useState } from "react";
import { set } from "zod";
export function CartDesktop({
    cart,
    qty,
    notes,
    onDecrement,
    onDelete,
    onIncrement,
    onUpdateNotes,
}: CartProps) {
    const navigate = useNavigate();
    const [inputNotes, setInputNotes] = useState(notes);
    return (
        <div className="flex flex-col border-b py-4">
            <div className="grid grid-cols-5 items-center text-sm">
                {/* Produk */}
                <div
                    className="col-span-2 flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                        navigate(`/product/${cart.id}`);
                    }}
                >
                    <img
                        src={cart.images[0]?.path || ""}
                        alt={cart.title}
                        className="w-16 h-16 object-fill border rounded-md shrink-0"
                    />
                    <div>
                        <p className="font-medium">{cart.brand}</p>
                        <p className="text-gray-500 line-clamp-2">
                            {cart.title}
                        </p>
                    </div>
                </div>

                {/* Harga */}
                <div className="text-right">
                    {cart.formattedPriceWithDiscount ? (
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 line-through">
                                {cart.formattedPrice}
                            </span>
                            <span className="font-semibold text-red-600">
                                {cart.formattedPriceWithDiscount}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-700">
                            {cart.formattedPrice}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-center gap-2">
                    <Button
                        className="h-7 w-7"
                        size="icon"
                        variant="outline"
                        onClick={onDecrement}
                    >
                        -
                    </Button>
                    <span className="w-6 text-center">{qty}</span>
                    <Button
                        className="h-7 w-7"
                        size="icon"
                        variant="outline"
                        onClick={onIncrement}
                    >
                        +
                    </Button>
                </div>

                {/* Total + Trash */}
                <div className="flex items-center justify-end gap-3">
                    <p className="font-semibold text-gray-800">
                        {cart.totalFormattedPrice}
                    </p>
                    <Trash
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                        size={16}
                        onClick={onDelete}
                    />
                </div>
            </div>
            <Textarea
                value={inputNotes}
                placeholder="Catatan"
                className="mt-4"
                onChange={(e) => {
                    setInputNotes(e.target.value);
                    onUpdateNotes(e.target.value);
                }}
            />
        </div>
    );
}
