import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import Search from './components/Search';
import Layers from './components/Layers';
import Toolbar from './components/Toolbar';
import { Globe as GlobeIcon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchLocation, setSearchLocation] = useState(null);
  const [activeLayers, setActiveLayers] = useState([]);
  const [drawTool, setDrawTool] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (location) => {
    setSearchLocation({
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
      display_name: location.display_name,
    });
  };

  const toggleLayer = (layerId) => {
    setActiveLayers((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const handleToolSelect = (toolId) => {
    setDrawTool(toolId);
    if (toolId === 'delete') {
      // Clear logic handled in Map component via state if needed
      console.log('Clearing all layers...');
    }
  };
  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${isDark ? 'dark bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Side Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Map Viewer Area */}
      <main className="flex-1 relative ml-20">
        <header className={`absolute top-0 left-0 right-0 h-16 backdrop-blur-md border-b z-[1001] flex items-center px-8 shadow-sm pointer-events-auto transition-colors duration-300 ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
              <GlobeIcon size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-black dark:text-white italic">INDIA<span className="text-blue-600">-GIS</span></h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">v1.2 Enterprise</span>
          </div>
        </header>

        <Map 
          searchLocation={searchLocation} 
          activeLayers={activeLayers} 
          drawTool={drawTool} 
        />

        {/* Floating UI Overlays */}
        {activeTab === 'search' && (
          <Search onSearch={handleSearch} />
        )}
        
        {activeTab === 'layers' && (
          <Layers activeLayers={activeLayers} toggleLayer={toggleLayer} />
        )}

        {activeTab === 'tools' && (
          <Toolbar onToolSelect={handleToolSelect} />
        )}

        {/* Optional: Footer Stats / Coordinate Bar */}
        <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg text-[10px] font-mono text-gray-500 dark:text-gray-400 z-[1000] border border-gray-200 dark:border-gray-800">
          GIS INDIA • SCALE: 1:5,000,000 • WGS84
        </div>
      </main>
    </div>
  );
}

export default App;