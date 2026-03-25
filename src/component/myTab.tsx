import React, { useState } from 'react';

interface Tab {
  id: number;
  label: string;
  content: React.ReactNode;
}

interface MyTabProps {
  tabs: Tab[]; // 外部提供的 tabs 資料
  keepAlive?: boolean; // 新增屬性：是否保持所有分頁的狀態
}

/**
 * ### MyTab 分頁元件 
 *
  * @param {Tab[]} tabs - 分頁資料陣列，每個元素包含 id、label 和 content
  * @param {boolean} [keepAlive=false] - 是否保持所有分頁的狀態，預設為 false
  
 */
const MyTab: React.FC<MyTabProps> = ({ tabs, keepAlive = false }) => {
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
      {/* <div className="tab-content" style={{ marginTop: '20px' }}>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div> */}

       {/* 新版 Tab內容,可決定是否要自動渲染 */}
      <div className="tab-content" style={{ marginTop: '20px' }}>
        {keepAlive ? (
          tabs.map(tab => (
            <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
              {tab.content}
            </div>
          ))
        ) : (
          tabs.find((tab) => tab.id === activeTab)?.content
        )}
      </div>

    </div>
  );
};

export default MyTab;