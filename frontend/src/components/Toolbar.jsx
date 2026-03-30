import React from 'react';
import { MousePointer, Square, Circle, Minus, Type, Trash2, Maximize, Ruler, MapPin } from 'lucide-react';

const Toolbar = ({ onToolSelect }) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'point', icon: MapPin, label: 'Draw Point' },
    { id: 'line', icon: Minus, label: 'Draw Line' },
    { id: 'square', icon: Square, label: 'Draw Polygon' },
    { id: 'circle', icon: Circle, label: 'Draw Circle' },
    { id: 'text', icon: Type, label: 'Add Text' },
    { id: 'measure_dist', icon: Ruler, label: 'Measure Distance' },
    { id: 'measure_area', icon: Maximize, label: 'Measure Area' },
    { id: 'delete', icon: Trash2, label: 'Clear All', danger: true },
  ];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center bg-white dark:bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl p-2 z-[1001] border-2 border-gray-200 dark:border-gray-800 h-20 transition-all duration-300 ring-4 ring-black/5 dark:ring-white/5">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`p-3 rounded-xl transition-all duration-200 group relative ${
            tool.id === 'select' && !tool.danger ? 'mr-4' : ''
          } ${
            tool.danger
              ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          title={tool.label}
        >
          <tool.icon size={20} />
          <span className="absolute top-full mt-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-100 text-[10px] text-white dark:text-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {tool.label}
          </span>
        </button>
      ))}
      <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-700 mx-2" />
      <div className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden md:block">
        GIS Tools
      </div>
    </div>
  );
};

export default Toolbar;
