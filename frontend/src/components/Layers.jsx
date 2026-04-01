import React from 'react';
import { Layers as LayersIcon, MapPin, Train, Plane, Hospital, School, Globe, Map as GlobeIcon, Building2, Droplet } from 'lucide-react';

const Layers = ({ activeLayers, toggleLayer }) => {
  const layerGroups = [
    {
      id: 'admin',
      label: 'Administrative Boundaries',
      icon: Globe,
      layers: [
        { id: 'india_boundary', label: 'India Boundary', icon: Globe },
        { id: 'state_boundary', label: 'State Boundaries', icon: GlobeIcon },
        { id: 'district_boundary', label: 'District Boundaries', icon: GlobeIcon },
      ],
    },
    {
      id: 'transport',
      label: 'Transportation Systems',
      icon: Train,
      layers: [
        { id: 'metro_network', label: 'Metro Rail Lines', icon: Train },
        { id: 'railway_network', label: 'Railway Network', icon: Train },
        { id: 'railway_stations', label: 'Railway Stations', icon: MapPin },
        { id: 'metro_stations', label: 'Metro Stations', icon: MapPin },
        { id: 'airports', label: 'Major Airports', icon: Plane },
      ],
    },
    {
      id: 'facility',
      label: 'Infrastructure',
      icon: Building2,
      layers: [
        { id: 'hospitals', label: 'Hospitals Registry', icon: Hospital },
        { id: 'schools', label: 'Schools Registry', icon: School },
        { id: 'water_tanks_nagpur', label: 'Nagpur Water Tanks', icon: Droplet },
      ],
    },
  ];

  return (
    <div className="absolute top-24 right-8 w-80 h-[calc(100vh-10rem)] bg-white dark:bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl overflow-y-auto z-[1001] border-2 border-gray-200 dark:border-gray-800 p-6 space-y-8 scrollbar-hide ring-4 ring-black/5 dark:ring-white/5 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <LayersIcon className="text-blue-600" size={24} />
        <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Filters</h2>
      </div>

      {layerGroups.map((group) => (
        <div key={group.id} className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <group.icon size={16} />
            <span className="text-xs uppercase font-semibold tracking-wider">{group.label}</span>
          </div>
          <div className="space-y-2">
            {group.layers.map((layer) => (
              <label
                key={layer.id}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                  activeLayers.includes(layer.id)
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={activeLayers.includes(layer.id)}
                  onChange={() => toggleLayer(layer.id)}
                  className="hidden"
                />
                <layer.icon size={18} className="mr-3" />
                <span className="text-sm font-medium flex-1">{layer.label}</span>
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    activeLayers.includes(layer.id) ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${
                      activeLayers.includes(layer.id) ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Layers;
