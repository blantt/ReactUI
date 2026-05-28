import React, { useState, useEffect } from 'react';

export interface Tab {
    id: string | number;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
}

export interface MyTabV2Props {
    /** 外部提供的 tabs 資料 */
    tabs: Tab[];
    /** 是否保持所有分頁的狀態（切換時不銷毀元件），預設為 false */
    keepAlive?: boolean;
    /** 預設選中的分頁 ID，若未提供則預設為第一個頁籤的 ID */
    defaultActiveId?: string | number;
    /** 頁籤切換時的回呼函式 */
    onChange?: (id: string | number) => void;
    /** 元件最外層容器的額外樣式類名 */
    className?: string;
    /** 下方內容區域的額外樣式類名 */
    contentClassName?: string;
}

const skewTabStyles = /* css */ `
        /* 1. 父容器：底色漸層與底部融合線 */
        .skew-tab-bar {
            display: flex;
            align-items: flex-end;
          /*  background: linear-gradient(to bottom, #b0c8d8, #d8e4ec); */
            padding: 0 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);  
            overflow: hidden;
            height: 48px;
            position: relative;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
        }

        /* 底部藍色融合線 */
        .skew-tab-bar::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 4px;
            background: #29ABE2;  
            z-index: 6;
            pointer-events: none;
            box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.08);
        }

        /* 2. 標籤本體 */
        .skew-tab-item {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 38px;
            min-width: 140px;
            margin-right: -5px;
            cursor: pointer;
            user-select: none;
            transition: transform 0.2s ease;
        }

        /* 3. 傾斜梯形：右半邊 (使用 ::before) */
        .skew-tab-item::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 12px;
            right: 0;
            background: linear-gradient(to bottom, #dce8f0, #c8d9e5);
            transform: skewX(-15deg);
            transform-origin: bottom left;
            border-radius: 0 6px 0 0;
            box-shadow: inset -1px 1px 0 rgba(255, 255, 255, 0.5), 3px 0 8px rgba(0, 0, 0, 0.1);
            transition: background 0.2s ease, box-shadow 0.2s ease;
            z-index: 1;
        }

        /* 4. 垂直邊角：左半邊 (使用 ::after) */
        .skew-tab-item::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 25px;
            background: linear-gradient(to bottom, #dce8f0, #c8d9e5);
            border-radius: 6px 0 0 0;
            box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.5), -1px 0 3px rgba(0, 0, 0, 0.03);
            transition: background 0.2s ease, box-shadow 0.2s ease;
            z-index: 1;
        }

        /* 滑鼠懸停效果 (非 Active) */
        .skew-tab-item:hover:not(.active)::before {
            background: linear-gradient(to bottom, #cddde8, #b8cdd9);
        }

        .skew-tab-item:hover:not(.active)::after {
            background: linear-gradient(to bottom, #cddde8, #b8cdd9);
        }

        .skew-tab-item:not(.active):hover {
            transform: translateY(-2px);
        }

        /* 5. 啟用 Active 樣式：漸變與底部融合 */
        .skew-tab-item.active::before {
            background: linear-gradient(to bottom, #29ABE2, #1a8fc0);
            box-shadow: inset -1px 1px 0 rgba(255, 255, 255, 0.35), 2px 0 8px rgba(41, 171, 226, 0.3);
        }

        .skew-tab-item.active::after {
            background: linear-gradient(to bottom, #29ABE2, #1a8fc0);
            box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.35);
        }

        /* 6. 標籤文字 */
        .skew-tab-label {
            position: relative;
            z-index: 10;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: #5a7a90;
            text-transform: uppercase;
            transition: color 0.2s;
            padding: 0 18px;
            white-space: nowrap;
        }

        .skew-tab-icon {
            display: inline-flex;
            align-items: center;
            line-height: 0;
        }

        /* 啟用中標籤文字 */
        .skew-tab-item.active .skew-tab-label {
            color: #ffffff;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        /* 懸浮中標籤文字 */
        .skew-tab-item:hover:not(.active) .skew-tab-label {
            color: #3a5f75;
        }

        /* 7. 內容漸顯動畫 */
        .skew-tab-content-pane {
            animation: skewFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes skewFadeIn {
            from {
                opacity: 0;
                transform: translateY(6px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
`;

const SkewTabStyles: React.FC = () => {
    useEffect(() => {
        const styleId = 'skew-tab-v2-styles';

        if (!document.getElementById(styleId)) {
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.innerHTML = skewTabStyles;
            document.head.appendChild(styleElement);
        }
    }, []);

    return null;
};

/**
 * ### MyTab_v2 斜角交疊頁籤元件 (Skewed Tab UI)
 *
 * 基於 Chrome 標籤風格設計的交疊式梯形頁籤。
 * 支援平滑過渡、Hover 浮動、底線融合，且能透過 `keepAlive` 決定是否保留子頁籤狀態。
 *
 * @example
 * <MyTab_v2
 *   tabs={[
 *     { id: 'server', label: 'Server Admin', content: <div>Server settings</div> },
 *     { id: 'web', label: 'Web Design', content: <div>Design assets</div> }
 *   ]}
 *   keepAlive
 *   onChange={(id) => console.log('Tab changed to:', id)}
 * />
 */
const MyTab_v2: React.FC<MyTabV2Props> = ({
    tabs,
    keepAlive = false,
    defaultActiveId,
    onChange,
    className = '',
    contentClassName = '',
}) => {
    // 管理選中的 Tab 狀態
    const [activeTab, setActiveTab] = useState<string | number>(
        defaultActiveId !== undefined ? defaultActiveId : (tabs[0]?.id || '')
    );

    // 追蹤滑鼠 Hover 狀態，用來動態微調 z-index 以利無限個標籤的正確交疊
    const [hoveredTabId, setHoveredTabId] = useState<string | number | null>(null);

    // 當外部 tabs 改變，或 defaultActiveId 改變時，自動調整 activeTab
    useEffect(() => {
        if (defaultActiveId !== undefined) {
            setActiveTab(defaultActiveId);
        } else if (tabs.length > 0 && !tabs.some((t) => t.id === activeTab)) {
            setActiveTab(tabs[0].id);
        }
    }, [defaultActiveId, tabs]);

    const handleTabClick = (id: string | number) => {
        setActiveTab(id);
        if (onChange) {
            onChange(id);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <SkewTabStyles />

            {/* Tab 頁籤標頭列 */}
            <div className="skew-tab-bar">
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.id;
                    const isHovered = hoveredTabId === tab.id;

                    // 計算 z-index：
                    // 預設情況下「左蓋右」（第一個 z-index 最大，依序遞減）
                    // 滑鼠懸浮 (hover) 時提升至 8
                    // 啟用 (active) 時提升至最高的 10
                    let zIndex = tabs.length - index;
                    if (isHovered) zIndex = 8;
                    if (isActive) zIndex = 10;

                    return (
                        <div
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            onMouseEnter={() => setHoveredTabId(tab.id)}
                            onMouseLeave={() => setHoveredTabId(null)}
                            className={`skew-tab-item ${isActive ? 'active' : ''}`}
                            style={{ zIndex }}
                        >
                            <span className="skew-tab-label">
                                {tab.icon ? <span className="skew-tab-icon">{tab.icon}</span> : null}
                                <span>{tab.label}</span>
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* 下方內容面板區 */}
            <div className={`bg-white rounded-b-lg shadow-xl p-8 border border-gray-200 min-h-[200px] ${contentClassName}`}>
                {keepAlive ? (
                    tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className="skew-tab-content-pane"
                            style={{ display: activeTab === tab.id ? 'block' : 'none' }}
                        >
                            {tab.content}
                        </div>
                    ))
                ) : (
                    <div className="skew-tab-content-pane">
                        {tabs.find((tab) => tab.id === activeTab)?.content}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTab_v2;
