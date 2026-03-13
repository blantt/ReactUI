 
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

export const TextInput = ({ placeholder, value, onChange ,  name, className }: TextInputProps) => {
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


export default TextInput;
