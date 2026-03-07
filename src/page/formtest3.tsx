import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Calendar, MapPin, DollarSign, MessageSquare, Save, Trash2 } from 'lucide-react';

const App = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    gender: '',
    department: '',
    position: '',
    joinDate: '',
    phone: '',
    email: '',
    emergencyContact: '',
    location: '',
    salaryType: '',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('提交的表單數據:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      employeeId: '',
      gender: '',
      department: '',
      position: '',
      joinDate: '',
      phone: '',
      email: '',
      emergencyContact: '',
      location: '',
      salaryType: '',
      notes: ''
    });
  };

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white hover:border-gray-400";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* 表單標題區 */}
        <div className="bg-white rounded-t-2xl shadow-sm border-b border-gray-100 p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">員工入職資料登記</h2>
          <p className="mt-2 text-gray-600">測試表單：包含 3 欄式佈局與「欄位合併」範例</p>
        </div>

        {/* 表單內容區 */}
        <div className="bg-white rounded-b-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 3欄 網格系統 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 第 1 列 */}
              <div>
                <label className={labelClasses}><User size={16} /> 員工姓名</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="例如：張小明"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}><Briefcase size={16} /> 員工編號</label>
                <input
                  type="text"
                  name="employeeId"
                  placeholder="EMP-001"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>性別</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option value="">請選擇</option>
                  <option value="male">男性 (Male)</option>
                  <option value="female">女性 (Female)</option>
                  <option value="other">其他</option>
                </select>
              </div>

              {/* 第 2 列 */}
              <div>
                <label className={labelClasses}>所屬部門</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option value="">請選擇部門</option>
                  <option value="it">資訊科技部</option>
                  <option value="hr">人力資源部</option>
                  <option value="marketing">行銷部</option>
                  <option value="sales">業務部</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>職位名稱</label>
                <input
                  type="text"
                  name="position"
                  placeholder="例如：高級工程師"
                  value={formData.position}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}><Calendar size={16} /> 入職日期</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* 第 3 列 */}
              <div>
                <label className={labelClasses}><Phone size={16} /> 聯絡電話</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0912-345-678"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}><Mail size={16} /> 電子郵件</label>
                <input
                  type="email"
                  name="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>緊急聯絡人</label>
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="姓名與關係"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* 第 4 列 - 包含合併欄位範例 */}
              <div>
                <label className={labelClasses}><MapPin size={16} /> 工作地點</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">請選擇地點</option>
                  <option value="taipei">台北辦公室</option>
                  <option value="hsinchu">新竹辦公室</option>
                  <option value="remote">遠端辦公</option>
                </select>
              </div>

              {/* 合併欄位：備註事項橫跨 2 個欄位 (md:col-span-2) */}
              <div className="md:col-span-2">
                <label className={labelClasses}><MessageSquare size={16} /> 備註事項 (已合併兩欄位)</label>
                <textarea
                  name="notes"
                  rows={1}
                  placeholder="在此輸入額外說明，此欄位在桌面版會橫跨兩格..."
                  value={formData.notes}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              {/* 額外測試列 (原薪資類別移至此處) */}
              <div>
                <label className={labelClasses}><DollarSign size={16} /> 薪資類別</label>
                <select
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">選擇類別</option>
                  <option value="monthly">月薪</option>
                  <option value="hourly">時薪</option>
                  <option value="contract">合約計件</option>
                </select>
              </div>
            </div>

            {/* 按鈕區域 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                <Save size={20} />
                儲存資料
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                清空重填
              </button>
            </div>

            {/* 成功提示 */}
            {isSubmitted && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center animate-bounce">
                表單已成功提交！
              </div>
            )}
          </form>
        </div>

        {/* 底部數據預覽 */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 text-gray-300 overflow-hidden">
          <h3 className="text-sm font-mono uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">即時 JSON 預覽</h3>
          <pre className="text-xs font-mono overflow-x-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;