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

import MyGetApi, { useMyApi } from '../component/myGetApi';

const app: React.FC = () => {
    const [dropRefreshKey, setDropRefreshKey] = useState(0); // 新增 state

    const [dropValue, setDropValue] = useState<string>('');


    return (
        <div className="p-1  ">
            <AppTitle title="測試頁面tempui3" />
            <div className="flex justify-center items-center ">

                <div className="p-2">
                    <div>
                        test DropDown refresh
                    </div>
                    <MyDropDown keyValue='ClassID' keyText='ClassName' haveBlank={true} emptyText='dropdown(API)選擇'
                        apiUrl="https://clockappservice.english4u.com.tw/api/clock/selectClockWorkClass"
                        value={dropValue}
                        onSelect={(option) => {
                            //  alert(`Selected name, value: ${option.ClassName} (${option.ClassID})`);
                            setDropValue(option.ClassID);
                        }}
                        refreshKey={dropRefreshKey}
                    />

                </div>
                <div>
                    <Button2 label="重新載入" onClick={() => {
                        setDropRefreshKey(prev => prev + 1)
                        setDropValue('9');

                    }} />
                </div>

                {/* 這裡預計呈現一個美觀的card樣式容器 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-lg font-medium mb-4">Card Title</div>
                    <div className="text-gray-600">Card Content</div>
                </div>



            </div>

        </div>
    );

}

export default app;
