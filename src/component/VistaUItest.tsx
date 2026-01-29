import React, { useState, useEffect, useRef } from 'react';
import { Info, ChevronDown, X, Square, Minus, Monitor, Settings, ShieldCheck } from 'lucide-react';

// --- 自定義 CSS 樣式 (模擬 Vista 複雜的漸層) ---
// 如果之後這css 樣式,也想有 css 提式,可以用擴充 如 "es6-string-html" 或 "Lit-html" 等外安裝後，您只需要在字串前加上一個註解標籤，編輯器就會把它當作 CSS 來處理：
const styles =  /* css */`
  .aero-blur {
    
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
  }

   

  .vista-glossy-bg {
    background: linear-gradient(to bottom, 
      rgba(255,255,255,0.5) 0%, 
      rgba(255,255,255,0.1) 50%, 
      rgba(255,255,255,0.05) 51%, 
      rgba(255,255,255,0.2) 100%
    );
  }

  
  .vista-btn-gradient {
    background: linear-gradient(to bottom, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 51%, #9ca3af 100%);
    border: 1px solid #717171;
    box-shadow: inset 0 1px 0 white;
  }

  .vista-btn-gradient:hover {
    background: linear-gradient(to bottom, #ebf5ff 0%, #c3e0ff 50%, #99ccff 51%, #66b2ff 100%);
    border-color: #3b82f6;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 0 10px rgba(59, 130, 246, 0.4);
  }

  .vista-btn-primary {
    background: linear-gradient(to bottom, #60a5fa 0%, #3b82f6 50%, #2563eb 51%, #1d4ed8 100%);
    border-color: #1e3a8a;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
  }

  /* 新增：黑金屬風格 (Obsidian) */
  .vista-btn-black {
    background: linear-gradient(to bottom, #4b5563 0%, #1f2937 50%, #111827 51%, #000000 100%);
    border-color: #000;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    color: #e5e7eb;
  }
  .vista-btn-black:hover {
    border-color: #60a5fa;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 0 12px rgba(255, 255, 255, 0.2);
  }

  .text-shadow-sm {
    text-shadow: 0 1px 1px rgba(0,0,0,0.3);
  }

`;


/**
 * 樣式注入組件
 * 在外部使用時，請在 App 根部渲染此組件一次
 */
// export const VistaStyles = () => <style>{styles}</style>;


/**
 * 智慧型樣式注入組件
 * 確保 CSS 只會被注入到 <head> 中一次，無論組件被呼叫幾次。
 */
export const VistaStyles = () => {
    useEffect(() => {
        const styleId = 'vista-aero-styles-singleton';
        if (!document.getElementById(styleId)) {
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }, []);

    return null; // 不在組件位置渲染任何東西
};

// --- 子元件：Aero 按鈕 ---
interface AeroButtonProps {
    children: React.ReactNode;
    primary?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    variant?: 'default' | 'primary' | 'black';
}

export const AeroButton: React.FC<AeroButtonProps> = ({ children, primary, onClick
    , className = "", variant = 'default' }) => {
    const variants = {
        default: 'vista-btn-default',
        primary: 'vista-btn-primary text-shadow-sm',
        black: 'vista-btn-black text-shadow-sm',
    };
    return (
        <>
            <VistaStyles />
            <button
                onClick={onClick}
                className={`
      px-5 py-1 text-sm font-medium rounded-sm transition-all active:opacity-80
      ${primary ? 'vista-btn-primary text-white text-shadow-sm' : 'vista-btn-gradient text-gray-800'}
       ${variants[variant] || variants.default}
      ${className}
    `}
            >
                {children}
            </button>
        </>
    )


};

// --- 子元件：標籤頁 (Tabs) ---
interface AeroTabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onChange: (id: string) => void;
}
export const AeroTabs: React.FC<AeroTabsProps> = ({ tabs, activeTab, onChange }) => (
    <div className="flex border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`
          px-4 py-1.5 text-sm transition-all relative top-[1px]
          ${activeTab === tab.id
                        ? 'bg-white border border-gray-300 border-bottom-white rounded-t-md text-gray-800 font-semibold shadow-[-2px_-2px_5px_rgba(0,0,0,0.05)]'
                        : 'text-gray-600 hover:bg-white/30 border border-transparent'}
        `}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

// --- 子元件：下拉選單 ---
type DropdownOption =
    | { label: string; type?: string }
    | { type: 'divider'; label?: string };
interface AeroDropdownProps {
    options: DropdownOption[];
    label: string;
}

export const AeroDropdown: React.FC<AeroDropdownProps> = ({ options, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* 如果這裡直接加入 VistaStyles ,就代表外部使用就不用再入這css樣式了,開箱即用 */}
            <VistaStyles />
            <AeroButton onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
                {label} <ChevronDown size={12} />
            </AeroButton>

            {isOpen && (
                <div className="absolute mt-1 w-56 aero-blur bg-white/90 border border-gray-400 rounded shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {options.map((opt, idx) => (
                        <React.Fragment key={idx}>
                            {opt.type === 'divider' ? (
                                <div className="border-t border-gray-300 my-1" />
                            ) : (
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {opt.label}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- 主元件：App ---
export default function App() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: '一般設定' },
        { id: 'appearance', label: '外觀個人化' },
        { id: 'advanced', label: '進階系統' },
    ];

    const themeOptions: DropdownOption[] = [
        { label: 'Windows Aero (預設)' },
        { label: 'Windows Vista 標準' },
        { label: 'Windows 基本風格' },
        { type: 'divider' },
        { label: '高對比度黑色' },
        { label: '傳統 Windows 樣式' },
    ];

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-blue-900 via-blue-500 to-green-400">
            <style>{styles}</style>

            {/* 視窗本體 */}
            <div className="aero-blur w-full max-w-3xl rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/40 flex flex-col">

                {/* 標題列 */}
                <div className="vista-glossy-bg px-4 py-2.5 flex items-center justify-between select-none border-b border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="p-1 bg-gradient-to-br from-blue-400 to-blue-700 rounded shadow-inner border border-white/30">
                            <Monitor size={16} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 drop-shadow-sm">個人化外觀設定</span>
                    </div>

                    <div className="flex gap-1.5">
                        <button className="w-7 h-5 flex items-center justify-center bg-black/5 hover:bg-white/30 border border-black/10 rounded-sm transition-colors"><Minus size={14} /></button>
                        <button className="w-7 h-5 flex items-center justify-center bg-black/5 hover:bg-white/30 border border-black/10 rounded-sm transition-colors"><Square size={10} /></button>
                        <button className="w-12 h-5 flex items-center justify-center bg-red-500/70 hover:bg-red-500 border border-red-400/50 rounded-sm text-white transition-colors"><X size={14} /></button>
                    </div>
                </div>

                {/* 內容區塊 */}
                <div className="bg-white/85 p-8 flex-1 min-h-[400px]">

                    <AeroTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* 左側：表單與控制項 */}
                        <div className="space-y-6">
                            <section>
                                <h3 className="flex items-center gap-2 text-md font-bold text-gray-800 mb-4">
                                    <Settings size={18} className="text-blue-600" /> 介面選項
                                </h3>
                                <div className="space-y-4 pl-2">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-gray-600">目前的配色方案：</label>
                                        <AeroDropdown label="Windows Aero (透明)" options={themeOptions} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="transparency" defaultChecked className="w-4 h-4 rounded border-gray-400" />
                                        <label htmlFor="transparency" className="text-sm text-gray-700">啟用透明效果 (Glass)</label>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-md font-bold text-gray-800 mb-4">
                                    操作測試
                                </h3>
                                <div className="flex gap-4 pl-2">
                                    <AeroButton onClick={() => console.log('Apply')}>套用</AeroButton>
                                    <AeroButton primary onClick={() => console.log('Confirm')}>確定</AeroButton>
                                </div>
                            </section>
                        </div>

                        {/* 右側：預覽與資訊 */}
                        <div className="space-y-6">
                            <div className="p-1 bg-gray-200 border border-gray-400 rounded shadow-inner">
                                <div className="aspect-video bg-gradient-to-br from-blue-300 to-blue-500 rounded flex items-center justify-center text-white/50 overflow-hidden relative">
                                    <div className="absolute inset-0 aero-blur scale-75 border border-white/50 rounded-lg shadow-2xl"></div>
                                    <span className="relative z-10 text-xs font-bold uppercase tracking-widest">Aero Preview</span>
                                </div>
                            </div>

                            <div className="p-4 rounded border border-blue-200 bg-blue-50/50 flex gap-4">
                                <ShieldCheck size={24} className="text-blue-500 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900">安全性提示</h4>
                                    <p className="text-xs text-blue-800 leading-relaxed mt-1">
                                        變更某些視覺效果可能會影響系統效能。若您的視訊卡不支援硬體加速，玻璃效果將會自動停用。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 狀態列 */}
                <div className="bg-gray-100/90 border-t border-gray-300 px-4 py-1.5 text-[11px] text-gray-500 flex justify-between items-center">
                    <div className="flex gap-4">
                        <span>正在運行：AeroGlassEngine.exe</span>
                        <span>GPU 負載：14%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Info size={10} />
                        <span>就緒</span>
                    </div>
                </div>
            </div>
        </div>
    );
}