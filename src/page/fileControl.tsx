import React, { useState } from 'react';
import { Download, FileText, Archive, FileSpreadsheet, ExternalLink, Loader2 } from 'lucide-react';
import { useFileDownload } from '../component/myfileControl';
type ModalProps = {

};

const App = ({ }: ModalProps) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    type DownLoadProps = {
        fileUrl: string;
        fileName: string;
        mode?: 'download' | 'open';
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'txt': return <FileText className="w-5 h-5 text-blue-500" />;
            case 'zip': return <Archive className="w-5 h-5 text-orange-500" />;
            case 'excel': return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
            default: return <Download className="w-5 h-5" />;
        }
    };

    // 模擬從後端取得的檔案路徑
    const filePaths = [
        {
            name: '專案本地文件 (Public)',
            path: '/mynote.txt', // 假設放在專案的 public 資料夾中
            type: 'txt',
        },
        { name: '範例文件.txt', path: 'https://www.w3.org/TR/PNG/iso_8859-1.txt', type: 'txt' },
        { name: '測試壓縮檔.zip', path: 'https://example.com/sample.zip', type: 'zip' },
        { name: '財務報表.xlsx', path: 'https://example.com/report.xlsx', type: 'excel' }
    ];

  
    const downloadWithBlob = async ({ fileUrl, fileName, mode }: DownLoadProps) => {
        try {
            setLoading(true);
            setStatus(`正在準備下載: ${fileName}...`);

            // 模擬 API 請求
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
                return;
            } else {
                // 建立隱藏的 <a> 標籤並觸發點擊
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); // 設定下載檔名
                document.body.appendChild(link);
                link.click();

                // 清理資源
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
            }


            // 注意：如果是 'open' 模式，建議延遲釋放 URL，否則新分頁可能讀不到資料
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);

            setStatus(mode === 'download' ? '下載完成！' : '已嘗試開啟檔案');
        } catch (error) {
            console.error('Download error:', error);
            setStatus('下載出錯，請檢查網絡或 CORS 設定。');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 3000);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">React 檔案下載功能</h1>
                    <p className="text-gray-600 mt-2">展示如何從後端路徑下載 TXT, ZIP, Excel 等檔案</p>
                </header>

                {/* 狀態提示區 */}
                {status && (
                    <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${status.includes('失敗') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {status}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700 border-b">檔案名稱</th>
                                <th className="p-4 font-semibold text-gray-700 border-b">格式</th>
                                <th className="p-4 font-semibold text-gray-700 border-b">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filePaths.map((file, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 border-b text-gray-800 font-medium">{file.name}</td>
                                    <td className="p-4 border-b uppercase text-xs font-bold text-gray-500">
                                        <div className="flex items-center gap-2">
                                            {getIcon(file.type)}
                                            {file.type}
                                        </div>
                                    </td>
                                    <td className="p-4 border-b space-x-2">
                                        {/* 按鈕 1：Blob 下載 */}
                                        <button
                                            onClick={() => downloadWithBlob({ fileUrl: file.path, fileName: file.name, mode: 'download' })}
                                            disabled={loading}
                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            <Download className="w-4 h-4 mr-1" />
                                            API 下載 (Blob)
                                        </button>

                                       <button
                                            onClick={() => downloadWithBlob({ fileUrl: file.path, fileName: file.name, mode: 'open' })}
                                            disabled={loading}
                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            <Download className="w-4 h-4 mr-1" />
                                           open (Blob)
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-xl">
                    <h3 className="text-amber-800 font-bold mb-2">💡 開發注意事項：</h3>
                    <ul className="list-disc list-inside text-amber-700 space-y-2 text-sm">
                        <li><strong>CORS 問題：</strong> 如果檔案主機與前端網域不同，後端必須設定 <code className="bg-amber-100 px-1">Access-Control-Allow-Origin</code>。</li>
                        <li><strong>安全性：</strong> 透過 Blob 方式下載，可以在 Header 攜帶 JWT Token 以確保檔案不被隨意存取。</li>
                        <li><strong>大檔案處理：</strong> 如果檔案非常大（數百 MB），Blob 下載會佔用前端記憶體，此時建議引導用戶直接開啟連結或使用流式傳輸。</li>
                        <li><strong>後端設置：</strong> 若希望直接連結也能觸發下載而非開啟，後端應設定 Header <code className="bg-amber-100 px-1">Content-Disposition: attachment; filename="filename.ext"</code>。</li>
                    </ul>
                </div>
            </div>
        </div>
    );


};

//App2 改採用myfileControl 元件 的下載功能
const App2 = () => {
    const { loading, status, downloadWithBlob } = useFileDownload();

    const getIcon = (type: string) => {
        switch (type) {
            case 'txt': return <FileText className="w-5 h-5 text-blue-500" />;
            case 'zip': return <Archive className="w-5 h-5 text-orange-500" />;
            case 'excel': return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
            default: return <Download className="w-5 h-5" />;
        }
    };

    const filePaths = [
        { name: '專案本地文件 (Public)', path: '/mynote.txt', type: 'txt' },
        { name: '範例文件.txt', path: 'https://www.w3.org/TR/PNG/iso_8859-1.txt', type: 'txt' },
        { name: '測試壓縮檔.zip', path: 'https://example.com/sample.zip', type: 'zip' },
        { name: '財務報表.xlsx', path: 'https://example.com/report.xlsx', type: 'excel' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">React 檔案下載功能 (App2)</h1>
                    <p className="text-gray-600 mt-2">使用 useFileDownload Hook 版本</p>
                </header>

                {status && (
                    <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${status.includes('失敗') || status.includes('出錯') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {status}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700 border-b">檔案名稱</th>
                                <th className="p-4 font-semibold text-gray-700 border-b">格式</th>
                                <th className="p-4 font-semibold text-gray-700 border-b">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filePaths.map((file, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 border-b text-gray-800 font-medium">{file.name}</td>
                                    <td className="p-4 border-b uppercase text-xs font-bold text-gray-500">
                                        <div className="flex items-center gap-2">
                                            {getIcon(file.type)}
                                            {file.type}
                                        </div>
                                    </td>
                                    <td className="p-4 border-b space-x-2">
                                        <button
                                            onClick={() => downloadWithBlob({ fileUrl: file.path, fileName: file.name, mode: 'download' })}
                                            disabled={loading}
                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            <Download className="w-4 h-4 mr-1" />
                                            API 下載 (Blob)
                                        </button>
                                        <button
                                            onClick={() => downloadWithBlob({ fileUrl: file.path, fileName: file.name, mode: 'open' })}
                                            disabled={loading}
                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            <Download className="w-4 h-4 mr-1" />
                                            open (Blob)
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export { App2 };
export default App2;
