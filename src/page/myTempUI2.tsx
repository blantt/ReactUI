import React, { useState, useEffect } from 'react';
import MyDropDown from '../component/myDropDown';
import MyDropGrid, { transformToFormField as apitransform } from '../component/myDropGrid';
import AppTitle from '../component/header';
import Loading from '../component/myload';
import { LoadingInline } from '../component/myload';
import Modal from '../component/myModal';
import DataGridApi from '../component/myDataGrid';
import { Button2 } from "../component/button";
// import { Grid_Data1 } from "../data/data.js";
import { DiscordIcon, AnotherIcon, AnotherIcon2 } from "../component/mySvg";
import type { FileItem as DropdownOption } from '../component/myDropGrid'; // 匯入 FileItem 型別
import SmartModal from '../component/SmartModal';
import MyGetApi from '../component/myGetApi';

const app: React.FC = () => {

    const [jsonData, setJsonData] = useState<any[]>([]); // 儲存 JSON 陣列

    const [showApi, setShowApi] = useState(false);
    const [apiUrl一例一休, setApiUrl] = useState("");

  
    const fetchData = async () => {

        try {
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            const apiUrl = isLocal
                ? `http://localhost:52538/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休`
                : `https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休`;

            // const apiUrl = `/HandlerApiTest.ashx`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let parsedData;

            if (typeof data === 'string') {
                parsedData = JSON.parse(data);
            } else {
                parsedData = data;
            }

            // 判斷是否為 JSON 陣列
            if (Array.isArray(parsedData)) {

                setJsonData(parsedData); // 儲存 JSON 陣列

            } else {
                throw new Error('資料格式錯誤，應為 JSON 陣列');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('資料取得失敗' + error);
        }
    };

    React.useEffect(() => {
        //  setApiUrl(apiUrl一例一休);
        //  fetchData();
        //  setShowButton(false);
    }, []);



    // 將資料依據 empno 群組
    const groupedData = jsonData.reduce((groups: any, item: any) => {
        const empno = item.empno;  // 取得員工編號作為分組的 key
        if (!groups[empno]) {
            groups[empno] = []; // 如果該 empno 尚未存在於 groups，初始化為空陣列
        }
        groups[empno].push(item); // 將該筆資料 (item) 加入對應 empno 的陣列中
        return groups;
    }, {});

    function oldGetApi() {
        fetchData();
    }

    function GetApiFromUI() {
        // 加上時間戳，確保每次都重新 fetch

      //  setApiUrl(`${apiUrl一例一休}&t =${Date.now()}`);
            const tempapi = 'https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休'
            setApiUrl(`${tempapi}&t =${Date.now()}`);

         //  setApiUrl("https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休&t=" + Date.now());
    }

    return (
        <div>

            
            {apiUrl一例一休 && (

                <MyGetApi apiUrl={apiUrl一例一休}  asJson={true}>
                    {({ loading, error, data, status }) => {
                        if (loading) return <div>MyGetApi 載入中...</div>;
                        if (error) return <div style={{ color: 'red' }}>失敗: {String(error)}</div>;
                        if (status === 'success') {
                          //  alert('MyGetApi 成功取得資料！');
                            // 你可以在這裡自訂處理 data（即 parsedData）
                            setJsonData(data); // 或其他自訂處理
                            return <div>MyGetApi 成功取得資料！</div>;
                        }
                        return null;
                    }}
                </MyGetApi>

            )}


            <AppTitle title="My tempui2" />
            <div className="flex justify-center items-center ">

                <Button2 label="Old fetch API" onClick={oldGetApi} />
                <span className="mx-2"></span>
                <Button2 label="MyGetApi fetch API" onClick={GetApiFromUI} />

            </div>

            <h1>輪班制一例一休查詢</h1>

            {Object.keys(groupedData).map((empno, index) => (
                <div key={index} className="mb-6">
                    {/* 表頭 */}
                    <h2 className="text-lg font-bold text-blue-600">員工編號: {empno}</h2>
                    <div className="text-gray-700">姓名: {groupedData[empno][0].fullname}</div>

                    {/* 細項 */}
                    {groupedData[empno].map((item: any, subIndex: number) => (
                        <div key={subIndex} className="ml-4 mt-2">
                            <pre className="text-sm bg-gray-100 p-2 rounded">
                                <div>
                                    {'週期'}: {item.weektype}, {'開始日期'}: {item.sdate}, {'結束日期'}: {item.edate}
                                </div>
                                <div>
                                    {'訊息'}: {item.message}
                                </div>
                                {item.message_error && (
                                    <div style={{ color: 'red' }}>
                                        {'不合規定'}: {item.message_error}
                                    </div>
                                )}
                            </pre>
                        </div>
                    ))}
                </div>
            ))}


        </div>


    );

}

export default app;
