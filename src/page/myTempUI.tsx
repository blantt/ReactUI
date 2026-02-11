import React, { useState, useEffect } from 'react';
import MyDropDown from '../component/myDropDown';
import MyDropGrid, { transformToFormField as apitransform } from '../component/myDropGrid';
import AppTitle from '../component/header';
import Loading from '../component/myload';
import { LoadingInline } from '../component/myload';
import Modal from '../component/myModal';
import DataGridApi from '../component/myDataGrid';
import { Button2 } from "../component/button";
import { Button } from "../component/button";
// import { Grid_Data1 } from "../data/data.js";
import { DiscordIcon, AnotherIcon, AnotherIcon2 } from "../component/mySvg";
import type { FileItem as DropdownOption } from '../component/myDropGrid'; // 匯入 FileItem 型別
import SmartModal from '../component/SmartModal';
const MyTempUI: React.FC = () => {
    //   212, 240, 255
    //196, 223, 242
    const styles =  /* css */`
        .aero-blur {
            
            backdrop-filter: blur(15px) saturate(160%);
            -webkit-backdrop-filter: blur(15px) saturate(160%);
        }
      
        .vista-btn-gradient3 {
            background: linear-gradient(to bottom, 
               rgba(212,240,255,0.5) 0%, 
                rgba(124, 174, 207,0.5) 50%, 
                rgba(124, 174, 207,0.5) 51%, 
                rgba(124, 174, 207,0.5) 100%
            );
            border: 1px solid #717171;
            box-shadow: inset 0 1px 0 white;
        }

        .vista-btn-gradient2 {
            background: linear-gradient(to bottom, 
             rgba(212,240,255,0.5) 0%, 
                rgba(42,105,145,0.5) 50%, 
                rgba(42,105,145,0.5) 51%, 
                rgba(42,105,145,0.5) 100%
            );
            border: 1px solid #717171;
            box-shadow: inset 0 1px 0 white;
        }

        
        .vista-btn-gradient {
            background: linear-gradient(to bottom , 
                #f3f4f6 0%, #e5e7eb 50%, #d1d5db 51%, #9ca3af 100%);
            border: 1px solid #717171;
            box-shadow: inset 0 1px 0 white;
        }
        
     `;

    const VistaStyles = () => <style>{styles}</style>;

    useEffect(() => {

    }, []);

    // 處理開啟與關閉的動畫邏輯
    const Grid_Data1 = [

        {
            Name: 'blantt',
            Age: 'blantt Components',
            Tel: '123-456-7890',
            Email:
                'bb.com',
        },
        {
            Name: 'boy',
            Age: 'fish Components',
            Tel: '234-567-8901',
            Email:
                'bb2.com',
        },
        {
            Name: 'girl',
            Age: 'QQQ Components',
            Tel: '345-678-9012',
            Email:
                '',
        },

    ];


    const [checkedItems_old, setCheckedItems_old] = useState<any[]>([]); // 1. 新增 state

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading_modal, setIsLoading_modal] = useState(false);
    const [isLoading_modal2, setIsLoading_modal2] = useState(false);

    const [isLoading_modal_check, setIsLoading_modal_check] = useState(false);
    const [isLoading_smartModal, setIsLoading_smartModal] = useState(false);

    const [isLoading_modal_test, setIsLoading_modal_test] = useState(false);

    const handleButtonClick_modal = () => {
        setIsLoading_modal(true); // 顯示 Loading
    };
    // const handleButtonClick_modal2 = () => {
    //     setIsLoading_modal2(true); // 顯示 Loading
    // };


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
            <VistaStyles />
            <AppTitle title="My Dropdown Example" bkcolor="bg-green-600" btest='dd'
                onCheckItemsChange={(items) => console.log(items)}

            />
            <div className="flex justify-center items-center ">
                <div className="p-2">
                    <h1 className="text-sm font-bold mb-4">Drop sch check Grid </h1>
                    {/* 在drop 使用 grid havecheckbox 還沒完成,找時間再來處理!! */}
                    <MyDropGrid apiUrl="https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休"
                        columns={[
                            { name: 'empno', type: 'input', colSpan: 1 },
                            { name: 'fullname', type: 'input', colSpan: 1 },
                        ]}
                        keyValue='empno' keyText='fullname' gridCols={2}
                        useBar={true}
                        havecheckbox={true}
                        useSearch={true}

                    />

                </div>


            </div>



            <div className="flex justify-center items-center ">

                <div className="p-4">
                    <h1 className="text-sm font-bold mb-4">dropdown Example</h1>
                    <MyDropDown keyValue='sname' keyText='svalue'
                        options={fileOptions} style1='vistaBlue'
                        // onSelect={handleSelect2}
                        emptyText='我是誰'
                    />
                </div>

                <div className="p-4">
                    <h1 className="text-sm font-bold mb-4">dropdown(API) Example</h1>
                    <MyDropDown keyValue='ClassID' keyText='ClassName' haveBlank={true} emptyText='dropdown(API)選擇'
                        apiUrl="https://clockappservice.english4u.com.tw/api/clock/selectClockWorkClass"
                        onSelect={handleSelect3}
                    />
                </div>

                <div className="p-2">
                    <h1 className="text-sm font-bold mb-4">DropGrid(直接給數據)</h1>
                    <MyDropGrid data={fileOptions2} style1='vistaBlue'
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
                    <Button2 label="test btnstyle4"  style1='vistaBlue'
                        onClick={handleButtonClick_modal} />
                </div>
                <div>
                    <Button2 label="test btnstyle3" className='  vista-btn-gradient3 '
                        onClick={handleButtonClick_modal} />
                </div>
                <div>
                    <Button2 label="test btnstyle2" className='  vista-btn-gradient2 '
                        onClick={handleButtonClick_modal} />
                </div>

            </div>


            <div className="flex justify-center items-center  ">
                <div>
                    {/* <input type="text" id='gridChecklist' className="border border-gray-300 rounded-md px-3 py-2 mr-2"
                        placeholder="取得grid checkbox選擇" /> */}

                    <div id='gridChecklist'>
                        {/* 這裡是外部放置勾選清單的位置 */}



                    </div>
                </div>


                <div>

                    <div className="bg-[linear-gradient(to_bottom,#60a5fa_0%,#3b82f6_50%,#2563eb_51%,#1d4ed8_100%)]">
                        立體按鈕效果(classname)
                    </div>

                    <Button2 label="test btnstyle2" className=' '
                        onClick={handleButtonClick_modal} />

                    <Button2 className=' bg-cyan-100 text-sm text-amber-800 hover:bg-blue-500 hover:text-amber-50 '
                        label="test button2"
                        onClick={() => setIsLoading_modal2(true)} />


                </div>


                <div>
                    <Button2 icon={<img src={`${import.meta.env.BASE_URL}arrow_r.png`} alt="icon" style={{ width: 20, height: 20 }} />}
                        label="modal_checkgrid"
                        onClick={() => setIsLoading_modal_check(true)} />
                </div>
                <div>
                    <Button2 icon={<img src={`${import.meta.env.BASE_URL}arrow_r.png`} alt="icon" style={{ width: 20, height: 20 }} />}
                        label="smartModal"
                        onClick={() => setIsLoading_smartModal(true)} />
                </div>

                <div>
                    <Button2 icon={<img src={`${import.meta.env.BASE_URL}arrow_r.png`} alt="icon" style={{ width: 20, height: 20 }} />}
                        label="test modal new"
                        onClick={() => setIsLoading_modal_test(true)} />
                </div>
            </div>


            <div className="flex justify-center items-center  ">

                <div>
                    <Button2 icon={<DiscordIcon color='rgb(255, 87, 51)' />} label="modaltest"
                        onClick={() => setIsLoading_modal(true)} />
                </div>
                <div className='p-2'>
                    <Button2 icon={<AnotherIcon2 />} label="testLoad" onClick={handleButtonClick} />
                </div>
               

            </div>

            <Loading isLoading={isLoading} message="加載中..." />

            <Button2 label="test log" onClick={() => console.log(checkedItems_old)} />
            <Modal isOpen={isLoading_modal_check} onClose={() => setIsLoading_modal_check(false)}
                title="我是checkbox grid彈跳視窗"
                width="  w-4/5 " height=' h-4/5'
                footer={
                    <div className="flex justify-end">
                        <Button2 label="Close" onClick={() => setIsLoading_modal_check(false)} />
                    </div>
                }
            >
                <div className='h-[500px]'>
                    <DataGridApi
                        columns={[
                            { name: 'empno', type: 'input', showname: '員工編號', colSpan: 1, },
                            { name: 'fullname', type: 'input', showname: '全名', colSpan: 1, visible: false }
                        ]}

                        useBar={true}
                        havecheckbox={true}
                        useSearch={true}
                        checkedItems_old={checkedItems_old} // 2. 傳入已勾選項目
                        onCheckItemsChange={items => {
                            // console.log('com in onCheckItemsChange');
                            setCheckedItems_old(items); // 3. 更新 state
                            //console.log('之前勾選資料:', checkedItems_old);
                            const checklistDiv = document.getElementById('gridChecklist');
                            if (checklistDiv) {

                                checklistDiv.innerHTML = '<h3>勾選清單:</h3><ul>' +
                                    items.map(item => `<li>${item.empno.value} - ${item.fullname.value}</li>`).join('') +
                                    '</ul>';
                            }

                        }}
                        // customTransform={customTransform}
                        apiUrl="https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休"
                    />
                </div>


            </Modal>


            <Modal isOpen={isLoading_modal} onClose={() => setIsLoading_modal(false)} title="我是彈跳視窗"

                footer={
                    <div className="flex justify-end">
                        <Button2 label="Close" onClick={() => setIsLoading_modal(false)} />
                    </div>
                }
            >
                <p  >今天笑了嗎?</p>
                <Button2 label="close" onClick={() => setIsLoading_modal(false)} />

            </Modal>

            <Modal isOpen={isLoading_modal2} onClose={() => setIsLoading_modal2(false)} title="我是loading modal">
                <p>loading modal</p>
                <div className=' relative w-4/5 '>
                    <Button2 label="close" onClick={() => setIsLoading_modal2(false)} />
                    <LoadingInline isLoading={true} message="資料加載中..." />
                </div>

            </Modal>




        </div>


    );
};

export default MyTempUI;


