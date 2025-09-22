import { Button } from "~/components/ui/button";
import { Heart, Share2, ChevronDown } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ShoppingCart } from "lucide-react";
import type { ProductUI } from "~/shared/schemas/product-ui-schema";
import { useProductDetail } from "./useProductDetail";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import IconWrapper from "~/components/template/IconWrapper";
import { useWishlist } from "~/shared/hooks/useWishlist";
import { LoadingOverlay } from "~/components/ui/loading";
import { useRouteLoaderData } from "react-router";
function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-foreground font-bold">{value}</span>
        </div>
    );
}

export function ProductDetailMobile({ product }: { product: ProductUI }) {
    const { wishlist } = useRouteLoaderData("root");
    const isOnWishlist = wishlist.some(
        (item: ProductUI) => item.id === product.id
    );
    const { addToCart, loading } = useProductDetail(product.id);
    const { loading: wishlistLoading, handleAddToWishlist, handleRemoveFromWishlist } = useWishlist();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 3000 }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect(); // initial selection
    }, [emblaApi, onSelect]);
    return (
        <div className="flex flex-col pb-8">
            <div className="overflow-hidden relative" ref={emblaRef}>
                <div className="flex">
                    {product.images.map((slide, index) => (
                        <div className="flex-[0_0_100%] relative" key={index}>
                            <img
                                src={slide.path}
                                alt={product.title}
                                className={cn("w-full object-fit h-[24rem]")}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={cn(
                                "w-1 h-1",
                                "rounded-full",
                                index === selectedIndex
                                    ? "bg-primary"
                                    : "bg-black/50"
                            )}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-sm font-bold mt-4 px-4">{product.brand}</h1>
                <div className="flex flex-row">
                    <IconWrapper
                        onClick={() => {
                            if (isOnWishlist) {
                                handleRemoveFromWishlist(product.id);
                            } else {
                                handleAddToWishlist(product.id);
                            }
                        }}
                    >
                        <Heart
                            size={16}
                            className={cn(
                                isOnWishlist && "fill-current text-destructive"
                            )}
                        />
                    </IconWrapper>
                    <IconWrapper>
                        <Share2 size={16} />
                    </IconWrapper>
                </div>
            </div>
            <p className="text-gray-600 mb-2 px-4">{product.title}</p>
            {!product.formattedPriceWithDiscount && (
                <p className="text-xs font-semibold text-black mb-4 px-4">
                    {product.formattedPrice}
                </p>
            )}
            {product.formattedPriceWithDiscount && (
                <div className="mb-4 px-4">
                    <p className="text-xs line-through text-muted-foreground">
                        {product.formattedPrice}
                    </p>
                    <p className="text-sm font-semibold text-destructive">
                        {product.formattedPriceWithDiscount}
                    </p>
                </div>
            )}

            <div className="bg-gray-100 h-2 mb-4" />
            <div className="flex flex-col space-y-2 px-4 pb-4">
                <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger className="w-full flex flex-row text-sm font-bold items-center justify-between">
                        <span>Detail Produk</span>
                        <ChevronDown size={14} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="my-2 text-sm text-gray-500">
                        <div className="divide-gray-200 gap-y-2 flex flex-col">
                            {/* <DetailRow
                                label="Min. Pembelian"
                                value={product.minOrder.toString()}
                            />
                            <hr />
                            <DetailRow
                                label="Stok"
                                value={product.stock.toString()}
                            /> */}
                            <hr />
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
                            <DetailRow label="Kemasan" value={product.sachet} />
                            <hr />
                            <DetailRow label="No. BPOM" value={product.bpom} />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <hr />
                <Collapsible>
                    <CollapsibleTrigger className="w-full flex flex-row text-sm font-bold items-center justify-between">
                        <span>Deskripsi</span>
                        <ChevronDown size={14} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="my-2 text-sm text-black">
                        <p className="whitespace-pre-line">
                            {product.description}
                        </p>
                    </CollapsibleContent>
                </Collapsible>
                <hr />
                <Collapsible>
                    <CollapsibleTrigger className="w-full flex flex-row text-sm font-bold items-center justify-between">
                        <span>Petunjuk Penggunaan</span>
                        <ChevronDown size={14} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="my-2 text-sm text-black">
                        <p className="whitespace-pre-line">{product.howTo}</p>
                    </CollapsibleContent>
                </Collapsible>
                <hr />
                <Collapsible>
                    <CollapsibleTrigger className="w-full flex flex-row text-sm font-bold items-center justify-between">
                        <span>Kandungan Skincare</span>
                        <ChevronDown size={14} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="my-2 text-sm text-black">
                        <p className="whitespace-pre-line mb-4">
                            {product.ingredients}
                        </p>
                    </CollapsibleContent>
                </Collapsible>
                {/* <hr /> */}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
                <div
                    className={cn(
                        "w-full grid items-center gap-2",
                        product.needConsult
                            ? "grid-cols-[1fr_1fr_2.5rem_2.5rem]"
                            : "grid-cols-[1fr_2.5rem]"
                    )}
                >
                    {product.needConsult && (
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
                    )}
                    <Button
                        variant="outline"
                        className={cn(
                            "border-primary font-bold text-primary",
                            !product.needConsult && "w-full"
                        )}
                        size={"lg"}
                    >
                        Beli Langsung
                    </Button>
                    <Button
                        size={"icon"}
                        variant={"outline"}
                        onClick={addToCart}
                    >
                        <ShoppingCart />
                    </Button>
                </div>
            </div>
            <LoadingOverlay show={loading || wishlistLoading} />
        </div>
    );
}
