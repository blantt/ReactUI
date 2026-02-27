
import { useState, useEffect } from "react";
import Button from "../component/button";
import MyGetApi from "../component/myGetApi";
export default function app() {

    const [data, setData] = useState([]); // 用於儲存 API 返回的資料
    const [loading, setLoading] = useState(true); // 用於顯示載入狀態
    const [error, setError] = useState(null); // 用於顯示錯誤訊息

    // 呼叫 API,useEffect範例,是一進入頁面就執行
    // useEffect(() => {
    //     fetch("http://localhost:3001/api/data") // 替換為你的 API URL
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             setData(data);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             setError(error.message);
    //             setLoading(false);
    //         });
    // }, []);

    // 按下按鈕時觸發 API 呼叫
    const fetchData = () => {
        setLoading(true); // 開始載入
        setError(null); // 清除之前的錯誤訊息

        fetch("/path/to/myapi.php") // 替換為你的相關 路徑
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false); // 載入完成
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false); // 載入完成
            });
    };

    return (
        <div className="min-h-screen flex flex-col">
        
             <MyGetApi apiUrl={"https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休"}   asJson={true}>
                    {({ loading, error, data, status }) => {

                        if (loading) return <div>MyGetApi 載入中...</div>;
                        if (error) return <div style={{ color: 'red' }}>失敗: {String(error)}</div>;
                        if (status === 'success') {
                                alert('MyGetApi 成功取得資料，請查看 console.log');
                                console.log('MyGetApi 成功取得資料:', data);

                        }
                        return null;
                    }}
                </MyGetApi>


            <div>
                API測試頁面
                <div className="space-x-4">
                    {/* onClick={() => callUrl( "apiTest")} */}
                    <Button label="apiTest" />
                    <Button label="觸發api" onClick={fetchData} />
                </div>
            </div>


            {/* 這裡呈現最頁面最下方,提供顥示api回傳的訊 */}

            <div className=" mt-80 p-2 border ">
                <h2>API回傳結果:</h2>
                <div id="apiResult" className="mt-auto p-2 border border-gray-300">
                {loading && <p>載入中...</p>}
                {error && <p className="text-red-500">錯誤: {error}</p>}
                {!loading && !error && data.length > 0 && (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index} className="mb-2">
                                {/* <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-8 h-8 inline-block mr-2"
                                />
                                <strong>{item.title}:</strong> {item.description} */}
                            </li>
                        ))}
                    </ul>
                )}
                {!loading && !error && data.length === 0 && <p>沒有資料。</p>}
            </div>
            </div>
        </div>

    )

}
