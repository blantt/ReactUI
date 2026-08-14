
import React, { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

type TextInputProps = {
    /** 輸入框提示文字 (Placeholder) */
    placeholder?: string;
    /** 受控輸入框的目前數值 */
    value?: string;
    /** 表單欄位名稱 (name 屬性) */
    name?: string;
    /** 自訂 CSS 類別名稱 (Tailwind CSS) */
    className?: string;
    /** 數值變更時的回調函數 */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** 是否啟用編輯功能；`false` 時為禁用/不可編輯狀態，預設為 `true` */
    enable?: boolean;
};

/**
 * 單行文字輸入框元件 (TextInput)
 * 
 * @param {string} [placeholder] - 輸入框提示文字
 * @param {string} [value] - 受控輸入框的數值
 * @param {string} [name] - 表單欄位名稱 (name 屬性)
 * @param {string} [className] - 自訂 CSS 類別名稱 (Tailwind CSS)
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} [onChange] - 數值變更時的回調函數
 * @param {boolean} [enable=true] - 是否啟用編輯功能；`false` 時為禁用/不可編輯狀態，預設為 `true`
 * 
 * @example
 * ```tsx
 * <TextInput
 *   placeholder="請輸入姓名"
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 *   enable={true}
 * />
 * ```
 */
export const TextInput = ({ placeholder, value, onChange, name, className, enable = true }: TextInputProps) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={!enable}
            className={twMerge(clsx(` w-full px-4 py-2 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white hover:border-gray-400 disabled:bg-gray-50/60 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:border-gray-200`
                , className))}
        />
    );
};




export default TextInput;
