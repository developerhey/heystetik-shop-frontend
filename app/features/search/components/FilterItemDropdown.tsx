import { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router";
import { cn } from "~/lib/utils";
export default function FilterItemDropdown({
    label,
    items,
    isOpen = false,
    type,
    onSelected,
}: {
    type: string;
    label: string;
    items: { id: string; text: string }[];
    isOpen: boolean;
    onSelected: (id: string) => void;
}) {
    const [searchParams] = useSearchParams();
    const category = searchParams.get(type);
    const [isCategoryOpen, setIsCategoryOpen] = useState(isOpen);

    function FilterItem({
        id,
        text,
        onSelected,
    }: {
        id: string;
        text: string;
        onSelected: (id: string) => void;
    }) {
        return (
            <li
                className={cn(
                    "py-1 text-gray-700 hover:bg-gray-100 cursor-pointer",
                    category === id ? "bg-primary/10 " : ""
                )}
                onClick={() => {
                    onSelected(id);
                }}
            >
                {text}
            </li>
        );
    }

    return (
        <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
            <CollapsibleTrigger className="hover:underline w-full hover:bg-gray-100 ">
                <div className="w-full flex items-center justify-between cursor-pointer">
                    <span className="font-bold">{label}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 my-2">
                <ul>
                    {items.map((item, key) => {
                        return (
                            <FilterItem
                                key={key}
                                text={item.text}
                                id={item.id}
                                onSelected={onSelected}
                            />
                        );
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    );
}
