import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export function CartPageMobile() {
    return (
        <div className="p-4 space-y-2 bg-muted">
            {/* Cart Title */}
            <h2 className="text-lg font-semibold">Keranjang</h2>

            {/* Product List */}
            <Card className="shadow-none rounded-md">
                <CardContent className="space-y-2">
                    <div className="flex gap-3">
                        <img
                            src="/images/dummy_product.jpg"
                            className="w-16 h-16 rounded-md object-cover"
                            alt="Product"
                        />
                        <div className="flex-1">
                            <p className="font-semibold">BONAVIE</p>
                            <p className="text-sm text-muted-foreground">
                                Eau de Parfum - Madeleine et Glacé 30ml
                            </p>
                            <p className="font-semibold mt-1">Rp 65.400</p>
                        </div>
                    </div>

                    {/* Counter & Total */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                                -
                            </Button>
                            <span>1</span>
                            <Button variant="outline" size="icon">
                                +
                            </Button>
                        </div>
                        <p className="font-semibold">Rp 65.400</p>
                    </div>
                </CardContent>
            </Card>

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
                        <span>1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>Rp 65.400</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>Rp 65.400</span>
                    </div>

                    <Button className="w-full mt-2" variant="default">
                        CHECKOUT
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
