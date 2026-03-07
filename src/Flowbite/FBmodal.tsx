import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Trash2, 
  AlertCircle, 
  Check, 
  Layout, 
  Maximize2, 
  UserPlus,
  HelpCircle,
  Info // 新增此導入以修正 ReferenceError
} from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
}

/**
 * 通用 Modal 元件 - 高度自定義化
 * @param {boolean} isOpen - 是否開啟
 * @param {function} onClose - 關閉回調
 * @param {React.ReactNode} title - 標題（支援字串或元件）
 * @param {React.ReactNode} footer - 底部區域（支援自定義按鈕組合）
 * @param {string} size - 寬度大小: sm, md, lg, xl, full
 * @param {boolean} showCloseButton - 是否顯示右上角 X
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]'
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* 遮罩背景 */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal 本體 */}
      <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`}>
        
        {/* Header 部分 - 可調整：背景色、文字對齊、圖標 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            {typeof title === 'string' ? (
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            ) : (
              title
            )}
          </div>
          {showCloseButton && (
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content 部分 - 可調整：內邊距、是否可捲動 */}
        <div className="p-6 overflow-y-auto max-h-[70vh] text-gray-600">
          {children}
        </div>

        {/* Footer 部分 - 可調整：按鈕順序、背景、陰影 */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Modal 進階範例展示</h1>
          <p className="text-slate-500 text-lg">透過不同參數調整 Header, Footer 與內容佈局。</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. 基本範例 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 mb-2 flex items-center">
              <Layout className="w-5 h-5 mr-2 text-blue-500" /> 基本對話框
            </h2>
            <p className="text-sm text-slate-500 mb-6">標準的標題、內容與雙按鈕設計。</p>
            <button 
              onClick={() => setActiveModal('basic')}
              className="w-full py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all font-medium"
            >
              開啟範例
            </button>
          </div>

          {/* 2. 大尺寸 + 捲動內容 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 mb-2 flex items-center">
              <Maximize2 className="w-5 h-5 mr-2 text-purple-500" /> 大型內容 & 捲動
            </h2>
            <p className="text-sm text-slate-500 mb-6">展示內容過多時的自動捲動機制。</p>
            <button 
              onClick={() => setActiveModal('large')}
              className="w-full py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium"
            >
              測試大型 Modal
            </button>
          </div>

          {/* 3. 危險操作 (自定義 Footer) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 mb-2 flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-red-500" /> 危險操作提示
            </h2>
            <p className="text-sm text-slate-500 mb-6">調整 Footer 按鈕樣式與圖標 Header。</p>
            <button 
              onClick={() => setActiveModal('danger')}
              className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all font-medium"
            >
              確認刪除
            </button>
          </div>

        </div>

        {/* --- Modal 實作清單 --- */}

        {/* 1. Basic Modal */}
        <Modal 
          isOpen={activeModal === 'basic'} 
          onClose={closeModal}
          title="系統設定"
          footer={
            <>
              <button onClick={closeModal} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">取消</button>
              <button className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">儲存變更</button>
            </>
          }
        >
          <div className="space-y-4">
            <p>您可以在這裡調整您的個人化設定。這些變更將立即應用於您的帳戶。</p>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
              <Info className="w-4 h-4 mr-2 shrink-0" />
              <span>這是一個內嵌在內容區塊的小提醒。</span>
            </div>
          </div>
        </Modal>

        {/* 2. Large Scrollable Modal */}
        <Modal 
          isOpen={activeModal === 'large'} 
          onClose={closeModal}
          size="lg"
          title={
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-600" />
              <span>服務條款與細則</span>
            </div>
          }
          footer={
            <button onClick={closeModal} className="w-full sm:w-auto px-10 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold">
              我已閱讀並同意
            </button>
          }
        >
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900">1. 使用條款</h4>
            <p>這是一段非常長的文字測試。這是一段非常長的文字測試。這是一段非常長的文字測試。這是一段非常長的文字測試。</p>
            <h4 className="font-bold text-gray-900">2. 隱私政策</h4>
            <p>我們重視您的隱私。我們重視您的隱私。我們重視您的隱私。我們重視您的隱私。我們重視您的隱私。我們重視您的隱私。</p>
            <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              [ 佔位符：更多內容 ]
            </div>
            <p>滾動測試末端：確保 Footer 是固定在底部的，不會隨著內容消失。</p>
          </div>
        </Modal>

        {/* 3. Danger Modal */}
        <Modal 
          isOpen={activeModal === 'danger'} 
          onClose={closeModal}
          size="sm"
          title={
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>刪除專案</span>
            </div>
          }
          footer={
            <div className="flex flex-col w-full gap-2">
              <button 
                className="w-full py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition-colors"
                onClick={() => { alert('已刪除！'); closeModal(); }}
              >
                確認永久刪除
              </button>
              <button 
                className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={closeModal}
              >
                先不要
              </button>
            </div>
          }
        >
          <p className="text-center text-gray-600">
            您確定要刪除專案 「<span className="font-bold text-gray-900">Marketing_2024</span>」 嗎？此操作無法撤銷。
          </p>
        </Modal>

      </div>
    </div>
  );
}