import React, { useState, useEffect, useRef } from 'react';
/**
 * 提示：這兩個套件需要手動安裝，請在終端機執行：
 * npm install tailwind-merge clsx
 * 或者使用 yarn:
 * yarn add tailwind-merge clsx
 */
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';


const styles =  /* css */` 
        .vista-btn-blue {
            background: linear-gradient(to bottom, 
               rgba(212,240,255,0.5) 0%, 
                rgba(124, 174, 207,0.5) 50%, 
                rgba(124, 174, 207,0.5) 51%, 
                rgba(124, 174, 207,0.5) 100%
            );
            border: 1px solid #717171;
            box-shadow: inset 0 1px 0 white;
        }
         /* 增加滑鼠懸停效果，讓 Vista 感更強 */
          .vista-btn-blue:hover {
            filter: brightness(1.05);
            box-shadow: inset 0 1px 0 white, 0 0 5px rgba(124, 174, 207, 0.8);
          }

        /* 3. 山茶紅 (Camellia Red) */
          .vista-btn-red {
            background: linear-gradient(to bottom, 
                #fee2e2 0%, 
                #fca5a5 50%, 
                #fca5a5 51%, 
                #fca5a5 100%
            );
            
            border: 1px solid #770404;
          }
           
          .vista-btn-red:hover {
            filter: brightness(1.05);
            box-shadow: inset 0 1px 0 white, 0 0 5px rgba(252, 165, 165, 0.8);
          }

           /* 2. 天空藍 (Sky Blue) */
          .vista-btn-skyblue {
            background: linear-gradient(to bottom, 
                #e0f2fe 0%, 
                #7dd3fc 50%, 
                #7dd3fc 51%, 
                #7dd3fc 100%
            );
             
            border: 1px solid #035277;
          }
          .vista-btn-skyblue:hover {
            filter: brightness(1.05);
            box-shadow: inset 0 1px 0 white, 0 0 5px rgba(125, 211, 252, 0.8);
          }
 

          /* 4. 琥珀黃 (Amber Yellow) */
          .vista-btn-yellow {
            background: linear-gradient(to bottom, 
                #fef3c7 0%, 
                #fcd34d 50%, 
                #fcd34d 51%, 
                #fcd34d 100%
            );
            
            border: 1px solid #bd9103;
          }
          .vista-btn-yellow:hover {
            filter: brightness(1.05);
            box-shadow: inset 0 1px 0 white, 0 0 5px rgba(252, 211, 77, 0.8);
          }

          /* 5. 銀灰白 (Silver Gray) */
          .vista-btn-gray {
            background: linear-gradient(to bottom, 
                #f9fafb 0%, 
                #d1d5db 50%, 
                #d1d5db 51%, 
                #d1d5db 100%
            );
             
            border: 1px solid #6e7b8d;
          }
          .vista-btn-gray:hover {
            filter: brightness(1.03);
            box-shadow: inset 0 1px 0 white, 0 0 5px rgba(209, 213, 219, 0.6);
          }

     `;
export const VistaStyles = () => {
    useEffect(() => {
        const styleId = 'vista-btn-styles';
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

type ButtonProps = {
    label: string; // label 是字串
    icon?: React.ReactNode; // icon 是可選的 React 節點
    className?: string;
    style1?: 'default' | 'vistaBlue' | 'vistaRed' | 'vistaSkyBlue' | 'vistaYellow' | 'vistaGray';
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 允許帶 event
};


export const Button = ({ label, icon, onClick, style1 = 'default', className = "" }: ButtonProps) => {

    const styles = {
        default: '',
        vistaBlue: 'vista-btn-blue',
        vistaRed: 'vista-btn-red',
        vistaSkyBlue: 'vista-btn-skyblue',
        vistaYellow: 'vista-btn-yellow',
        vistaGray: 'vista-btn-gray',

    };

    return (
        VistaStyles(),
        <button onClick={onClick}

            className={cn(
                `inline-flex items-center bg-slate-100 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800
         hover:bg-sky-200 focus:outline-none focus:ring-2 
         focus:ring-offset-2 focus:ring-gray-500`,

                `${styles[style1] || styles.default}  ${className}`
            )}

        >


            {icon && <span className="mr-2">{icon}</span>}

            <span>{label}</span>

        </button>


    );
};


// type ButtonProps2 = {
//     label: string; // label 是字串
//     icon?: React.ReactNode; // icon 是可選的 React 節點
//     className?: string;
//     style1?: 'default' | 'vistaBlue';
//     onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 允許帶 event
// };


// export const Button2 = ({ label, icon, onClick, style1 = 'default', className = "" }: ButtonProps2) => {

//     const styles = {
//         default: '',
//         vistaBlue: 'vista-btn-blue',
//     };

//     return (
//         VistaStyles(),
//         <button onClick={onClick}

//             className={cn(
//                 `inline-flex items-center bg-slate-100 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800
//          hover:bg-sky-200 focus:outline-none focus:ring-2 
//          focus:ring-offset-2 focus:ring-gray-500`,

//                 `${styles[style1] || styles.default}  ${className}`
//             )}

//         >


//             {icon && <span className="mr-2">{icon}</span>}

//             <span>{label}</span>

//         </button>


//     );
// };


export default Button;
