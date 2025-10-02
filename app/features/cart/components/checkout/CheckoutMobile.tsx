import { Card, CardContent } from "~/components/ui/card";
import type { ProductUI } from "~/shared/schemas/product-ui-schema";

export function CheckoutMobile({ cart }: { cart: ProductUI }) {
    return (
        <Card className="shadow-none rounded-md mb-3">
            <CardContent className="pt-4">
                <div className="flex gap-3">
                    <img
                        src={cart.images[0]?.path || ""}
                        alt={cart.title}
                        className="w-12 h-12 rounded-md object-cover border"
                    />
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{cart.brand}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {cart.title}
                        </p>
                        {cart.notes && (
                            <p className="text-xs text-gray-500 mt-1">
                                Catatan: {cart.notes}
                            </p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                            {cart.formattedPriceWithDiscount ? (
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 line-through">
                                        {cart.formattedPrice}
                                    </span>
                                    <span className="font-semibold text-red-600 text-sm">
                                        {cart.qty} x{" "}
                                        {cart.formattedPriceWithDiscount}
                                    </span>
                                </div>
                            ) : (
                                <span className="font-semibold text-sm">
                                    {cart.qty} x {cart.formattedPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
