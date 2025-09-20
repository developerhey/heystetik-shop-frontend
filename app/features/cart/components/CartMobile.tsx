import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Trash } from "lucide-react";
import { type CartProps } from ".";
import { Textarea } from "~/components/ui/textarea";
import { useNavigate } from "react-router";
import { useState } from "react";
export function CartMobile({
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
        <Card className="shadow-none rounded-md">
            <CardContent className="space-y-2">
                <div className="flex gap-3 cursor-pointer" onClick={() => navigate(`/product/${cart.id}`)}>
                    <img
                        src={cart.images[0]?.path || ""}
                        alt={cart.title}
                        className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                        <p className="font-semibold">{cart.brand}</p>
                        <p className="text-sm text-muted-foreground">
                            {cart.title}
                        </p>
                        {/* Harga */}

                        {cart.formattedPriceWithDiscount ? (
                            <div className="flex flex-col ">
                                <p className="text-xs mt-1 text-gray-400 line-through">
                                    {cart.formattedPrice}
                                </p>
                                <p className="font-semibold mt-1 text-red-600">
                                    {cart.formattedPriceWithDiscount}
                                </p>
                            </div>
                        ) : (
                            <p className="font-semibold mt-1">
                                {cart.formattedPrice}
                            </p>
                        )}
                    </div>
                </div>

                {/* Counter & Total */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onDecrement}
                        >
                            -
                        </Button>
                        <span>{qty}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onIncrement}
                        >
                            +
                        </Button>
                    </div>
                    <div className="flex flex-row gap-x-2 items-center">
                        <p className="font-semibold">
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
                    onChange={(e) => {
                        setInputNotes(e.target.value);
                        onUpdateNotes(e.target.value);
                    }}
                    placeholder="Catatan"
                />
            </CardContent>
        </Card>
    );
}
