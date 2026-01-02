import React from 'react';
import DataGridApi from '../component/myDataGrid.tsx';
import type { FormField } from '../component/myDataGrid.tsx';

type CodeTxtProps = {
    label: string; // label 是字串
    txtcolor?: string; // txtcolor 是可選的字串
    align?: string; // align 是可選的字串
};


export const CodeTxt = ({ label, txtcolor = 'text-gray-800', align = 'text-left' }: CodeTxtProps) => {
    return (
        <div className={`   whitespace-pre-wrap  ${align} ${txtcolor} leading-relaxed`}>
            {label}
        </div>
    );
};

const DocGrid: React.FC = () => {
    const columns = [
        { name: 'id', type: 'input' },
        { name: 'name', type: 'input' },
        { name: 'link', type: 'hyperlink' },
    ];

    const data = [
        { id: { name: 'id', value: '1', type: 'input' }, name: { name: 'name', value: 'John', type: 'input' }, link: { name: 'link', value: 'Google', type: 'hyperlink', href: 'https://google.com' } },
        { id: { name: 'id', value: '2', type: 'input' }, name: { name: 'name', value: 'Jane', type: 'input' }, link: { name: 'link', value: 'Bing', type: 'hyperlink', href: 'https://bing.com' } },
    ];

    const handleRowClick = (row: Record<string, FormField>) => {
        console.log('Row clicked:', row);
    };

    const scrollToElementById = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">DataGridApi 元件文件</h1>
            <p className="mb-4">此頁面展示了 <code>DataGridApi</code> 元件的使用方式，包括欄位定義、資料來源及事件處理。</p>

            <h2 className="text-xl font-semibold mb-2">範例</h2>
            <DataGridApi
                columns={columns}
                data={data}
                gridCols={3}
                onRowClick={handleRowClick}
            />

            <h2 className="text-xl font-semibold mt-6 mb-2">屬性說明</h2>
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">屬性名稱</th>
                        <th className="border border-gray-300 px-4 py-2">類型</th>
                        <th className="border border-gray-300 px-4 py-2">說明</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">columns</td>
                        <td className="border border-gray-300 px-4 py-2">Array&lt;{`{ name: string; colSpan?: number; type: string; transform?: (value: any) => FormField }`}&gt;</td>
                        <td className="border border-gray-300 px-4 py-2">定義表格欄位的結構，包括名稱、寬度、型態及轉換邏輯。</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">data</td>
                        <td className="border border-gray-300 px-4 py-2">Array&lt;Record&lt;string, FormField&gt;&gt;</td>
                        <td className="border border-gray-300 px-4 py-2">靜態資料來源，若未提供，則需提供 apiUrl。</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">apiUrl</td>
                        <td className="border border-gray-300 px-4 py-2">string</td>
                        <td className="border border-gray-300 px-4 py-2">API 資料來源的 URL，若提供此屬性，元件會自動從 API 載入資料。</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">className</td>
                        <td className="border border-gray-300 px-4 py-2">string</td>
                        <td className="border border-gray-300 px-4 py-2">自定義樣式類別。</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">gridCols</td>
                        <td className="border border-gray-300 px-4 py-2">number</td>
                        <td className="border border-gray-300 px-4 py-2">動態控制表格的列數，若未提供，則根據 columns 的長度決定。</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">onRowClick</td>
                        <td className="border border-gray-300 px-4 py-2">(row: Record&lt;string, FormField&gt;) =&gt; void</td>
                        <td className="border border-gray-300 px-4 py-2">點擊表格列時的回呼函數，接收被點擊的列資料。</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">
                            <button onClick={() => scrollToElementById('customTransform')} className="text-blue-500 underline">
                                customTransform
                            </button>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">(item: any, col: DataGridProps[`columns`][number]) =&gt; FormField</td>
                        <td className="border border-gray-300 px-4 py-2">自定義資料轉換邏輯，優先於欄位的 transform 屬性。</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">
                            <button onClick={() => scrollToElementById('transformToFormField')} className="text-blue-500 underline">
                                transformToFormField
                            </button>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">data: any[],
                            columns: DataGridProps['columns'],
                            customTransform?: (item: any, col: DataGridProps['columns'][number])  =&gt;  FormField </td>
                        <td className="border border-gray-300 px-4 py-2"> 將 JSON 資料轉換為 FormField 格式的函數。並且是提供外部呼叫使用</td>
                    </tr>

                </tbody>
            </table>


            <h2 id="customTransform" className="text-xl  font-semibold mt-6 mb-2">customTransform</h2>
            <div className="p-1  gap-0  grid place-items-center bg-gray-100   w-full">
                {/* 應用 Tailwind CSS 類別 */}

                <CodeTxt label={`customTransform 是元件裡call back機制,允許外部定義條件。
                   如符合設定條件，回傳一個符合 FormField 結構的物件。如沒設條件,或沒不符合,則是預設處理。
                   屬性說明:
                     DataGridProps['columns'][number]
                        為什麼可以取出 col.name？
                        col 是 columns 陣列中的一個元素。
                        根據 DataGridProps['columns'][number] 的定義，每個元素都具有 name 屬性，且型別為 string。
                        因此，當你遍歷 columns 陣列時，col 就是 DataGridProps['columns'][number] 型別的物件，這個物件保證有 name 屬性
                        ，所以可以直接使用 col.name。
                   `} />
                <h3 className="text-lg font-semibold mt-1 mb-1">外部取用</h3>
                <CodeTxt label={`
                  const customTransform = (item: any, col: { name: string; type: string }) => {
                        // 這裡可以自定義轉換邏輯
                        if (col.name === 'Age') {
                            //customTransform 正在處理 Age 欄位
                            
                             return {
                                name: col.name,
                                value: 'age new value',
                               type: 'hyperlink',
                                href: '', // 確保 href 有值
                              };
                        }
                         //如果沒有自定義, 就return 預設處理     
                         return { name: col.name, value: String(item[col.name]), type: col.type };
            };      
                `} />

                <h3 className="text-lg font-semibold mt-1 mb-1">元件內使用</h3>

                <CodeTxt label={`
                    綁定 transformToFormField 函數,這裡是將json資料轉成 FormField 格式
                    所以也判斷 如有自定義customTransform 進行欄位轉換
                    GRID 有分api取資料 及 外部傳入兩種資料來源,二種都需要判斷
                    export const transformToFormField = (data: any[],
                        columns: DataGridProps['columns'],
                        customTransform?: (item: any, col: DataGridProps['columns'][number]) => FormField
                    ) => { .........
                    `} />
            </div>

            {/* 分隔線 */}
            <hr className="my-1 border-t border-gray-300" />
            <h2 id="transformToFormField" className="text-xl  font-semibold mt-6 mb-2">transformToFormField</h2>
            <div className="p-1  gap-0  grid place-items-center bg-gray-100   w-full">

                <CodeTxt label={`參數說明:
                    data: any[] 類型: 陣列
                    說明: 原始資料的陣列，每個元素代表一列資料（通常是從 API 或其他來源獲取的 JSON 資料）。
                    [
                        { "name": "John", "age": 30 },
                        { "name": "Jane", "age": 25 }
                    ]
                    columns: DataGridProps['columns'],
                        ,DataGridProps是元件定義的物件, columns是其中一個屬性,定義欄位結構
                         DataGridProps['columns'] 即是取出columns這屬性(它是一個陣列)
                    DataGridProps['columns'][number] 即是取出陣列中的每一個元素(欄位定義物件)
                        Array<T> 是一個泛型型別，[number] 表示取出陣列中的單一元素型別。
                        因此，DataGridProps['columns'][number] 表示 columns 陣列中每個元素的型別，也就是：
                        DataGridProps['columns'][number] 型別的物件，這個物件保證有 name 屬性
                        ，所以可以直接使用 col.name
                    `


                } />

            </div>


        </div>
    );
};

export default DocGrid;