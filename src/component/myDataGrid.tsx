import React, { useState, useEffect, useRef } from 'react';
import { LoadingInline } from '../component/myload';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

const styles =  /* css */` 
        .vistaBlue {
            background: linear-gradient(to bottom, 
               rgba(212,240,255,0.5) 0%, 
                rgba(124, 174, 207,0.5) 50%, 
                rgba(124, 174, 207,0.5) 51%, 
                rgba(124, 174, 207,0.5) 100%
            );
            border: 1px solid #717171;
            box-shadow: inset 0 1px 0 white;
        }
  
     `;

export const gridStyles = () => {
    useEffect(() => {
        const styleId = 'vistaBlue-styles';
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

interface ColumnType {
    name: string;
    colSpan?: number;
    subSearch?: boolean; // 是否啟用單一欄位搜尋
}

type DataGridProps = {
    columns: Array<{
        name: string; // 欄位名稱
        showname?: string; // 顯示名稱
        colSpan?: number; // 欄位寬度
        widthcss?: string; // 自定義寬度樣式
        type: string; // 欄位型態，例如 "input"、"hyperlink"、"empty"
        visible?: boolean; // 控制欄位是否可見
        transform?: (value: any) => FormField; // 動態轉換函數
        subSearch?: boolean; // 是否啟用單一欄位搜尋
    }>;

    data?: Array<Record<string, FormField>>; // 直接傳入的資料（已轉換好的 FormField 格式）
    rawData?: any[]; // 傳入原始 JSON，元件內部自動以 columns 轉換（擇一使用）
    setTransformedData?: (data: Array<Record<string, FormField>>) => void; // rawData 轉換完後的回調，可取得轉換結果做細部調整
    apiUrl?: string; // API 資料來源 URL
    className?: string; // 自定義樣式
    gridCols?: number; // 動態控制grid列數
    PageSize?: number; // 分頁大小
    useSearch?: boolean; // 是否啟用搜尋功能
    useSubSearch?: boolean; // 是否啟用搜尋功能
    havecheckbox?: boolean; // 是否顯示checkbox欄位
    useBar?: boolean; // 是否使用進度條
    useXBar?: boolean; // 是否使用橫向捲動軸
    keycol?: string; // 指定每列的唯一鍵值欄位名稱
    onCheckItemsChange?: (items: Array<Record<string, FormField>>) => void; // 新增選取項目變更回調
    onRowClick?: (row: Record<string, FormField>) => void; // 新增點擊事件
    checkedItems_old?: Array<Record<string, FormField>>; // 新增這行
    customTransform?: (item: any, col: DataGridProps['columns'][number]) => FormField; // 新增自定義轉換邏輯
    onlyCheckedItems?: boolean; // 是否只顯示已勾選的項目
    haveCredentials?: boolean; // 是否包含憑證(後端可讀取到session)
    textSize?: string; // 字體大小，例如 "text-sm"、"text-base" 等 Tailwind CSS 類別
    classNameHeader?: string; // 表頭的自定義樣式
    classItem?: string; // 單元格的自定義樣式
    borderColor?: string; // 邊框顏色，例如 "border-gray-300"、"border-blue-500" 等 Tailwind CSS 類別
    styleHeader?: 'default' | 'empty' | 'yellow' | 'vistaBlue' | 'green1' | 'green2' | 'white1';
    refreshKey?: number; // ← 如外部要強制重抓資料時
};

export const transformToFormField = (
    data: any[],
    columns: DataGridProps['columns'],
    customTransform?: (item: any, col: DataGridProps['columns'][number]) => FormField
) => {
    return data.map((item) => {
        const transformedRow: Record<string, FormField> = {};
        columns.forEach((col) => {
            const value = item[col.name];
            transformedRow[col.name] = customTransform
                ? customTransform(item, col)
                : col.transform
                    ? col.transform(value)
                    : { name: col.name, value: String(value ?? ''), type: col.type };
        });
        return transformedRow;
    });
};

// ============================================================================
// Custom Hooks (將 Side Effects 與特化狀態抽離)
// ============================================================================

/**
 * Custom Hook: 處理 DataGrid 資料來源（direct data / rawData / apiUrl）
 */
function useDataGridSource({
    data,
    rawData,
    apiUrl,
    columns,
    customTransform,
    setTransformedData,
    haveCredentials,
    refreshKey,
    onDataChange,
}: {
    data?: Array<Record<string, FormField>>;
    rawData?: any[];
    apiUrl?: string;
    columns: DataGridProps['columns'];
    customTransform?: DataGridProps['customTransform'];
    setTransformedData?: DataGridProps['setTransformedData'];
    haveCredentials?: boolean;
    refreshKey?: number;
    onDataChange?: () => void;
}) {
    const [internalData, setInternalData] = useState<Array<Record<string, FormField>>>(data || []);
    const [loading, setLoading] = useState(!!apiUrl);

    // 1. rawData 變化時自動轉換
    useEffect(() => {
        if (rawData) {
            const transformed = transformToFormField(rawData, columns, customTransform);
            if (setTransformedData) {
                setTransformedData(transformed);
            }
            setInternalData([...transformed]);
            onDataChange?.();
        }
    }, [rawData, columns, customTransform, refreshKey]);

    // 2. 外部直接傳入 data 改變時同步更新 internalData
    useEffect(() => {
        if (data) {
            setInternalData(data || []);
            onDataChange?.();
        }
    }, [data]);

    // 3. API 來源或刷新 key 改變時發起 fetch
    useEffect(() => {
        if (apiUrl) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const fetchOptions: RequestInit = {};
                    if (haveCredentials) {
                        fetchOptions.credentials = 'include';
                    }
                    const response = await fetch(apiUrl, fetchOptions);
                    if (!response.ok) {
                        alert(`HTTP error! status: ${response.status}`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const jsonData = await response.json();
                    const transformedData = transformToFormField(jsonData, columns, customTransform);

                    if (setTransformedData) {
                        setTransformedData(transformedData);
                    }

                    setTimeout(() => {
                        setInternalData(transformedData);
                        setLoading(false);
                    }, 0);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    alert('資料取得失敗' + error);
                }
            };
            fetchData();
        }
    }, [apiUrl, columns, customTransform, refreshKey, haveCredentials]);

    return { internalData, loading, setInternalData };
}

/**
 * Custom Hook: 處理浮動水平捲軸 (Floating Horizontal Scrollbar) 雙向同步
 */
function useFloatingScroll(useXBar: boolean, internalData: any[]) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const floatingBarRef = useRef<HTMLDivElement>(null);
    const floatingBarInnerRef = useRef<HTMLDivElement>(null);
    const isSyncingRef = useRef(false);
    const [showFloatingBar, setShowFloatingBar] = useState(false);
    const [floatingBarRect, setFloatingBarRect] = useState({ left: 0, width: 0 });

    useEffect(() => {
        if (!useXBar) return;

        const container = scrollContainerRef.current;
        const floatingBar = floatingBarRef.current;
        const floatingBarInner = floatingBarInnerRef.current;
        if (!container || !floatingBar || !floatingBarInner) return;

        const updateInnerWidth = () => {
            floatingBarInner.style.width = `${container.scrollWidth}px`;
            setShowFloatingBar(container.scrollWidth > container.clientWidth);
        };

        const updatePosition = () => {
            const rect = container.getBoundingClientRect();
            setFloatingBarRect({ left: rect.left, width: rect.width });
        };

        updateInnerWidth();
        updatePosition();

        const handleContainerScroll = () => {
            if (isSyncingRef.current) return;
            isSyncingRef.current = true;
            floatingBar.scrollLeft = container.scrollLeft;
            requestAnimationFrame(() => { isSyncingRef.current = false; });
        };

        const handleFloatingScroll = () => {
            if (isSyncingRef.current) return;
            isSyncingRef.current = true;
            container.scrollLeft = floatingBar.scrollLeft;
            requestAnimationFrame(() => { isSyncingRef.current = false; });
        };

        container.addEventListener('scroll', handleContainerScroll);
        floatingBar.addEventListener('scroll', handleFloatingScroll);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        const resizeObserver = new ResizeObserver(() => {
            updateInnerWidth();
            updatePosition();
        });
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener('scroll', handleContainerScroll);
            floatingBar.removeEventListener('scroll', handleFloatingScroll);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
            resizeObserver.disconnect();
        };
    }, [useXBar, internalData]);

    return {
        scrollContainerRef,
        floatingBarRef,
        floatingBarInnerRef,
        showFloatingBar,
        floatingBarRect,
    };
}

/**
 * Custom Hook: 處理 Checkbox 勾選與選取狀態管理
 */
function useGridSelection(
    checkedItems_old: Array<Record<string, FormField>> | undefined,
    keyColumn: string | undefined,
    onCheckItemsChange?: (items: Array<Record<string, FormField>>) => void
) {
    const [checkItems, setCheckItems] = useState<Array<Record<string, FormField>>>([]);

    const handleCheck = (item: Record<string, FormField>, checked: boolean) => {
        let newChecked: Array<Record<string, FormField>>;
        if (checked) {
            newChecked = [...checkItems, item];
        } else {
            if (keyColumn) {
                newChecked = checkItems.filter(i => i[keyColumn]?.value !== item[keyColumn]?.value);
            } else {
                newChecked = checkItems;
            }
        }
        setCheckItems(newChecked);
        if (onCheckItemsChange) {
            onCheckItemsChange(newChecked);
        }
    };

    // 外部 checkedItems_old 改變時同步寫入內部 state
    useEffect(() => {
        if (checkedItems_old && Array.isArray(checkedItems_old)) {
            setCheckItems(checkedItems_old);
        }
    }, [checkedItems_old]);

    return { checkItems, handleCheck };
}

// ============================================================================
// 主組件 DataGridApi
// ============================================================================

/**
 * 通用 datagrid 元件 - 高度自定義化
 */
const DataGridApi: React.FC<DataGridProps> = ({
    columns,
    data,
    rawData,
    setTransformedData,
    apiUrl,
    className,
    PageSize,
    havecheckbox = false,
    onlyCheckedItems = false,
    useBar = false,
    useXBar = false,
    useSearch = false,
    keycol,
    gridCols,
    checkedItems_old,
    onCheckItemsChange,
    onRowClick,
    customTransform,
    useSubSearch = false,
    haveCredentials = false,
    textSize = "text-sm",
    classNameHeader = "",
    classItem = "",
    refreshKey,
    borderColor = "border-slate-700",
    styleHeader = 'default'
}) => {
    // ── 1. 樣式與參數設定 ──────────────────────────
    const styles = {
        default: ' bg-gradient-to-br from-indigo-100 to-blue-200 backdrop-blur-xl shadow-lg ',
        empty: ' nocss',
        yellow: ' bg-gradient-to-br from-orange-100/80 to-orange-200/80 backdrop-blur-xl shadow-lg ',
        green1: ' bg-gradient-to-br from-lime-50/90 to-emerald-100/80 text-emerald-900 ',
        green2: ' bg-gradient-to-br from-emerald-50/80 to-teal-100/80 text-emerald-900 ',
        white1: ' bg-gradient-to-br from-slate-50/80 to-slate-200/80 text-slate-800 ',
        vistaBlue: 'vistaBlue',
    };

    let cssUserbar = "";
    if (useBar) {
        PageSize = 10000;
        cssUserbar += " h-full overflow-y-auto ";
    }
    if (useXBar) {
        cssUserbar += " w-full overflow-x-auto min-w-0 ";
    }
    let itemsPerPage = PageSize || 5;
    const keyColumn = keycol || (columns.length > 0 ? columns[0].name : undefined);

    // ── 2. Local State ──────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [subSearchTexts, setSubSearchTexts] = useState<Record<string, string>>({});

    // ── 3. Custom Hooks (資料來源、浮動捲軸、勾選管理) ──────────────────────────
    const { internalData, loading } = useDataGridSource({
        data,
        rawData,
        apiUrl,
        columns,
        customTransform,
        setTransformedData,
        haveCredentials,
        refreshKey,
        onDataChange: () => setCurrentPage(1),
    });

    const {
        scrollContainerRef,
        floatingBarRef,
        floatingBarInnerRef,
        showFloatingBar,
        floatingBarRect
    } = useFloatingScroll(useXBar, internalData);

    const { checkItems, handleCheck } = useGridSelection(
        checkedItems_old,
        keyColumn,
        onCheckItemsChange
    );

    // ── 4. useEffect 集中區 (頁碼與搜尋條件聯動) ──────────────────────────
    useEffect(() => {
        setCurrentPage(1);
    }, [apiUrl, refreshKey, searchText, subSearchTexts]);

    // ── 5. 事件處理器 (Handlers) ──────────────────────────
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSubSearchChange = (colName: string, value: string) => {
        setSubSearchTexts(prev => ({
            ...prev,
            [colName]: value
        }));
    };

    // ── 6. 資料過濾與分頁計算 (Derived State) ──────────────────────────
    let filteredData1 = internalData;
    if (useSearch && searchText.trim() !== '') {
        filteredData1 = internalData.filter(item => {
            return Object.values(item).some(field =>
                field.value?.toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }

    if (useSubSearch) {
        const activeSubSearches = Object.entries(subSearchTexts).filter(([, value]) => value.trim() !== '');

        if (activeSubSearches.length > 0) {
            filteredData1 = filteredData1.filter(row => {
                return activeSubSearches.every(([colName, searchValue]) => {
                    const cellValue = row[colName]?.value;
                    return cellValue ? cellValue.toLowerCase().includes(searchValue.toLowerCase()) : false;
                });
            });
        }
    }

    if (havecheckbox && onlyCheckedItems) {
        filteredData1 = filteredData1.filter(item =>
            checkItems.some(checkedItem =>
                keyColumn ? checkedItem[keyColumn]?.value === item[keyColumn]?.value : false
            )
        );
    }

    const totalPages = Math.ceil(filteredData1.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;

    const gridTemplate = [
        ...(havecheckbox ? ['30px'] : []),
        ...columns
            .filter(col => col.visible === undefined || col.visible === true)
            .map(col => col.widthcss?.trim() ? col.widthcss : '1fr')
    ].join('_');

    const gridColsStyle = `grid-cols-[${gridTemplate}]`;

    /**
     * 將文字中符合關鍵字的部分用 <mark> 包住
     */
    const highlightText = (
        text: string,
        keywords: { word: string; color: string }[]
    ): React.ReactNode => {
        const activeKeywords = keywords.filter(k => k.word.trim());
        if (activeKeywords.length === 0) return <>{text}</>;

        const colorMap: Record<string, string> = {};
        activeKeywords.forEach(k => {
            colorMap[k.word.toLowerCase()] = k.color;
        });

        const pattern = activeKeywords
            .map(k => k.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');
        const regex = new RegExp(`(${pattern})`, 'gi');

        const parts = text.split(regex);

        return (
            <>
                {parts.map((part, i) => {
                    const bgColor = colorMap[part.toLowerCase()];
                    return bgColor ? (
                        <mark key={i} className={`${bgColor} text-inherit rounded-sm px-0.5`}>{part}</mark>
                    ) : (
                        <span key={i}>{part}</span>
                    );
                })}
            </>
        );
    };

    // ── 7. JSX Return ──────────────────────────
    return (
        <div ref={scrollContainerRef} className={` ${cssUserbar} relative ${textSize} border border-gray-300 bg-slate-100 rounded-md`}>
            {gridStyles()}
            <div className='text-gray-800 p-2'>

                {useSearch && (
                    <div className="mb-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                )}

                <div className={`grid ${useXBar ? 'min-w-max' : ''} border-r border-b ${borderColor} ${gridColsStyle} bg-white/50 ${className || ''} shadow-md`}>

                    {/* 表頭 Checkbox 預留欄位 */}
                    {havecheckbox && (
                        <div className={`sticky top-0 p-1.5 border-l border-t ${borderColor} text-center`}>
                        </div>
                    )}

                    {/* 表頭 欄位標題 */}
                    {columns.map((col, index) => (
                        (col.visible === undefined || col.visible === true) && (
                            <div
                                key={index}
                                className={cn(
                                    `sticky top-0 p-1.5 border-l border-t ${borderColor} text-center ${styles[styleHeader] || styles.default}`,
                                    `${classNameHeader}`
                                )}
                            >
                                {col.showname ? col.showname : col.name}
                            </div>
                        )
                    ))}

                    {/* 單欄搜尋列 (useSubSearch) */}
                    {useSubSearch && (
                        <React.Fragment>
                            {havecheckbox && (
                                <div className={`p-1.5 border-l border-t ${borderColor} text-gray-600 font-medium text-center`}>
                                </div>
                            )}

                            {columns.map((col, index) => (
                                col.visible === false ? null :
                                    (col.subSearch === true) ? (
                                        <div key={index} className={`p-1 border-l border-t ${borderColor} text-gray-600`}>
                                            <input
                                                type="text"
                                                placeholder={`搜尋...${col.showname}`}
                                                className="w-full p-1 border border-blue-400 text-gray-600 rounded"
                                                value={subSearchTexts[col.name] || ''}
                                                onChange={e => handleSubSearchChange(col.name, e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div key={index} className={`p-1.5 border-l border-t ${borderColor} text-gray-600 font-medium text-center`}>
                                        </div>
                                    )
                            ))}
                        </React.Fragment>
                    )}

                    {/* 表身資料渲染 */}
                    {filteredData1.slice(startIndex, startIndex + itemsPerPage).map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            {havecheckbox && (
                                <div className={`p-1.5 border-l border-t ${borderColor} outline-stone-400 text-gray-600 font-medium text-center`}>
                                    <input
                                        type="checkbox"
                                        checked={
                                            keyColumn
                                                ? checkItems.some(i => i[keyColumn]?.value === row[keyColumn]?.value)
                                                : false
                                        }
                                        onChange={e => handleCheck(row, e.target.checked)}
                                    />
                                </div>
                            )}
                            {columns.map((col, colIndex) => {
                                if (col.visible === false) return null;
                                const field = row[col.name];
                                if (!field) {
                                    return (
                                        <div
                                            key={colIndex}
                                            className="col-span-1 p-1.5"
                                        />
                                    );
                                }

                                return (
                                    <React.Fragment key={colIndex}>
                                        {(col.visible === undefined || col.visible === true) && (
                                            <div
                                                onClick={() => onRowClick && onRowClick(row)}
                                                className={cn(
                                                    `p-1.5 border-l border-t ${borderColor} font-medium text-center`,
                                                    `${classItem}`
                                                )}
                                            >
                                                {(col.visible === undefined || col.visible === true) && (
                                                    <>
                                                        {field.type === 'input' && (() => {
                                                            const kws: { word: string; color: string }[] = [];
                                                            if (useSubSearch && subSearchTexts[col.name]?.trim()) {
                                                                kws.push({ word: subSearchTexts[col.name], color: 'bg-yellow-200' });
                                                            }
                                                            return kws.length > 0
                                                                ? highlightText(field.value ?? '', kws)
                                                                : field.value;
                                                        })()}
                                                        {field.type === 'hyperlink' && field.href && (
                                                            <a
                                                                href={field.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                {field.value}
                                                            </a>
                                                        )}
                                                        {field.type === 'empty' && field.child}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    ))}

                </div>
            </div>

            {/* 分頁與資訊列 */}
            <div className='w-full border-t border-gray-300 p-2 text-[14px] text-gray-600'>
                <div className="flex justify-center mt-4 space-x-2">
                    <div>
                        Page {currentPage} of {totalPages} ({filteredData1.length} items)
                    </div>
                    <div>
                        <button
                            className="text-blue-500 hover:underline focus:outline-none"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            上一頁
                        </button>
                    </div>
                    <div>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                className={`px-1 text-blue-700 rounded ${page === currentPage ? "bg-blue-300 text-white" : "bg-slate-100"}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <div>
                        <button
                            className="text-blue-500 hover:underline focus:outline-none"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            下一頁
                        </button>
                    </div>
                </div>
            </div>

            <LoadingInline isLoading={loading} message="i am loading..." />

            {/* 浮動水平捲軸容器 */}
            {useXBar && (
                <div
                    ref={floatingBarRef}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: floatingBarRect.left,
                        width: floatingBarRect.width,
                        height: showFloatingBar ? '14px' : '0px',
                        overflowX: showFloatingBar ? 'auto' : 'hidden',
                        overflowY: 'hidden',
                        zIndex: 1000,
                        background: 'rgba(226,232,240,0.97)',
                        borderTop: showFloatingBar ? '2px solid #94a3b8' : 'none',
                        boxShadow: showFloatingBar ? '0 -3px 10px rgba(0,0,0,0.13)' : 'none',
                        transition: 'height 0.15s ease',
                    }}
                >
                    <div ref={floatingBarInnerRef} style={{ height: '1px' }} />
                </div>
            )}
        </div>
    );
};

export default DataGridApi;