import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Loader2, Navigation, Search } from "lucide-react";
import { type SearchInputProps } from "./types";

export function SearchInput({
    searchQuery,
    onSearchQueryChange,
    onSearch,
    isLoading,
    onUseCurrentLocation,
    isLoadingCurrentLocation,
}: SearchInputProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onUseCurrentLocation}
                    disabled={isLoadingCurrentLocation}
                    className="flex items-center gap-2"
                >
                    {isLoadingCurrentLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Navigation className="h-4 w-4" />
                    )}
                    Lokasi Sekarang
                </Button>
            </div>

            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Input
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Masukkan alamat atau nama tempat..."
                        type="text"
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-3">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    )}
                </div>
                <Button
                    onClick={onSearch}
                    disabled={!searchQuery.trim() || isLoading}
                >
                    Cari
                </Button>
            </div>
        </div>
    );
}
