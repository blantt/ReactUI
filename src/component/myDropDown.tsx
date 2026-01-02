import React, { useState } from 'react';

// 定義下拉選單元件的屬性介面
interface DropdownProps {
  options: FileItem[]; // 下拉選單的選項陣列
  onSelect: (value: FileItem) => void; // 當選擇選項時觸發的回調函數
  keyValue?: string; // 可選的當前選擇值
  keyText?: string; // 可選的顯示文字
}

//FileItem 預計是dropdown選項的型別 
// export interface FileItem {
//     name: string;
//     value: string;
// }

export interface FileItem {
    [key: string]: any;
}

const MyDropDown: React.FC<DropdownProps> = ({ options, onSelect, keyValue, keyText }) => {
  // 狀態：管理下拉選單是否展開
  const [isOpen, setIsOpen] = useState(false);
  // 狀態：儲存當前選擇的選項
  const [selectedOption, setSelectedOption] = useState<FileItem | null>(null);

  // 切換下拉選單展開/收起的函數
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  
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
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* 渲染每個選項作為按鈕 */}
            {/* 如果沒有傳進 keyValue, keyText ,預設使用 option.value 和 option.name */}
            {options.map((option) => (
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