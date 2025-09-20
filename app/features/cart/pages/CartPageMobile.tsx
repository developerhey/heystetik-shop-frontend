import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { type ProductListUI } from "~/shared/schemas/product-ui-schema";
import { useCart } from "../hooks/useCart";
import { CartMobile } from "../components";
import { LoadingOverlay } from "~/components/ui/loading";
export function CartPageMobile({ carts }: { carts: ProductListUI }) {
    const {
        handleDeleteFromCart,
        loading,
        updateQty,
        updateNotes,
        localNotes,
        localQty,
        summary,
    } = useCart({ carts });
    return (
        <div className="p-4 space-y-2 bg-muted">
            {/* Cart Title */}
            <h2 className="text-lg font-semibold">Keranjang</h2>

            {/* Product List */}
            {carts.map((cart, key) => {
                const qty = localQty[cart.cartId.toString()] ?? cart.qty;
                const notes = localNotes[cart.cartId.toString()] ?? cart.notes;
                return (
                    <CartMobile
                        key={key}
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
                            updateQty(cart.cartId.toString(), qty + 1, notes)
                        }
                        onDelete={() =>
                            handleDeleteFromCart(cart.cartId.toString())
                        }
                        onUpdateNotes={(notes) =>
                            updateNotes(cart.cartId.toString(), qty, notes)
                        }
                    />
                );
            })}
            {/* Promo Section */}
            <Card className="rounded-md shadow-none">
                <CardContent className="space-y-2">
                    <h3 className="font-medium">Promo</h3>
                    <div className="flex gap-2">
                        <Input placeholder="Input code here" />
                        <Button>APPLY</Button>
                    </div>
                    <Button
                        variant="outline"
                        className="border-destructive text-destructive hover:text-destructive"
                    >
                        Lihat semua promo
                    </Button>
                </CardContent>
            </Card>

            {/* Summary Section */}
            <Card className="rounded-md shadow-none">
                <CardContent className="space-y-2">
                    <h3 className="font-medium">Ringkasan Belanja</h3>

                    <div className="flex justify-between text-sm">
                        <span>Items</span>
                        <span>{summary.items}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>
                            {" "}
                            Rp {summary.subtotal.toLocaleString("id-ID")}
                        </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>
                            {" "}
                            Rp {summary.subtotal.toLocaleString("id-ID")}
                        </span>
                    </div>

                    <Button className="w-full mt-2" variant="default">
                        CHECKOUT
                    </Button>
                </CardContent>
            </Card>
            <LoadingOverlay show={loading} />
        </div>
    );
}
