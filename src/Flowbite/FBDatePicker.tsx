import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Type, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  X 
} from 'lucide-react';

/**
 * 自定義日期與時間選取器 (Custom Date & Time Picker)
 * 解決外部套件在環境中無法載入的問題，同時提供：
 * 1. 手動輸入解析
 * 2. 日曆圖形選取
 * 3. 時間側邊欄選取
 */
const CustomDateTimePicker = ({ value, onChange }: { value: Date | null; onChange: (date: Date | null) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef(null);

  // 格式化日期時間為字串 (yyyy/MM/dd HH:mm)
  const formatDateTime = (date: Date): string => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}/${m}/${d} ${hh}:${mm}`;
  };

  useEffect(() => {
    if (value) setInputValue(formatDateTime(value));
  }, [value]);

  // 處理手動輸入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    // 簡易解析輸入 (支援 yyyy/MM/dd HH:mm 或 yyyy-MM-dd)
    const parsed = new Date(val.replace(/\//g, '-'));
    if (!isNaN(parsed.getTime())) {
      onChange(parsed);
      setViewDate(parsed);
    }
  };

  // 生成日曆格子
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const days = [];
  const totalDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startOffset = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // 填充空白
  for (let i = 0; i < startOffset; i++) days.push(null);
  // 填充日期
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const selectDate = (day: number) => {
    const newDate = new Date(value || new Date());
    newDate.setFullYear(viewDate.getFullYear());
    newDate.setMonth(viewDate.getMonth());
    newDate.setDate(day);
    onChange(newDate);
  };

  const selectTime = (hour: number) => {
    const newDate = new Date(value || new Date());
    newDate.setHours(hour);
    newDate.setMinutes(0);
    onChange(newDate);
  };

  const changeMonth = (offset: number) => {
    const next = new Date(viewDate);
    next.setMonth(viewDate.getMonth() + offset);
    setViewDate(next);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="yyyy/MM/dd HH:mm"
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <CalendarIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        {inputValue && (
          <button 
            onClick={() => { onChange(null); setInputValue(""); }}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          {/* 日曆區 */}
          <div className="p-4 w-64 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-4 h-4" /></button>
              <span className="font-bold text-sm">
                {viewDate.getFullYear()}年 {viewDate.getMonth() + 1}月
              </span>
              <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  disabled={!day}
                  onClick={() => day !== null && selectDate(day)}
                  className={`h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-colors
                    ${!day ? 'invisible' : 'hover:bg-blue-50 text-gray-700'}
                    ${day === value?.getDate() && viewDate.getMonth() === value?.getMonth() ? 'bg-blue-600 text-white font-bold' : ''}
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* 時間區 */}
          <div className="w-full md:w-32 bg-gray-50 flex flex-col">
            <div className="p-3 text-xs font-bold text-gray-500 border-b border-gray-200 text-center">選擇時間</div>
            <div className="overflow-y-auto max-h-64 scrollbar-hide">
              {Array.from({ length: 24 }).map((_, h) => (
                <button
                  key={h}
                  onClick={() => selectTime(h)}
                  className={`w-full py-2 text-xs hover:bg-blue-100 transition-colors ${value?.getHours() === h ? 'bg-blue-100 text-blue-700 font-bold border-r-4 border-blue-600' : 'text-gray-600'}`}
                >
                  {String(h).padStart(2, '0')}:00
                </button>
              ))}
            </div>
          </div>

          {/* 底部關閉按鈕 (手機版方便使用) */}
          <div className="md:hidden p-2 border-t border-gray-100">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs"
            >
              完成選擇
            </button>
          </div>
        </div>
      )}
      
      {/* 點擊外部關閉 */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-white">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl mb-4">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">預約時間設定</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">支援手動輸入、日曆選取與時間設定</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              預約日期與時間
            </label>
            
            <CustomDateTimePicker 
              value={selectedDate} 
              onChange={setSelectedDate} 
            />
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">功能特點</h3>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-slate-600">
                <Type className="w-3.5 h-3.5 mr-2 text-blue-400" />
                可以直接在輸入框打字解析日期
              </div>
              <div className="flex items-center text-xs text-slate-600">
                <CalendarIcon className="w-3.5 h-3.5 mr-2 text-blue-400" />
                圖形化日曆快速選擇天數
              </div>
              <div className="flex items-center text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 mr-2 text-blue-400" />
                右側側邊欄快速設定整點時間
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg shadow-blue-200 flex items-center justify-center ${
              submitted ? 'bg-green-500 shadow-green-100' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {submitted ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                預約成功！
              </>
            ) : (
              '確認並提交預約'
            )}
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter mb-1">內部儲存格式</p>
          <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-2 rounded-lg break-all">
            {selectedDate ? selectedDate.toISOString() : 'NULL'}
          </div>
        </footer>
      </div>
    </div>
  );
}