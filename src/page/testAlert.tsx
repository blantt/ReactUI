import React, { useState } from 'react';
import MyAlert from '../component/myAlert';
import MyConfirm from '../component/myConfirm';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Bell,
  Layout,
  Maximize
} from 'lucide-react';
// --------------------------------------------------------------------------
// 使用範例展示 (App)
// --------------------------------------------------------------------------

interface AppState {
  inline: boolean;
  auto: boolean;
  top: boolean;
  center: boolean;
}

export default function App() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alerts, setAlerts] = useState<AppState>({
    inline: true,
    auto: false,
    top: false,
    center: false
  });

  // 模擬點擊確定後的操作
  const handleDelete = () => {
    setIsDeleting(true); // 按鈕會變成 loading 轉圈圈狀態
    setTimeout(() => {
      console.log('已經刪除！');
      setIsDeleting(false);
      setShowConfirm(false);
    }, 2000);
  };
  const toggle = (key: keyof AppState, val: boolean) => {
    setAlerts(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto py-12 px-6">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Bell className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">UI Alert TypeScript 版</h1>
          </div>
          <p className="text-slate-500 text-lg">
            已修復型別定義：支援嚴格的 Props 檢查與物件索引安全。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> 基礎觸發
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setShowConfirm(true)}
              >
                刪除資料(confirm元件)
              </button>
              <button
                type="button"
                onClick={() => toggle('inline', !alerts.inline)}
                className="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                切換嵌入式
              </button>
              <button
                type="button"
                onClick={() => toggle('auto', true)}
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors shadow-md"
              >
                3秒消失
              </button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 高級定位
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggle('top', true)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-md"
              >
                上方固定
              </button>
              <button
                type="button"
                onClick={() => toggle('center', true)}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors shadow-md"
              >
                中心彈窗
              </button>
            </div>
          </div>
        </div>

        <section className="bg-slate-200/50 p-8 rounded-3xl border-2 border-dashed border-slate-300">
          <MyAlert
            show={alerts.inline}
            type="info"
            title="TSX 成功載入"
            onClose={() => toggle('inline', false)}
          >
            這是一個型別安全的 TypeScript 組件範例。
          </MyAlert>

          <MyAlert
            show={alerts.auto}
            type="success"
            position="top-center"
            duration={3000}
            title="通知"
            onClose={() => toggle('auto', false)}
          >
            自動關閉邏輯現在受 TS 嚴格檢查。
          </MyAlert>

          <MyAlert
            show={alerts.top}
            type="failure"
            position="top-center"
            withAccent
            title="安全提醒"
            onClose={() => toggle('top', false)}
          >
            請確認您的所有 Prop 都符合 Interface 定義。
          </MyAlert>

          <MyAlert
            show={alerts.center}
            type="dark"
            position="center"
            title="TypeScript 說明"
            onClose={() => toggle('center', false)}
            additionalContent={
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggle('center', false)}
                  className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs"
                >
                  關閉
                </button>
              </div>
            }
          >
            使用了 Record 型別來處理樣式映射，解決了隱式 any 的問題。
          </MyAlert>

          {/* 呼叫我們剛剛建立的 Confirm 元件 */}
          <MyConfirm
            show={showConfirm}
            type="warning"               // 可改為 'failure', 'info', 'success'
            title="確定要刪除這筆資料嗎？"
            confirmText="確認刪除"       // 預設是 "確定"
            cancelText="先不要"          // 預設是 "取消"
            isLoading={isDeleting}       // 加上這行，按鈕可以防呆+轉圈圈
            onConfirm={handleDelete}
            onCancel={() => setShowConfirm(false)}
          >
            這個操作將無法復原，請您再次確認。
          </MyConfirm>

          <div className="h-40 flex items-center justify-center text-slate-300 italic">
            頁面主要內容區域...
          </div>
        </section>
      </div>

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink-width {
          animation-name: shrinkWidth;
        }
      `}</style>
    </div>
  );
}