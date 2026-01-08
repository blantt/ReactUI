import React, { useState } from 'react';
import MyDropDown from '../component/myDropDown';
import MyDropGrid, { transformToFormField as apitransform } from '../component/myDropGrid';
import AppTitle from '../component/header.tsx';
import Loading from '../component/myload';
import {LoadingInline} from '../component/myload';
import Modal from '../component/myModal';
import { Button2 } from "../component/button.tsx";
 import { Grid_Data1 } from "../data/data.js";
import { DiscordIcon, AnotherIcon, AnotherIcon2 } from "../component/mySvg.tsx";
import type { FileItem as DropdownOption } from '../component/myDropGrid'; // 匯入 FileItem 型別
 


const MyTempUI: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading_modal, setIsLoading_modal] = useState(false);
    const [isLoading_modal2, setIsLoading_modal2] = useState(false);
    const handleButtonClick_modal = () => {
        setIsLoading_modal(true); // 顯示 Loading
    };
     const handleButtonClick_modal2 = () => {
        setIsLoading_modal2(true); // 顯示 Loading
    };

    const handleSelect = (value: string) => {
        // console.log('Selected value:', value);
        alert(`Selected value: ${value}`);
    };

    const handleSelect2 = (value: DropdownOption) => {
        alert(`Selected name, value: ${value.sname} (${value.svalue})`);
    };

 const handleSelect3 = (value: DropdownOption) => {
        alert(`Selected name, value: ${value.ClassName} (${value.ClassID})`);
    };

    // interface FileItem {
    //     name: string;
    //     value: string;
    // }

    const fileOptions: DropdownOption[] = [
        { sname: "name 1", svalue: "value 1", sother: "other1" },
        { sname: "name 2", svalue: "value 2", sother: "other2" },
        { sname: "name 3", svalue: "value 3", sother: "other3" },
    ];

    const fileOptions2: DropdownOption[] = [
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
            Name: { name: 'Name', value: 'Charlie', type: 'input' },
            Age: { name: 'Age', value: '35', type: 'input' },
            Email: { name: 'Email', value: 'charlie@example.com', type: 'empty', href: 'mailto:abc' },
        },
    ];


    const columns_api = [
        { name: 'Name', type: 'input' },
        { name: 'Age', type: 'input' },
        { name: 'Email', type: 'input' },
    ];

    //customTransform 如要客製化才使用
    const customTransform = (item: any, col: { name: string; type: string }) => {
        
        //  console.log(`customTransform 被呼叫:`, { item, col });
        if (col.name === 'Age') {
           // console.log(`customTransform 正在處理 Age 欄位`);
            // return {
            //   name: col.name,
            //   value: 'age new value',
            //   type: 'hyperlink',
            //   href: `https://example.com/age/${item[col.name]}`, // 確保 href 有值
            // };
            // return {
            //     name: col.name,
            //     value: '',
            //     type: 'empty',
            //     child: <Button2 label="取得值" onClick={() => handleSelect2(item)} ></Button2>, // 確保 href 有值
            // };

        }

        return { name: col.name, value: String(item[col.name]), type: col.type };
    };
    const transformedData_api = apitransform(Grid_Data1, columns_api, customTransform);

    const handleButtonClick = () => {
        setIsLoading(true); // 顯示 Loading

        // 模擬加載過程，例如 2 秒後隱藏 Loading
        setTimeout(() => {
            setIsLoading(false);
            alert('加載完成！');
        }, 2000);
    };

    

    return (

        <div>
            <AppTitle title="My Dropdown Example" bkcolor="bg-green-600" />
            <div className="flex justify-center items-center ">

                <div className="p-4">
                    <h1 className="text-sm font-bold mb-4">dropdown Example</h1>
                    <MyDropDown keyValue='sname' keyText='svalue'
                        options={fileOptions}
                        onSelect={handleSelect2}
                    />
                </div>

                 <div className="p-4">
                    <h1 className="text-sm font-bold mb-4">dropdown(API) Example</h1>
                    <MyDropDown keyValue='ClassID' keyText='ClassName' haveBlank={true}
                        apiUrl="https://clockappservice.english4u.com.tw/api/clock/selectClockWorkClass"
                        onSelect={handleSelect3}
                    />
                </div>

                <div className="p-2">
                    <h1 className="text-sm font-bold mb-4">DropGrid(直接給數據)</h1>
                    <MyDropGrid data={fileOptions2}
                        columns={[
                            { name: 'Name', type: 'input', colSpan: 1 },
                            { name: 'Age', type: 'input', colSpan: 1 },
                            { name: 'Email', type: 'hyperlink', colSpan: 2 },
                        ]}
                        keyValue='Name' keyText='Email' gridCols={4}

                    />
                </div>
                <div className="p-2">
                    <h1 className="text-sm font-bold mb-4">DropGrid(給json)</h1>
                    <MyDropGrid data={transformedData_api}
                        columns={[
                            { name: 'Name', type: 'input', colSpan: 1 },
                            { name: 'Age', type: 'input', colSpan: 1 },
                            { name: 'Email', type: 'hyperlink', colSpan: 2 },
                        ]}
                        keyValue='Name' keyText='Email' gridCols={4}

                    />
                </div>
                <div className="p-2">
                    <h1 className="text-sm font-bold mb-4">DropGrid(給api)</h1>
                    <MyDropGrid apiUrl="https://clockappservice.english4u.com.tw/api/testdata"
                        columns={[
                            { name: 'Name', type: 'input', colSpan: 1 },
                            { name: 'Age', type: 'input', colSpan: 1 },
                            { name: 'Email', type: 'input', colSpan: 2 },
                        ]}
                        keyValue='Name' keyText='Email' gridCols={4}

                    />
                </div> 


            </div>
            <div className="flex justify-center items-center  ">
                <div>
                    <Button2 icon={<DiscordIcon color='rgb(255, 87, 51)' />} label="testmodal" onClick={handleButtonClick_modal} />
                </div>
                <div className='p-2'>
                    <Button2 icon={<AnotherIcon2 />} label="testLoad" onClick={handleButtonClick} />
                </div>
                <div className='p-2'>
                    <Button2 icon={<AnotherIcon2 />} label="testinlineLoad" onClick={handleButtonClick_modal2} />
                </div>

            </div>

            


            <Loading isLoading={isLoading} message="加載中..." />
            <Modal isOpen={isLoading_modal} onClose={() => setIsLoading_modal(false)} title="我是彈跳視窗">
                <p>今天笑了嗎?</p>
                <Button2 label="close" onClick={() => setIsLoading_modal(false)} />
            </Modal>

            <Modal isOpen={isLoading_modal2} onClose={() => setIsLoading_modal2(false)} title="我是loading modal">
                <p>loading modal</p>
                <div className=' relative  '>
                     <Button2 label="close" onClick={() => setIsLoading_modal2(false)} />
                     <LoadingInline isLoading={true}   message="資料加載中..." />   
                </div>
              
            </Modal>

        </div>


    );
};

export default MyTempUI;


