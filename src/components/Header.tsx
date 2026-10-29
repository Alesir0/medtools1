import React, { useState } from 'react';
import { 
  Menu, 
  Activity, 
  Sparkles, 
  UserPlus, 
  Archive, 
  AlertTriangle 
} from 'lucide-react';
import { DepartmentType } from '../types/clinical';

interface HeaderProps {
  wardTitle: string;
  aiStatus: string;
  isAiEnabled: boolean;
  dischargedCount: number;
  onToggleSidebar: () => void;
  onQuickAddPatient: (name: string, department: DepartmentType) => void;
  onNavigateToDischarged: () => void;
  bannerConfig: { active: boolean; text: string; type: string };
  onDismissBanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wardTitle,
  aiStatus,
  isAiEnabled,
  dischargedCount,
  onToggleSidebar,
  onQuickAddPatient,
  onNavigateToDischarged,
  bannerConfig,
  onDismissBanner,
}) => {
  const [quickName, setQuickName] = useState('');
  const [quickDept, setQuickDept] = useState<DepartmentType>('طوارئ');
  const [showQuickForm, setShowQuickForm] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    onQuickAddPatient(quickName.trim(), quickDept);
    setQuickName('');
    setShowQuickForm(false);
  };

  return (
    <>
      {/* Alert Banner if enabled */}
      {bannerConfig.active && (
        <div className={`px-4 py-2 text-sm font-semibold flex items-center justify-between transition-all ${
          bannerConfig.type === 'banner-danger' 
            ? 'bg-red-50 text-red-800 border-b border-red-200'
            : bannerConfig.type === 'banner-success'
            ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
            : bannerConfig.type === 'banner-info'
            ? 'bg-sky-50 text-sky-800 border-b border-sky-200'
            : 'bg-amber-50 text-amber-800 border-b border-amber-200'
        }`}>
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="truncate">{bannerConfig.text}</span>
          </div>
          <button 
            onClick={onDismissBanner}
            className="text-slate-400 hover:text-slate-700 px-2 text-lg font-bold"
            title="إخفاء التنبيه"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Right section: Menu button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              aria-label="القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-base md:text-lg tracking-tight text-white line-clamp-1">
                  {wardTitle}
                </h1>
                <p className="text-xs text-sky-300/80 hidden sm:block">
                  منظومة الفرز والتدقيق السريري الذكي للأطباء
                </p>
              </div>
            </div>
          </div>

          {/* Center & Left section: Quick Add by Name & Status */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Quick Add Button or Inline Form */}
            {!showQuickForm ? (
              <button
                onClick={() => setShowQuickForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs md:text-sm font-bold shadow-sm transition-all"
                title="إضافة مريض في أي قسم بالاسم فقط"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">إضافة مريض بالاسم فقط</span>
                <span className="sm:hidden">إضافة مريض</span>
              </button>
            ) : (
              <form onSubmit={handleQuickSubmit} className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-sky-500/50">
                <input
                  type="text"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="اسم المريض..."
                  autoFocus
                  required
                  className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded outline-none border border-slate-700 w-32 md:w-44 focus:border-sky-400"
                />
                <select
                  value={quickDept}
                  onChange={(e) => setQuickDept(e.target.value as DepartmentType)}
                  className="bg-slate-900 text-slate-200 text-xs px-2 py-1 rounded outline-none border border-slate-700"
                >
                  <option value="طوارئ">الطوارئ</option>
                  <option value="ردهات">الردهات</option>
                  <option value="غسل كلوي">الغسل الكلوي</option>
                </select>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-white px-2.5 py-1 rounded text-xs font-bold"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickForm(false)}
                  className="text-slate-400 hover:text-white px-1.5 text-xs"
                >
                  إلغاء
                </button>
              </form>
            )}

            {/* Discharged Cases Navigation Button */}
            <button
              onClick={onNavigateToDischarged}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              title="سجل الحالات التي تم تخريجها (تحذف بعد شهر)"
            >
              <Archive className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">المخرجون</span>
              {dischargedCount > 0 && (
                <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-full text-[11px] border border-amber-500/30">
                  {dischargedCount}
                </span>
              )}
            </button>

            {/* AI Status Badge */}
            {isAiEnabled && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiStatus}</span>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
};
