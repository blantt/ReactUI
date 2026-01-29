import React from 'react';
/**
 * 提示：這兩個套件需要手動安裝，請在終端機執行：
 * npm install tailwind-merge clsx
 * 或者使用 yarn:
 * yarn add tailwind-merge clsx
 */
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

/**
 * 封裝一個 cn (className) 工具函數
 * 這能解決 Tailwind 類別順序衝突的問題，確保外部傳入的 className 優先級最高
 */
function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

type ButtonProps = {
    label: string; // label 是字串
    className?: string;
    onClick?: () => void; // onClick 是一個函式，無參數且無回傳值 
};


export const Button = ({ label, onClick, className = "" }: ButtonProps) => {
    return (
        <button
    //         className={`
    //   px-5 py-1 text-sm font-medium rounded-sm transition-all active:opacity-80
    //   ${primary ? 'vista-btn-primary text-white text-shadow-sm' : 'vista-btn-gradient text-gray-800'}
    //    ${variants[variant] || variants.default}
    //   ${className}
    // `}
          
     className={cn(
        `bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700`,
        className
      )}
    // className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ${className}`}
            onClick={onClick}  >
            {label}
        </button>
    );
};

type ButtonProps2 = {
    label: string; // label 是字串
    icon?: React.ReactNode; // icon 是可選的 React 節點
    className?: string;
     onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 允許帶 event
};


export const Button2 = ({ label, icon, onClick, className = "" }: ButtonProps2) => {
 
    return (
         
        <button onClick={onClick}
   
 className={cn(
        `inline-flex items-center bg-slate-100 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800
         hover:bg-sky-200 focus:outline-none focus:ring-2 
         focus:ring-offset-2 focus:ring-gray-500`,
        className
      )}
 
        >


            {icon && <span className="mr-2">{icon}</span>}

            <span>{label}</span>
           
        </button>


    );
};


export default Button;
