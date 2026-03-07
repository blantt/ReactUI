
import React, { useState } from 'react';
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

type AlertColor = 'info' | 'success' | 'warning' | 'failure' | 'dark';
type AlertPosition = 'inline' | 'top-center' | 'top-right' | 'bottom-right' | 'center';

type AlertProps = {
  color?: AlertColor;
  position?: AlertPosition;
  icon?: React.ElementType;
  onDismiss?: () => void;
  rounded?: boolean;
  withBorderAccent?: boolean;
  additionalContent?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
};

type VisibleAlertsState = {
  info: boolean;
  success: boolean;
  warning: boolean;
  failure: boolean;
  accent: boolean;
  rich: boolean;
  topFloating: boolean;
  centerOverlay: boolean;
};

/**
 * Alert 元件
 * @param {string} color - 顏色主題: info, success, warning, failure, dark
 * @param {string} position - 定位屬性: inline (預設), top-center, top-right, bottom-right, center
 * @param {React.ElementType} icon - Lucide 圖標組件
 * @param {function} onDismiss - 關閉時的回調函數
 * @param {boolean} rounded - 是否圓角
 * @param {boolean} withBorderAccent - 是否帶有頂部邊框強調
 * @param {React.ReactNode} additionalContent - 額外內容區域
 * @param {string} title - 標題文字
 */
const Alert = ({ 
  color = 'info', 
  position = 'inline',
  icon: Icon, 
  onDismiss, 
  rounded = true, 
  withBorderAccent = false,
  additionalContent,
  children,
  title
}: AlertProps) => {
  const colorStyles = {
    info: {
      container: 'text-blue-800 bg-blue-50 border-blue-300',
      icon: 'text-blue-500',
      accent: 'border-t-4 border-blue-500',
      dismiss: 'bg-blue-50 text-blue-500 hover:bg-blue-200 focus:ring-blue-400'
    },
    success: {
      container: 'text-green-800 bg-green-50 border-green-300',
      icon: 'text-green-500',
      accent: 'border-t-4 border-green-500',
      dismiss: 'bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400'
    },
    warning: {
      container: 'text-yellow-800 bg-yellow-50 border-yellow-300',
      icon: 'text-yellow-500',
      accent: 'border-t-4 border-yellow-500',
      dismiss: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-400'
    },
    failure: {
      container: 'text-red-800 bg-red-50 border-red-300',
      icon: 'text-red-500',
      accent: 'border-t-4 border-red-500',
      dismiss: 'bg-red-50 text-red-500 hover:bg-red-200 focus:ring-red-400'
    },
    dark: {
      container: 'text-gray-800 bg-gray-50 border-gray-300',
      icon: 'text-gray-500',
      accent: 'border-t-4 border-gray-500',
      dismiss: 'bg-gray-50 text-gray-500 hover:bg-gray-200 focus:ring-gray-400'
    }
  };

  // 定位樣式映射
  const positionStyles = {
    'inline': 'relative mb-4',
    'top-center': 'fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg shadow-xl',
    'top-right': 'fixed top-5 right-5 z-[100] w-[90%] max-w-sm shadow-xl',
    'bottom-right': 'fixed bottom-5 right-5 z-[100] w-[90%] max-w-sm shadow-xl',
    'center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[90%] max-w-md shadow-2xl border-2'
  };

  const style = colorStyles[color as AlertColor] || colorStyles.info;
  const posStyle = positionStyles[position as AlertPosition] || positionStyles.inline;

  return (
    <div 
      className={`flex flex-col p-4 text-sm border animate-in fade-in slide-in-from-top-2 duration-300 ${style.container} ${posStyle} ${rounded ? 'rounded-lg' : ''} ${withBorderAccent ? style.accent : ''}`} 
      role="alert"
    >
      <div className="flex items-center">
        {Icon && <Icon className="shrink-0 w-5 h-5 mr-3" />}
        <div className="flex-1">
          {title && <span className="font-bold mr-2">{title}</span>}
          {children}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${style.dismiss}`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {additionalContent && (
        <div className="mt-2 mb-2">
          {additionalContent}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [visibleAlerts, setVisibleAlerts] = useState<VisibleAlertsState>({
    info: true,
    success: false,
    warning: false,
    failure: false,
    accent: false,
    rich: false,
    topFloating: false,
    centerOverlay: false
  });

  const toggleAlert = (key: keyof VisibleAlertsState, value: boolean) => {
    setVisibleAlerts(prev => ({ ...prev, [key]: value }));
  };

  const showAll = () => {
    const newState = Object.keys(visibleAlerts).reduce<VisibleAlertsState>(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as VisibleAlertsState
    );
    setVisibleAlerts(newState);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center">
              <Bell className="mr-3 text-blue-600" />
              Flowbite Alert 定位範例
            </h1>
            <p className="text-gray-600">除了標準嵌入式，現在支援「畫面固定位置」的定位屬性。</p>
          </div>
          <button 
            onClick={showAll}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            恢復所有範例
          </button>
        </header>

        {/* 控制面板 */}
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <Layout className="mr-2 w-5 h-5 text-blue-500" />
            觸發定位演示
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold mb-3 text-gray-700">標準嵌入 (Inline)</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => toggleAlert('info', true)} className="px-3 py-2 text-xs bg-white border rounded shadow-sm hover:bg-gray-50">資訊</button>
                <button onClick={() => toggleAlert('success', true)} className="px-3 py-2 text-xs bg-white border rounded shadow-sm hover:bg-gray-50">成功</button>
                <button onClick={() => toggleAlert('warning', true)} className="px-3 py-2 text-xs bg-white border rounded shadow-sm hover:bg-gray-50">警告</button>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-semibold mb-3 text-blue-800">浮動定位 (Fixed)</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => toggleAlert('topFloating', true)} 
                  className="px-3 py-2 text-xs bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 flex items-center"
                >
                  <Maximize className="w-3 h-3 mr-1" /> 觸發上方固定
                </button>
                <button 
                  onClick={() => toggleAlert('centerOverlay', true)} 
                  className="px-3 py-2 text-xs bg-indigo-600 text-white rounded shadow-md hover:bg-indigo-700 flex items-center"
                >
                  <Maximize className="w-3 h-3 mr-1" /> 觸發畫面中央
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 展示區域 */}
        <div className="space-y-4 min-h-75 relative">
          
          {/* 1. 標準 Inline 警報 */}
          {visibleAlerts.info && (
            <Alert color="info" icon={Info} title="Inline:" onDismiss={() => toggleAlert('info', false)}>
              這是在頁面正常流程中的警報。
            </Alert>
          )}

          {visibleAlerts.success && (
            <Alert color="success" icon={CheckCircle2} title="Inline:" onDismiss={() => toggleAlert('success', false)}>
              您的資料已成功儲存。
            </Alert>
          )}

          {/* 2. 固定定位 Alert - 畫面頂部 */}
          {visibleAlerts.topFloating && (
            <Alert 
              color="failure" 
              position="top-center" 
              icon={AlertTriangle} 
              title="緊急通知" 
              onDismiss={() => toggleAlert('topFloating', false)}
            >
              這是固定在<strong>畫面正上方</strong>的 Alert。
            </Alert>
          )}

          {/* 3. 固定定位 Alert - 畫面中央 (類似 Modal) */}
          {visibleAlerts.centerOverlay && (
            <>
              {/* 遮罩背景 */}
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-99" onClick={() => toggleAlert('centerOverlay', false)} />
              <Alert 
                color="dark" 
                position="center" 
                icon={Bell} 
                title="系統彈窗" 
                onDismiss={() => toggleAlert('centerOverlay', false)}
                additionalContent={
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => toggleAlert('centerOverlay', false)}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs"
                    >
                      我知道了
                    </button>
                  </div>
                }
              >
                這是固定在<strong>畫面正中央</strong>的 Alert 範例。
              </Alert>
            </>
          )}

          <div className="p-8 text-center text-gray-300 border-2 border-dashed rounded-lg">
            主要內容區域（Alert 將根據屬性定位於此處或畫面最上方）
          </div>
        </div>
      </div>
    </div>
  );
}


