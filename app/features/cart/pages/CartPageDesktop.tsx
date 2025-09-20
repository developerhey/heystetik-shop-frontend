import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import type { ProductListUI } from "~/shared/schemas/product-ui-schema";
import { useCart } from "../hooks/useCart";
import { LoadingOverlay } from "~/components/ui/loading";
import { CartDesktop } from "../components";
export function CartPageDesktop({ carts }: { carts: ProductListUI }) {
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
        <div className="w-full px-54 py-12 grid grid-cols-3 gap-6 bg-muted">
            <div className="col-span-2 bg-white rounded-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Keranjang</h2>

                {/* Header */}
                <div className="grid grid-cols-5 border-b pb-2 text-sm font-medium text-gray-500">
                    <div className="col-span-2">Produk</div>
                    <div className="text-right">Harga</div>
                    <div className="text-center">Jumlah</div>
                    <div className="text-right">Total</div>
                </div>

                {carts.map((cart, key) => {
                    const qty = localQty[cart.cartId.toString()] ?? cart.qty;
                    const notes =
                        localNotes[cart.cartId.toString()] ?? cart.notes;
                    return (
                        <CartDesktop
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
                                updateQty(
                                    cart.cartId.toString(),
                                    qty + 1,
                                    notes
                                )
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

                {carts.length === 0 && (
                    <p className="mt-4">Tidak ada produk dalam keranjang</p>
                )}
            </div>

            <div className="space-y-6">
                <Card className="w-full max-w-sm shadow-none gap-y-4 rounded-md">
                    <CardHeader>
                        <CardTitle className="font-semibold">Promo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Input code here"
                                className="shadow-none"
                            />
                            <Button variant={"secondary"}>APPLY</Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button
                            variant="outline"
                            className="w-full border-destructive text-destructive hover:text-destructive"
                        >
                            Lihat semua promo
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="w-full max-w-sm shadow-none gap-y-4 rounded-md">
                    <CardHeader>
                        <CardTitle className="font-semibold">
                            Ringkasan Belanja
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Items</span>
                            <span>{summary.items}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>
                                Rp {summary.subtotal.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>
                                Rp {summary.subtotal.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">CHECKOUT</Button>
                    </CardFooter>
                </Card>
            </div>
            <LoadingOverlay show={loading} />
        </div>
    );
}
