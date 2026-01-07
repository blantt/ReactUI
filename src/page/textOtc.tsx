import React, { useState, useEffect } from 'react';
import MyDropDown from '../component/myDropDown';
import MyDropGrid, { transformToFormField as apitransform } from '../component/myDropGrid';
import AppTitle from '../component/header.tsx';
import Loading from '../component/myload';
import Modal from '../component/myModal';
import { Button2 } from "../component/button.tsx";

import type { FileItem as DropdownOption } from '../component/myDropGrid'; // 匯入 FileItem 型別

export interface CheckItem {
    classid: string;
    classname: string;
}

const page: React.FC = () => {
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const handleCheck = (item: CheckItem, checked: boolean) => {
        if (checked) 
            {
            //prev 代表目前的 checkItems 陣列,...prev 是展開原本所有元素,[...prev, item] 就是「原本的全部」加上「新 item」
            setCheckItems(prev => [...prev, item]);
        } else {
            setCheckItems(prev => prev.filter(i => i.classid !== item.classid));
        }
    };
    const [data1, setdata1] = useState<any[]>([]);
    const fetchData = async () => {

        // setLoading(true);
        try {
            const apiUrl = 'https://clockappservice.english4u.com.tw/api/clock/selectClockWorkClass'; // 替換為你的 API URL
            const response = await fetch(apiUrl);
           
            if (!response.ok) {
                alert(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();
             
            setdata1(jsonData);
            
            // console.log('com in apichange:', internalOptions);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('資料取得失敗' + error);
        } finally {
            //setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div>
            <AppTitle title="OTC 測試頁面" />
            <div>
                data1menu check item show
            </div>
            <div id="checkmenu1" className='w-full h-10 bg-slate-200 flex items-center px-2'>
                {checkItems.map(i => i.classname).join(', ')}
            </div>

            <div className="w-4/5 h-screen  mx-auto pt-4 bg-amber-100 
               flex   ">
                <div id="data1menu" className="w-2/5 bg-blue-100 h-full overflow-y-auto">
                    aaa
                    {data1.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 py-1 px-2">
                            <input
                                type="checkbox"
                                checked={checkItems.some(i => i.classid === item.ClassID)}
                                onChange={e =>
                                    handleCheck(
                                        { classid: item.ClassID, classname: item.ClassName },
                                        e.target.checked
                                    )
                                }
                            />
                            <span>{item.ClassID} - {item.ClassName}</span>
                        </div>
                    ))}
                </div>

                <div className=' w-3/5 bg-blue-200 '>
                    bbb
                </div>
            </div>

        </div>
    );

};

export default page;


