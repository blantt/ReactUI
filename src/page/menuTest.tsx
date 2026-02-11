import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FileText } from 'lucide-react';


/**
 * 定義 MenuItem 的 Props 介面
 */
interface MenuItemProps {
  title: string;
  children: React.ReactNode;

}

/**
 * 定義 SubItem 的 Props 介面
 */
interface SubItemProps {
  label: string;
  onClick: () => void;
}

/**
 * MenuItem 元件
 */
const MenuItem: React.FC<MenuItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full mb-1 overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      {/* 標題區塊 - 點擊觸發展開/收合 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 transition-colors duration-200 text-left ${isOpen ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
      >
        <div className="flex items-center gap-3">
          <Folder size={18} className={isOpen ? 'text-blue-500' : 'text-gray-400'} />
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* 子項目容器 - 根據 isOpen 狀態決定是否顯示 */}
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="p-2 bg-gray-50 flex flex-col gap-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const HorizontalMenuItem: React.FC<MenuItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 標題按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)} // 同時支援點擊切換
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${isOpen ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
      >
        <span className="font-medium">{title}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 w-48 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * SubItem 元件 - 用於選單內的具體子項目
 */
const SubItem: React.FC<SubItemProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all text-left w-full"
  >
    <FileText size={14} className="text-gray-400" />
    {label}
  </button>
);

const App: React.FC = () => {
  const handleItemClick = (label: string) => {
    console.log(`點擊了: ${label}`);
  };

  return (

    <div className='  '>
      <div>
        測試版2
      </div>
      <div className="flex justify-center items-start ">
        <HorizontalMenuItem title="系統設定vv">
          <SubItem label="個人資料修改" onClick={() => handleItemClick('個人資料')} />
          <SubItem label="密碼安全性" onClick={() => handleItemClick('安全性')} />
          <SubItem label="隱私設定" onClick={() => handleItemClick('隱私')} />
        </HorizontalMenuItem>

        <HorizontalMenuItem title="文件管理">
          <SubItem label="最近使用的檔案" onClick={() => handleItemClick('最近檔案')} />
          <SubItem label="已歸檔專案" onClick={() => handleItemClick('歸檔')} />
          <SubItem label="資源回收桶" onClick={() => handleItemClick('回收桶')} />
        </HorizontalMenuItem>
      </div>

      <div className="flex justify-center items-center ">

        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">React TS 側邊選單</h1>

          <MenuItem title="系統設定">
            <SubItem label="個人資料修改" onClick={() => handleItemClick('個人資料')} />
            <SubItem label="密碼安全性" onClick={() => handleItemClick('安全性')} />
            <SubItem label="隱私設定" onClick={() => handleItemClick('隱私')} />
          </MenuItem>

          <MenuItem title="文件管理">
            <SubItem label="最近使用的檔案" onClick={() => handleItemClick('最近檔案')} />
            <SubItem label="已歸檔專案" onClick={() => handleItemClick('歸檔')} />
            <SubItem label="資源回收桶" onClick={() => handleItemClick('回收桶')} />
          </MenuItem>

          <MenuItem title="通知中心">
            <div className="p-3 text-sm text-gray-500 italic text-center">
              目前沒有新通知
            </div>
          </MenuItem>
        </div>


      </div>

    </div>


  );
};

export default App;