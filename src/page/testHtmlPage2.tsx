import React from 'react';
import Button from "../component/button";
import DataGridApi, { transformToFormField as apitransform } from '../component/myDataGrid';
const TesttHtmlPage: React.FC = () => {



    const customTransform = (item: any, col: { name: string; type: string }) => {

        const handleSelect2 = (value: GridDataItem) => {
            alert(`Selected value: ${value.Name} (${value.Age})`);
        };

        interface GridDataItem {
            Name: string;
            Age: string;
            Email?: string | null;
        }

        //  console.log(`customTransform 被呼叫:`, { item, col });
        if (col.name === 'Age') {
            console.log(`customTransform 正在處理 Age 欄位`);
            // return {
            //   name: col.name,
            //   value: 'age new value',
            //   type: 'hyperlink',
            //   href: `https://example.com/age/${item[col.name]}`, // 確保 href 有值
            // };
            return {
                name: col.name,
                value: '',
                type: 'empty',
                child: <Button label="取得值" onClick={() => handleSelect2(item)} ></Button>, // 確保 href 有值
            };

        }

        return { name: col.name, value: String(item[col.name]), type: col.type };
    };

    const columns_api = [
        { name: 'Name', type: 'input' },
        { name: 'Age', type: 'input' },
        { name: 'Email', type: 'input' },
    ];

    return (

        <div>
            <div>ttt</div>

            <div className='w-1/2'>
                <h1>AMC GRID api new</h1>

                <DataGridApi
                    columns={columns_api}
                    customTransform={customTransform}
                    apiUrl="https://clockappservice.english4u.com.tw/api/testdata"
                />

            </div>

            <iframe
                src="/my-legacy-page2.html"
                title="Legacy Page"
                style={{ width: '100%', height: '100vh', border: 'none' }}
            />
        </div>


    );
};

export default TesttHtmlPage;
