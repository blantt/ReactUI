import React, { useState } from 'react';
import NavItem, { MenuItem, type MenuItemData } from '../component/myMenuItem';
import { Button } from "../component/button";
import { FileText, ChevronRight, ChevronDown, Folder, File, Layers, Settings, User, Mail, Star, Share2 } from 'lucide-react';
import TestTab from '../page/testTab';
import { isLocal, getApiUrl } from '../utils/env';
interface MasterProps {
    tabs?: string
}

const MyMaster: React.FC<MasterProps> = ({ tabs = "" }) => {

 
    const menuData: MenuItemData[] = [
        {
            id: '1',
            label: '個人檔案',
            icon: <User size={18} />,
            selfUI: (
                <Button label="個人檔案" className=' w-full ' icon={<User size={18} />} />
            ),

            children: [
                {
                    id: '1-1', label: '轉跳頁面test',
                    content: <TestTab />,
                    icon: <File size={16} />
                },
                {
                    id: '1-1', label: 'url直接轉跳頁面',
                    //content: <TestTab />,
                    url: '/testVista',
                    icon: <File size={16} />
                },
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
        {
            id: '3', label: '系統設定', icon: <Settings size={18}

            />, content: <div>系統設定內容</div>
        },
    ];

    const [currentPage, setCurrentPage] = useState<MenuItemData>(menuData[0]);
    const handleNavigate = (item: MenuItemData) => {
           // alert(`導向頁面: ${item.label}`);
           // console.log(`導向頁面: ${item.label}`);
   
           if (item.url) {
               window.location.href = getApiUrl(item.url);
               // 如果是iframe 時
              //  window.parent.location.href  =  getApiUrl(item.url);
               return;
           } else if (item.content) {
               setCurrentPage(item);
           }
       };
    return (
        <div className=' h-full w-full'>
 
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
                                <NavItem
                                    key={item.id}
                                    item={item}
                                    onNavigate={handleNavigate}
                                    activeId={currentPage.id}
                                />
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

                {/* 核心內容區塊 (Content Area) */}
                <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
                    {/* 麵包屑導覽 (Breadcrumb) */}
                    <div className="mb-6 flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest font-bold">
                        <span>Main</span>
                        <ChevronRight size={12} />
                        <span className="text-blue-500">{currentPage.label}</span>
                    </div>

                    {/* 動態渲染內容 */}
                    <div className="transition-all duration-300 ease-in-out">
                        {currentPage.content || (
                            <div className="p-20 text-center text-slate-300">

                                <p>此頁面尚無內容</p>
                            </div>
                        )}
                    </div>
                </main>
           
                

                {/* 底下footer */}
                <footer className=" sticky top-[100vh] w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4 text-center text-slate-500 dark:text-slate-400">
                        © 2024 DevSystem. All rights reserved.
                    </div>
                </footer>
                 
            </div>



            
        </div>

    );
};


export default MyMaster;