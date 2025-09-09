import { Trash } from "lucide-react";
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

export function CartPageDesktop({ carts }: { carts: ProductListUI }) {
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

                {/* Item Row */}
                {carts.map((cart, key) => (
                    <div
                        key={key}
                        className="grid grid-cols-5 items-center border-b py-4 text-sm"
                    >
                        {/* Produk */}
                        <div className="col-span-2 flex items-center gap-3">
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

                        {/* Jumlah */}
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                className="h-7 w-7"
                                size="icon"
                                variant="outline"
                            >
                                -
                            </Button>
                            <span className="w-6 text-center">{cart.qty}</span>
                            <Button
                                className="h-7 w-7"
                                size="icon"
                                variant="outline"
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
                            />
                        </div>
                    </div>
                ))}
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
                            <span>1</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>Rp 65.400</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>Rp 65.400</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">CHECKOUT</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
