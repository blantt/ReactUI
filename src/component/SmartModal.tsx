import React, { useState, useEffect, useRef } from 'react';
import { X, Info } from 'lucide-react';

// parent scroll 資訊型別
interface ParentScrollInfo {
  parentScrollY: number;    // parent 頁面目前的 scrollY
  iframeOffsetTop: number;  // iframe 元素距離 parent 頁面頂端的絕對距離
  viewportHeight: number;   // parent 頁面的視窗高度
}

interface SmartModalProps {
  isOpen: boolean;
  onClose: () => void;

  /**
   * 觸發按鈕的文件絕對 Y 座標
   * - iframe 模式：rect.top (iframe 無內部 scroll，viewport = document)
   * - 直接開頁面：rect.top + window.scrollY
   */
  triggerY?: number;

  /**
   * true = 此頁面在 iframe 裡 (由 window.self !== window.top 判斷)
   * false / undefined = 直接開啟的頁面
   */
  isInIframe?: boolean;

  /** 由 parent postMessage 傳入的 scroll 資訊 (isInIframe=true 時才有效) */
  parentScrollInfo?: ParentScrollInfo;

  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  footer?: React.ReactNode;
}

const MARGIN = 16; // 離可視區邊緣的最小距離

const SmartModal: React.FC<SmartModalProps> = ({
  isOpen,
  onClose,
  triggerY = 0,
  isInIframe = false,
  parentScrollInfo,
  title = '系統訊息',
  children,
  maxWidth = 'max-w-sm',
  footer,
}) => {
  const [displayTop, setDisplayTop] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modalHeight = modalRef.current.offsetHeight;

    // ── 計算 user 當前在文件座標系看到的可視區域 ─────────────────────
    let visibleTop: number;
    let visibleHeight: number;

    if (isInIframe && parentScrollInfo) {
      // 被 iframe 包住：parent 頁面 scroll 控制可視區
      // parentScrollY - iframeOffsetTop = iframe 中，user 目前看到的起點
      visibleTop = Math.max(0, parentScrollInfo.parentScrollY - parentScrollInfo.iframeOffsetTop);
      visibleHeight = parentScrollInfo.viewportHeight;
    } else {
      // 直接開頁面：用自身 window.scrollY
      visibleTop = window.scrollY;
      visibleHeight = window.innerHeight;
    }

    const visibleBottom = visibleTop + visibleHeight;

    // ── 理想位置：靠近 user 點擊的按鈕下方 ───────────────────────────
    // triggerY 已是文件絕對座標（兩種情境都由呼叫端處理好）
    let idealTop = triggerY + 8;

    // ── 邊界修正：不能超出可視區域 ──────────────────────────────────
    // 下方超出 → 往上移
    if (idealTop + modalHeight > visibleBottom - MARGIN) {
      idealTop = visibleBottom - modalHeight - MARGIN;
    }
    // 上方超出 → 往下移
    if (idealTop < visibleTop + MARGIN) {
      idealTop = visibleTop + MARGIN;
    }
    // 整體保護：不小於 0
    idealTop = Math.max(0, idealTop);

    setDisplayTop(idealTop);
  }, [isOpen, triggerY, isInIframe, parentScrollInfo]);

  // 鎖定 iframe 自身 scroll（通常沒有，但保險）
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div id="smart-modal" className="absolute inset-0 z-50" style={{ pointerEvents: 'none' }}>
      {/* 背景半透明遮罩：fixed 覆蓋整個可視畫面 */}
      <div
        className="fixed inset-0 bg-slate-900/40 transition-opacity"
        style={{ pointerEvents: 'auto' }}
        onClick={onClose}
      />

      {/* Modal 主體：absolute 定位在文件座標系，top = 計算後位置 */}
      <div
        ref={modalRef}
        style={{
          position: 'absolute',
          top: `${displayTop}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
          zIndex: 51,
        }}
        className={`w-full ${maxWidth}`}
      >
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-indigo-600 text-base font-bold">
              <Info size={18} />
              <span>{title}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {children}
          </div>

          {footer && (
            <div className="flex items-center justify-end bg-slate-50/50 px-6 py-2 border-t border-slate-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartModal;