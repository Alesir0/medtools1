import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Pill, Sparkles, Building2, AlertCircle, Baby } from 'lucide-react';
import { PediatricDrug, EmergencyDrug, IraqiDrug } from '../types/clinical';

export interface UnifiedDrugOption {
  id: string;
  name: string;
  genericName?: string;
  source: 'iraqi' | 'emergency' | 'pediatric';
  sourceLabel: string;
  categoryLabel?: string;
  suggestedDose?: string;
  suggestedRoute?: string;
}

interface DrugSelectorInputProps {
  value: string;
  onChange: (name: string, suggestedDose?: string, suggestedRoute?: string) => void;
  pediatricDrugs: PediatricDrug[];
  emergencyDrugs: EmergencyDrug[];
  iraqiDrugs: IraqiDrug[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const DrugSelectorInput: React.FC<DrugSelectorInputProps> = ({
  value,
  onChange,
  pediatricDrugs,
  emergencyDrugs,
  iraqiDrugs,
  placeholder = 'ابحث في قاعدة الأدوية أو اكتب الاسم يدوياً...',
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build unified search pool
  const allDrugs = useMemo<UnifiedDrugOption[]>(() => {
    const pool: UnifiedDrugOption[] = [];

    // 1. Iraqi Pharmacy Formulary
    iraqiDrugs.forEach((d) => {
      pool.push({
        id: 'iq_' + d.id,
        name: d.tradeName,
        genericName: d.genericName,
        source: 'iraqi',
        sourceLabel: 'صيدلية العراق',
        categoryLabel: d.categoryLabel,
        suggestedDose: d.adultDose || d.pediatricDose,
        suggestedRoute: d.forms?.includes('أمبول') || d.forms?.includes('فيال') ? 'IV' : 'Oral',
      });
      // Also index generic if significantly different from trade
      if (d.genericName && d.genericName.toLowerCase() !== d.tradeName.toLowerCase()) {
        pool.push({
          id: 'iq_gen_' + d.id,
          name: d.genericName,
          genericName: `(تجاري: ${d.tradeName})`,
          source: 'iraqi',
          sourceLabel: 'صيدلية العراق',
          categoryLabel: d.categoryLabel,
          suggestedDose: d.adultDose || d.pediatricDose,
          suggestedRoute: d.forms?.includes('أمبول') || d.forms?.includes('فيال') ? 'IV' : 'Oral',
        });
      }
    });

    // 2. Emergency Drugs Formulary
    emergencyDrugs.forEach((d) => {
      pool.push({
        id: 'er_' + d.id,
        name: d.name,
        genericName: d.genericName,
        source: 'emergency',
        sourceLabel: 'أدوية الطوارئ',
        categoryLabel: d.categoryLabel,
        suggestedDose: d.adultDose,
        suggestedRoute: 'IV Push / Infusion',
      });
    });

    // 3. Pediatric Drugs Formulary
    pediatricDrugs.forEach((d) => {
      pool.push({
        id: 'peds_' + d.id,
        name: d.name,
        genericName: d.genericName,
        source: 'pediatric',
        sourceLabel: 'أدوية الأطفال',
        categoryLabel: d.category,
        suggestedDose: `${d.mgPerKg} mg/kg (${d.frequency})`,
        suggestedRoute: d.route,
      });
    });

    return pool;
  }, [pediatricDrugs, emergencyDrugs, iraqiDrugs]);

  // Filter based on input value
  const filteredSuggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) {
      // Show first 15 popular medications as quick picks
      return allDrugs.slice(0, 15);
    }
    return allDrugs
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.genericName && d.genericName.toLowerCase().includes(q)) ||
          (d.categoryLabel && d.categoryLabel.toLowerCase().includes(q))
      )
      .slice(0, 25);
  }, [allDrugs, value]);

  const handleSelect = (drug: UnifiedDrugOption) => {
    onChange(drug.name, drug.suggestedDose, drug.suggestedRoute);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full text-xs px-3 py-2 pl-8 border border-slate-300 rounded-lg outline-none focus:border-sky-500 bg-white"
        />
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Dropdown Suggestions List */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100 text-xs">
          <div className="p-2 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-600" />
              <span>نتائج من قاعدة بيانات أدوية الموقع ({filteredSuggestions.length}):</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              أو استمر بكتابة أي اسم يدوياً
            </span>
          </div>

          {filteredSuggestions.length === 0 ? (
            <div className="p-3 text-center text-slate-500 text-xs">
              لم يتم العثور على الدواء في القاعدة. يمكنك إدخال الاسم يدوياً كما هو مكتوب أعلاه.
            </div>
          ) : (
            filteredSuggestions.map((drug) => (
              <button
                key={drug.id}
                type="button"
                onClick={() => handleSelect(drug)}
                className="w-full text-right p-2.5 hover:bg-sky-50 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 group-hover:text-sky-700 flex items-center gap-1.5 truncate">
                    <Pill className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{drug.name}</span>
                    {drug.genericName && (
                      <span className="text-[11px] font-normal text-slate-500 truncate">
                        {drug.genericName}
                      </span>
                    )}
                  </div>
                  {drug.suggestedDose && (
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      الجرعة النموذجية: {drug.suggestedDose}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      drug.source === 'emergency'
                        ? 'bg-rose-100 text-rose-800'
                        : drug.source === 'pediatric'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {drug.sourceLabel}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
