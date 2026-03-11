 
import React, { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

type TextInputProps = {
    placeholder?: string; // Optional placeholder text
    value?: string; // Optional value for controlled input
    py?: number; // Optional padding for y-axis
    othercss?: string; // Optional additional CSS classes
    name?: string; // Optional name attribute for form handling
    className?: string; // Optional className for styling
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
};

export const TextInput = ({ placeholder, value, onChange ,py=0, othercss="", name, className }: TextInputProps) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            className={twMerge(clsx(`border border-gray-300 rounded px-2 py-${py} focus:outline-none focus:ring-2 focus:ring-blue-500`, othercss, className))}
        />
    );
};


export default TextInput;
