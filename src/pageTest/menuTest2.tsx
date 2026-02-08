import React, { useState  } from 'react';
import NavMenu,{ MenuItem, type MenuItemData} from '../component/myMenuItem'; 
import { Button } from "../component/button";
import { FileText, ChevronRight, ChevronDown, Folder, File, Layers, Settings, User, Mail, Star, Share2 } from 'lucide-react';

const App: React.FC = () => {

const menuData: MenuItemData[] = [
    {
        id: '1',
        label: '個人檔案',
        icon: <User size={18} />,
        selfUI: (
            <Button label="個人檔案" className=' w-full ' icon={<User size={18} />} />
        ),
        children: [
            { id: '1-1', label: '基本資料', icon: <File size={16} /> },
            {
                id: '1-2',
                label: '隱私設定',
                icon: <Settings size={16} />,
                children: [
                    { id: '1-2-1', label: '密碼修改', icon: <Layers size={14} /> },
                    { id: '1-2-2', label: '二階段驗證', icon: <Layers size={14} /> },
                ]
            },
        ]
    },
    {
        id: '2',
        label: '訊息通知',

        selfUI: (
            <Button label="快速建立專案" className=' w-full ' />

        ),

        icon: <Mail size={18} />,
        children: [
            { id: '2-1', label: '收件匣', icon: <Star size={16} /> },
            {
                id: '2-2',
                label: '已發送',
                icon: <Share2 size={16} />,
                children: [
                    {
                        id: '2-2-1',
                        label: '2024 封存檔',
                        icon: <Folder size={14} />,
                        children: [
                            { id: '2-2-1-1', label: '第一季報告', icon: <File size={12} /> },
                            { id: '2-2-1-2', label: '第二季預算', icon: <File size={12} /> },
                        ]
                    }
                ]
            },
        ]
    },
    { id: '3', label: '系統設定', icon: <Settings size={18} /> }
];



  const handleItemClick = (label: string) => {
          console.log(`點擊了: ${label}`);
      };
  
      return (
  
          <div className='  '>
  
              <div>
                  橫版測試
              </div>
              <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                  {/* 導航列容器 */}
                  <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            
                          {/* Logo 部份 */}
                          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                  <Layers size={18} />
                              </div>
                              <span>DevSystem</span>
                          </div>
  
                          {/* 水平選單主體 */}
                          <nav className="flex items-center gap-1">
                              {menuData.map((item) => (
                                  <NavMenu key={item.id} item={item} />
                              ))}
                          </nav>
  
                          {/* 右側工具列 (示範用) */}
                          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-4 ml-4">
                              <button className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                  <Settings size={20} />
                              </button>
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                              </div>
                          </div>
  
                      </div>
                  </header>
  
                  <main className="p-10 text-center">
                      <h1 className="text-2xl font-bold text-slate-400">請嘗試將滑鼠移至導航項目上</h1>
                      <p className="text-slate-500 mt-2">支援無限層級的 Fly-out 子選單與自定義 selfUI</p>
                  </main>
              </div>
  
  
  
              <div>
                  進階版測試
              </div>
  
              <div className="flex justify-center items-center ">
  
                  <div className="w-full max-w-md">
                      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">React TS 側邊選單</h1>
                      {menuData.map((item) => (
                          <MenuItem key={item.id} item={item} />
                      ))}
                  </div>
  
  
              </div>
  
          </div>
  
  
      );

}
 



export default App;
