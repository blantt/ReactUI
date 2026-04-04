import React, { useEffect, useState ,useRef,useCallback} from 'react';

export type MyGetApiProps = {
    apiUrl: string;
    asJson?: boolean; // true: 回傳 JSON，false: 回傳字串
    haveCredentials?: boolean; // 是否包含憑證(後端可讀取到session)
     method?: 'GET' | 'POST';
    postData?: Record<string, string>; // POST 的資料，例如 { action: 'blanttApi', func: 'testabc' }
    onProgress?: (status: 'loading' | 'success' | 'error', data?: any, error?: any) => void;
    children?: (args: {
        loading: boolean;
        error: any;
        data: any;
        status: 'loading' | 'success' | 'error';
    }) => React.ReactNode;
};

/**
 * ### MyGetApi API 請求元件v3
 *
 *  * />
 */
const MyGetApi: React.FC<MyGetApiProps> = ({ apiUrl, asJson = true, haveCredentials = false, onProgress, children,
      method = 'GET',       // ✅ 預設 GET
    postData,             // ✅ POST 的資料
 }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        setStatus('loading');
        setData(null);
        
        const fetchData = async () => {
            try {
                const fetchOptions: RequestInit = {};
                if (haveCredentials) {
                    fetchOptions.credentials = 'include'; // 如果條件成立，就加入 credentials
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
                if (isMounted) {
                    setData(result);
                    setStatus('success');
                    setLoading(false);
                    onProgress && onProgress('success', result, null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    setStatus('error');
                    setLoading(false);
                    onProgress && onProgress('error', null, err);
                }
            }
        };
        fetchData();
        onProgress && onProgress('loading');
        return () => { isMounted = false; };
    }, [apiUrl, asJson]);

    if (children) {
        return <>{children({ loading, error, data, status })}</>;
    }
    // 預設渲染
    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {String(error)}</div>;
    return <pre>{asJson ? JSON.stringify(data, null, 2) : String(data)}</pre>;
};


//hook版本===================================
 
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';
export type ExecuteResult = {
    data: any;
    status: 'success' | 'error' | 'idle';
    error: any;
};
export type MyApiOptions = {
    apiUrl: string;
    asJson?: boolean;
    haveCredentials?: boolean;
    method?: 'GET' | 'POST';
    postData?: Record<string, any>;
    onProgress?: (status: ApiStatus, data?: any, error?: any) => void;
};

export type UseMyApiReturn = {
    loading: boolean;
    error: any;
    data: any;
    status: ApiStatus;
  execute: (overrideOptions?: Partial<MyApiOptions>) => Promise<ExecuteResult | null>;
};


export type MyGetApi_hook = MyApiOptions & {
    children?: (args: {
        loading: boolean;
        error: any;
        data: any;
        status: ApiStatus;
        execute: (overrideOptions?: Partial<MyApiOptions>) => Promise<ExecuteResult | null>;
    }) => React.ReactNode;
};

/**
 * ### useMyApi 自定義 Hook，用於處理 API 請求
 *
 * ---
 * #### ApiStatus 狀態說明
 * | 狀態 | 說明 |
 * |------|------|
 * | `'idle'`    | 初始狀態，尚未發出任何請求 |
 * | `'loading'` | 請求進行中 |
 * | `'success'` | 請求成功 |
 * | `'error'`   | 請求失敗 |
 *
 * ---
 * #### MyApiOptions 參數說明
 * @param {string}  options.apiUrl          - **(必填)** API 的 URL 位址
 * @param {boolean} [options.asJson=true]   - 是否將回應解析為 JSON（預設 `true`，false 時回傳純字串）
 * @param {boolean} [options.haveCredentials=false] - 是否附帶 Cookie 憑證（跨域 Session 需設為 `true`）
 * @param {'GET'|'POST'} [options.method='GET'] - HTTP 請求方法（預設 `'GET'`）
 * @param {Record<string, any>} [options.postData]  - POST 時要傳送的表單資料
 * @param {Function} [options.onProgress]   - 狀態變更回呼：`(status, data?, error?) => void`
 *
 * ---
 * #### execute 方法（useCallback）
 * - `execute(overrideOptions?)` 為命令式觸發函式，以 `useCallback` 包裝，確保參考穩定不重複建立。
 * - 可在呼叫時傳入 `overrideOptions` 覆蓋初始設定（例如動態切換 apiUrl 或 postData）。
 * - 回傳 `Promise<ExecuteResult>` 可直接 `await` 取得結果，不需等待 React 狀態更新。
 *   ```ts
 *   type ExecuteResult = { data: any; status: 'success' | 'error' | 'idle'; error: any }
 *   ```
 *
 * ---
 * #### 使用範例
 * ```tsx
 * // 基本 GET 請求
 * const { loading, data, status, execute } = useMyApi({
 *   apiUrl: '/api/user/list',
 *   asJson: true,
 * });
 *
 * // 手動觸發（例如按鈕點擊）
 * const handleSubmit = async () => {
 *   const result = await execute({
 *     method: 'POST',
 *     postData: { action: 'login', user: 'admin' },
 *   });
 *   if (result?.status === 'success') {
 *     console.log('回傳資料:', result.data);
 *   } else {
 *     console.error('錯誤:', result?.error);
 *   }
 * };
 *
 * return (
 *   <div>
 *     {loading && <p>載入中...</p>}
 *     {status === 'error' && <p>發生錯誤</p>}
 *     {status === 'success' && <pre>{JSON.stringify(data, null, 2)}</pre>}
 *     <button onClick={handleSubmit}>送出</button>
 *   </div>
 * );
 * ```
 *
 * @param {MyApiOptions} initialOptions - 初始 API 選項設定
 * @returns {UseMyApiReturn} `{ loading, error, data, status, execute }`
 */
export const useMyApi = (initialOptions: MyApiOptions): UseMyApiReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState<ApiStatus>('idle');
    
    // 使用 useRef 來追蹤組件是否還掛載著，避免記憶體洩漏
    const isMounted = useRef(true);
     // ✅ 用 useRef 儲存最新的 options，避免閉包問題
    const optionsRef = useRef(initialOptions);
    useEffect(() => {
        optionsRef.current = initialOptions;
    });

    useEffect(() => {
        isMounted.current = true;  // ✅ 每次掛載時重設為 true

        return () => {
          // console.log("元件卸載時的清理動作");
            isMounted.current = false;
           
        };
    }, []);
    // 命令式觸發模式, execute 函式接受可選的覆蓋選項，允許在執行時動態修改 API 請求參數
    const execute = useCallback(async (overrideOptions?: Partial<MyApiOptions>) => {
        const options = { ...optionsRef.current, ...overrideOptions };
        const { apiUrl, asJson = true, haveCredentials = false, method = 'GET', postData, onProgress } = options;

        if (!isMounted.current) return null;

        setLoading(true);
        setError(null);
        setStatus('loading');
        onProgress?.('loading');
              
        try {
            const fetchOptions: RequestInit = {};
            
            if (haveCredentials) {
                fetchOptions.credentials = 'include';
            }

            if (postData instanceof FormData) {

                // 如果是 FormData，不需要手動設定 Headers 的 Content-Type
                // 瀏覽器會自動設為 multipart/form-data 並加上正確的 boundaryww
                fetchOptions.body = postData;

                // 如果原本 fetchOptions 已經有預設 headers，請確保裡面沒有 Content-Type
                // fetchOptions.headers = { ...fetchOptions.headers };
            } else if (method === 'POST' && postData) {
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
                // 處理部分後端回傳雙重 JSON 字串的情況
                result = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } else {
                result = await response.text();
            }

            if (isMounted.current) {
                setData(result);
                setStatus('success');
                setLoading(false);
                onProgress?.('success', result, null);
                // return result;  
                 // 明確 Return 給外部呼叫者 (handleCheck)
                // 這裡回傳的是一個全新的物件，外部透過 await execute() 就能立刻解構出這些欄位
                // 這樣可以避開 React State 更新緩慢（下一次 Render 才生效）的問題
                    return { data: result, status: 'success' as const, error: null };
            }
             return { data: null, status: 'idle' as const, error: null }; // ✅ isMounted 為 false 時
        } catch (err) {
            if (isMounted.current) {
                setError(err);
                setStatus('error');
                setLoading(false);
                onProgress?.('error', null, err);
            }
             return { data: null, status: 'error' as const, error: err }; // ✅ 錯誤時
        }
     }, []); // ✅ 不需要依賴任何東西

    return { loading, error, data, status, execute };
};
 

export default MyGetApi;

 


