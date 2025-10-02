import { useEffect } from "react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap,
    useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { type MapComponentProps } from "./types";

const API_KEY = "AIzaSyCF5fKaL91ofgj1uusPnnPJEIzA3l7DnmE";

function MapContent({
    currentLocation,
    isLoading,
    onMarkerDragEnd,
    defaultLocation,
}: MapComponentProps) {
    const map = useMap();
    const [markerRef, marker] = useAdvancedMarkerRef();

    useEffect(() => {
        if (!map || isLoading || !currentLocation) return;
        map.setCenter(currentLocation);
        map.setZoom(17);
    }, [map, currentLocation, isLoading]);

    useEffect(() => {
        if (!marker || isLoading) return;

        marker.gmpDraggable = true;

        const dragEndListener = marker.addListener("dragend", (event: any) => {
            const position = marker.position as google.maps.LatLng;
            onMarkerDragEnd(position);
        });

        return () => {
            if (dragEndListener) {
                dragEndListener.remove();
            }
        };
    }, [marker, isLoading, onMarkerDragEnd]);

    return (
        <Map
            mapId={"address-selection-map"}
            defaultZoom={3}
            defaultCenter={{ lat: 0, lng: 0 }}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
        >
            {!isLoading && currentLocation && (
                <AdvancedMarker
                    ref={markerRef}
                    position={currentLocation}
                    draggable={true}
                    title="Drag me to adjust your location"
                />
            )}
        </Map>
    );
}

export function MapComponent(props: MapComponentProps) {
    if (!API_KEY) {
        console.error("Google Maps API key is missing");
        return (
            <div className="h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">
                    Google Maps API key is required
                </p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={API_KEY}>
            <MapContent {...props} />
        </APIProvider>
    );
}
