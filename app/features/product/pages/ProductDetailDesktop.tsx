// ProductDetailDesktop.tsx
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { ProductUI } from "~/shared/schemas/product-ui-schema";
import { LoadingOverlay } from "~/components/ui/loading";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "~/components/ui/carousel";
import { useProductDetail } from "./useProductDetail";

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-foreground font-bold">{value}</span>
        </div>
    );
}

function InputQuantity({
    totalStock,
    qty,
    onQtyChange,
}: {
    totalStock: number;
    qty: number;
    onQtyChange: (newQty: number) => void;
}) {
    return (
        <>
            <Button
                size="icon"
                variant={"outline"}
                disabled={qty === 1}
                onClick={() => qty > 1 && onQtyChange(qty - 1)}
            >
                -
            </Button>
            <span className="px-3">{qty}</span>
            <Button
                size="icon"
                variant={"outline"}
                // disabled={qty === totalStock}
                onClick={() => onQtyChange(qty + 1)}
            >
                +
            </Button>
        </>
    );
}

export function ProductDetailDesktop({ product }: { product: ProductUI }) {
    const { qty, setQty, addToCart, loading } = useProductDetail(
        product.id,
        product.minOrder
    );

    return (
        <div className="flex flex-col px-54 pt-12 pb-24 min-h-screen">
            <div className="grid grid-cols-[30rem_1fr] gap-x-12">
                <Carousel className="w-[90%] h-[25rem]">
                    <CarouselContent>
                        {product.images.map((img, index) => (
                            <CarouselItem key={index}>
                                <img
                                    src={img.path || ""}
                                    alt={img.path}
                                    className="h-[25rem] rounded-lg w-full object-fill"
                                    loading="lazy"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>

                <div>
                    <h1 className="text-2xl font-bold">{product.brand}</h1>
                    <p className="text-gray-600 mb-2">{product.title}</p>
                    {!product.formattedPriceWithDiscount ? (
                        <p className="text-2xl font-semibold text-black mb-4">
                            {product.formattedPrice}
                        </p>
                    ) : (
                        <>
                            <p className="text-md text-muted-foreground line-through">
                                {product.formattedPrice}
                            </p>
                            <p className="text-2xl font-semibold text-destructive mb-4">
                                {product.formattedPriceWithDiscount}
                            </p>
                        </>
                    )}

                    <div className="flex items-center gap-2 mb-6 !font-bold">
                        <InputQuantity
                            totalStock={product.stock}
                            qty={qty}
                            onQtyChange={setQty}
                        />
                        <Button
                            variant="outline"
                            size={"icon"}
                            // disabled={qty < product.minOrder}
                            onClick={addToCart}
                        >
                            <ShoppingCart />
                        </Button>
                        <Button
                            variant="default"
                            size={"lg"}
                            className="font-bold"
                            onClick={() => {
                                window.location.href =
                                    "https://play.google.com/store/apps/details?id=com.desacode.heystetik_mobileapps";
                            }}
                        >
                            Konsultasi Dulu
                        </Button>
                        <Button
                            variant="outline"
                            size={"lg"}
                            className="border-primary font-bold text-primary"
                            disabled={qty < product.minOrder}
                        >
                            Beli Sekarang
                        </Button>
                    </div>

                    <Tabs defaultValue="detail">
                        <TabsList>
                            <TabsTrigger value="detail">Detail</TabsTrigger>
                            <TabsTrigger value="desc">Deskripsi</TabsTrigger>
                            <TabsTrigger value="how-to">
                                Petunjuk Penggunaan
                            </TabsTrigger>
                            <TabsTrigger value="composition">
                                Kandungan Skincare
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="desc" className="pt-4">
                            <p className="whitespace-pre-line mb-4">
                                {product.description}
                            </p>
                        </TabsContent>
                        <TabsContent value="how-to" className="pt-4">
                            <p className="whitespace-pre-line mb-4">
                                {product.howTo}
                            </p>
                        </TabsContent>
                        <TabsContent value="composition" className="pt-4">
                            <p className="whitespace-pre-line mb-4">
                                {product.ingredients}
                            </p>
                        </TabsContent>
                        <TabsContent value="detail" className="pt-4">
                            <div className="divide-gray-200 gap-y-2 flex flex-col">
                                <DetailRow
                                    label="Kategori"
                                    value={product.category}
                                />
                                <hr />
                                <DetailRow
                                    label="Etalase Skincare"
                                    value={product.display}
                                />
                                <hr />
                                <DetailRow
                                    label="Tekstur"
                                    value={product.texture}
                                />
                                <hr />
                                <DetailRow
                                    label="Kemasan"
                                    value={product.sachet}
                                />
                                <hr />
                                <DetailRow
                                    label="No. BPOM"
                                    value={product.bpom}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <LoadingOverlay show={loading} />
        </div>
    );
}
