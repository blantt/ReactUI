import React, { useState, useRef, type ChangeEvent } from 'react';
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// 定義上傳狀態類型
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理檔案選取
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 驗證是否為圖片
      if (!file.type.startsWith('image/')) {
        setMessage('請選擇有效的圖片檔案');
        setStatus('error');
        return;
      }

      setSelectedFile(file);
      setStatus('idle');
      setMessage('');
      
      // 建立預覽 URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 移除已選取的檔案
  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 執行上傳動作
  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setMessage('正在將圖片寫入資源資料夾...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      /**
       * 根據您的環境切換路徑：
       * WordPress: '/wp-json/custom/v1/upload-image'
       * ASP.NET: '/Handlers/UploadHandler.ashx'
       */
      const API_URL = '/api/upload-endpoint'; 

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        // 注意：使用 FormData 時，fetch 會自動設定 Content-Type 為 multipart/form-data 且帶上 boundary
        // 請勿手動設定 Content-Type Header
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(`上傳成功！檔案位置：${data.filePath}`);
      } else {
        throw new Error(data.error || '上傳失敗');
      }
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      setStatus('error');
      setMessage(error.message || '上傳失敗，請檢查 API 連線');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-xl font-bold">資源檔上傳工具</h1>
          <p className="text-indigo-100 text-sm mt-1">上傳圖片至專案 public/uploads 目錄</p>
        </div>

        <div className="p-6">
          {/* 上傳區域 */}
          {!previewUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
            >
              <div className="bg-indigo-100 p-4 rounded-full group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="mt-4 text-slate-600 font-medium">點擊或拖放圖片至此</p>
              <p className="text-slate-400 text-xs mt-1">支援 JPG, PNG, WebP (最大 5MB)</p>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-64 object-cover rounded-xl border border-slate-200" 
              />
              <button 
                onClick={clearSelection}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mt-3 flex items-center text-sm text-slate-500 italic">
                <ImageIcon className="w-4 h-4 mr-2" />
                {selectedFile?.name} ({(selectedFile?.size! / 1024).toFixed(1)} KB)
              </div>
            </div>
          )}

          {/* 隱藏的 Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* 狀態訊息 */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center text-sm ${
              status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {status === 'success' && <CheckCircle2 className="w-4 h-4 mr-2" />}
              {status === 'error' && <AlertCircle className="w-4 h-4 mr-2" />}
              {status === 'uploading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {message}
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || status === 'uploading' || status === 'success'}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center ${
                !selectedFile || status === 'uploading' || status === 'success'
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
              }`}
            >
              {status === 'uploading' ? (
                <>上傳中...</>
              ) : (
                <>開始上傳回專案資源檔</>
              )}
            </button>
            
            {status === 'success' && (
              <button
                onClick={clearSelection}
                className="w-full mt-3 py-2 text-indigo-600 text-sm font-medium hover:underline"
              >
                繼續上傳下一張
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;