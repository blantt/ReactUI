import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  height?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, width, height }) => {
  if (!isOpen) return null;

  return (
    <div className="   fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-lg   min-w-80 ${width || ''} ${height || ''} `}>
        {/* Header */}
        {title && (
          <div className=" px-2 py-1 border-b border-gray-200 flex justify-between items-center">
            <h2 className=" text-base  text-center  "> {'dd'}{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-2 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;