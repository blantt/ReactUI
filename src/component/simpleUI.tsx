
import React, { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

type TextInputProps = {
    placeholder?: string; // Optional placeholder text
    value?: string; // Optional value for controlled input
    name?: string; // Optional name attribute for form handling
    className?: string; // Optional className for styling
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
};

export const TextInput = ({ placeholder, value, onChange, name, className }: TextInputProps) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            className={twMerge(clsx(` w-full px-4 py-2 border border-gray-300 text-sm  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white hover:border-gray-400`
                , className))}
        />
    );
};


// ─────────────────────────────────────────────
// RadioboxList 元件
// ─────────────────────────────────────────────

/** RadioboxList 的單一選項格式 */
export interface RadioOption {
    sname: string;  // 顯示文字
    svalue: string; // 選項值
}

type RadioboxListProps = {
    /** 選項陣列，每個元素需有 sname（顯示文字）與 svalue（值） */
    options: RadioOption[];
    /** 目前選取的值（受控模式） */
    value?: string;
    /** input name 屬性（同一組 radio 必須相同） */
    name?: string;
    /** 選項改變時觸發，回傳新的 svalue 字串 */
    onChange?: (value: string) => void;
    /** 排列方向：水平 horizontal（預設）或垂直 vertical */
    direction?: 'horizontal' | 'vertical';
    /** 額外 className 套用於外層容器 */
    className?: string;
    /** 是否禁用整組 */
    disabled?: boolean;
};

/**
 * ### RadioboxList — 單選按鈕群組元件
 *
 * @param options      選項陣列 `{ sname: string, svalue: string }[]`
 * @param value        受控值，對應選項的 svalue
 * @param name         radio input 的 name 屬性
 * @param onChange     選取時回調，傳入選中的 svalue
 * @param direction    `'horizontal'`（預設，水平排列）| `'vertical'`（垂直排列）
 * @param className    額外 className 套用於外層容器
 * @param disabled     是否禁用整組選項
 *
 * @example
 * const options = [
 *   { sname: '選項A', svalue: 'A' },
 *   { sname: '選項B', svalue: 'B' },
 * ];
 * <RadioboxList
 *   options={options}
 *   value={selected}
 *   name="myGroup"
 *   onChange={(val) => setSelected(val)}
 * />
 */
export const RadioboxList = ({
    options,
    value,
    name = 'radioGroup',
    onChange,
    direction = 'horizontal',
    className,
    disabled = false,
}: RadioboxListProps) => {
    const [internalValue, setInternalValue] = useState<string>(value ?? '');

    // 同步受控值
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    const handleChange = (svalue: string) => {
        setInternalValue(svalue);
        if (onChange) onChange(svalue);
    };

    const wrapperCls = twMerge(
        clsx(
            'flex gap-2 flex-wrap',
            direction === 'vertical' ? 'flex-col' : 'flex-row items-center',
            className
        )
    );

    return (
        <div className={wrapperCls} role="radiogroup">
            {options.map((opt) => {
                const isChecked = internalValue === opt.svalue;
                const itemId = `${name}_${opt.svalue}`;

                return (
                    <label
                        key={opt.svalue}
                        htmlFor={itemId}
                        className={twMerge(clsx(
                            // 外框：圓角、邊框、transition
                            'relative flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer select-none',
                            'text-sm font-medium transition-all duration-200',
                            // 未選中
                            'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50/50',
                            // 選中
                            isChecked && 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100',
                            // 禁用
                            disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                        ))}
                    >
                        {/* 隱藏原生 radio，用自訂樣式取代 */}
                        <input
                            type="radio"
                            id={itemId}
                            name={name}
                            value={opt.svalue}
                            checked={isChecked}
                            disabled={disabled}
                            onChange={() => handleChange(opt.svalue)}
                            className="sr-only"
                        />

                        {/* 自訂圓形指示器 */}
                        <span
                            className={twMerge(clsx(
                                'inline-flex items-center justify-center w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-200',
                                isChecked
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-400 bg-white'
                            ))}
                        >
                            {isChecked && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                            )}
                        </span>

                        {/* 顯示文字 */}
                        <span>{opt.sname}</span>
                    </label>
                );
            })}
        </div>
    );
};



export default TextInput;
