import { useState } from 'react';

export type DownLoadProps = {
    fileUrl: string;
    fileName: string;
    mode?: 'download' | 'open';
};

export type UseFileDownloadReturn = {
    loading: boolean;
    status: string;
    downloadWithBlob: (props: DownLoadProps) => Promise<void>;
};

export const useFileDownload = (): UseFileDownloadReturn => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const downloadWithBlob = async ({ fileUrl, fileName, mode }: DownLoadProps) => {
        try {
            setLoading(true);
            setStatus(`正在準備下載: ${fileName}...`);

            // 在實際場景中，這裡可以加上 headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
            const response = await fetch(fileUrl);

            if (!response.ok) throw new Error('檔案下載失敗');

            // 將回應轉為 Blob (Binary Large Object)
            const blob = await response.blob();

            // 建立一個暫時的 URL 指向該 Blob
            const url = window.URL.createObjectURL(blob);

            if (mode === 'open') {
                window.open(url, '_blank');
                setStatus('檔案已在新分頁開啟！');
                // 延遲釋放 URL，避免新分頁還未讀取資料即被撤銷
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                return;
            }

            // 建立隱藏的 <a> 標籤並觸發點擊
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // 清理資源
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            setStatus('下載完成！');
        } catch (error) {
            console.error('Download error:', error);
            setStatus('下載出錯，請檢查網絡或 CORS 設定。');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return { loading, status, downloadWithBlob };
};
