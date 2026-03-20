import React, { useState, useCallback, useEffect, useRef } from 'react';
import MyGetApi,{useMyApi as useMyApi2} from '../component/myGetApi';


// export { default as MyGetApi, useMyApi   } from './component/myGetApi';

// --- Types 定義 ---

/** API 狀態類型 */
type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

/** API 配置項類型 */
type MyApiOptions = {
    apiUrl: string;
    asJson?: boolean;
    haveCredentials?: boolean;
    method?: 'GET' | 'POST';
    postData?: Record<string, any>;
    onProgress?: (status: ApiStatus, data?: any, error?: any) => void;
};

// --- Custom Hook: useMyApi ---

/**
 * 自定義 Hook，用於處理 API 請求3
 * 採用 Latest Ref Pattern 以確保 execute 函式的穩定性
 */
export const useMyApi = (initialOptions: MyApiOptions) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState<ApiStatus>('idle');

    const isMounted = useRef(true);
    const optionsRef = useRef(initialOptions);
    const abortControllerRef = useRef<AbortController | null>(null);

    // 同步最新的配置到 Ref 中
    useEffect(() => {
        optionsRef.current = initialOptions;
    });

    // 元件卸載時的清理動作
   useEffect(() => {
        isMounted.current = true;  // ✅ 每次掛載時重設為 true

        return () => {
            console.log("元件卸載時的清理動作");
            isMounted.current = false;
            abortControllerRef.current?.abort();
        };
    }, []);

    const execute = useCallback(async (overrideOptions?: Partial<MyApiOptions>) => {
        const options = { ...optionsRef.current, ...overrideOptions };
        const { apiUrl, asJson = true, haveCredentials = false, method = 'GET', postData, onProgress } = options;

        console.log('開始 API 請求:', apiUrl);

        console.log("loading current..", isMounted.current)

        if (!isMounted.current) return;


        console.log("loading1..")

        // 取消先前的請求，避免 Race Condition
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);
        setStatus('loading');
        onProgress?.('loading');

        console.log("loading2..")

        try {
            const fetchOptions: RequestInit = {
                signal: abortControllerRef.current.signal
            };

            if (haveCredentials) {
                fetchOptions.credentials = 'include';
            }

            if (method === 'POST' && postData) {
                fetchOptions.method = 'POST';
                fetchOptions.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                };
                fetchOptions.body = new URLSearchParams(postData).toString();
            }

            const response = await fetch(apiUrl, fetchOptions);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            let result: any;
            if (asJson) {
                const raw = await response.json();
                result = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } else {
                result = await response.text();
            }

            if (isMounted.current) {
                setData(result);
                setStatus('success');
                setLoading(false);
                onProgress?.('success', result, null);
            }
        } catch (err: any) {
            if (err.name === 'AbortError') return;

            if (isMounted.current) {
                setError(err);
                setStatus('error');
                setLoading(false);
                onProgress?.('error', null, err);
            }
        }
    }, []);

    return { loading, error, data, status, execute };
};

// --- 主要範例元件 ---

const App = () => {
    // 初始化 API Hook

    const { loading: loading2, error : error2, data: data2, status: status2, execute: execute2 } = useMyApi2({
        apiUrl: 'https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休',
        method: 'GET',
        asJson: true,
    });


    const { loading, error, data, status, execute } = useMyApi({
        apiUrl: 'https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休',
        method: 'GET',
        asJson: true,
    });

    const handleButtonClick2 = () => {
        // 按下按鈕才觸發 execute
        //alert('即將發送 API 請求，請查看下方結果區域...');
        execute2();
    };

    const handleButtonClick = () => {
        // 按下按鈕才觸發 execute
        //alert('即將發送 API 請求，請查看下方結果區域...');
        execute();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-100">
                <header className="border-b border-gray-100 pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">API 功能測試範例</h1>
                    <p className="text-sm text-gray-500 mt-1">使用指令式 Hook 觸發 API 請求</p>
                </header>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs font-mono text-blue-700 break-all">
                        <span className="font-bold mr-2 text-blue-900">Endpoint:</span>
                        https://editor.4kids.com.tw/Portal/apitest/HandlerApiTest.ashx?func=Cehck輪班制一例一休
                    </p>
                </div>

                <div className="flex items-center justify-between">

                    <button
                        onClick={handleButtonClick2}
                        disabled={loading2}
                        className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95
              ${loading2
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-lime-600 shadow-indigo-200'
                            }`}
                    >
                        {loading2 ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                傳輸中...
                            </>
                        ) : (
                            '點擊獲取資料(ui版)'
                        )}
                    </button>


                    <button
                        onClick={handleButtonClick}
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
                            '點擊獲取資料(本頁版測試用)'
                        )}
                    </button>

                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Status</span>
                        <span className={`text-lg font-black ${status === 'success' ? 'text-emerald-500' :
                                status === 'error' ? 'text-rose-500' :
                                    status === 'loading' ? 'text-amber-500' : 'text-gray-300'
                            }`}>
                            {status}
                        </span>
                    </div>
                </div>

                {/* 錯誤反饋 */}
                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                        <div className="text-rose-500 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        </div>
                        <div>
                            <p className="font-bold text-rose-800 text-sm">請求失敗</p>
                            <p className="text-xs text-rose-600 font-mono mt-1">{String(error)}</p>
                        </div>
                    </div>
                )}

                {/* 結果區域 */}

                <div className="relative group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Response Data(UI)</label>
                        {data2 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">SUCCESS</span>}
                    </div>
                    <div className="w-full bg-gray-900 rounded-xl p-6 min-h-[160px] overflow-hidden">
                        {data2 ? (
                            <pre className="text-emerald-400 font-mono text-xs leading-relaxed overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-700">
                                {JSON.stringify(data2, null, 2)}
                            </pre>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                                {loading2 ? '正在解析資料回傳中...' : '尚未發送請求或無回傳資料'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Response Data</label>
                        {data && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">SUCCESS</span>}
                    </div>
                    <div className="w-full bg-gray-900 rounded-xl p-6 min-h-[160px] overflow-hidden">
                        {data ? (
                            <pre className="text-emerald-400 font-mono text-xs leading-relaxed overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-700">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                                {loading ? '正在解析資料回傳中...' : '尚未發送請求或無回傳資料'}
                            </div>
                        )}
                    </div>
                </div>

                <footer className="pt-4 text-center">
                    <p className="text-[10px] text-gray-300">本範例使用 React Hook 模式封裝 API 邏輯</p>
                </footer>
            </div>
        </div>
    );
};

export default App;