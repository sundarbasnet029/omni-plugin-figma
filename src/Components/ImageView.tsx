import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { imagesArray } from '../API/unsplash'; // ensure this is correctly exported

interface ImageItem {
  id: number;
  height: string;
  gradient: string;
  category: string;
  name: string;
}

export const ImagesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [imageCategory, setImageCategory] = useState('all');

  const imageItems: ImageItem[] = [
    { id: 1, height: 'h-32', gradient: 'from-teal-400 via-green-400 to-blue-500', category: 'nature', name: 'Aurora' },
    { id: 2, height: 'h-24', gradient: 'from-orange-300 via-red-300 to-pink-300', category: 'nature', name: 'Flowers' },
    { id: 3, height: 'h-36', gradient: 'from-green-600 via-green-700 to-gray-800', category: 'nature', name: 'Mountain' },
    { id: 4, height: 'h-28', gradient: 'from-yellow-400 via-orange-400 to-red-400', category: 'landscape', name: 'Sunset' },
    { id: 5, height: 'h-32', gradient: 'from-orange-600 via-red-500 to-yellow-400', category: 'nature', name: 'Forest' },
  ];

  const filteredImages = imageItems.filter((image) => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = imageCategory === 'all' || image.category === imageCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Search & Filter */}
      <div className="h-10 bg-white border-b border-neutral-200 flex items-center">
        <div className="flex-1 relative border-r border-neutral-200">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border-0 text-sm focus:outline-none bg-transparent placeholder-neutral-400"
          />
        </div>
        <div className="relative">
          <select
            value={imageCategory}
            onChange={(e) => setImageCategory(e.target.value)}
            className="px-3 py-2.5 border-0 text-sm focus:outline-none bg-transparent text-gray-700 appearance-none cursor-pointer pr-6"
          >
            <option value="all">All</option>
            <option value="nature">Nature</option>
            <option value="landscape">Landscape</option>
            <option value="abstract">Abstract</option>
          </select>
          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Images Display */}
      <div className="image-grid-container flex-1 p-4 overflow-auto">
        <div className="columns-2 gap-3 space-y-3">
          {imagesArray.map((img) => (
            <div key={img.id} className="rounded-lg overflow-hidden shadow">
              <img src={img.urls.thumb} alt={img.alt_description || 'Unsplash Image'} className="w-full h-auto" />
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No images found
          </div>
        )}
      </div>
    </div>
  );
};
