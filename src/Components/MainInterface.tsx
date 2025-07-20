import React, { useState } from 'react';
import {TabBar} from './TabBar';
import {IconsView} from './IconsView';
import {ImagesView} from './ImageView';
import {ContentView} from './ContentView';

// Define TabType type if not already defined elsewhere
type TabType = 'icons' | 'image' | 'content';

const MainInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('icons');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-[550px]  overflow-hidden flex flex-col">
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Render the appropriate view based on active tab */}
      {activeTab === 'icons' && <IconsView />}
      {activeTab === 'image' && <ImagesView />}
      {activeTab === 'content' && <ContentView />}
    </div>
  );
};

export default MainInterface;