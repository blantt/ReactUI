import React, { useState, useEffect, useRef, use } from 'react';
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
    //colSpan 暫時沒有作用,因為grid現在是自動分配欄位寬度,所以如有colSpan,會影響顯示效果(真有需要再優化)
    colSpan?: number;
    subSearch?: boolean; // 是否啟用單一欄位搜尋
}

/**
 * 通用 datagrid 元件 - 高度自定義化
 * @param {string} className - 自定義樣式
 */
type DataGridProps = {
    //columns: ColumnType[]; // 表頭名稱
    columns: Array<{
        name: string; // 欄位名稱
        showname?: string; // 顯示名稱
        colSpan?: number; // 欄位寬度
        widthcss?: string; // 自定義寬度樣式
        type: string; // 欄位型態，例如 "input"、"hyperlink"、"empty"
        visible?: boolean; // 控制欄位是否可見
        transform?: (value: any) => FormField; // 動態轉換函數
        subSearch?: boolean; // 是否啟用單一欄位搜尋
        //  outPutSearchText?: string; // 外部搜尋文字(此文字暫不會過濾內容,但表身的文字如符合關鍵字,文字會有底色標記)

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
    checkedItems_old?: Array<Record<string, FormField>>; // 1. 新增這行
    customTransform?: (item: any, col: DataGridProps['columns'][number]) => FormField; // 新增自定義轉換邏輯
    onlyCheckedItems?: boolean; // 是否只顯示已勾選的項目
    haveCredentials?: boolean; // 是否包含憑證(後端可讀取到session)
    textSize?: string; // 字體大小，例如 "text-sm"、"text-base" 等 Tailwind CSS 類別
    classNameHeader?: string; // 表頭的自定義樣式
    classItem?: string; // 單元格的自定義樣式
    borderColor?: string; // 邊框顏色，例如 "border-gray-300"、"border-blue-500" 等 Tailwind CSS 類別
    styleHeader?: 'default' | 'empty' | 'yellow' | 'vistaBlue' | 'green1' | 'green2' | 'white1';
    //green1 抺茶歐蕾,green2薄荷晨曦,white1 絲絨銀灰
    refreshKey?: number; // ← 如外部要強制重抓資料時
};

export const transformToFormField = (data: any[],
    columns: DataGridProps['columns'],
    customTransform?: (item: any, col: DataGridProps['columns'][number]) => FormField
) => {

    return data.map((item, itemIndex) => {
        const transformedRow: Record<string, FormField> = {};
        columns.forEach((col, colIndex) => {
            const value = item[col.name];

            transformedRow[col.name] = customTransform
                ? customTransform(item, col) // 使用外部提供的邏輯
                : col.transform
                    ? col.transform(value) // 使用欄位的 transform
                    : { name: col.name, value: String(value), type: col.type }; // 預設邏輯

        });

        return transformedRow;
    });
};

/**
 *  * ### columns 欄位設定說明
 * | 屬性 | 型別 | 必填 | 說明 |
 * |------|------|------|------|
 * | `name` | `string` | ✅ | 對應資料的欄位 key |
 * | `showname` | `string` | ❌ | 表頭顯示名稱，未設定則顯示 name |
 * | `type` | `string` | ✅ | `'input'` 純文字 / `'hyperlink'` 超連結 / `'empty'` 自訂內容 |
 * | `widthcss` | `string` | ❌ | 欄位寬度，支援 CSS Grid 語法，如 `'120px'`、`'minmax(100px,200px)'`，預設 `'1fr'` |
 * | `colSpan` | `number` | ❌ | 欄位合併（目前自動分配寬度，效果有限） |
 * | `visible` | `boolean` | ❌ | 控制欄位是否顯示，預設 `true` |
 * | `subSearch` | `boolean` | ❌ | 是否在該欄位顯示子搜尋輸入框，需搭配 `useSubSearch={true}` |
 * | `transform` | `(value) => FormField` | ❌ | 自訂欄位資料轉換邏輯 |
 *
 * ---
 * DataGridApi 元件
* @param {Array} columns - **【必填】** 欄位設定陣列，定義表頭與資料顯示方式（詳見上表）
 *
 * @param {Array<Record<string, FormField>>} [data] - 直接傳入已處理好的資料（與 `apiUrl` 擇一使用）
 *
 * @param {string} [apiUrl] - API 端點 URL，元件掛載時自動 fetch 資料（與 `data` 擇一使用）
 *
 * @param {boolean} [haveCredentials=false] - fetch 時是否帶入 cookie/session 憑證（`credentials: 'include'`），
 *   後端需要讀取 session 時設為 `true`
 *
 * @param {number} [PageSize=5] - 每頁顯示筆數。當 `useBar={true}` 時此設定無效，會自動設為 10000（顯示全部）
 *
 * @param {boolean} [useXBar=false] - 啟用橫向捲軸，當表格寬度超過容器寬度時顯示水平滾動條
 * @param {boolean} [useBar=false] - 啟用捲軸模式，元件高度填滿父容器並可垂直捲動，同時顯示全部資料不分頁
 *
 * @param {boolean} [useSearch=false] - 在表格上方顯示全欄位搜尋輸入框，即時過濾所有欄位內容
 *
 * @param {boolean} [useSubSearch=false] - 啟用單欄搜尋功能，需在 `columns` 對應欄位設定 `subSearch: true`
 *
 * @param {boolean} [havecheckbox=false] - 在每列最左側顯示 checkbox，搭配 `keycol` 使用效果最佳
 *
 * @param {string} [keycol] - 指定每列的唯一識別欄位名稱（如 `'id'`），
 *   用於 checkbox 勾選比對，未設定時預設使用 columns 第一個欄位
 *
 * @param {Array<Record<string, FormField>>} [checkedItems_old] - 外部傳入預設勾選的資料，
 *   元件會同步更新內部 checkItems state
 *
 * @param {(items: Array<Record<string, FormField>>) => void} [onCheckItemsChange] - 
 *   使用者操作 checkbox 時的回調，回傳當前所有已勾選的列資料
 *
 * @param {boolean} [onlyCheckedItems=false] - 設為 `true` 時，表格只顯示已勾選的列，
 *   需搭配 `havecheckbox={true}` 使用
 *
 * @param {(row: Record<string, FormField>) => void} [onRowClick] - 點擊任一列時觸發的回調，回傳該列資料
 *
 * @param {(item: any, col: ColumnDef) => FormField} [customTransform] -
 *   **第一層轉換**：全域自訂資料轉換函式，優先於各欄位的 `transform`。
 *   在資料進入 grid 前，對每個 row × col 逐一執行，適合統一決定欄位的 type / value / href 等。
 *   執行時機：原始 JSON → FormField 轉換階段（per row, per column）。
 *
 *   @example
 *   ```tsx
 *   customTransform={(item, col) => {
 *       if (col.name === 'status') {
 *           return { name: col.name, type: 'input', value: item.status === 1 ? '啟用' : '停用' };
 *       }
 *       return { name: col.name, type: col.type, value: String(item[col.name] ?? '') };
 *   }}
 *   ```
 *
 * @param {(data: Array<Record<string, FormField>>) => void} [setTransformedData] -
 *   **第二層轉換**：資料全部轉換完後的回調，可對整批已轉換的資料做進一步修改（mutation）。
 *   執行時機：`customTransform` 跑完 → `setTransformedData` → grid 寫入 state。
 *   適用場景：注入按鈕元件（type: 'empty'）、依其他欄位的值動態調整某欄、跨欄位邏輯。
 *   **同時支援 `rawData` 和 `apiUrl` 兩種資料來源。**
 *
 *   @example
 *   ```tsx
 *   setTransformedData={(transformed) => {
 *       transformed.forEach((row) => {
 *           const id = row['id']?.value ?? '';
 *           row['action'] = {
 *               name: 'action',
 *               type: 'empty',
 *               child: (
 *                   <button onClick={() => alert('id: ' + id)}>檢視</button>
 *               ),
 *           };
 *       });
 *   }}
 *   ```
 *
 * @param {'default'|'empty'|'yellow'|'vistaBlue'|'green1'|'green2'|'white1'} [styleHeader='default'] -
 *   表頭預設主題樣式：
 * @param {string} [className] - 附加在 grid 容器上的 Tailwind CSS 類別
 *
 * @param {string} [classNameHeader] - 附加在每個表頭儲存格的 Tailwind CSS 類別，可覆蓋預設樣式
 *
 * @param {string} [classItem] - 附加在每個資料儲存格的 Tailwind CSS 類別
 *
 * @param {string} [borderColor='border-slate-700'] - 表格邊框顏色，使用 Tailwind CSS border 色彩類別，
 *   例如 `'border-gray-300'`、`'border-blue-500'`
 *
 * @param {string} [textSize='text-sm'] - 整體字體大小，使用 Tailwind CSS 類別，
 *   例如 `'text-xs'`、`'text-base'`、`'text-lg'`
 * @param {number} [refreshKey] - 監聽此值變化以強制重新抓取 API 資料（僅當 `apiUrl` 設定時有效）
 * @param {number} [gridCols] - 手動指定 grid 欄數（目前以 `widthcss` 自動計算為主，較少使用）

 */
const DataGridApi: React.FC<DataGridProps> = ({ columns, data, rawData, setTransformedData, apiUrl, className, PageSize, havecheckbox = false,
    onlyCheckedItems = false, useBar = false, useXBar = false, useSearch = false, keycol, gridCols, checkedItems_old, onCheckItemsChange, onRowClick
    , customTransform, useSubSearch = false, haveCredentials = false, textSize = "text-sm", classNameHeader = "", classItem = "", refreshKey
    , borderColor = "border-slate-700", styleHeader = 'default' }) => {

    const styles = {
        default: ' bg-gradient-to-br from-indigo-100 to-blue-200 backdrop-blur-xl   shadow-lg ',
        empty: ' nocss',
        yellow: '   bg-gradient-to-br from-orange-100/80 to-orange-200/80 backdrop-blur-xl shadow-lg   ',
        green1: '  bg-gradient-to-br from-lime-50/90 to-emerald-100/80   text-emerald-900   ',
        green2: '  bg-gradient-to-br from-emerald-50/80 to-teal-100/80   text-emerald-900   ',
        white1: ' bg-gradient-to-br from-slate-50/80 to-slate-200/80   text-slate-800  ',
        vistaBlue: 'vistaBlue',
    };

    let cssUserbar = "";
    if (useBar) {
        PageSize = 10000
        cssUserbar += " h-full overflow-y-auto ";
    }
    if (useXBar) {
        cssUserbar += " w-full overflow-x-auto  min-w-0 ";
    }
    let itemsPerPage = PageSize || 5;

    const [internalData, setInternalData] = useState<Array<Record<string, FormField>>>(data || []);

    // rawData 變化時，使用自身 columns 自動轉換
    // setTransformedData 先執行（讓外部可 mutate transformed），再寫入 state
    useEffect(() => {
        if (rawData) {
            const transformed = transformToFormField(rawData, columns, customTransform);
            if (setTransformedData) {
                setTransformedData(transformed); // 外部可在此修改 transformed（mutation）
            }
            setInternalData([...transformed]); // 展開新陣列，確保 React 偵測到變化
            setCurrentPage(1);
        }
    }, [rawData]); // eslint-disable-line react-hooks/exhaustive-deps
    const [loading, setLoading] = useState(!!apiUrl); // 如果有 apiUrl，預設為加載中

    const [currentPage, setCurrentPage] = useState(1);

    const [searchText, setSearchText] = useState('');
    // 新增一個 state 來儲存每個欄位的搜尋文字
    const [subSearchTexts, setSubSearchTexts] = useState<Record<string, string>>({});

    // 浮動水平捲軸相關 refs & state
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const floatingBarRef = useRef<HTMLDivElement>(null);
    const floatingBarInnerRef = useRef<HTMLDivElement>(null);
    const isSyncingRef = useRef(false);
    const [showFloatingBar, setShowFloatingBar] = useState(false);
    const [floatingBarRect, setFloatingBarRect] = useState({ left: 0, width: 0 });

    // 當 API 來源或強制刷新 key 改變時，回到第一頁
    useEffect(() => {
        setCurrentPage(1);
    }, [apiUrl, refreshKey]);

    // 當外部直接傳入的 data 改變時，同步更新 internalData 並回到第一頁
    useEffect(() => {
        setInternalData(data || []);
        setCurrentPage(1);
    }, [data]);

    // 當本地搜尋條件改變時，回到第一頁
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, subSearchTexts]);

    // ── 浮動水平捲軸：雙向 scroll 同步 ──────────────────────────
    useEffect(() => {
        if (!useXBar) return;

        const container = scrollContainerRef.current;
        const floatingBar = floatingBarRef.current;
        const floatingBarInner = floatingBarInnerRef.current;
        if (!container || !floatingBar || !floatingBarInner) return;

        // 更新浮動捲軸內層寬度（等於 grid 的 scrollWidth）
        const updateInnerWidth = () => {
            floatingBarInner.style.width = `${container.scrollWidth}px`;
            setShowFloatingBar(container.scrollWidth > container.clientWidth);
        };

        // 更新浮動捲軸的水平位置與寬度
        const updatePosition = () => {
            const rect = container.getBoundingClientRect();
            setFloatingBarRect({ left: rect.left, width: rect.width });
        };

        updateInnerWidth();
        updatePosition();

        // grid → 浮動捲軸（grid 被拖動時同步浮動捲軸）
        const handleContainerScroll = () => {
            if (isSyncingRef.current) return;
            isSyncingRef.current = true;
            floatingBar.scrollLeft = container.scrollLeft;
            requestAnimationFrame(() => { isSyncingRef.current = false; });
        };

        // 浮動捲軸 → grid（拖動浮動捲軸時同步 grid）
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
    }, [useXBar, internalData]); // internalData 變化代表資料載入完成，scrollWidth 可能改變

    // totalPages / startIndex 移至 filteredData1 計算完後（見下方）

    //keycol 如果是空值,則預設使用 columns 的第一個欄位名稱
    const keyColumn = keycol || (columns.length > 0 ? columns[0].name : undefined);

    // 4. 外部 checkedItems_old 改變時，更新內部 state
    useEffect(() => {
        if (checkedItems_old) {

        }
    }, [checkedItems_old]);

    useEffect(() => {

        if (apiUrl) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const fetchOptions: RequestInit = {};

                    if (haveCredentials) {
                        fetchOptions.credentials = 'include'; // 如果條件成立，就加入 credentials
                    }
                    const response = await fetch(apiUrl, fetchOptions)
                    //const response = await fetch(apiUrl);
                    // const response = await fetch('/data2.json'); //抓在本地的json檔測試用
                    if (!response.ok) {
                        alert(`HTTP error! status: ${response.status}`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const jsonData = await response.json();

                    const transformedData = transformToFormField(jsonData, columns, customTransform);

                    if (setTransformedData) {
                        setTransformedData(transformedData); // 外部可在此 mutation transformedData（與 rawData 行為一致）
                    }

                    setTimeout(() => {

                        setInternalData(transformedData);
                        setLoading(false);

                    }, 0);
                    //   setInternalData(transformedData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    alert('資料取得失敗' + error);
                } finally {
                    //setLoading(false);
                }
            };

            fetchData();
        }
    }, [apiUrl, customTransform, refreshKey]); // 當 apiUrl 或 customTransform 變化時重新抓取資料

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const [checkItems, setCheckItems] = useState<Array<Record<string, FormField>>>([]);

    // 有在使用者點選 checkbox 時，才會觸發 onCheckItemsChange，checkedItems_old 
    // 也只會在真正有勾選變動時才被更新，不會因為外部 checkedItems_old 變動或初始化而被清空。
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
            //要確定是點選checkbox時才呼叫 onCheckItemsChange
            onCheckItemsChange(newChecked); // 只在這裡呼叫
        }
    };

    useEffect(() => {
        // 只有 checkedItems_old 有值時才寫入
        if (checkedItems_old && Array.isArray(checkedItems_old)) {
            setCheckItems(checkedItems_old);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedItems_old]);


    // （searchText / subSearchTexts 已移至上方 useEffect 之前宣告）
    // 處理子搜尋欄位變更的函式
    const handleSubSearchChange = (colName: string, value: string) => {
        setSubSearchTexts(prev => ({
            ...prev,
            [colName]: value
        }));
    };


    // 根據搜尋文字過濾資料,如沒關鍵字,則顯示全部
    let filteredData1 = internalData;
    if (useSearch && searchText.trim() !== '') {

        filteredData1 = internalData.filter(item => {

            // 搜尋所有欄位
            return Object.values(item).some(field =>
                field.value?.toLowerCase().includes(searchText.toLowerCase())
            );

        });

    }

    //TODO 處理子搜尋的過濾邏輯
    if (useSubSearch) {
        const activeSubSearches = Object.entries(subSearchTexts).filter(([, value]) => value.trim() !== '');

        if (activeSubSearches.length > 0) {
            filteredData1 = filteredData1.filter(row => {
                // 必須滿足所有子搜尋條件(全部滿足,會傳true>保留,反之過濾掉)
                return activeSubSearches.every(([colName, searchValue]) => {
                    //every() 會對陣列中的每個元素執行提供的函式，並檢查是否所有元素都符合條件。
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

    // 根據過濾後的資料計算分頁（必須在 filteredData1 確定後才計算）
    const totalPages = Math.ceil(filteredData1.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    // let mygridCols = gridCols || columns.length;
    // if (havecheckbox) {
    //     mygridCols += 1; //預留給 checkbox 欄位使用
    // }


    //let gridColsClass = ' ';
    // gridColsClass = ` bg-gradient-to-br from-indigo-100 to-blue-200 backdrop-blur-xl    shadow-lg `;

    // gridColsStyle 這裡要處理 columns 的 widthcss 屬性，動態設定欄位寬度,組合成 grid的css ,ex:grid-cols-[minmax(100px,150px)_max-content_1fr_1fr]
    //如果 widthcss空值,預設為 1fr
    const gridTemplate = [
        ...(havecheckbox ? ['30px'] : []), // checkbox 欄位寬度
        ...columns
            //  .filter(col => col.name==="sssssss")   
            .filter(col => col.visible === undefined || col.visible === true)
            // .filter(col =>   col.visible === true)
            //col.visible === undefined || col.visible === true
            .map(col => col.widthcss?.trim() ? col.widthcss : '1fr')
    ].join('_');



    const gridColsStyle = `grid-cols-[${gridTemplate}]`;

    /**
     * 將文字中符合關鍵字的部分用 <mark> 包住
     * @param text      - 原始文字
     * @param keywords  - 關鍵字陣列，每個元素格式為 { word: string; color: string }
     *   color 對應 Tailwind bg class，例如 'bg-yellow-200'（subSearch）或 'bg-blue-200'（outPutSearchText）
     */
    const highlightText = (
        text: string,
        keywords: { word: string; color: string }[]
    ): React.ReactNode => {
        const activeKeywords = keywords.filter(k => k.word.trim());
        if (activeKeywords.length === 0) return <>{text}</>;

        // 建立 word -> color 的對照表（小寫 key）
        const colorMap: Record<string, string> = {};
        activeKeywords.forEach(k => {
            colorMap[k.word.toLowerCase()] = k.color;
        });

        // 合成多關鍵字 regex: (word1|word2|...)
        const pattern = activeKeywords
            .map(k => k.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');
        // outPutSearchType: '精準' 用 \b 只比對完整單字；'模糊' 則維持部分比對
        // const regex = outPutSearchType === '精準'
        //     ? new RegExp(`\\b(${pattern})\\b`, 'gi')
        //     : new RegExp(`(${pattern})`, 'gi');
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

    return (
        // gridStyles(); // 確保樣式被注入

        <div ref={scrollContainerRef} className={` ${cssUserbar} relative ${textSize} border border-gray-300  bg-slate-100  rounded-md`}>
            {gridStyles()}
            <div className=' text-gray-800 p-2  '>

                {useSearch && (
                    <div className="mb-2  ">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                )}

                <div className={`grid ${useXBar ? 'min-w-max' : ''} border-r border-b ${borderColor}  ${gridColsStyle}    bg-white/50   ${className || ''} shadow-md `}>

                    {/* 表頭 */}
                    {/* <div className={` shadow-md bg-gray-300 text-gray-700    `}> */}
                    {
                        havecheckbox && (
                            <div className={` sticky top-0 p-1.5  border-l border-t  ${borderColor} text-center `}>
                            </div>
                        )

                    }

                    {columns.map((col, index) => (
                        //判斷 col.colSpan
                        (col.visible === undefined || col.visible === true) && (
                            <div
                                key={index}

                                //   className={`  sticky top-0 p-1.5 outline outline-1 outline-slate-700 text-center ${gridColsClass || ''}`}
                                className={cn(
                                    ` sticky top-0 p-1.5 border-l border-t   ${borderColor}  text-center ${styles[styleHeader] || styles.default}  `,

                                    ` ${classNameHeader}  `
                                )}


                            >
                                {col.showname ? col.showname : col.name}
                            </div>
                        )


                    ))}

                    {/* 開始處理 useSubSearch */}

                    {useSubSearch && (
                        <React.Fragment >
                            {
                                havecheckbox && (

                                    <div className={` p-1.5  border-l border-t  ${borderColor} text-gray-600 font-medium text-center`}>
                                    </div>
                                )
                            }

                            {columns.map((col, index) => (
                                col.visible === false ? null :
                                    (col.subSearch === true) ? (
                                        <div key={index} className={`p-1 border-l border-t  ${borderColor}    text-gray-600`} >
                                            <input
                                                type="text"
                                                placeholder={`搜尋...${col.showname}`}
                                                className="w-full p-1  border border-blue-400  text-gray-600 rounded"
                                                value={subSearchTexts[col.name] || ''}
                                                onChange={e => handleSubSearchChange(col.name, e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        // 這裡放 col.subSearch 不為 true 時要顯示的內容
                                        <div key={index} className={` p-1.5  border-l border-t  ${borderColor}   text-gray-600 font-medium text-center`}>
                                            {/* 留白或其他內容 */}
                                        </div>
                                    )


                            ))}


                        </React.Fragment>


                    )}

                    {/* 處理表身NEW */}
                    {/* React.Fragment（或簡寫為 <>...</>）是 React 提供的一個虛擬容器，用來包裹多個子元素，但不會在 DOM 中產生額外的標籤。
                    它的用途是：當你需要回傳多個元素，但又不想多包一層 <div> 或其他 HTML 標籤時 */}
                    {filteredData1.slice(startIndex, startIndex + itemsPerPage).map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>

                            {
                                havecheckbox && (
                                    <div className={`  p-1.5 border-l border-t  ${borderColor}  outline-stone-400 text-gray-600 font-medium text-center`}>
                                        {havecheckbox && (
                                            <input
                                                type="checkbox"
                                                checked={
                                                    keyColumn
                                                        ? checkItems.some(i => i[keyColumn]?.value === row[keyColumn]?.value)
                                                        : false
                                                }
                                                onChange={e =>
                                                    handleCheck(
                                                        row,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                )
                            }
                            {columns.map((col, colIndex) => {
                                if (col.visible === false) return null;
                                const field = row[col.name];
                                if (!field) {
                                    return (
                                        <div
                                            key={colIndex}
                                            className="col-span-1 p-1.5  "
                                        />
                                    );
                                }

                                // 這裡想抓到 columns 裡面的對應欄位field.name 的 colSpan
                                const header_colSpan = col.colSpan || 1;
                                //colSpan 優先使用 field.colSpan , 若無則使用 header 的 colSpan, 若 header 也無則預設為1
                                const colSpan = field.colSpan || header_colSpan || 1; // Default colSpan to 1 if not provided

                                // key 必須在 return 的最頂層元素，不能藏在 && 條件裡
                                return (
                                    <React.Fragment key={colIndex}>
                                        {(col.visible === undefined || col.visible === true) && (
                                            <div
                                                onClick={() => onRowClick && onRowClick(row)} // 新增點擊事件
                                                // className={`  p-1.5 outline outline-1   outline-stone-400 text-gray-600 font-medium text-center`}
                                                className={cn(
                                                    ` p-1.5   border-l border-t   ${borderColor} font-medium text-center `,
                                                    ` ${classItem}  `
                                                )}
                                            >
                                                {(col.visible === undefined || col.visible === true) && (
                                                    <>
                                                        {field.type === 'input' && (() => {
                                                            // 收集所有高亮關鍵字
                                                            const kws: { word: string; color: string }[] = [];

                                                            // 來源1: subSearch input（黃色）
                                                            if (useSubSearch && subSearchTexts[col.name]?.trim()) {
                                                                kws.push({ word: subSearchTexts[col.name], color: 'bg-yellow-200' });
                                                            }

                                                            // 來源2: outPutSearchText 外部傳入，用 @@ 分隔多關鍵字（藍色）
                                                            // if (col.outPutSearchText?.trim()) {
                                                            //     col.outPutSearchText.split('@@')
                                                            //         .map(k => k.trim())
                                                            //         .filter(k => k)
                                                            //         .forEach(k => kws.push({ word: k, color: 'bg-blue-200' }));
                                                            // }

                                                            return kws.length > 0
                                                                ? highlightText(field.value ?? '', kws)
                                                                : field.value;
                                                        })()}
                                                        {field.type === 'hyperlink' && field.href && (
                                                            <a href={field.href}
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


                    {/* 表身NEW END */}


                </div>


            </div>

            <div className=' w-full border-t border-gray-300 p-2 text-[14px] text-gray-600 '>
                <div className="flex justify-center mt-4 space-x-2">
                    <div>
                        {/* total count: {data.length} items */}
                        {/* 呈現 Page 2 of 17 (510 items) */}
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
                        {/* 頁碼按鈕 */}
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                className={`px-1 text-blue-700 rounded ${page === currentPage ? "bg-blue-300 text-white" : "bg-slate-100"
                                    // className={`px-1  rounded ${page === currentPage ? "text-blue-500 hover:underline focus:outline-none" : "bg-gray-300"
                                    }`}
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
            <div>
            </div>
            <LoadingInline isLoading={loading} message="i am loading..." />

            {/* ── 浮動水平捲軸：固定在視窗底部，隨時可用 ── */}
            {/* 注意：不能用 showFloatingBar 做條件渲染，否則 ref 初始為 null 造成循環死結 */}
            {/* 改用 height: 0 隱藏，確保 ref 永遠有值讓 useEffect 可正確執行 */}
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
                    {/* 內層 div 的寬度 = grid 的 scrollWidth，產生可捲動空間 */}
                    <div ref={floatingBarInnerRef} style={{ height: '1px' }} />
                </div>
            )}
        </div>

    );
};

export default DataGridApi;