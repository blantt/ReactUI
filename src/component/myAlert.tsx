import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Bell,
  Terminal,
  AlertCircle
} from 'lucide-react';

/**
 * 警示框的外觀類型
 * - `info`    ：藍色，一般資訊提示
 * - `success` ：綠色，操作成功
 * - `warning` ：黃色，注意事項
 * - `failure` ：紅色，錯誤 / 失敗
 * - `dark`    ：灰色，系統 / 終端訊息
 */
type AlertType = 'info' | 'success' | 'warning' | 'failure' | 'dark';

/**
 * 警示框的顯示位置
 * - `inline`       ：嵌入文件流（預設）
 * - `top-center`   ：固定於畫面頂部置中
 * - `top-right`    ：固定於畫面右上角
 * - `bottom-right` ：固定於畫面右下角
 * - `center`       ：固定於畫面正中央（含黑色遮罩）
 */
type AlertPosition = 'inline' | 'top-center' | 'top-right' | 'bottom-right' | 'center';

/** Alert 元件的 Props 定義 */
interface AlertProps {
  /** 外觀類型，預設 `'info'` */
  type?: AlertType;
  /** 顯示位置，預設 `'inline'` */
  position?: AlertPosition;
  /** 標題文字（粗體，顯示於內容上方） */
  title?: string;
  /** 主要訊息內容（支援 ReactNode） */
  children?: ReactNode;
  /** 額外補充內容，會以分隔線隔開顯示在底部 */
  additionalContent?: ReactNode;
  /** 是否顯示，預設 `true` */
  show?: boolean;
  /** 自動關閉的毫秒數，設定後會顯示進度條，`0` 表示不自動關閉 */
  duration?: number;
  /** 點擊關閉按鈕或遮罩時的回呼函式 */
  onClose?: () => void;
  /** 是否套用圓角，預設 `true` */
  rounded?: boolean;
  /** 是否在頂部顯示強調色邊框，預設 `false` */
  withAccent?: boolean;
}

interface ThemeStyle {
  container: string;
  icon: React.ReactElement;
  accent: string;
  btn: string;
}

/**
 * ### Alert 警示框元件
 *
 * 基於 Tailwind CSS + lucide-react 的多功能提示元件，
 * 支援多種外觀、顯示位置、自動關閉與可關閉功能。
 *
 * @example
 * // 基本用法
 * <Alert type="success">操作成功！</Alert>
 *
 * @example
 * // 帶標題、可關閉
 * <Alert type="warning" title="注意" onClose={() => setShow(false)}>
 *   請確認資料後再送出。
 * </Alert>
 *
 * @example
 * // 固定於右上角，5 秒後自動關閉
 * <Alert
 *   type="info"
 *   position="top-right"
 *   duration={5000}
 *   onClose={() => setShow(false)}
 * >
 *   資料已儲存
 * </Alert>
 *
 * @example
 * // 置中對話框樣式（含遮罩）
 * <Alert type="failure" position="center" title="發生錯誤" onClose={() => setShow(false)}>
 *   伺服器無回應，請稍後再試。
 * </Alert>
 *
 * @param type           外觀類型，預設 `'info'`，可選：`'info'` | `'success'` | `'warning'` | `'failure'` | `'dark'`
 * @param position       顯示位置，預設 `'inline'`，可選：`'inline'` | `'top-center'` | `'top-right'` | `'bottom-right'` | `'center'`
 * @param title          標題文字
 * @param children       主要訊息內容
 * @param additionalContent  額外補充內容
 * @param show           是否顯示，預設 `true`
 * @param duration       自動關閉毫秒數（需同時提供 `onClose`）
 * @param onClose        關閉回呼函式
 * @param rounded        是否圓角，預設 `true`
 * @param withAccent     是否顯示頂部強調色邊框，預設 `false`
 *
 */
const MyAlert: React.FC<AlertProps> = ({
  type = 'info',
  position = 'inline',
  title,
  children,
  additionalContent,
  show = true,
  duration,
  onClose,
  rounded = true,
  withAccent = false
}) => {
  // 自動消失邏輯
  useEffect(() => {
    if (show && duration && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  // 顏色配置 - 使用 Record 確保索引安全
  const themeStyles: Record<AlertType, ThemeStyle> = {
    info: {
      container: 'text-blue-800 bg-blue-50 border-blue-300',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      accent: 'border-t-4 border-blue-500',
      btn: 'bg-blue-50 text-blue-500 hover:bg-blue-200 focus:ring-blue-400'
    },
    success: {
      container: 'text-green-800 bg-green-50 border-green-300',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      accent: 'border-t-4 border-green-500',
      btn: 'bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400'
    },
    warning: {
      container: 'text-yellow-800 bg-yellow-50 border-yellow-300',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      accent: 'border-t-4 border-yellow-500',
      btn: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-400'
    },
    failure: {
      container: 'text-red-800 bg-red-50 border-red-300',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      accent: 'border-t-4 border-red-500',
      btn: 'bg-red-50 text-red-500 hover:bg-red-200 focus:ring-red-400'
    },
    dark: {
      container: 'text-gray-800 bg-gray-50 border-gray-300',
      icon: <Terminal className="w-5 h-5 text-gray-500" />,
      accent: 'border-t-4 border-gray-500',
      btn: 'bg-gray-50 text-gray-500 hover:bg-gray-200 focus:ring-gray-400'
    }
  };

  // 定位配置 - 使用 Record 確保索引安全
  const positionClasses: Record<AlertPosition, string> = {
    'inline': 'relative mb-4 w-full',
    'top-center': 'fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-lg shadow-2xl',
    'top-right': 'fixed top-6 right-6 z-[9999] w-[90%] max-w-sm shadow-2xl',
    'bottom-right': 'fixed bottom-6 right-6 z-[9999] w-[90%] max-w-sm shadow-2xl',
    'center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-md shadow-2xl border-2 animate-in zoom-in-95'
  };

  const style = themeStyles[type];
  const layout = positionClasses[position];

  const content = (
    <>
      {/* 遮罩 (僅用於 center) */}
      {position === 'center' && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-9998 transition-opacity animate-in fade-in" 
          onClick={onClose}
        />
      )}
      
      <div 
        className={`
          flex flex-col p-4 text-sm border transition-all
          animate-in fade-in slide-in-from-top-4 duration-300
          ${style.container} ${layout} 
          ${rounded ? 'rounded-xl' : ''} 
          ${withAccent ? style.accent : ''}
        `}
        role="alert"
      >
        <div className="flex items-start">
          <div className="shrink-0 mt-0.5">{style.icon}</div>
          <div className="flex-1 ml-3 mr-2">
            {title && <h3 className="text-base font-bold mb-1 leading-tight">{title}</h3>}
            <div className={title ? "text-sm opacity-90" : "text-sm font-medium"}>
              {children}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className={`-mr-1 -mt-1 p-1.5 rounded-lg transition-colors ${style.btn}`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {additionalContent && (
          <div className="mt-3 border-t border-black/5 pt-3">
            {additionalContent}
          </div>
        )}

        {/* 自動消失進度條 */}
        {duration && duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-10 rounded-b-xl overflow-hidden w-full">
            <div 
              className="h-full bg-current opacity-30 animate-shrink-width"
              style={{ animationDuration: `${duration}ms`, animationTimingFunction: 'linear' }}
            />
          </div>
        )}
      </div>
    </>
  );

  // 如果是 fixed 定位，使用 Portal 確保在最外層
  if (position !== 'inline') {
    return createPortal(content, document.body);
  }

  return content;
};


export default MyAlert;