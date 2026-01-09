import React, { useEffect, useState } from 'react';
import DataGridApi, { transformToFormField as apitransform } from '../component/myDataGrid.tsx';
import Button from "../component/button.tsx";
import { Grid_Data1 } from "../data/data.js";
// import type { FormField } from '../component/DataGrid2'; // 匯入 FileItem 型別
import Loading from '../component/myload';

const Example = () => {



  const columns = ['Name', 'Age', 'Email'];
  const data = [
    {
      Name: { name: 'Name', value: 'Alice', type: 'input' },
      Age: { name: 'Age', value: '299', type: 'input' },
      Email: { name: 'Email', value: 'alice@example.com', type: 'hyperlink', href: 'mailto:alice@example.com' },
    },
    {
      Name: { name: 'Name', value: 'Bob', type: 'input' },
      Age: { name: 'Age', value: '30', type: 'input' },
      Email: { name: 'Email', value: 'bob@example.com', type: 'hyperlink', href: 'mailto:bob@example.com' },
    },
    {
      Name: { name: 'Name', value: 'Charlie', type: 'input', },
      Age: { name: 'Age', value: '35', type: 'input' },
      Email: { name: 'Email', value: 'charlie@example.com', type: 'empty', child: <Button label="Buttonabc" /> },
    },
  ];

  const handleSelect2 = (value: GridDataItem) => {
    alert(`Selected value: ${value.Name} (${value.Age})`);
  };

  interface GridDataItem {
    Name: string;
    Age: string;
    Email?: string | null;
  }



  const customTransform = (item: any, col: { name: string; type: string }) => {

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
    { name: 'empno', type: 'input', showname: '員工編號', colSpan: 1, widthcss: 'minmax(80px,120px)' },
    { name: 'fullname', type: 'input', showname: '全名', colSpan: 1 }
  ];

  const transformedData_api = apitransform(Grid_Data1, columns_api, customTransform);

  return (
    <div>

      <div className='w-1/2'>
        <h1>AMC GRID api new</h1>
        <div className='h-[400px]'>
          <DataGridApi
            columns={columns_api}
            useBar={true}
            havecheckbox={true}
            // customTransform={customTransform}
            apiUrl="https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休"
          />
        </div>


      </div>

      <div></div>

      <div>
        {/* 這裡試著 取得 data.js 的 Grid_Data1 資料給grid  */}
        {/* 但要先將Grid_Data1 轉換成符合FormField格式的資料 */}

        <h1>local GRID</h1>
        <DataGridApi
          columns={[
            { name: 'Name', type: 'input', colSpan: 1 },
            { name: 'Age', type: 'input', colSpan: 1 },
            { name: 'Email', type: 'hyperlink', colSpan: 2 },
          ]}
          data={transformedData_api} gridCols={4}
          onRowClick={(item) => {
            alert(`Clicked Name: ${item['Name']?.value}, Age: ${item['Age']?.value}`);
          }}
        />

      </div>

    </div>

  );
};

export default Example;