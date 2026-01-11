import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  onConfirm: () => void;
};

const Modal = ({ isOpen, onClose, title, children, onConfirm }: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 處理開啟與關閉的動畫邏輯
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* 背景遮罩 (Backdrop) */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal 本體 */}
      <div 
        className={`relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out ${
          isAnimating ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="relative border-b border-slate-100 px-6 py-4">
          <h3 className="text-center text-xl font-semibold text-slate-800">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            {/* <X size={20} /> */}
          </button>
        </div>

        {/* 內容區 (Body) */}
        <div className="px-8 py-10 text-center text-slate-600">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 bg-slate-50/50 px-6 py-4">
          <button 
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 active:scale-95"
          >
            取消關閉
          </button>
          <button 
            onClick={onConfirm}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95"
          >
            確定執行
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 font-sans">
      <div className="text-center">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">Tailwind Modal 示範</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 hover:bg-indigo-700 active:translate-y-0"
        >
          點擊開啟視窗
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="系統確認通知"
        onConfirm={() => {
          console.log("已確認操作");
          setIsModalOpen(false);
        }}
      >
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-slate-900">您確定要執行此操作嗎？</p>
            <p className="mt-2 text-sm text-slate-500">
              這是一個範例訊息區塊。您可以放入任何內容，文字已預設置中對齊，看起來非常大方得體。
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}