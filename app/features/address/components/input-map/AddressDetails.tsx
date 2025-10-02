import { Card, CardContent } from "~/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import { type AddressDetailsProps } from "./types";

export function AddressDetails({
    currentAddress,
    currentLocation,
    isLoading,
    isSearching,
    isLoadingCurrentLocation,
}: AddressDetailsProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Detil Alamat</h3>
                </div>
                {isLoadingCurrentLocation ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">
                            Sedang memuat alamat...
                        </p>
                    </div>
                ) : isSearching ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">
                            Mencari lokasi...
                        </p>
                    </div>
                ) : currentAddress ? (
                    <div className="space-y-2">
                        <p className="text-sm">{currentAddress}</p>
                        {currentLocation && (
                            <p className="text-xs text-muted-foreground">
                                Latitude: {currentLocation.lat.toFixed(6)},
                                Longitude: {currentLocation.lng.toFixed(6)}
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Tidak ada alamat yang ditemukan...
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
