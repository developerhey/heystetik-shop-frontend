import { Button } from "~/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ShoppingCart } from "lucide-react";
import type { ProductUI } from "~/shared/schemas/product-ui-schema";

export function ProductDetailMobile({ product }: { product: ProductUI }) {
    return (
        <div className="flex flex-col pb-8">
            <img
                src="/images/dummy_product.jpg"
                alt="BONAVIE"
                className="w-full h-[24rem] object-cover"
            />
            {/* <div className="my-2 px-4">
                <Button variant={"link"} className="text-sm text-foreground font-medium"><ArrowLeft />Kembali</Button>
            </div> */}

            <h1 className="text-sm font-bold mt-4 px-4">BONAVIE</h1>
            <p className="text-gray-600 mb-2 px-4">
                Eau de Parfum - Madeleine et Glacé 30 ml
            </p>
            <p className="text-xs font-semibold text-black mb-4 px-4">
                Rp 65.400
            </p>

            <div className="bg-gray-100 h-2 mb-4" />
            <div className="flex flex-col space-y-2 px-4 pb-4">
                <Collapsible open={true}>
                    <CollapsibleTrigger className="w-full flex flex-row text-sm font-bold items-center justify-between">
                        <span>Detail Produk</span>
                        <ChevronDown size={14} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="my-2 text-sm text-gray-500">
                        Yes. Free to use for personal and commercial projects.
                        No attribution required.
                    </CollapsibleContent>
                </Collapsible>
                <hr />
                <Collapsible>
                    <CollapsibleTrigger className="w-full flex flex-row text-sm font-bold items-center justify-between">
                        <span>Deskripsi</span>
                        <ChevronDown size={14} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="my-2 text-sm text-gray-500">
                        Yes. Free to use for personal and commercial projects.
                        No attribution required.
                    </CollapsibleContent>
                </Collapsible>
                <hr />
                <Collapsible>
                    <CollapsibleTrigger className="w-full flex flex-row text-sm font-bold items-center justify-between">
                        <span>Petunjuk Penggunaan</span>
                        <ChevronDown size={14} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="my-2 text-sm text-gray-500">
                        Yes. Free to use for personal and commercial projects.
                        No attribution required.
                    </CollapsibleContent>
                </Collapsible>
                <hr />
                <Collapsible>
                    <CollapsibleTrigger className="w-full flex flex-row text-sm font-bold items-center justify-between">
                        <span>Kandungan Skincare</span>
                        <ChevronDown size={14} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="my-2 text-sm text-gray-500">
                        Yes. Free to use for personal and commercial projects.
                        No attribution required.
                    </CollapsibleContent>
                </Collapsible>
                {/* <hr /> */}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
                <div className="w-full grid grid-cols-[1fr_1fr_2.5rem] items-center gap-2">
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
                        className="border-primary font-bold text-primary"
                        size={"lg"}
                    >
                        Beli Sekarang
                    </Button>
                    <Button size={"icon"} variant={"outline"}>
                        <ShoppingCart />
                    </Button>
                </div>
            </div>
        </div>
    );
}
