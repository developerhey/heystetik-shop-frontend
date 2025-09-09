import FilterItemDropdown from "~/features/search/components/FilterItemDropdown";
import type { FilterListProps } from ".";
import { cn } from "~/lib/utils";
import { useNavigate, useSearchParams } from "react-router";
import { useCallback } from "react";

export function FilterListDesktop({
    className,
    categoriesSkinCare,
    concerns,
    skinTypes,
}: FilterListProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleFilter = useCallback(
        (id: string, type: string) => {
            const params = new URLSearchParams(searchParams);

            if (id && params.get(type) !== id) {
                params.set(type, id);
            } else {
                params.delete(type);
            }

            navigate(
                {
                    search: `?${params.toString()}`,
                },
                {
                    replace: true,
                    preventScrollReset: false,
                }
            );
        },
        [searchParams, navigate]
    );

    const handleReset = useCallback(() => {
        navigate(
            {
                search: "",
            },
            {
                replace: true,
                preventScrollReset: false,
            }
        );
    }, [navigate]);

    return (
        <aside className={cn("flex flex-col gap-y-2", className)}>
            <div className="flex flex-row justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Filters</h2>
                <span
                    className="text-sm text-gray-700 cursor-pointer"
                    onClick={handleReset}
                >
                    Reset all
                </span>
            </div>
            <FilterItemDropdown
                label={"Categories"}
                type={"category"}
                items={categoriesSkinCare}
                isOpen={true}
                onSelected={(id) => handleFilter(id, "category")}
            />
            <FilterItemDropdown
                label={"Skin Types"}
                type={"skinType"}
                items={skinTypes}
                isOpen={false}
                onSelected={(id) => handleFilter(id, "skinType")}
            />
            <FilterItemDropdown
                type={"concern"}
                label={"Concerns"}
                items={concerns}
                isOpen={false}
                onSelected={(id) => handleFilter(id, "concern")}
            />
        </aside>
    );
}
