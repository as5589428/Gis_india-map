import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-measure";
import "leaflet-defaulticon-compatibility";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { Target } from 'lucide-react';
import axios from 'axios';
import MarkerClusterGroup from 'react-leaflet-cluster';

const { BaseLayer } = LayersControl;

// Fix for default marker icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const GeomanControl = ({ drawTool }) => {
  const map = useMap();

  useEffect(() => {
    if (!map.pm) return;
    
    // Configure Geoman global settings
    map.pm.setGlobalOptions({ 
      snappable: true,
      snapDistance: 20,
      allowSelfIntersection: false,
      templineStyle: { color: '#3b82f6' },
      hintlineStyle: { color: '#3b82f6', dashArray: [5, 5] },
    });

    // Prevent duplicate event listeners when drawTool changes
    map.off('pm:create');
    map.on('pm:create', (e) => {
      const layer = e.layer;
      
      // If the drawn layer is a Line (Polyline)
      if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        const latlngs = layer.getLatLngs();
        let totalDistance = 0;
        
        // Support segments: calculate total distance between all vertices
        for (let i = 0; i < latlngs.length - 1; i++) {
          totalDistance += latlngs[i].distanceTo(latlngs[i + 1]);
        }
        
        const distanceText = totalDistance > 1000 
          ? (totalDistance / 1000).toFixed(2) + ' km' 
          : Math.round(totalDistance) + ' m';
          
        // Bind persistent distance tooltip directly on the map line
        layer.bindTooltip(
          `<div class="flex items-center gap-1 font-semibold text-[11px] text-blue-700">
             <span class="opacity-75">Distance:</span>
             <span>${distanceText}</span>
           </div>`,
          {
            permanent: true,
            direction: 'center',
            className: 'bg-white/95 backdrop-blur-sm border border-blue-200 px-2 py-1 rounded-md shadow-sm',
          }
        ).openTooltip();
      }
    });

    // Handle tool changes from external Toolbar
    if (drawTool) {
      if (drawTool === 'delete') {
        const layers = map.pm.getGeomanLayers();
        layers.forEach(layer => layer.remove());
      } else {
        const shapeMap = {
          'point': 'Marker',
          'line': 'Line',
          'square': 'Polygon',
          'circle': 'Circle',
        };
        
        const shape = shapeMap[drawTool];
        if (shape) {
          map.pm.enableDraw(shape, {
            continueDrawing: true,
          });
        } else if (drawTool === 'measure_dist' || drawTool === 'measure_area') {
          map.pm.enableDraw(drawTool === 'measure_dist' ? 'Line' : 'Polygon', {
            tooltips: true,
            snappable: true,
            measurements: { display: true }
          });
        } else if (drawTool === 'select') {
          map.pm.disableDraw();
        }
      }
    }
  }, [map, drawTool]);

  return null;
};

const LocateControl = ({ setLocation }) => {
  const map = useMap();
  
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  useEffect(() => {
    map.on('locationfound', (e) => {
      setLocation(e.latlng);
    });
  }, [map]);

  return (
    <button 
      onClick={handleLocate}
      className="absolute bottom-10 left-6 z-[1000] p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 transition-all hover:scale-110 active:scale-95"
      title="Show My Location"
    >
      <Target className="text-blue-600 dark:text-blue-400" size={24} />
    </button>
  );
};

const IndiaMap = ({ searchLocation, activeLayers, drawTool }) => {
  const [layersData, setLayersData] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadedLayersRef = React.useRef(new Set());

  // Nagpur, Maharashtra (Geographic Center)
  const center = [21.1458, 79.0882];
  const zoom = 5;

  // Fetch layer data when toggled
  useEffect(() => {
    activeLayers.forEach(layerId => {
      if (!loadedLayersRef.current.has(layerId)) {
        setIsLoading(true);
        axios.get(`http://localhost:5000/api/layers/${layerId}`)
          .then(res => {
            loadedLayersRef.current.add(layerId);
            setLayersData(prev => ({ ...prev, [layerId]: res.data }));
          })
          .catch(err => console.error(`Error loading layer ${layerId}:`, err))
          .finally(() => setIsLoading(false));
      }
    });
  }, [activeLayers]);

  function ChangeView({ coords }) {
    const map = useMap();
    if (coords) {
      map.setView(coords, 14);
    }
    return null;
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={true}
      >
        {isLoading && (
          <div className="absolute inset-0 z-[2000] bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-none transition-all">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="mt-4 text-xs font-bold text-blue-600 uppercase tracking-widest drop-shadow-sm">Parsing High-Fidelity GIS Data...</span>
            </div>
          </div>
        )}
        <LayersControl position="topright">
          <BaseLayer checked name="STREET VIEW (OSM)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="SATELLITE VIEW (ESRI)">
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
        </LayersControl>

        {searchLocation && (
          <>
            <Marker position={[searchLocation.lat, searchLocation.lon]}>
              <Popup>{searchLocation.display_name}</Popup>
            </Marker>
            <ChangeView coords={[searchLocation.lat, searchLocation.lon]} />
          </>
        )}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        <GeomanControl drawTool={drawTool} />

        {activeLayers.map(layerId => {
          if (!layersData[layerId]) return null;

          const geoJsonLayer = (
            <GeoJSON 
              key={`${layerId}-layer`}
              data={layersData[layerId]} 
              pointToLayer={(feature, latlng) => {
                const isHealth = layerId === 'hospitals';
                const isEducation = layerId === 'schools';
                const isAirport = layerId === 'airports';

                if (isHealth || isEducation || isAirport || layerId === 'railway_stations' || layerId === 'metro_stations') {
                  const bgPulse = isHealth ? 'bg-red-500/20' : isEducation ? 'bg-green-500/20' : 'bg-blue-500/20';
                  const bgCore = isHealth ? 'bg-red-600' : isEducation ? 'bg-green-600' : 'bg-blue-600';
                  const label = isHealth ? 'H' : isEducation ? 'S' : isAirport ? '✈' : 'T';
                  
                  const iconHtml = `
                    <div class="relative flex items-center justify-center">
                      <div class="absolute w-8 h-8 ${bgPulse} rounded-full animate-pulse"></div>
                      <div class="relative flex items-center justify-center w-6 h-6 ${bgCore} text-white rounded-lg shadow-lg border-2 border-white text-[10px] font-bold">
                        ${label}
                      </div>
                    </div>`;

                  return L.marker(latlng, {
                    icon: L.divIcon({
                      html: iconHtml,
                      className: 'custom-marker-icon bg-transparent',
                      iconSize: [32, 32],
                      iconAnchor: [16, 16]
                    })
                  });
                }
                return L.marker(latlng);
              }}
              onEachFeature={(feature, layer) => {
                let name = "N/A";
                let type = "";
                let details = "";

                if (feature.properties) {
                  name = feature.properties.name || feature.properties.NAME_1 || feature.properties.DISTRICT || feature.properties.ST_NM ||  "Unnamed Facility";
                  
                  if (layerId === 'hospitals') {
                    type = feature.properties.healthcare || feature.properties.amenity || 'Healthcare Facility';
                    details = feature.properties['healthcare:speciality'] ? `<br/>Specialty: ${feature.properties['healthcare:speciality']}` : '';
                  } else if (layerId === 'schools') {
                    type = feature.properties.amenity || 'Educational Facility';
                  } else if (layerId === 'airports') {
                    type = feature.properties.type || 'Airport';
                    details = feature.properties.iata ? `<br/>IATA: ${feature.properties.iata}` : '';
                  } else {
                    type = feature.properties.type || layerId.replace('_', ' ').toUpperCase();
                  }
                }

                layer.bindPopup(`
                  <div class="text-xs p-1">
                    <strong class="text-sm block mb-1 text-slate-800 dark:text-slate-100">${name}</strong>
                    <span class="text-slate-500 dark:text-slate-400 capitalize">${type.replace('_', ' ')}</span>
                    ${details ? `<span class="text-slate-500 dark:text-slate-400 block mt-1">${details}</span>` : ''}
                  </div>
                `);

              }}
              style={{ 
                color: 
                  layerId === 'india_boundary' ? '#3b82f6' : 
                  layerId === 'state_boundary' ? '#ef4444' : 
                  layerId === 'district_boundary' ? '#10b981' : 
                  layerId === 'railway_network' ? '#1e293b' : // Slate 800 for Railways
                  layerId === 'metro_network' ? '#f59e0b' : // Amber 500 for Metro
                  '#3b82f6',
                weight: layerId.includes('boundary') ? 3 : (layerId === 'railway_network' ? 3 : layerId === 'metro_network' ? 5 : 2),
                dashArray: layerId === 'district_boundary' ? '5, 5' : layerId === 'railway_network' ? '4, 6' : '0',
                fillOpacity: layerId.includes('boundary') ? 0.05 : 0.8
              }} 
            />
          );

          const isPointLayer = layerId === 'hospitals' || layerId === 'schools' || layerId === 'airports' || layerId === 'railway_stations' || layerId === 'metro_stations';

          if (isPointLayer) {
            return (
              <MarkerClusterGroup 
                key={layerId}
                chunkedLoading={true}
                maxClusterRadius={50}
                spiderfyOnMaxZoom={true}
              >
                {geoJsonLayer}
              </MarkerClusterGroup>
            );
          }
          
          return <React.Fragment key={layerId}>{geoJsonLayer}</React.Fragment>;
        })}

        <LocateControl setLocation={setUserLocation} />
      </MapContainer>
    </div>
  );
};

export default IndiaMap;