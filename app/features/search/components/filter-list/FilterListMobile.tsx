import FilterItemDropdown from "~/features/search/components/FilterItemDropdown";
import type { FilterListProps } from ".";
import { cn } from "~/lib/utils";

export function FilterListMobile({
    className,
    categoriesSkinCare,
    concerns,
    skinTypes,
}: FilterListProps) {
    return (
        <div className={cn("flex flex-col gap-y-2 px-4", className)}>
            <FilterItemDropdown
                label={"Categories"}
                items={categoriesSkinCare}
                isOpen={true}
            />
            <FilterItemDropdown
                label={"Skin Types"}
                items={skinTypes}
                isOpen={false}
            />
            <FilterItemDropdown
                label={"Concerns"}
                items={concerns}
                isOpen={false}
            />
        </div>
    );
}
