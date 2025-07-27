import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';

interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  alt_description?: string;
  description?: string;
  user: {
    name: string;
    username: string;
  };
}

interface ImagesViewProps {
  images: UnsplashImage[];
  isLoading?: boolean;
}

export const ImagesView: React.FC<ImagesViewProps> = ({ images, isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imageCategory, setImageCategory] = useState<string>('all');

  // Filter Unsplash images based on search and category
  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const searchText = searchQuery.toLowerCase();
      const matchesSearch = searchText === '' || 
        image.alt_description?.toLowerCase().includes(searchText) ||
        image.description?.toLowerCase().includes(searchText) ||
        image.user.name.toLowerCase().includes(searchText);

      // For category filtering, you might want to implement tags or use keywords from descriptions
      // For now, we'll show all images when category is 'all'
      const matchesCategory = imageCategory === 'all';

      return matchesSearch && matchesCategory;
    });
  }, [images, searchQuery, imageCategory]);

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      {/* Search & Filter */}
      <div className="h-10 bg-white border-b border-neutral-200 flex items-center flex-shrink-0">
        <div className="flex-1 relative border-r border-neutral-200">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border-0 text-sm focus:outline-none bg-transparent placeholder-neutral-400"
            disabled={isLoading}
          />
        </div>
        <div className="relative">
          <select
            value={imageCategory}
            onChange={(e) => setImageCategory(e.target.value)}
            className="px-3 py-2.5 border-0 text-sm focus:outline-none bg-transparent text-gray-700 appearance-none cursor-pointer pr-6"
            disabled={isLoading}
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
      <div className="flex-1 p-3 overflow-y-auto min-h-0" style={{ height: 0 }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-gray-400" />
              <p className="text-gray-500 text-sm">Loading images...</p>
            </div>
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="columns-2 gap-2 w-full">
            {filteredImages.map((img) => (
              <div 
                key={img.id} 
                className="break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer mb-2 w-full"
              >
                <img 
                  src={img.urls.small} 
                  alt={img.alt_description || img.description || 'Unsplash Image'} 
                  className="w-full h-auto object-cover block" 
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : images.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center">
              <p className="text-gray-500 text-lg">No images available</p>
              <p className="text-gray-400 text-sm mt-1">Try switching to the images tab to load some photos</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center">
              <p className="text-gray-500 text-lg">No images match your search</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};