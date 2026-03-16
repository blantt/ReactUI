
import { useState, useEffect } from "react";
import Button from "../component/button";
import MyGetApi, { useMyApi } from "../component/myGetApi";
import Loading from '../component/myload';

//import { MyGetApi } from 'fish-reactui';
export default function app() {

    const [data, setData] = useState([]); // 用於儲存 API 返回的資料
    const [loading, setLoading] = useState(true); // 用於顯示載入狀態
    const [loading_h, setLoading_h] = useState(false);
    const [error, setError] = useState(null); // 用於顯示錯誤訊息

    const { loading: loading2, data: data2, execute, status } = useMyApi({
        apiUrl: 'https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休',
        method: 'POST',
        onProgress: (status, data, error) => {
            if (status === 'loading') alert('載入中...');
            if (status === 'success') {
                alert('成功！');
                console.log('資料:', data);
            }
            if (status === 'error') {
                alert('失敗！');
                console.error(error);
            }
        }
    });


    // 初始化 API Hook
    const { loading: loading3, error: error3, data: data3, status: status3, execute: execute3 } = useMyApi({
        apiUrl: 'https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休',
        method: 'GET',
        asJson: true,
    });

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

            <Loading isLoading={loading_h} message="讀取api中..." />

            <MyGetApi apiUrl={"https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休"} asJson={true}>
                {({ loading, error, data, status }) => {

                    if (loading) return <div>MyGetApi 載入中...</div>;
                    if (error) return <div style={{ color: 'red' }}>失敗: {String(error)}</div>;
                    if (status === 'success') {
                        // alert('MyGetApi 成功取得資料，請查看 console.log');
                        // console.log('MyGetApi 成功取得資料:', data);

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

                    <Button label="api hook版本"
                        onClick={() => {
                            alert('開始執行 MyGetApi_hook，請查看 console.log');
                            execute();
                            setLoading_h(loading2);
                            // // 這裡可以根據 status 來顯示不同的訊息
                            // if (status === 'loading') {
                            //     alert('MyGetApi_hook 載入中...');
                            // } else if (status === 'error') {
                            //     alert('MyGetApi_hook 失敗，請查看 console.log');
                            //     console.error('MyGetApi_hook 失敗:', data2);
                            // } else if (status === 'success') {
                            //     alert('MyGetApi_hook 成功取得資料，請查看 console.log');
                            //     console.log('MyGetApi_hook 成功取得資料:', data2);
                            // }

                        }}
                    />


                    <button
                        onClick={() => execute()}
                        disabled={loading}
                        className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95
              ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                傳輸中...
                            </>
                        ) : (
                            '點擊獲取資料'
                        )}
                    </button>

                </div>
            </div>


            {/* 這裡呈現最頁面最下方,提供顥示api回傳的訊 */}

            <div className=" mt-80 p-2 border ">
                <h2>API回傳結果:</h2>
                <div id="apiResult" className="mt-auto p-2 border border-gray-300">
                    {loading3 && <p>載入中...</p>}
                    {error3 && <p className="text-red-500">錯誤: {error3}</p>}
                    {loading3 ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            傳輸中...
                        </>
                    ) : (
                        '點擊獲取資料'
                    )}
                </div>
            </div>

            {/* 結果區域 */}
            <div className="relative group">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Response Data</label>
                    {data3 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">SUCCESS</span>}
                </div>
                <div className="w-full bg-gray-900 rounded-xl p-6 min-h-[160px] overflow-hidden">
                    {data3 ? (
                        <pre className="text-emerald-400 font-mono text-xs leading-relaxed overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-700">
                            {JSON.stringify(data3, null, 2)}
                        </pre>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                            {loading3 ? '正在解析資料回傳中...' : '尚未發送請求或無回傳資料'}
                        </div>
                    )}
                </div>
            </div>
        </div>

    )

}
