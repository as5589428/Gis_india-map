import { Layers, Search as SearchIcon, Globe as GlobeIcon, Database, MousePointer, Ruler, Navigation, Sun, Moon } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isDark, toggleTheme }) => {
  const tabs = [
    { id: 'search', icon: SearchIcon, label: 'Search' },
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'tools', icon: MousePointer, label: 'Tools' },
    { id: 'data', icon: Database, label: 'GIS Data' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col items-center py-6 z-[1002] shadow-[4px_0_24px_rgba(0,0,0,0.1)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.3)] border-r border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="mb-10 flex flex-col items-center">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 mb-2">
          <GlobeIcon className="text-white" size={24} />
        </div>
        <span className="text-[10px] font-black tracking-tighter text-gray-500 uppercase">GIS</span>
      </div>
      
      <div className="flex-1 space-y-6 flex flex-col items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3 rounded-xl transition-all duration-200 group relative ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <tab.icon size={22} />
            <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 dark:bg-gray-100 text-[10px] text-white dark:text-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-6 pb-4">
        <button 
          onClick={toggleTheme}
          className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-amber-500 dark:text-blue-400 rounded-xl transition-all hover:scale-110 shadow-md shadow-black/5 dark:shadow-black/20"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} className="text-blue-400" /> : <Moon size={20} className="text-amber-500" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
