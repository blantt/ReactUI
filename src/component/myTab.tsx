import React, { useState } from 'react';

interface Tab {
  id: number;
  label: string;
  content: React.ReactNode;
}

interface MyTabProps {
  tabs: Tab[]; // 外部提供的 tabs 資料
}

const MyTab: React.FC<MyTabProps> = ({ tabs }) => {
  // 管理選中的 Tab 狀態
  const [activeTab, setActiveTab] = useState<number>(tabs[0]?.id || 0);

  return (
    <div>
      {/* 渲染 Tab 標籤 */}
      <div className="tab-header" style={{ display: 'flex', cursor: 'pointer' }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              borderBottom: activeTab === tab.id ? '2px solid blue' : 'none',
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* 顯示選中的 Tab 的內容 */}
      <div className="tab-content" style={{ marginTop: '20px' }}>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default MyTab;