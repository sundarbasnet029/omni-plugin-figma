// Define tab types
type TabType = 'icons' | 'image' | 'content';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'icons' as TabType, label: 'Icons' },
    { id: 'image' as TabType, label: 'Image' },
    { id: 'content' as TabType, label: 'Content' },
  ];

  return (
    <div className="flex p-3 h-10 justify-between items-center bg-neutral-50 border-b border-neutral-100">
      <div className="tab-container flex gap-1">
      {tabs.map((tab) => (
        
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-2 h-6 text-sm font-regular transition-all rounded-sm ${
            activeTab === tab.id
              ? 'text-neutral-600 bg-neutral-200 font-medium shadow-sm'
              : 'text-neutral-600  hover:bg-neutral-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
      </div>
      <button className="px-2 h-6 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-lg  transition-colors">
        Sign in
      </button>
    </div>
  );
};