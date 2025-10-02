import { useEffect } from "react";
import { useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { MapComponent } from "./MapComponent";
import { SearchInput } from "./SearchInput";
import { AddressDetails } from "./AddressDetails";
import { type InputMapProps } from "./types";
import { useState } from "react";
import { useRouteLoaderData } from "react-router";
const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

export function InputMap({
    onAddressSelect,
    defaultToCurrentLocation = true,
    defaultLocation,
}: InputMapProps) {
    const { isMobile } = useRouteLoaderData("root") ?? {};
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [currentAddress, setCurrentAddress] = useState(
        defaultLocation?.formattedAddress || ""
    );
    const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] =
        useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentLocation, setCurrentLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(
        defaultLocation
            ? { lat: defaultLocation.lat, lng: defaultLocation.lng }
            : null
    );
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [subdistrict, setSubdistrict] = useState("");

    useEffect(() => {
        // If defaultLocation is provided (edit mode), use it directly
        if (defaultLocation) {
            setCurrentLocation({
                lat: defaultLocation.lat,
                lng: defaultLocation.lng,
            });
            setCurrentAddress(defaultLocation.formattedAddress);
            // Set the address components if available
            if (defaultLocation.city) setCity(defaultLocation.city);
            if (defaultLocation.province) setProvince(defaultLocation.province);
            if (defaultLocation.subdistrict)
                setSubdistrict(defaultLocation.subdistrict);
        }
        // Otherwise, use current location for create mode
        else if (defaultToCurrentLocation && !currentLocation) {
            getCurrentLocation();
        }
    }, [defaultLocation, defaultToCurrentLocation]); // Remove isOpen dependency

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        setIsLoadingCurrentLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const location = { lat: latitude, lng: longitude };

                setCurrentLocation(location);
                await reverseGeocode(latitude, longitude);
                setIsLoadingCurrentLocation(false);
            },
            (error) => {
                console.error("Error getting current location:", error);
                setIsLoadingCurrentLocation(false);

                const defaultLocation = { lat: 40.7128, lng: -74.006 };
                setCurrentLocation(defaultLocation);
                setCurrentAddress("New York, NY, USA");
            }
        );
    };

    const searchLocation = async (locationName: string) => {
        if (!locationName.trim()) return;

        setIsSearching(true);
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=${API_KEY}&language=id`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    const geometry = data.results[0].geometry.location;
                    const lat = geometry.lat;
                    const lng = geometry.lng;
                    const address = data.results[0].formatted_address;

                    const components = data.results[0].address_components;
                    const provincesComponent = components.filter((c: any) =>
                        c.types.includes("administrative_area_level_1")
                    );

                    const citiesComponent = components.filter((c: any) =>
                        c.types.includes("administrative_area_level_2")
                    );

                    const districtComponent = components.filter((c: any) =>
                        c.types.includes("administrative_area_level_4")
                    );

                    setProvince(provincesComponent[0]?.long_name ?? "");
                    setCity(citiesComponent[0]?.long_name ?? "");
                    setSubdistrict(districtComponent[0]?.long_name ?? "");

                    setCurrentLocation({
                        lat,
                        lng,
                    });
                    setCurrentAddress(address);

                    if (marker) {
                        marker.position = { lat, lng };
                    }
                } else {
                    setCurrentAddress(
                        "Location not found. Please try a different search term."
                    );
                }
            } else {
                setCurrentAddress("Error searching for location.");
            }
        } catch (error) {
            console.error("Search error:", error);
            setCurrentAddress("Network error occurred while searching.");
        } finally {
            setIsSearching(false);
        }
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}&language=id`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const address = data.results[0].formatted_address;
                    const components = data.results[0].address_components;

                    const provincesComponent = components.filter((c: any) =>
                        c.types.includes("administrative_area_level_1")
                    );

                    const citiesComponent = components.filter((c: any) =>
                        c.types.includes("administrative_area_level_2")
                    );

                    const districtComponent = components.filter((c: any) =>
                        c.types.includes("administrative_area_level_4")
                    );

                    setProvince(provincesComponent[0]?.long_name ?? "");
                    setCity(citiesComponent[0]?.long_name ?? "");
                    setSubdistrict(districtComponent[0]?.long_name ?? "");

                    setCurrentAddress(address);
                    return address;
                }
            }
            setCurrentAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        } catch (error) {
            console.error("Error reverse geocoding:", error);
            setCurrentAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            searchLocation(searchQuery.trim());
        }
    };

    const handleMarkerDragEnd = async (location: google.maps.LatLng) => {
        const lat: any = location.lat;
        const lng: any = location.lng;
        setCurrentLocation({ lat, lng });
        setCurrentAddress("");
        await reverseGeocode(lat, lng);
    };

    const handleUseCurrentLocation = () => {
        getCurrentLocation();
    };

    const handleConfirm = () => {
        if (currentLocation && currentAddress) {
            onAddressSelect({
                lat: currentLocation.lat,
                lng: currentLocation.lng,
                formattedAddress: currentAddress,
                city: city,
                province: province,
                subdistrict: subdistrict,
            });
        }
    };

    const handleSearchQueryChange = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="relative p-4 flex flex-col h-full">
            <div className="flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold mb-6">
                        {defaultLocation ? "Edit Alamat" : "Tambah Alamat"}
                    </DialogTitle>
                </DialogHeader>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full flex-1">
                <div className="flex flex-col gap-4">
                    <SearchInput
                        searchQuery={searchQuery}
                        onSearchQueryChange={handleSearchQueryChange}
                        onSearch={handleSearch}
                        isLoading={isSearching}
                        onUseCurrentLocation={handleUseCurrentLocation}
                        isLoadingCurrentLocation={isLoadingCurrentLocation}
                    />

                    {isMobile && (
                        <div className="h-[200px]">
                            <MapComponent
                                currentLocation={currentLocation}
                                isLoading={
                                    isLoadingCurrentLocation || isSearching
                                }
                                onMarkerDragEnd={handleMarkerDragEnd}
                                defaultLocation={defaultLocation}
                            />
                        </div>
                    )}
                    <AddressDetails
                        isLoadingCurrentLocation={false}
                        currentAddress={currentAddress}
                        currentLocation={currentLocation}
                        isLoading={isLoadingCurrentLocation}
                        isSearching={isSearching}
                    />

                    <Button
                        onClick={handleConfirm}
                        disabled={
                            !currentAddress ||
                            isLoadingCurrentLocation ||
                            isSearching
                        }
                        className="mt-auto"
                    >
                        {isLoadingCurrentLocation || isSearching
                            ? "Loading..."
                            : defaultLocation
                              ? "Perbarui Alamat"
                              : "Konfirmasi Alamat"}
                    </Button>
                </div>

                {!isMobile && (
                    <div className="h-full">
                        <MapComponent
                            currentLocation={currentLocation}
                            isLoading={isLoadingCurrentLocation || isSearching}
                            onMarkerDragEnd={handleMarkerDragEnd}
                            defaultLocation={defaultLocation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
