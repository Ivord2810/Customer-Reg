import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Customer } from '../types';
import L from 'leaflet';

// Explicitly define the marker icon to ensure it loads correctly in all environments
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  customers: Customer[];
}

// Helper component to adjust map view to fit all markers
const FitBounds = ({ customers }: { customers: Customer[] }) => {
  const map = useMap();

  useEffect(() => {
    if (customers.length > 0) {
      const bounds = L.latLngBounds(customers.map(c => [c.latitude, c.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [customers, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ customers }) => {
  // Default center (Accra) if no customers
  const defaultCenter: [number, number] = [5.6037, -0.1870];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner z-0 bg-gray-100 dark:bg-slate-800">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds customers={customers} />

        {customers.map((customer) => (
          <Marker 
            key={customer.id} 
            position={[customer.latitude, customer.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-blue-900">{customer.businessName}</h3>
                <p className="text-sm text-gray-600 mb-1">{customer.contactName}</p>
                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-1 mt-1">
                  <span className="text-gray-500">Vol:</span>
                  <span className="font-bold text-blue-600">{customer.averageBags} bags</span>
                </div>
                <a 
                  href={`tel:${customer.phone}`}
                  className="block mt-2 text-xs text-center bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors"
                >
                  Call {customer.phone}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;