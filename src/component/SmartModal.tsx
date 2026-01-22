import React, { useState, useEffect, useRef } from 'react';
import { X, MousePointer2, Info } from 'lucide-react';


interface SmartModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerTop: number; // 觸發按鈕的垂直位置
  title?: string;
  children: React.ReactNode;
  maxWidth?: string; // 可選：自定義寬度
  footer?: React.ReactNode;
}

const SmartModal: React.FC<SmartModalProps> = ({
  isOpen,
  onClose,
  triggerTop,
  title = "系統訊息",
  children,
  maxWidth = "max-w-sm"
  , footer
}) => {
  const [displayTop, setDisplayTop] = useState(triggerTop);
  const modalRef = useRef<HTMLDivElement>(null);

  // 當 Modal 開啟或觸發位置改變時，執行智慧位置修正
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const viewportHeight = window.innerHeight;
      const modalHeight = modalRef.current.offsetHeight;
      const margin = 20;

      // 檢查是否超出底部
      if (triggerTop + modalHeight > viewportHeight) {
        const correctedTop = Math.max(margin, viewportHeight - modalHeight - margin);
        setDisplayTop(correctedTop);
      } else {
        setDisplayTop(triggerTop);
      }
    }
  }, [isOpen, triggerTop]);

  // 開啟時鎖定背景捲動
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
    <div id="smart-modal" className="fixed inset-0 z-50">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0  bg-slate-900/40   transition-opacity"
        onClick={onClose}
      />

      {/* Modal 主體 */}
      <div
        ref={modalRef}
        style={{
          top: `${displayTop}px`,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
        className={`absolute z-50 w-full ${maxWidth} bg-black bg-opacity-50`}
      >
        <div className="bg-white rounded-lg shadow-lg  border  overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-1  border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600  text-base   font-bold">
              <Info size={18} />
              <span>{title}</span>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {children}
          </div>
          {footer && (
            <div className="flex items-center justify-end   bg-slate-50/50 px-6 py-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartModal;