import React, { useState, useRef } from 'react';
import { Button2 } from "../component/button";
import { Button } from "../component/button";
import { FileText, ChevronRight, ChevronDown, Folder, File, Layers, Settings, User, Mail, Star, Share2 } from 'lucide-react';


/**
 * 定義 MenuItem 的 Props 介面
 */
interface MenuItemProps {
    item: MenuItemData;
    level?: number;
    onNavigate?: (item: MenuItemData) => void;
    activeId?: string;
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
export const MenuItem: React.FC<MenuItemProps> = ({ item, level = 0 }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const hasChildren = !!(item.children && item.children.length > 0);

    const toggleOpen = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.stopPropagation();
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="w-full">
            {/* 選單項目本體 */}
            <div
                onClick={toggleOpen}
                style={{ paddingLeft: level === 0 ? 0 : `${level * 1.25 + 1}rem` }}
                className={`
          flex items-center justify-between  cursor-pointer  
          transition-all duration-200 ease-in-out  not-visited:
          hover:bg-slate-100 dark:hover:bg-slate-800
          ${isOpen ? 'text-blue-600 font-medium' : 'text-slate-700 dark:text-slate-300'}
          ${level === 0 ? 'border-b border-slate-100 dark:border-slate-800' : ''}
        `}
            >

                {/* 優先判斷是否有 selfUI */}
                {item.selfUI ? (

                    <div className="flex items-center    overflow-hidden w-full ">
                        <div className="flex items-center w-full">
                            {item.selfUI}
                        </div>

                    </div>
                    //  <div className="flex items-center w-full">
                    //     {item.selfUI}
                    // </div>  

                ) : (
                    <>

                        <div className="flex items-center gap-3 py-2.5 pr-4  overflow-hidden w-full ">
                            <span className={`${isOpen ? 'text-blue-500' : 'text-slate-400'} shrink-0`}>
                                {item.icon}
                            </span>
                            <span className="text-sm truncate">{item.label}</span>

                        </div>
                        {hasChildren && (
                            <div className="text-slate-400 ml-2 shrink-0">
                                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                        )}
                    </>
                )}



            </div>

            {/* 子項目容器 (遞迴調用) */}
            {hasChildren && isOpen && item.children && (
                <div className="overflow-hidden animate-in slide-in-from-top-1 duration-200">
                    {item.children.map((child) => (
                        <MenuItem key={child.id} item={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};



export const NavItem: React.FC<MenuItemProps> = ({ item, level = 0, onNavigate, activeId }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null);
    const hasChildren = !!(item.children && item.children.length > 0);


    const handleClick = (e: React.MouseEvent) => {
        // 如果沒有子選單，代表它是功能點，執行導覽
       // alert(`點擊了: ${item.label}`);
        if (!hasChildren) {
            onNavigate?.(item);
            setIsOpen(false);
        }
    };

    // 處理滑鼠進入 (展開)
    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    // 處理滑鼠離開 (延遲收合以增加操作容錯度)
    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    // 決定下拉選單的定位
    // 第一層向正下方展開，第二層以後向右側展開
    const dropdownClasses = level === 0
        ? "top-full left-0 mt-1"
        : "top-0 left-full ml-1";

    return (
        <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 項目主體 */}
            <div  onClick={handleClick}
                className={`
          flex items-center justify-between gap-2 px-4 py-2 cursor-pointer transition-colors whitespace-nowrap
          ${level === 0 ? 'rounded-md hover:bg-slate-100 dark:hover:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
          ${isOpen ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}
        `}
            >
                <div className="flex items-center gap-2">
                    {item.selfUI ? (
                        <div className="flex items-center">{item.selfUI}</div>
                    ) : (
                        <>
                            <span className={`${isOpen ? 'text-blue-500' : 'text-slate-400'}`}>{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </>
                    )}
                </div>

                {hasChildren && (
                    <span className="text-slate-400">
                        {level === 0 ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
            </div>

            {/* 巢狀下拉選單 */}
            {hasChildren && isOpen && (
                <div className={`
          absolute z-50 min-w-[180px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 
          shadow-xl rounded-lg py-1 animate-in fade-in zoom-in-95 duration-150
          ${dropdownClasses}
        `}>
                    {item.children?.map((child) => (
                        <NavItem key={child.id} item={child} level={level + 1} onNavigate={onNavigate} activeId={activeId} />
                    ))}
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

export interface MenuItemData {
    id: string;
    label: string;
    icon: React.ReactNode;
    children?: MenuItemData[];
    selfUI?: React.ReactNode;
    /** 點擊後要顯示的組件內容 */
    content?: React.ReactNode;
    // 點擊後直接轉跳頁面
    url?: string;
}


export default NavItem;
