import React, { useState, useEffect } from 'react';
import MyDropDown from '../component/myDropDown';
import MyDropGrid, { transformToFormField as apitransform } from '../component/myDropGrid';
import AppTitle from '../component/header';
import Loading from '../component/myload';
import { LoadingInline } from '../component/myload';
import Modal from '../component/myModal';
import DataGridApi from '../component/myDataGrid';
import { Button } from "../component/button";
// import { Grid_Data1 } from "../data/data.js";
import { DiscordIcon, AnotherIcon, AnotherIcon2 } from "../component/mySvg";
import type { FileItem as DropdownOption } from '../component/myDropGrid'; // 匯入 FileItem 型別
import SmartModal from '../component/SmartModal';
import { Plus, Trash2, Save, ChevronRight, ChevronDown, Delete, Image as ImageIcon, AudioLines, MessageSquareMore, Pen, Icon } from 'lucide-react';
import MyGetApi, { useMyApi } from '../component/myGetApi';
import MyTab_v2 from '../component/myTab_v2';
import MyTab from '../component/myTab';
const app: React.FC = () => {
    const [dropRefreshKey, setDropRefreshKey] = useState(0); // 新增 state

    const [dropValue, setDropValue] = useState<string>('');


    const tabData = [
        {
            id: 'server',
            label: 'Server Admin',
            icon: <Plus size={18} />,
            content: (
                <div>
                    <h2 className="text-lg font-bold text-gray-700 mb-2">🖥️ Server Admin</h2>
                    <p className="text-gray-500 text-sm">Manage your servers, configure environments, and monitor uptime.</p>
                </div>
            )
        },
        {
            id: 'web',
            label: 'Web Design',
            icon: <Delete size={18} />,
            content: (
                <div>
                    <h2 className="text-lg font-bold text-gray-700 mb-2">🎨 Web Design</h2>
                    <p className="text-gray-500 text-sm">Craft beautiful, responsive interfaces with modern design tools.</p>
                </div>
            )
        },
        {
            id: 'marketing',
            label: 'Marketing',
            content: (
                <div>
                    <h2 className="text-lg font-bold text-gray-700 mb-2">📣 Marketing</h2>
                    <p className="text-gray-500 text-sm">Drive growth with data-driven campaigns and brand strategies.</p>
                </div>
            )
        }
    ];

    return (
        <div className="p-1  ">
            <AppTitle title="測試頁面tempui3" />
            <MyTab
                tabs={tabData}
                keepAlive={true}

            />

            <MyTab_v2
                tabs={tabData}
                keepAlive={true}
                onChange={(activeId) => console.log('目前選中頁籤：', activeId)}
            />

            <div>

                <div className="flex justify-center items-center ">



                    <div className="p-2">

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
                    <Button label="重新載入" onClick={() => {
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
