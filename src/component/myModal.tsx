import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  myHeader?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  height?: string;
  isAnimating?: boolean;
   
}
/**
 * ### myModal 元件
 * @param {boolean} isOpen - 控制 Modal 的開啟與關閉
 * @param {() => void} onClose - 關閉 Modal 時觸發的函式
 * @param {string} [title] - Modal 的標題
 * @param {React.ReactNode} [children] - Modal 的內容
 * @param {React.ReactNode} [myHeader] - 自訂的 Modal 標頭，如果提供，將會取代預設的 title
 * @param {React.ReactNode} [footer] - 自訂的 Modal 頁腳
 * @param {string} [width] - 設定 Modal 的寬度 (例如: 'w-1/2', 'max-w-lg')
 * @param {string} [height] - 設定 Modal 的高度
 * @param {boolean} [isAnimating] - 是否啟用動畫效果
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, myHeader, footer, width, height }) => {
  if (!isOpen) return null;

  return (
    <div className="      fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`  flex flex-col bg-white rounded-lg shadow-lg  min-w-80 ${width || ''} ${height || ''} `}>
        {/* Header */}
        <div className="relative px-2 py-1 border-b border-gray-200 flex items-center justify-center">
           {myHeader ? myHeader : <h2 className="text-center text-base font-semibold text-slate-800">{title}</h2>}
          {/* <h2 className="text-base text-center font-medium">{title}</h2> */}
          <button
            onClick={onClose}
            className="absolute right-2 text-gray-500 hover:text-gray-700 focus:outline-none text-xl"
          >
            ×
          </button>
        </div>
         
        {/* Body */}
        <div className=" flex-1  p-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
         <div className="flex items-center justify-end   bg-slate-50/50 px-6 py-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};


 
export default Modal;