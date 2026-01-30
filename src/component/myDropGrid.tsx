import React, { useState, useEffect, useRef } from 'react';
// import DataGrid2 from '../component/DataGrid2';
import DataGridApi, { transformToFormField as apitransform } from './myDataGrid';
import { Down } from "../component/mySvg";
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

import { ArrowBigRightDash, ChevronDown, X, CircleX, DivideIcon, SquareChevronDown } from 'lucide-react';
// 定義下拉選單元件的屬性介面

const styles =  /* css */`
         
         .vista-dropGrid-blue {
            /* Vista 經典的雙層玻璃漸變 */
            border-color: #3c7fb1;
            background: linear-gradient(to bottom, 
                #f8fbff 0%, 
                #e5f1fb 45%, 
                #d2eaff 50%, 
                #c2e0ff 100%);
            border: 1px solid #7a7a7a;
            
            padding: 10px 15px; /* 調整內距，因為不再需要預留空間給自定義圖片 */
            color: #222;
           /*  font-size: 14px; */
            font-family: "Segoe UI", Tahoma, sans-serif;
            cursor: pointer;
            
            /* 關鍵：未點選時的內陰影組合 */
            box-shadow: 
                inset 0 2px 5px rgba(84, 105, 133, 0.15),   /* 頂部深色內陰影，營造凹陷感 */
                inset 1px 0 3px rgba(84, 105, 133, 0.05),   /* 左側微弱陰影 */
                inset 0 0 0 1px rgba(255, 255, 255, 0.4), /* 邊緣的高亮內發光 */
                0 1px 0 rgba(255, 255, 255, 0.8);      /* 外邊框底部的白色投影 */

            position: relative;
            transition: all 0.2s ease-in-out;
        }

         /* 懸停時增強光澤與外發光 */
        .vista-dropGrid-blue:hover {
            
            box-shadow: 
                inset 0 1px 3px rgba(0, 0, 0, 0.1), 
                0 0 6px rgba(60, 127, 177, 0.4);
        }
 
     `;
export const VistaStyles = () => {
  useEffect(() => {
    const styleId = 'vista-dropGrid-styles';

    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    }
  }, []);

  return null; // 不在組件位置渲染任何東西
};

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export interface FormField {
  name: string;
  value?: string;
  colSpan?: number;
  type: string; // 支援 "input"、"hyperlink" 和 "empty"
  href?: string; // 當 type 為 hyperlink 時，指定超連結的目標 URL
  child?: React.ReactNode; // 當 type 為 empty 時，允許外部傳入子元素
}

// interface ColumnType {
//   name: string;
//   colSpan?: number;

// }

interface DropdownProps {
  data?: Array<Record<string, FormField>>; // 直接傳入的資料
  apiUrl?: string; // API 資料來源 URL
  // columns: ColumnType[]; // 可選的表頭名稱
  columns: Array<{
    name: string; // 欄位名稱
    colSpan?: number; // 欄位寬度
    type: string; // 欄位型態，例如 "input"、"hyperlink"、"empty"
    transform?: (value: any) => FormField; // 動態轉換函數

  }>;
  onSelect?: (value: FileItem) => void; // 當選擇選項時觸發的回調函數
  keyValue?: string; // 可選的當前選擇值
  keyText?: string; // 可選的顯示文字
  gridCols?: number; // 動態控制grid列數
  useSearch?: boolean; // 是否啟用搜尋功能
  havecheckbox?: boolean; // 是否顯示checkbox欄位
  useBar?: boolean; // 是否使用進度條
  widthCss?: string; // 下拉選單寬度
  emptyText?: string; // 空白選項顯示文字
  style1?: 'default' | 'vistaBlue';
  className?: string;
}

export interface FileItem {
  [key: string]: any;
}

export const transformToFormField = apitransform;

const MyDropDown: React.FC<DropdownProps> = ({ data, columns, apiUrl, onSelect, keyValue, keyText, gridCols
  , useSearch, havecheckbox, useBar, widthCss = "w-48", emptyText = "請選擇", style1 = 'default', className = "" }) => {
  // 狀態：管理下拉選單是否展開  
  const [isOpen, setIsOpen] = useState(false);
  // 狀態：儲存當前選擇的選項
  const [selectedOption, setSelectedOption] = useState<FileItem | null>(null);
  const mygridCols = gridCols || columns.length;

  // 使用 useRef 來參考下拉選單的 DOM 節點
  const dropdownRef = useRef<HTMLDivElement>(null);

  const styles = {
    default: '',
    vistaBlue: 'vista-dropGrid-blue',
  };


  // 切換下拉選單展開/收起的函數
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // 點擊外部時關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  let cssUserbar = "";
  if (useBar) {
    cssUserbar = " h-full overflow-y-auto "
  }

  //handleGridSelect 是要給 DataGrid2 用的點選事件處理函數
  const handleSelect = (option: FileItem) => {
    setSelectedOption(option); // 更新當前選擇的選項
    setIsOpen(false); // 收起下拉選單

  };
  return (
    VistaStyles(),
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>


        <button


          className={cn(`relative flex items-center justify-center ${widthCss} rounded-md border   border-gray-300 shadow-sm px-4 py-2 bg-slate-100  text-sm font-medium
          text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-offset-2 focus:ring-indigo-500 `, `${styles[style1] || styles.default}  ${className} `)}
          onClick={handleToggle} >

          {/* <div className="absolute left-1">
            
             <img src={`${import.meta.env.BASE_URL}arrow_del.png`} alt="icon" style={{ width: 20, height: 20 }} />
          </div> */}

          {selectedOption ? (keyText ? selectedOption[keyText]?.value : selectedOption.Name?.value) : emptyText}

          <div className="absolute right-1">

            <div className=' flex flex-row'>
              <SquareChevronDown
                className={`w-5 h-5  ${style1 === 'vistaBlue' ? 'text-blue-400' : 'text-blue-300'}`}
              />
              <div>
                <button
                  onClick={e => {
                    e.stopPropagation(); // 阻止事件冒泡
                    setSelectedOption(null);
                    setIsOpen(false);
                  }}>
                  {/* <img src={`${import.meta.env.BASE_URL}arrow_del.png`} alt="icon" style={{ width: 20, height: 20 }} /> */}
                  <CircleX className={`w-5 h-5  ${style1 === 'vistaBlue' ? 'text-blue-400' : 'text-blue-300'}`}
                  />
                </button>

              </div>

            </div>


          </div>

        </button>
      </div>


      {/* 下拉選單內容，僅在 isOpen 為 true 時顯示 */}
      {isOpen && (
        <div className="origin-top-right z-50 absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className={` ${cssUserbar} `} style={{ maxHeight: '400px' }}>
            {/* 渲染 DataGrid2，並處理其點選事件 */}
            {/* onRowClick={handleSelect} */}

            <DataGridApi
              columns={columns}
              data={data} apiUrl={apiUrl} gridCols={mygridCols}
              onRowClick={item => handleSelect(item)}
              useSearch={useSearch}
              havecheckbox={havecheckbox}
              useBar={useBar}
            />

          </div>
        </div>
      )}


    </div>
  );
};

export default MyDropDown;