import React, { useState, useEffect } from 'react';
import { LoadingInline } from './myload';
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

}

type DataGridProps = {
    //columns: ColumnType[]; // 表頭名稱
    columns: Array<{
        name: string; // 欄位名稱
        showname?: string; // 顯示名稱
        colSpan?: number; // 欄位寬度
        type: string; // 欄位型態，例如 "input"、"hyperlink"、"empty"
        transform?: (value: any) => FormField; // 動態轉換函數

    }>;
    data?: Array<Record<string, FormField>>; // 直接傳入的資料
    apiUrl?: string; // API 資料來源 URL
    className?: string; // 自定義樣式
    gridCols?: number; // 動態控制grid列數
    PageSize?: number; // 分頁大小
    onRowClick?: (row: Record<string, FormField>) => void; // 新增點擊事件
    customTransform?: (item: any, col: DataGridProps['columns'][number]) => FormField; // 新增自定義轉換邏輯
};

export const transformToFormField = (data: any[],
    columns: DataGridProps['columns'],
    customTransform?: (item: any, col: DataGridProps['columns'][number]) => FormField
) => {
   // console.log('原始資料:', data); // 確認原始資料
  //  console.log('欄位定義:', columns); // 確認欄位定義

    return data.map((item, itemIndex) => {
        const transformedRow: Record<string, FormField> = {};
        columns.forEach((col, colIndex) => {
            const value = item[col.name];
           // console.log(`處理第 ${itemIndex + 1} 列，第 ${colIndex + 1} 欄 (${col.name}):`, value); // 確認每個欄位的值

            transformedRow[col.name] = customTransform
                ? customTransform(item, col) // 使用外部提供的邏輯
                : col.transform
                    ? col.transform(value) // 使用欄位的 transform
                    : { name: col.name, value: String(value), type: col.type }; // 預設邏輯
        //  console.log(`轉換後的欄位 (${col.name}):`, transformedRow[col.name]); // 確認轉換後的欄位
        });
       // console.log(`轉換後的第 ${itemIndex + 1} 列:`, transformedRow); // 確認整列轉換結果
        return transformedRow;
    });
};

const DataGridApi: React.FC<DataGridProps> = ({ columns, data, apiUrl, className,PageSize,
    gridCols, onRowClick, customTransform }) => {

    const [internalData, setInternalData] = useState<Array<Record<string, FormField>>>(data || []);
    const [loading, setLoading] = useState(!!apiUrl); // 如果有 apiUrl，預設為加載中

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = PageSize || 5;
    const totalPages = Math.ceil(internalData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = internalData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        if (apiUrl) {
            const fetchData = async () => {
                setLoading(true);
                try {
                   // console.log(`Fetching datagrid from API: ${apiUrl}`);;
                    const response = await fetch(apiUrl);
                   // const response = await fetch('/data2.json'); //抓在本地的json檔測試用
                    if (!response.ok) {
                        alert(`HTTP error! status: ${response.status}`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const jsonData = await response.json();
                   // console.log('grid jsonData:', jsonData);
                    const transformedData = transformToFormField(jsonData, columns, customTransform);

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
    }, [apiUrl, customTransform]);



    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const mygridCols = gridCols || columns.length;

    let gridColsClass = ' shadow-2xl   outline-gray-400  bg-gradient-to-br from-blue-50 via-[#e8efff] to-[#ccdff9] shadow-md';
    gridColsClass = ` bg-gradient-to-br from-indigo-100 to-blue-200 backdrop-blur-xl    shadow-lg `;

    return (
        <div className=' relative text-sm border border-gray-300  bg-slate-100  rounded-md'>
            <div className=' text-gray-800 p-2  '>
                <div className={`grid   gap-1 border border-gray-300 bg-white/50 p-1  ${className || ''} shadow-md `}>
                    {/* 表頭 */}
                    <div className={`grid gap-1   grid-cols-${mygridCols} shadow-md bg-gray-300 text-gray-700    `}>
                        {columns.map((col, index) => (
                            //判斷 col.colSpan

                            <div
                                key={index}
                                // border-[#cabbbb]
                                //className={`col-span-1 p-1.5 outline outline-1   outline-slate-700   text-center  ${gridColsClass || ''}  `}>
                                className={`col-span-${col.colSpan || 1} p-1.5 outline outline-1 outline-slate-700 text-center ${gridColsClass || ''}`}
                            >
                               {col.showname ? col.showname : col.name}
                            </div>
                        ))}
                    </div>

                    {/* 表身 */}
                    <div className="grid  gap-1 text-gray-700 font-medium not-only-of-type:">

                        {paginatedData.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className={`grid   grid-cols-${mygridCols} bg-white hover:bg-gray-100 cursor-pointer`}
                                onClick={() => onRowClick && onRowClick(row)} // 新增點擊事件
                            >
                                {columns.map((col, colIndex) => {
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

                                    return (
                                        <div
                                            key={colIndex}
                                            className={`col-span-${colSpan} p-1.5 outline outline-1   outline-stone-400 text-gray-600 font-medium text-center`}
                                        >
                                            {field.type === 'input' && field.value}
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
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>


            </div>

            <div className=' w-full border-t border-gray-300 p-2 text-[14px] text-gray-600 '>
                <div className="flex justify-center mt-4 space-x-2">
                    <div>
                        {/* total count: {data.length} items */}
                        {/* 呈現 Page 2 of 17 (510 items) */}
                        Page {currentPage} of {totalPages} ({internalData.length} items)

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

            <div  >


            </div>


            <LoadingInline isLoading={loading} message="i am loading..." />
        </div>



    );
};

export default DataGridApi;