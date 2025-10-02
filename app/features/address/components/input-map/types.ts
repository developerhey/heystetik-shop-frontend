export interface InputMapProps {
    onAddressSelect: (address: Address) => void;
    defaultToCurrentLocation?: boolean;
    defaultLocation?: {
        lat: number;
        lng: number;
        formattedAddress: string;
        city?: string;
        province?: string;
        subdistrict?: string;
    };
}

export interface Address {
    lat: number;
    lng: number;
    formattedAddress: string;
    city?: string;
    province?: string;
    subdistrict?: string;
}

export interface MapComponentProps {
    currentLocation: { lat: number; lng: number } | null;
    isLoading: boolean;
    onMarkerDragEnd: (location: google.maps.LatLng) => void;
    defaultLocation?: { lat: number; lng: number; formattedAddress: string };
}

export interface SearchInputProps {
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    onUseCurrentLocation: () => void;
    isLoadingCurrentLocation: boolean;
}

export interface AddressDetailsProps {
    currentAddress: string;
    currentLocation: { lat: number; lng: number } | null;
    isLoading: boolean;
    isSearching: boolean;
    isLoadingCurrentLocation: boolean;
}
