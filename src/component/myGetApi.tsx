import React, { useEffect, useState } from 'react';

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

export default MyGetApi;

  


