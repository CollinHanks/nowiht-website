"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom black marker icon for NOWIHT aesthetic
const customIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath d='M12.5 0C5.6 0 0 5.6 0 12.5c0 1.9.4 3.7 1.2 5.3L12.5 41l11.3-23.2c.8-1.6 1.2-3.4 1.2-5.3C25 5.6 19.4 0 12.5 0z' fill='%23000'/%3E%3Ccircle cx='12.5' cy='12.5' r='5' fill='%23fff'/%3E%3C/svg%3E",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const selectedIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath d='M12.5 0C5.6 0 0 5.6 0 12.5c0 1.9.4 3.7 1.2 5.3L12.5 41l11.3-23.2c.8-1.6 1.2-3.4 1.2-5.3C25 5.6 19.4 0 12.5 0z' fill='%23DC2626'/%3E%3Ccircle cx='12.5' cy='12.5' r='5' fill='%23fff'/%3E%3C/svg%3E",
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -34],
});

// Component to handle map view changes
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  district: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  email: string;
}

interface StoreMapProps {
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
}

export default function StoreMap({ stores, selectedStore, onStoreSelect }: StoreMapProps) {
  // Default center (Turkey)
  const defaultCenter: [number, number] = [39.0, 35.0];
  const defaultZoom = 6;

  // Selected store center
  const center: [number, number] = selectedStore
    ? [selectedStore.coordinates.lat, selectedStore.coordinates.lng]
    : defaultCenter;

  const zoom = selectedStore ? 14 : defaultZoom;

  return (
    <div className="relative aspect-square bg-gray-100 border border-gray-200 overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={true}
      >
        {/* OpenStreetMap Tiles - Monochrome style for NOWIHT aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-[50%] contrast-125"
        />

        <ChangeMapView center={center} zoom={zoom} />

        {/* Store Markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[store.coordinates.lat, store.coordinates.lng]}
            icon={selectedStore?.id === store.id ? selectedIcon : customIcon}
            eventHandlers={{
              click: () => onStoreSelect(store),
            }}
          >
            <Popup closeButton={false}>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-medium text-sm mb-1">{store.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{store.district}, {store.city}</p>
                <p className="text-xs text-gray-500 mb-2">{store.address}</p>
                <a
                  href={`tel:${store.phone}`}
                  className="text-xs text-black hover:underline block mb-1"
                >
                  {store.phone}
                </a>
                <a
                  href={`mailto:${store.email}`}
                  className="text-xs text-black hover:underline block"
                >
                  {store.email}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Powered by OpenStreetMap badge */}
      <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[10px] text-gray-600 rounded shadow-sm">
        Map by OpenStreetMap
      </div>
    </div>
  );
}