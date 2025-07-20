import React, { useState } from 'react';
import { Search, Settings, Home, Clock, Bell, Box, Download, Copy,  ChevronDown } from 'lucide-react';


export const IconsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [iconStyle, setIconStyle] = useState('outline');

  const iconItems = [
    { icon: Search, name: 'Search' },
    { icon: Home, name: 'Home' },
    { icon: Settings, name: 'Settings' },
    { icon: Clock, name: 'Clock' },
    { icon: Bell, name: 'Bell' },
    { icon: Box, name: 'Box' },
    { icon: Download, name: 'Download' },
    { icon: Copy, name: 'Copy' },
  ];

  // Create 3 rows of 8 icons each (24 total)
  const allIcons = Array.from({ length: 24 }, (_, index) => {
    const iconItem = iconItems[index % iconItems.length];
    return { ...iconItem, id: index };
  });

  const filteredIcons = allIcons.filter(icon => 
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Icons-specific Search Bar */}
      <div className="h-10  bg-white border-b border-neutral-200 flex items-center">
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
          <div className="relative flex gap-[10px] p-3 items-center justify-end">
            <select 
              value={iconStyle}
              onChange={(e) => setIconStyle(e.target.value)}
              className="px-3 py-2.5 border-0 text-sm focus:outline-none bg-transparent text-gray-700 appearance-none cursor-pointer pr-6"
            >
              <option value="outline">Outline</option>
              <option value="filled">Filled</option>
              <option value="duotone">Duotone</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
      </div>

      {/* Icons Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-8 gap-2">
          {filteredIcons.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="aspect-square bg-white hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-center rounded border border-gray-200"
                title={item.name}
              >
                <IconComponent size={18} className="text-gray-700" strokeWidth={iconStyle === 'outline' ? 1.5 : 2} />
              </div>
            );
          })}
        </div>
        {filteredIcons.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No icons found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
