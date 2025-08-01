
import React, { useState } from 'react';
import { Search,  ChevronRight, ChevronDown } from 'lucide-react';
import { insertContent } from '../ContentFunctions/insertFunctions';

export const ContentView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('all');

  const contentItems = [
    {
      icon: '👤',
      role: 'avatar',
      title: 'Avatar',
      subtitle: 'Random images',
      type: 'data',
      hasChevron: false,
      onClick: () => {
        console.log("Avatar clicked");
        parent.postMessage({ 
          pluginMessage: { 
            type: 'avatar' 
          } 
        }, '*');

      },
    },
    {
      icon: '👤',
      title: 'Name(Full name)',
      subtitle: 'eg: John Doe',
      type: 'data',
      hasChevron: false,
      onClick: () => {
        console.log("Name clicked");
        insertContent("name");
      },
    },
    {
      icon: '✉️',
      title: 'Email',
      subtitle: 'example@email.com',
      type: 'data',
      hasChevron: false,
      hasIndicator: false,
      onClick: () => {
        console.log("Email clicked");
        insertContent("email");
      },
    },
    {
      icon: '📞',
      title: 'Phone(US)',
      subtitle: '(650) 253-2524',
      type: 'data',
      hasChevron: false,
      onClick: () => {
        console.log("Phone clicked");
        insertContent("number");
      },
    },
    {
      icon: '📄',
      title: 'Lorem ipsum',
      subtitle: 'Random Text',
      type: 'text',
      hasChevron: false,
      onClick: () => {
        console.log("Lorem Ipsum clicked");
        insertContent("loremIpsum");
        // add your lorem logic here
      },
    },
    {
      icon: '📅',
      title: 'Date(mm/dd/yyyy)',
      subtitle: '09/24/2025',
      type: 'data',
      hasChevron: false,
      onClick: () => {
        console.log("Date clicked");
        insertContent("date");
        // add your date logic here
      },
    },
    {
      icon: '🕒',
      title: 'Time',
      subtitle: '2 hrs ago',
      type: 'data',
      hasChevron: false,
      onClick: () => {
        console.log("Time clicked");
        insertContent("time");
        // add your time logic here
      },
    },
    {
      icon: '💰',
      title: 'Currency(US)',
      subtitle: '',
      type: 'data',
      hasChevron: false,
      onClick: () => {
        console.log("Currency clicked");
        // add your currency logic here
        insertContent("price");
      },
    },
  ];
  

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = contentType === 'all' || item.type === contentType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Content-specific Search Bar */}
      <div className="h-10  bg-white border-b border-neutral-200 flex items-center">
          <div className="flex-1 relative border-r border-neutral-200">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border-0 text-sm focus:outline-none bg-transparent placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <select 
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="px-3 py-2.5 border-0 text-sm focus:outline-none bg-transparent text-gray-700 appearance-none cursor-pointer pr-6"
            >
              <option value="all">All</option>
              <option value="text">Text</option>
              <option value="data">Data</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
      </div>

      {/* Content List */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="space-y-0">
        {filteredContent.map((item, index) => (
         <div
            key={index}
            className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
            onClick={item.onClick}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                {item.icon}
                </div>
                <div>
                <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                {item.subtitle && (
                <div className="text-[13px] text-gray-500">{item.subtitle}</div>
                )}
                </div>
              </div>
            <div className="flex items-center gap-2">
            {item.hasIndicator && (
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            )}
            {item.hasChevron && (
            <ChevronRight size={16} className="text-gray-400" />
            )}
            </div>
            </div>
        ))}

        </div>
        {filteredContent.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No content found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};