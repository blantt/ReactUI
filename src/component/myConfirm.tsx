import React from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X
} from 'lucide-react';

/**
 * 警示框的外觀類型
 */
type ConfirmType = 'info' | 'success' | 'warning' | 'failure';

/** Confirm 元件的 Props 定義 */
interface ConfirmProps {
  /** 外觀類型，預設 `'warning'` */
  type?: ConfirmType;
  /** 標題文字 */
  title?: string;
  /** 主要訊息內容（支援 ReactNode） */
  children?: ReactNode;
  /** 是否顯示 */
  show: boolean;
  /** 點擊「確定」時的回呼函式 */
  onConfirm: () => void;
  /** 點擊「取消」或遮罩時的回呼函式 */
  onCancel: () => void;
  /** 確定按鈕文字，預設 `'確定'` */
  confirmText?: string;
  /** 取消按鈕文字，預設 `'取消'` */
  cancelText?: string;
  /** 是否顯示為讀取中狀態（防連點），預設 `false` */
  isLoading?: boolean;
}

interface ThemeStyle {
  container: string;
  icon: React.ReactElement;
  accent: string;
  confirmBtn: string;
  cancelBtn: string;
}

/**
 * ### Confirm 確認對話框元件
 *
 * 專為雙向確認需求設計的對話框，固定置中並帶有背景遮罩。
 * 強制要求使用者進行「確定」或「取消」的決策。
 *
 * @example
 * <MyConfirm
 *   show={showConfirm}
 *   type="warning"
 *   title="確定要刪除嗎？"
 *   onConfirm={() => console.log('已刪除')}
 *   onCancel={() => setShowConfirm(false)}
 * >
 *   這個操作無法復原，請謹慎評估。
 * </MyConfirm>
 */
const MyConfirm: React.FC<ConfirmProps> = ({
  type = 'warning',
  title,
  children,
  show,
  onConfirm,
  onCancel,
  confirmText = '確定',
  cancelText = '取消',
  isLoading = false
}) => {
  if (!show) return null;

  // 顏色配置
  const themeStyles: Record<ConfirmType, ThemeStyle> = {
    info: {
      container: 'text-blue-800 bg-white border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      accent: 'border-t-4 border-blue-500',
      confirmBtn: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      cancelBtn: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    },
    success: {
      container: 'text-green-800 bg-white border-green-200',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      accent: 'border-t-4 border-green-500',
      confirmBtn: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      cancelBtn: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    },
    warning: {
      container: 'text-yellow-800 bg-white border-yellow-200',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      accent: 'border-t-4 border-yellow-500',
      confirmBtn: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
      cancelBtn: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    },
    failure: {
      container: 'text-red-800 bg-white border-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      accent: 'border-t-4 border-red-500',
      confirmBtn: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      cancelBtn: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }
  };

  const style = themeStyles[type];

  const content = (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[9998] transition-opacity animate-in fade-in"
        onClick={isLoading ? undefined : onCancel}
      />

      {/* 對話框本體 */}
      <div
        className={`
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] 
          w-[90%] max-w-md shadow-2xl rounded-xl border flex flex-col overflow-hidden
          animate-in zoom-in-95 duration-200
          ${style.container} ${style.accent}
        `}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start p-5 pb-4">
          <div className="shrink-0 mt-0.5">{style.icon}</div>
          <div className="flex-1 ml-3 mr-2">
            {title && <h3 className="text-lg font-bold mb-2 leading-tight text-gray-900">{title}</h3>}
            <div className="text-sm text-gray-600 font-medium">
              {children}
            </div>
          </div>
          <button
            onClick={isLoading ? undefined : onCancel}
            type="button"
            className="p-1.5 -start-2 -mt-1 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 按鈕區域 */}
        <div className="flex justify-end gap-3 px-5 py-4 bg-gray-50/80 border-t border-gray-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className={`
              px-4 py-2 text-sm font-medium border rounded-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${style.cancelBtn}
            `}
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`
              inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-70 disabled:cursor-not-allowed
              ${style.confirmBtn}
            `}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default MyConfirm;
