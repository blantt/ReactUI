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
    execute: (overrideOptions?: Partial<MyApiOptions>) => Promise<void>;
};


export type MyGetApi_hook = MyApiOptions & {
    children?: (args: {
        loading: boolean;
        error: any;
        data: any;
        status: ApiStatus;
        execute: (overrideOptions?: Partial<MyApiOptions>) => Promise<void>;
    }) => React.ReactNode;
};

/**
 * ### useMyApi 自定義 Hook，用於處理 API  
 *
 *  * />
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

    const execute = useCallback(async (overrideOptions?: Partial<MyApiOptions>) => {
        const options = { ...optionsRef.current, ...overrideOptions };
        const { apiUrl, asJson = true, haveCredentials = false, method = 'GET', postData, onProgress } = options;

        if (!isMounted.current) return;

        setLoading(true);
        setError(null);
        setStatus('loading');
        onProgress?.('loading');

        try {
            const fetchOptions: RequestInit = {};
            
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
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err);
                setStatus('error');
                setLoading(false);
                onProgress?.('error', null, err);
            }
        }
     }, []); // ✅ 不需要依賴任何東西

    return { loading, error, data, status, execute };
};
 

export default MyGetApi;

 


