import React, { useState, useEffect, useRef } from 'react';
import { ArrowBigRightDash, ChevronDown, X, CircleX, DivideIcon, SquareChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';


const styles =  /* css */`
         
         .vista-drop-blue {
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
        .vista-drop-blue:hover {
            
            box-shadow: 
                inset 0 1px 3px rgba(0, 0, 0, 0.1), 
                0 0 6px rgba(60, 127, 177, 0.4);
        }
 
     `;
export const VistaStyles = () => {
  useEffect(() => {
    const styleId = 'vista-drop-styles';

    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    }
  }, []);

  return null; // 不在組件位置渲染任何東西
};
/**
 * 封裝一個 cn (className) 工具函數
 * 這能解決 Tailwind 類別順序衝突的問題，確保外部傳入的 className 優先級最高
 */
function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}



// 定義下拉選單元件的屬性介面
interface DropdownProps {
  options?: FileItem[]; // 下拉選單的選項陣列
  onSelect?: (value: FileItem) => void; // 當選擇選項時觸發的回調函數
  keyValue?: string; // 可選的當前選擇值
  keyText?: string; // 可選的顯示文字
  apiUrl?: string; // API 資料來源 URL
  haveBlank?: boolean; // 是否包含空白選項
  widthCss?: string; // 下拉選單寬度
  emptyText?: string; // 空白選項顯示文字
  style1?: 'default' | 'vistaBlue';
  className?: string;
  value?: string; // 用於綁定選擇值的屬性
   refreshKey?: number; // ← 如外部要強制重抓資料時
}

//FileItem 預計是dropdown選項的型別 
// export interface FileItem {
//     name: string;
//     value: string;
// }

export interface FileItem {
  [key: string]: any;
}

//FileItem 範例
const fileOptions: FileItem[] = [
  { sname: "name 1", svalueb: "value 1", sother: "other1" },
  { sname: "name 2", svalueb: "value 2", sother: "other2" },
  { sname: "name 3", svalueb: "value 3", sother: "other3" },
];

export const transformToFormField = (data: any[], keyValue?: string, keyText?: string, haveBlank: boolean = true
) => {

  const transformedData = data.map((item, itemIndex) => {
    const result: FileItem = {};
    //這裡目的是要把 item 轉換成 FileItem 型別

    //[{\"ClassID\":4,\"ClassName\":\"全公司(09-18)\"},{\"ClassID\":5,\"ClassName\":\"發行客服(0830-1730)\"}]

    if (keyValue) {
      result[keyValue] = item[keyValue];
    }
    if (keyText) {
      result[keyText] = item[keyText];
    }

    // console.log(`轉換後的第 ${itemIndex + 1} 列:`, result); // 確認整列轉換結果
    return result;
  });

  // 建立一個空白選項
  const blankOption: FileItem = {};
  // 根據傳入的 key 來設定空白選項的屬性
  if (keyValue) {
    blankOption[keyValue] = '';
  } else {
    blankOption.value = ' '; // 預設的 value key
  }
  if (keyText) {
    blankOption[keyText] = '請選擇'; // 顯示一個空格，避免選項高度為 0
  } else {
    blankOption.name = ' '; // 預設的 name key
  }

  // 將空白選項加到陣列的最前面並回傳
  if (!haveBlank) {
    return transformedData;
  } else {

    return [blankOption, ...transformedData];
  }


};

/**
 * ### MyDropDown 下拉選單元件v3
 *
 * @param {FileItem[]} [options] - 下拉選項資料陣列，每個元素為 `FileItem` 物件（`{ [key: string]: any }`）
 * @param {string} [keyValue] - 指定 `FileItem` 中作為「值 (value)」的欄位名稱，例如 `"ClassID"`
 * @param {string} [keyText] - 指定 `FileItem` 中作為「顯示文字 (label)」的欄位名稱，例如 `"ClassName"`
 * @param {string} [value] - 外部受控值，對應 `keyValue` 欄位的值；變更時會自動同步選取項目
 * @param {(value: FileItem) => void} [onSelect] - 選取選項後觸發的回調，回傳完整的 `FileItem` 物件
 * @param {string} [apiUrl] - 遠端資料來源 API URL；設定後元件掛載時自動 fetch 並覆蓋 `options`
 * @param {boolean} [haveBlank=true] - 是否在選項最前方插入空白「請選擇」選項，預設為 `true`
 * @param {string} [emptyText="請選擇"] - 未選擇時按鈕上顯示的提示文字，預設為 `"請選擇"`
 * @param {string} [widthCss="w-48"] - 控制按鈕寬度的 Tailwind CSS class，預設為 `"w-48"`
 * @param {'default' | 'vistaBlue'} [style1='default'] - 按鈕外觀風格，`'vistaBlue'` 為 Vista 藍色玻璃質感
 * @param {string} [className] - 額外注入按鈕的 Tailwind / CSS class，優先級高於內建樣式
 * @param {number} [refreshKey] - 監聽此值變化以強制重新抓取 API 資料（僅當 `apiUrl` 設定時有效）
 * @example
 * // 基本用法（靜態選項）
 * <MyDropDown
 *   options={[{ id: 1, name: "選項A" }, { id: 2, name: "選項B" }]}
 *   keyValue="id"
 *   keyText="name"
 *   onSelect={(item) => console.log(item)}
 * />
 *
 * @example
 * // 遠端 API 資料來源
 * <MyDropDown
 *   apiUrl="/api/classes"
 *   keyValue="ClassID"
 *   keyText="ClassName"
 *   value={selectedId}
 *   onSelect={(item) => setSelectedId(item.ClassID)}
 * />
 */
const MyDropDown: React.FC<DropdownProps> = ({ options, apiUrl, onSelect, keyValue, keyText, haveBlank = true, widthCss = "w-48"
  , emptyText = "請選擇", style1 = 'default', className = "", value, refreshKey }) => {


  // const [internalOptions, setInternalOptions] = useState<FileItem[]>(options || []);
  const [internalOptions, setInternalOptions] = useState<FileItem[]>(
    // 因為第一列要加入空白選項,所以options 傳入時也要經過transformToFormField轉換
    options ? transformToFormField(options, keyValue, keyText, haveBlank) : []
  );

  // 狀態：管理下拉選單是否展開
  const [isOpen, setIsOpen] = useState(false);
  // 狀態：儲存當前選擇的選項
  const [selectedOption, setSelectedOption] = useState<FileItem | null>(null);

  // 修正1: 當 value 或 internalOptions 改變時,同步更新 selectedOption
  useEffect(() => {
    if (value !== undefined && internalOptions.length > 0) {
      const found = internalOptions.find(opt =>
        String(keyValue ? opt[keyValue] : opt.value) === String(value)
      );
      if (found) {
        setSelectedOption(found);
      } else if (value === '' || value === null) {
        // 處理清空的情況
        setSelectedOption(null);
      }
    } else if (value === '' || value === null || value === undefined) {
      setSelectedOption(null);
    }
  }, [value, internalOptions, keyValue]);

  //  const [loading, setLoading] = useState(!!apiUrl); // 如果有 apiUrl，預設為加載中
  // 切換下拉選單展開/收起的函數
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // 使用 useRef 來參考下拉選單的 DOM 節點
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {

    if (apiUrl) {
      const fetchData = async () => {

        // setLoading(true);
        try {
 
         // console.log('drop 抓資料中');

          const response = await fetch(apiUrl);
          // const response = await fetch('/data2.json'); //抓在本地的json檔測試用
          if (!response.ok) {
            alert(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jsonData = await response.json();
          
          setInternalOptions(transformToFormField(jsonData, keyValue, keyText, haveBlank));
           
        } catch (error) {
          console.error('Error fetching data:', error);
          alert('資料取得失敗' + error);
        } finally {
          //setLoading(false);
        }
      };
      //dd
      fetchData()
    }
  }, [apiUrl, keyValue, keyText, haveBlank,refreshKey]); // 修正依賴陣列

  // 修正3: 當 options prop 改變時更新 internalOptions
  useEffect(() => {
    if (options && !apiUrl) {
      setInternalOptions(transformToFormField(options, keyValue, keyText, haveBlank));
    }
  }, [options, keyValue, keyText, haveBlank, apiUrl]);

  const handleSelect = (option: FileItem) => {
    setSelectedOption(option); // 更新當前選擇的選項
    if (onSelect) onSelect(option); // 觸發回調函數，傳遞選擇的值
    setIsOpen(false); // 收起下拉選單
  };

  const styles = {
    default: '',
    vistaBlue: 'vista-drop-blue',
  };


  return (
    VistaStyles(),
    <div className="relative inline-block text-center w-full ">
      <div id='btnPanel' className=' flex justify-center '>

        <button
          // className2={`relative flex items-center justify-center ${widthCss} rounded-md border   border-gray-300 shadow-sm px-4 py-2 bg-slate-100 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none 
          //   focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 `}
          //vista-drop-blue  abc2
          className={cn(
            `relative flex items-center justify-center ${widthCss} rounded-md border   border-gray-300 shadow-sm px-4 py-2 bg-slate-100 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  `,

            `${styles[style1] || styles.default}  ${className} `
          )}

          onClick={handleToggle} >
          {/* {selectedOption ? (keyText ? selectedOption[keyText] : selectedOption.name) : emptyText} */}
          {
            selectedOption
              ? (
                //  如果有傳入 keyText（代表你希望顯示某個欄位的文字），就用 selectedOption[keyText] 取出該欄位的值。
                // 如果沒傳 keyText，就用 selectedOption.name 取出 name 欄位的值。
                (keyText ? selectedOption[keyText] : selectedOption.name) === "請選擇"
                  ? emptyText
                  : (keyText ? selectedOption[keyText] : selectedOption.name)
              )
              : emptyText
          }
          <div className="absolute right-1">
            <SquareChevronDown
              //className="w-5 h-5   text-blue-300  "
              //  className={`w-5 h-5 ${styles[style1] || styles.default}   text-blue-300 `}
              className={`w-5 h-5  ${style1 === 'vistaBlue' ? 'text-blue-400' : 'text-blue-300'}`}
            />
            {/* <img src={`${import.meta.env.BASE_URL}arrow_d.png`} alt="icon" style={{ width: 20, height: 20 }} /> */}
          </div>
        </button>



      </div>

      {/* 下拉選單內容，僅在 isOpen 為 true 時顯示 */}
      {isOpen && (
        <div ref={dropdownRef} className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 
        focus:outline-none">
          <div className="py-1">
            {/* 渲染每個選項作為按鈕 */}
            {/* 如果沒有傳進 keyValue, keyText ,預設使用 option.value 和 option.name */}
            {/* 在這裡可以在前端先console.log internalOptions */}

            {internalOptions.map((option) => (
              <button
                key={keyValue ? option[keyValue] : option.value} // 根據 keyValue 判斷使用哪個 key
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                onClick={() => {
                  setIsOpen(false);
                  handleSelect(option);

                }
                }
              >
                {keyText ? option[keyText] : option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDropDown;