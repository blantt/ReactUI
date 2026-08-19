import React, { useEffect, useState } from 'react';
import DataGridApi, { transformToFormField as apitransform } from '../component/myDataGrid';
import Button from "../component/button";

// import type { FormField } from '../component/DataGrid2'; // 匯入 FileItem 型別
import Loading from '../component/myload';


//TODO:customTransform2
const customTransform2 = (item: any, col: { name: string; type: string }) => {
  if (col.name === 'view') {
    // return {
    //   name: col.name,
    //   value: '',
    //   type: 'empty',
    //   child: <Button label="取得值2" onClick={() => handleSelect2(item)} ></Button>, // 確保 href 有值
    // };

    return {
      name: col.name,
      value: '',
      type: 'empty',
      child: <Button label="改變欄位值" onClick={() => {
        console.log("empno", item['empno']);
        item['empno'] = 'bill88888';
        console.log("new empno", item['empno']);
        //就算更新了InternalRefreshKey,但因為api也重取了,所以grid內容還是沒變
        // setInternalRefreshKey(prev => prev + 1);
      }} ></Button>,
    };

  }
  //  console.log(`customTransform 被呼叫:`, { item, col });
  if (col.name === 'fullname') {
    // console.log(`customTransform 正在處理 Age 欄位`);
    // return {
    //   name: col.name,
    //   value: 'age new value',
    //   type: 'hyperlink',
    //   href: `https://example.com/age/${item[col.name]}`, // 確保 href 有值
    // };
    return {
      name: col.name,
      value: 'transnew:' + String(item[col.name]),
      type: 'input',
      // child: <Button label="取得值" onClick={() => handleSelect2(item)} ></Button>, // 確保 href 有值
    };

  }

  return { name: col.name, value: String(item[col.name]), type: col.type };
};

const Example = () => {
  const [RefreshKeylocal, setRefreshKeylocal] = useState(0);
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
      Email: {
        name: 'Email', value: 'charlie@example.com', type: 'empty', child: <Button label="Buttonabc"
          onClick={() => alert('Button clicked')} />
      },
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
  const [gridData2, setGridData2] = useState([
    {
      Name: 'blantt',
      Age: 'blantt Components',
      Tel: '123-456-7890',
      Email: 'bb.com',
    },
    {
      Name: 'boy99',
      Age: 'fish Components',
      Tel: '234-567-8901',
      Email: 'bb2.com',
    },
  ]);

  //TODO: customTransform_local
  const customTransform_local = (item: any, col: { name: string; type: string }) => {

    //  console.log(`customTransform 被呼叫:`, { item, col });
    if (col.name === 'view') {
      return {
        name: col.name,
        value: '',
        type: 'empty',
        child: <Button label="改變欄位值" onClick={() => {
          console.log("Name old", item['Name']);
          setGridData2(prevData =>
            prevData.map(row =>
              row.Name === item.Name
                ? { ...row, Name: 'bill88888' }
                : row
            )
          );
        }} ></Button>,
      };
      // return {
      //   name: col.name,
      //   value: '',
      //   type: 'empty',
      //   child: <Button label="改變欄位值" onClick={() => {
      //     item['Name'].value = 'bill88888';
      //   }} ></Button>,
      // };

    }


    if (col.name === 'Age') {

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
        child: <Button label="取得值1" onClick={() => handleSelect2(item)} ></Button>, // 確保 href 有值
      };

    }

    return { name: col.name, value: String(item[col.name]), type: col.type };
  };


  // 將jsondata轉換成FormField格式
  const transformedData_local = apitransform(gridData2, [
    { name: 'Name', type: 'input', showname: '員工編號2', colSpan: 1, widthcss: 'minmax(80px,120px)' },
    { name: 'Age', type: 'input', showname: '全名', colSpan: 1 },
    { name: 'view', type: 'input', showname: '測試改值' }, // 👈 補上這行！
    { name: 'Email', type: 'input', showname: '電子郵件', colSpan: 2 }
  ], customTransform_local);




  return (
    <div>

      {/* minmax(80px,120px) */}
      <div className='w-1/2 '>
        <h1>AMC GRID api new(一例一休)</h1>
        <div className='h-[400px] p-1  '>
          <DataGridApi
            columns={[
              { name: 'empno', type: 'input', showname: '員工編號', colSpan: 1 },
              { name: 'fullname', type: 'input', showname: '全名2', colSpan: 1, widthcss: 'minmax(50px,150px)', subSearch: true }
            ]}
            useBar={true}
            havecheckbox={true}
            useSearch={true}
            useSubSearch={true}
            textSize="text-[14px]  tracking-[0.08em] "
            // classNameHeader='  text-amber-900 font-bold p-2 bg-gradient-to-br from-orange-100/80 to-orange-200/80 backdrop-blur-xl shadow-lg      '
            borderColor='  border-slate-400 '
            classItem=' text-[18px]  '
            styleHeader='green1'
            onCheckItemsChange={items => {
              // items 就是最新的 checkItems
              console.log('外部取得的勾選資料:', items);
              //寫入gridChecklist 
              const checklistDiv = document.getElementById('gridChecklist');
              if (checklistDiv) {

                checklistDiv.innerHTML = '<h3>勾選清單:</h3><ul>' +
                  items.map(item => `<li>${item.empno.value} - ${item.fullname.value}</li>`).join('') +
                  '</ul>';
              }

            }}
            // customTransform={customTransform}
            apiUrl="https://editor.4kids.com.tw/Portal/api/api_db.ashx?func=Cehck輪班制一例一休"
          />
        </div>

        <div className='mt-4 bg-amber-100 p-2 rounded-md' >
          <div id='gridChecklist'>
            {/* 這裡是外部放置勾選清單的位置 */}



          </div>
        </div>

      </div>

      <div></div>

      <div>
        {/* 這裡試著 取得 data.js 的 Grid_Data1 資料給grid  */}
        {/* 但要先將Grid_Data1 轉換成符合FormField格式的資料 */}
        {/* TODO: local GRID */}
        <h1>local GRID</h1>
        <div> 選擇local資料, 並轉成FormField格式,並且搭配transformedData,對每一列再做客制化調整</div>
        <DataGridApi
          refreshKey={RefreshKeylocal}
          columns={[
            { name: 'Name', showname: '員工編號3', type: 'input' },
            { name: 'Age', showname: 'aaa', type: 'input' },
            { name: 'view', showname: '測試改值', type: 'input' },
            { name: 'Email', type: 'hyperlink' },
          ]}
          //  data={data}    // 原本的data
          data={transformedData_local}   // 使用轉換後的data
          //gridCols={4}
          onRowClick={(item) => {
            alert(`Clicked Name: ${item['Name']?.value}, Age: ${item['Age']?.value}`);
          }}
        />

      </div>


      {/* TODO:api grid have trans */}
      <h1>api grid have transform</h1>
      <div >
        <DataGridApi

          PageSize={5}
          columns={[
            { name: 'empno', type: 'input', showname: '員工編號', colSpan: 1, widthcss: 'minmax(80px,120px)' },
            { name: 'fullname', type: 'input', showname: '全名', colSpan: 1 },
            // { name: 'view', showname: '測試改值', type: 'input' },
          ]}

          customTransform={customTransform2}
          // customTransform={customTransform}
          apiUrl="https://editor.4kids.com.tw/Portal/api/api_db.ashx?func=Cehck輪班制一例一休"
        />
      </div>



    </div>

  );
};

export default Example;