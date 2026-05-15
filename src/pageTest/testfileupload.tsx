import React, { useState, useRef, type ChangeEvent } from 'react';
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useFileDownload } from '../component/myfileControl';
import { MyFileUpload, type MyFileUploadRef } from "../component/MyFileUpload";
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
         <MyFileUpload
            //ref={uploadRef}
            acceptType='audio'
            defaultUrl=  '' 
            bShowTitle={false}
            //apiUrl={getApiUrl("/api/Handler_newBook.ashx?func=SaveUploadFile")}
            // apiUrl={
            //   fileModal.FileName === 'options_image' || fileModal.FileName === 'options_audio'
            //     ? getApiUrl("/api/Handler_newBook.ashx?func=SaveUploadFile_options")
            //     : getApiUrl("/api/Handler_newBook.ashx?func=SaveUploadFile")
            // }
            apiUrl={''}
          //  extraFormData={{ groupid: fileModal.groupid.toString(), itemid: fileModal.itemid.toString(), optionsid: fileModal.optionsid.toString(), filename: fileModal.FileName }}
            // footer={
            //   fileModal.defaultUrl
            //     ? (fileModal.FileName === 'options_image' || fileModal.FileName === 'options_audio'
            //       ? <Button label="清除資源"
            //         onClick={() => {
            //           DelItemFile_options(fileModal.groupid.toString(), fileModal.itemid.toString(), fileModal.optionsid.toString(), fileModal.FileName);
            //         }} />
            //       : <Button label="清除資源"
            //         onClick={() => {
            //           DelItemFile(fileModal.groupid.toString(), fileModal.itemid.toString(), fileModal.FileName);
            //         }} />
            //     )
            //     : null
            // }
            // onStatusChange={(status, message, data) => {
            //   if (status === 'success') {
            //     showAlertModal('上傳成功！', 1000);
            //     loadApiData({ MagType: group.magazine, yyyy: group.yyyy, mm: group.mm, unit: group.unit, chapter: group.chapter })
            //     setFileModal(prev => ({ ...prev, isOpen: false }));
            //     // 上傳成功後外部重置
            //     //   uploadRef.current?.reset();
            //     // console.log('上傳成功！', data);
            //   } else if (status === 'error') {
            //     showAlertErrorModal('上傳失敗！' + message);
                
            //   }
               
            // }}
            />
    </div>
  );
};

export default App;