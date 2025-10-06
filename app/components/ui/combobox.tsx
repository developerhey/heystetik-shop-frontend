import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";

interface Data {
    value: string;
    label: string;
    description?: string;
    isActive?: boolean;
}

export function Combobox({
    emptySearchText,
    searchText,
    selectText,
    listData,
    disabled,
    value,
    onValueChange,
}: {
    emptySearchText?: string;
    searchText?: string;
    selectText: string;
    listData: Data[];
    disabled?: boolean | false;
    value: string;
    onValueChange: (value: string) => void;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between shadow-xs"
                >
                    {value
                        ? listData.find((data) => data.value === value)?.label
                        : selectText}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[300px] p-0"
                align="start"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <Command>
                    {searchText && (
                        <CommandInput
                            placeholder={searchText}
                            className="h-9"
                        />
                    )}
                    <CommandList>
                        {emptySearchText && (
                            <CommandEmpty>{emptySearchText}</CommandEmpty>
                        )}
                        <CommandGroup>
                            {listData.map((data) => {
                                const isActive = data.isActive ?? true;
                                return (
                                    <CommandItem
                                        key={data.value}
                                        value={data.label}
                                        disabled={!isActive}
                                        onSelect={(currentValue) => {
                                            const selectedData = listData.find(
                                                (item) =>
                                                    item.label === currentValue
                                            );
                                            if (selectedData) {
                                                onValueChange(
                                                    selectedData.value === value
                                                        ? ""
                                                        : selectedData.value
                                                );
                                            }
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="flex flex-col">
                                            <span>{data.label}</span>
                                            {data.description && (
                                                <>
                                                    <br />
                                                    <span className="text-muted-foreground">
                                                        {data.description}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === data.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
