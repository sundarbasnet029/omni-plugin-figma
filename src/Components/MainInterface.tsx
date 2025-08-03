import React, { useState, useEffect } from 'react';
import { TabBar } from './TabBar';
import { IconsView } from './IconsView';
import { ImagesView} from './ImageView';

import { ContentView } from './ContentView';
import { unsplashAccessKey } from '../API/unsplash';

// Define TabType type
type TabType = 'icons' | 'image' | 'content';

// Define Unsplash image interface
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

const MainInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('icons');
  const [imagesArray, setImagesArray] = useState<UnsplashImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [imagesFetched, setImagesFetched] = useState<boolean>(false);

  // Fetch Unsplash images
  const fetchUnsplashImages = async (): Promise<void> => {
    if (imagesFetched || isLoadingImages) return; // Prevent duplicate calls

    setIsLoadingImages(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=30&client_id=${unsplashAccessKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: UnsplashImage[] = await response.json();
      setImagesArray(data);
      setImagesFetched(true);
      console.log('Fetched images:', data);
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
      setImagesArray([]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Effect to fetch images when image tab is selected
  useEffect(() => {
    if (activeTab === 'image' && !imagesFetched) {
      fetchUnsplashImages();
    }
  }, [activeTab, imagesFetched]);

  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-[550px] overflow-hidden flex flex-col">
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Render the appropriate view based on active tab */}
      {activeTab === 'icons' && <IconsView/>}
      {activeTab === 'image' && (
        <ImagesView 
          images={imagesArray} 
          isLoading={isLoadingImages}
        />
      )}
      {activeTab === 'content' && <ContentView />}
    </div>
  );
};

export default MainInterface;