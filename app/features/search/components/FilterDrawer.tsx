import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { FilterListMobile, type FilterListProps } from "./filter-list";
import { ScrollArea } from "~/components/ui/scroll-area";

interface FilterDrawer extends FilterListProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export default function FilterDrawer({
    open,
    onOpenChange,
    categoriesSkinCare,
    concerns,
    skinTypes,
}: FilterDrawer) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Filter</DrawerTitle>
                </DrawerHeader>
                <hr />
                <ScrollArea className="h-[50vh]">
                    <FilterListMobile
                        className="my-4"
                        categoriesSkinCare={categoriesSkinCare}
                        concerns={concerns}
                        skinTypes={skinTypes}
                    />
                </ScrollArea>
                <hr />
                <DrawerFooter className="grid grid-cols-2">
                    <Button
                        variant="outline"
                        size={"lg"}
                        onClick={() => {
                            onOpenChange(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button size={"lg"}>Submit</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
