import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, X } from 'lucide-react';
import axios from 'axios';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Call backend search API (proxied to Nominatim)
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-24 left-24 w-80 bg-white dark:bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-3xl overflow-hidden z-[1001] border-2 border-gray-200 dark:border-gray-800 transition-all duration-300 ring-4 ring-black/5 dark:ring-white/5">
      <form onSubmit={handleSearch} className="flex items-center px-4 py-3 bg-gray-50/50 border-b border-gray-100">
        <SearchIcon className={`text-gray-400 mr-3 ${loading ? 'animate-pulse text-blue-500' : ''}`} size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Nagpur Metro, Mumbai Airport..."
          className="bg-transparent outline-none flex-1 text-sm text-gray-800 placeholder-gray-400"
        />
        {query && <X className="text-gray-400 cursor-pointer hover:text-red-500" size={18} onClick={() => {setQuery(''); setResults([]);}} />}
      </form>

      {results.length > 0 && (
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {results.map((result) => (
            <div
              key={result.place_id}
              onClick={() => {
                onSearch(result);
                setResults([]);
              }}
              className="p-4 hover:bg-blue-50 cursor-pointer flex items-start group"
            >
              <MapPin className="text-blue-500 mr-3 mt-1 shrink-0" size={18} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-blue-700">
                  {result.display_name.split(',')[0]}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                  {result.display_name.substring(result.display_name.indexOf(',') + 1).trim()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
