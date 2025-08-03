import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface IconData {
  name: string;
  collection: string;
  svg?: string;
}

interface IconLibrary {
  id: string;
  name: string;
  displayName: string;
}

export const IconsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('lucide');
  const [icons, setIcons] = useState<IconData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayedIcons, setDisplayedIcons] = useState<IconData[]>([]);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 70 });
  
  const INITIAL_LOAD = 70; // Initial icons to show

  // Available icon libraries
  const iconLibraries: IconLibrary[] = [
    { id: 'lucide', name: 'lucide', displayName: 'Lucide' },
    { id: 'material-symbols', name: 'material-symbols', displayName: 'Material Symbols' },
    { id: 'heroicons', name: 'heroicons', displayName: 'Hero Icons' },
    { id: 'tabler', name: 'tabler', displayName: 'Tabler Icons' },
    { id: 'ph', name: 'phosphor', displayName: 'Phosphor Icons' },
    { id: 'hugeicons', name: 'huge-icons', displayName: 'Huge Icons' },
  ];

  const selectRef = useRef<HTMLSelectElement | null>(null);
const hiddenSpanRef = useRef<HTMLSpanElement | null>(null);

// Resize select width based on selected option text
useEffect(() => {
  if (selectRef.current && hiddenSpanRef.current) {
    const selectedText = iconLibraries.find(lib => lib.id === selectedLibrary)?.displayName || '';
    hiddenSpanRef.current.textContent = selectedText;

    const width = hiddenSpanRef.current.offsetWidth;
    selectRef.current.style.width = `${width + 24}px`; // +32 for padding & dropdown icon
  }
}, [selectedLibrary]);

  // Fetch icons from Iconify API
  const fetchIcons = async (collection: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Method 1: Try the main collection endpoint
      let iconNames: string[] = [];
      
      try {
        const response = await fetch(`https://api.iconify.design/collection?prefix=${collection}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Collection data:', data); // Debug log
          
          // Extract from all possible locations
          // For Lucide and similar collections - icons are in 'uncategorized' array
          if (data.uncategorized && Array.isArray(data.uncategorized)) {
            iconNames.push(...data.uncategorized);
          }
          
          // Hidden icons (if you want to include them)
          if (data.hidden && Array.isArray(data.hidden)) {
            iconNames.push(...data.hidden);
          }
          
          // For collections with categorized icons - icons are in category arrays
          if (data.categories) {
            Object.values(data.categories).forEach((category: any) => {
              if (Array.isArray(category)) {
                iconNames.push(...category);
              } else if (typeof category === 'object' && category !== null) {
                // Some categories might have subcategories or be objects with icon arrays
                Object.values(category).forEach((subCategory: any) => {
                  if (Array.isArray(subCategory)) {
                    iconNames.push(...subCategory);
                  }
                });
              }
            });
          }
        }
      } catch (e) {
        console.warn('Method 1 failed:', e);
      }
      
      // Method 2: If no icons found, try the icons endpoint
      if (iconNames.length === 0) {
        try {
          const response = await fetch(`https://api.iconify.design/${collection}.json?icons=true`);
          if (response.ok) {
            const data = await response.json();
            if (data.icons) {
              iconNames = Object.keys(data.icons);
            }
          }
        } catch (e) {
          console.warn('Method 2 failed:', e);
        }
      }
      
      // Method 3: Try search endpoint as last resort
      if (iconNames.length === 0) {
        try {
          const response = await fetch(`https://api.iconify.design/search?query=${collection}&limit=200&prefix=${collection}`);
          if (response.ok) {
            const data = await response.json();
            if (data.icons && Array.isArray(data.icons)) {
              iconNames = data.icons.map((icon: any) => icon.name || icon);
            }
          }
        } catch (e) {
          console.warn('Method 3 failed:', e);
        }
      }
      
      // Remove duplicates and filter valid names - Load ALL icons
      const uniqueIconNames = [...new Set(iconNames)]
        .filter(name => typeof name === 'string' && name.trim().length > 0);
      
      console.log(`Found ${uniqueIconNames.length} icons for ${collection}:`, uniqueIconNames.slice(0, 10));
      
      if (uniqueIconNames.length === 0) {
        throw new Error(`No icons found for collection: ${collection}`);
      }
      
      const iconData: IconData[] = uniqueIconNames.map(name => ({
        name: name.trim(),
        collection
      }));
      
      setIcons(iconData);
      setVisibleRange({ start: 0, end: INITIAL_LOAD });
    } catch (err) {
      console.error('All methods failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch icons');
      setIcons([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter icons based on search query
  const filteredIcons = React.useMemo(() => {
    if (!searchQuery.trim()) return icons;
    
    return icons.filter(icon =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [icons, searchQuery]);

  // Update displayed icons based on visible range and search
  useEffect(() => {
    const iconsToShow = filteredIcons.slice(visibleRange.start, visibleRange.end);
    setDisplayedIcons(iconsToShow);
  }, [filteredIcons, visibleRange]);

  // Handle scroll for infinite loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    
    // Load more icons when user scrolls past 70%
    if (scrollPercentage > 0.7 && visibleRange.end < filteredIcons.length) {
      setVisibleRange(prev => ({
        ...prev,
        end: Math.min(prev.end + 70, filteredIcons.length)
      }));
    }
  };

  // Fetch icons when library changes
  useEffect(() => {
    fetchIcons(selectedLibrary);
  }, [selectedLibrary]);

  // Reset visible range when search changes
  useEffect(() => {
    setVisibleRange({ start: 0, end: INITIAL_LOAD });
  }, [searchQuery]);

  // Handle icon click - send message to Figma with SVG data
  const handleIconClick = async (icon: IconData, svgContent: string) => {
    try {
      // Send message to Figma main thread with SVG content
      parent.postMessage({
        pluginMessage: {
          type: 'icon',
          iconData: {
            svg: svgContent,
            name: `${icon.collection}:${icon.name}`,
            collection: icon.collection,
            iconName: icon.name
          }
        }
      }, '*');

    } catch (error) {
      console.error('Error inserting icon:', error);
      // Show user feedback
      setError('Failed to insert icon. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Individual icon component
  const IconItem: React.FC<{ icon: IconData }> = ({ icon }) => {
    const [iconSvg, setIconSvg] = useState<string>('');
    const [loadingIcon, setLoadingIcon] = useState(true);
    const [iconError, setIconError] = useState(false);

    useEffect(() => {
      const fetchIconSvg = async () => {
        try {
          const response = await fetch(`https://api.iconify.design/${icon.collection}/${icon.name}.svg`);
          if (response.ok) {
            const svg = await response.text();
            setIconSvg(svg);
          } else {
            setIconError(true);
          }
        } catch (error) {
          console.error('Failed to fetch icon SVG:', error);
          setIconError(true);
        } finally {
          setLoadingIcon(false);
        }
      };

      fetchIconSvg();
    }, [icon]);

    return (
      <div
        className="aspect-square bg-white cursor-pointer transition-all duration-200 flex items-center justify-center rounded p-3 hover:bg-gray-100"
        title={`${icon.collection}:${icon.name}`}
        onClick={() => iconSvg && handleIconClick(icon, iconSvg)}
      >
        {loadingIcon ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        ) : iconError ? (
          <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-400">?</span>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: iconSvg }}
            className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
            style={{
              filter: 'none'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Search Bar with Library Selector */}
      <div className="h-10 bg-white border-b border-neutral-200 flex items-center flex-shrink-0">
        <div className="flex-1 relative border-r border-neutral-200">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border-0 text-sm focus:outline-none bg-transparent placeholder-neutral-400"
          />
        </div>
        
        {/* Library Dropdown */}
<div className="relative flex items-center pr-3">
  {/* Invisible text span to calculate width */}
  <span
    ref={hiddenSpanRef}
    className="absolute left-0 top-0 opacity-0 whitespace-nowrap text-sm font-normal px-3"
    aria-hidden="true"
  />

  <select
    ref={selectRef}
    value={selectedLibrary}
    onChange={(e) => setSelectedLibrary(e.target.value)}
    className="text-sm appearance-none bg-transparent pr-4 pl-3 py-2.5 text-gray-700  rounded-md focus:outline-none cursor-pointer transition-all"
  >
    {iconLibraries.map((library) => (
      <option key={library.id} value={library.id}>
        {library.displayName}
      </option>
    ))}
  </select>

  <ChevronDown size={16} className="absolute right-4 pointer-events-none text-gray-600" />
</div>
      </div>

      {/* Icons Grid */}
      <div className="flex-1 overflow-auto" onScroll={handleScroll}>
        <div className="p-4 pb-8">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                Loading all icons...
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium">Error loading icons</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => fetchIcons(selectedLibrary)}
                className="mt-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredIcons.length === 0 && searchQuery && (
            <div className="text-center text-gray-500 mt-8">
              <div className="mb-2">🔍</div>
              <p>No icons found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {!loading && !error && icons.length === 0 && !searchQuery && (
            <div className="text-center text-gray-500 mt-8">
              <div className="mb-2">📦</div>
              <p>No icons available in this library</p>
              <p className="text-sm mt-1">Try selecting a different library</p>
            </div>
          )}

          {displayedIcons.length > 0 && (
            <div className="grid grid-cols-7 gap-3">
              {displayedIcons.map((icon, index) => (
                <IconItem key={`${icon.collection}-${icon.name}-${index}`} icon={icon} />
              ))}
            </div>
          )}

          {/* Loading more indicator */}
          {!loading && displayedIcons.length > 0 && displayedIcons.length < filteredIcons.length && (
            <div className="text-center mt-6">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                Loading more icons...
              </div>
            </div>
          )}

          {/* Status Info */}
          {!loading && displayedIcons.length > 0 && (
            <div className="text-center mt-4 text-xs text-gray-400">
              {searchQuery ? (
                <>Showing {displayedIcons.length} of {filteredIcons.length} matching icons</>
              ) : (
                <>Showing {displayedIcons.length} of {icons.length} icons from {iconLibraries.find(lib => lib.id === selectedLibrary)?.displayName}</>
              )}
              {displayedIcons.length < filteredIcons.length && (
                <div className="mt-1">Scroll down to load more</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};