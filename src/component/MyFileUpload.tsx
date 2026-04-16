/**
 * @file MyFileUpload.tsx
 * @description 通用檔案上傳元件，支援圖片與音訊兩種類型。
 *
 * ## 功能
 * - 點擊或拖放選取檔案
 * - 圖片即時預覽 / 音訊播放預覽
 * - 透過 fetch 將檔案 POST 至指定 API
 * - 上傳進度與結果的狀態回饋
 * - 透過 `ref.reset()` 由父元件主動重置
 *
 * ## 基本使用
 * ```tsx
 * const uploadRef = useRef<MyFileUploadRef>(null);
 *
 * <MyFileUpload
 *   ref={uploadRef}
 *   apiUrl="/api/upload"
 *   acceptType="image"
 *   extraFormData={{ folder: 'avatars' }}
 *   onStatusChange={(status, message, data) => {
 *     if (status === 'success') console.log('上傳完成', data);
 *   }}
 * />
 *
 * // 由父元件重置
 * uploadRef.current?.reset();
 * ```
 */
import { useState, useRef, useImperativeHandle, forwardRef, type ChangeEvent } from 'react';
import { Upload, X, ImageIcon, Music, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

/** 元件的上傳生命週期狀態：idle（初始）、uploading（上傳中）、success（成功）、error（失敗） */
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/** 可接受的檔案類型分類：image（圖片）或 audio（音訊） */
type AcceptType = 'image' | 'audio';

/**
 * 各檔案類型對應的設定常數。
 * - `mimePrefix`：用於驗證 `File.type` 的 MIME 前綴
 * - `inputAccept`：傳給 `<input accept>` 的字串
 * - `hint`：顯示給使用者的格式提示文字
 * - `errorMsg`：類型驗證失敗時的錯誤訊息
 */
const ACCEPT_CONFIG: Record<AcceptType, { mimePrefix: string; inputAccept: string; hint: string; errorMsg: string }> = {
  image: {
    mimePrefix: 'image/',
    inputAccept: 'image/*',
    hint: '支援 JPG, PNG, WebP (最大 5MB)',
    errorMsg: '請選擇有效的圖片檔案',
  },
  audio: {
    mimePrefix: 'audio/',
    inputAccept: 'audio/*,.mp3,.wav,.ogg,.aac',
    hint: '支援 MP3, WAV, OGG, AAC (最大 20MB)',
    errorMsg: '請選擇有效的音訊檔案',
  },
};

/** `MyFileUpload` 元件的 Props 定義 */
interface UploadProps {
  /** 上傳時 FormData 中檔案欄位的名稱，預設為 `'file'` */
  apiFileName?: string;
  /** 是否顯示頂部標題列，預設為 `true` */
  bShowTitle?: boolean;
  /** 接受的檔案類型，`'image'`（預設）或 `'audio'` */
  acceptType?: AcceptType;
  /** 上傳目標 API URL（必填） */
  apiUrl: string;
  /** 額外附加至 FormData 的欄位，key-value 形式，例如 `{ folder: 'avatars' }` */
  extraFormData?: Record<string, string>;
  /**
   * 上傳狀態變更時的回呼，父元件可藉此同步取得最新狀態與訊息。
   * @param status - 當前上傳狀態
   * @param message - 對應的顯示訊息
   * @param responseData - 上傳成功時，伺服器回傳的 JSON 資料
   */
  onStatusChange?: (status: UploadStatus, message: string, responseData?: unknown) => void;
}

/** 透過 `ref` 由父元件主動呼叫的方法集合 */
export interface MyFileUploadRef {
  /** 清除已選取的檔案，並將元件重置回 `idle` 初始狀態 */
  reset: () => void;
}

/**
 * 通用檔案上傳元件，支援圖片與音訊兩種類型。
 *
 * @param acceptType - 接受的檔案類型，決定驗證邏輯與 UI 提示
 * @param apiUrl - 上傳目標 API 的 URL
 * @param extraFormData - 額外附加至 FormData 的欄位
 * @param onStatusChange - 上傳狀態變更時的回呼，父元件可藉此同步取得最新狀態與訊息
 * @param bShowTitle - 是否顯示頂部標題列，預設為 `true`
 * @param apiFileName - 上傳時 FormData 中檔案欄位的名稱，預設為 `'file'`
 *
 * @example
 * // 基本用法（靜態選項）
 * <MyFileUpload
 *   apiUrl="/api/upload"
 *   acceptType="image"
 *   onStatusChange={(status, message, data) => {
 *     if (status === 'success') console.log('上傳完成', data);
 *   }}
 * />
 *
 * @example
 * // 由父元件重置
 * const uploadRef = useRef<MyFileUploadRef>(null);
 * <MyFileUpload ref={uploadRef} apiUrl="/api/upload" />
 * uploadRef.current?.reset();
 */
const MyFileUpload = forwardRef<MyFileUploadRef, UploadProps>(({
  acceptType = 'image',
  apiUrl,
  extraFormData,
  onStatusChange,
  bShowTitle = true,
  apiFileName = 'file',
}, ref) => {
  const config = ACCEPT_CONFIG[acceptType];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState<string>('');

  // 統一更新狀態，並同步通知 parent
  const updateStatus = (nextStatus: UploadStatus, nextMessage: string, data?: unknown) => {
    setStatus(nextStatus);
    setMessage(nextMessage);
    onStatusChange?.(nextStatus, nextMessage, data);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 暴露給 parent 透過 ref 呼叫的方法
  useImperativeHandle(ref, () => ({
    reset: () => clearSelection(),
  }));

  // 處理檔案選取
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 驗證檔案類型
      if (!file.type.startsWith(config.mimePrefix)) {
        updateStatus('error', config.errorMsg);
        return;
      }

      setSelectedFile(file);
      updateStatus('idle', '');
      
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
    updateStatus('idle', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 執行上傳動作
  const handleUpload = async () => {
    if (!selectedFile) return;

    updateStatus('uploading', '正在將檔案寫入資源資料夾...');

    // 建立 FormData，並合併外部傳入的額外欄位
    const formData = new FormData();
    formData.append(apiFileName ||  'file', selectedFile);
    if (extraFormData) {
      Object.entries(extraFormData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // 注意：使用 FormData 時，fetch 會自動設定 Content-Type multipart/form-data
        // 請勿手動設定 Content-Type Header
      });

      const data = await response.json();

      if (response.ok) {
        const successMsg = `上傳成功！檔案位置：${data.filePath}`;
        updateStatus('success', successMsg, data);
      } else {
        throw new Error(data.error || '上傳失敗');
      }

    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : '上傳失敗，請檢查 API 連線';
      console.error('Upload failed:', error);
      updateStatus('error', errMsg);
    }
  };

  return (
    <div className="  bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        {bShowTitle && (
          <div className="bg-indigo-600 p-2 text-white text-center">
            <h1 className="text-xl font-bold">資源檔上傳UI</h1>
            {/* <p className="text-indigo-100 text-sm mt-1">上傳圖片至專案 public/uploads 目錄</p> */}
          </div>
        )}

        <div className="p-2">
          {/* 上傳區域 */}
          {!selectedFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
            >
              <div className="bg-indigo-100 p-4 rounded-full group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="mt-4 text-slate-600 font-medium">
                {acceptType === 'audio' ? '點擊或拖放音訊檔案至此' : '點擊或拖放圖片至此'}
              </p>
              <p className="text-slate-400 text-xs mt-1">{config.hint}</p>
            </div>
          ) : acceptType === 'audio' ? (
            /* 音訊預覽 */
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm text-slate-600 font-medium">
                  <Music className="w-5 h-5 mr-2 text-indigo-500" />
                  {selectedFile.name}
                </div>
                <button
                  onClick={clearSelection}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {previewUrl && (
                <audio controls src={previewUrl} className="w-full" />
              )}
              <p className="text-xs text-slate-400 mt-2 text-right">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            /* 圖片預覽 */
            <div className="relative">
              <img 
                src={previewUrl!} 
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
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            </div>
          )}

          {/* 隱藏的 Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={config.inputAccept}
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
});

export default MyFileUpload;
export { MyFileUpload };