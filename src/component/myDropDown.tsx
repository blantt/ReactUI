import React, { useState, useEffect,useRef } from 'react';

// 定義下拉選單元件的屬性介面
interface DropdownProps {
  options?: FileItem[]; // 下拉選單的選項陣列
  onSelect: (value: FileItem) => void; // 當選擇選項時觸發的回調函數
  keyValue?: string; // 可選的當前選擇值
  keyText?: string; // 可選的顯示文字
  apiUrl?: string; // API 資料來源 URL
  haveBlank?: boolean; // 是否包含空白選項
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

export const transformToFormField = (data: any[], keyValue?: string, keyText?: string,haveBlank: boolean = true
) => {

    const transformedData = data.map((item,itemIndex) => {
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
  if(!haveBlank){
    return transformedData;
  } else {

    return [blankOption, ...transformedData];
  }
   

};

const MyDropDown: React.FC<DropdownProps> = ({ options, apiUrl, onSelect, keyValue, keyText, haveBlank = true }) => {
  
 
  // const [internalOptions, setInternalOptions] = useState<FileItem[]>(options || []);
  const [internalOptions, setInternalOptions] = useState<FileItem[]>(
    // 因為第一列要加入空白選項,所以options 傳入時也要經過transformToFormField轉換
  options ? transformToFormField(options, keyValue, keyText,haveBlank) : []
);

  // 狀態：管理下拉選單是否展開
  const [isOpen, setIsOpen] = useState(false);
  // 狀態：儲存當前選擇的選項
  const [selectedOption, setSelectedOption] = useState<FileItem | null>(null);
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
         console.log('com in apiUrl:', internalOptions);
    }

    if (options) { 
         //==如果是options 傳入的,第一行也加入一個空白選項
        // setInternalOptions(transformToFormField(options, keyValue, keyText));
        
         console.log('com in options:', internalOptions);
    }

    if (apiUrl) {
      const fetchData = async () => {
         
        // setLoading(true);
        try {

          const response = await fetch(apiUrl);
          // const response = await fetch('/data2.json'); //抓在本地的json檔測試用
          if (!response.ok) {
            alert(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jsonData = await response.json();
          // console.log('drop jsonData:', jsonData);
          // options = transformToFormField(jsonData, keyValue, keyText);
          setInternalOptions(transformToFormField(jsonData, keyValue, keyText,haveBlank));
          // console.log('com in apichange:', internalOptions);
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
  }, [internalOptions,apiUrl,options]);


  const handleSelect = (option: FileItem) => {
    setSelectedOption(option); // 更新當前選擇的選項
    onSelect(option); // 觸發回調函數，傳遞選擇的值
    setIsOpen(false); // 收起下拉選單
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        {/* 按鈕：用於切換下拉選單 */}
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleToggle}
        >
          {/* 顯示當前選擇的選項或預設提示文字 */}
          {selectedOption ? (keyText ? selectedOption[keyText] : selectedOption.name) : '請選擇一個選項'}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* 下拉選單內容，僅在 isOpen 為 true 時顯示 */}
      {isOpen && (
        <div ref={dropdownRef} className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 
        focus:outline-none">
          <div className="py-1">
            {/* 渲染每個選項作為按鈕 */}
            {/* 如果沒有傳進 keyValue, keyText ,預設使用 option.value 和 option.name */}
            {/* 在這裡可以在前端先console.log internalOptions */}
             
            {internalOptions.map((option) => (
              <button
                key={keyValue ? option[keyValue] : option.value} // 根據 keyValue 判斷使用哪個 key
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                onClick={() => handleSelect(option)}
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