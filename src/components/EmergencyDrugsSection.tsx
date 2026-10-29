import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Syringe, 
  HeartPulse, 
  Activity, 
  ShieldAlert,
  ArrowLeft,
  Info
} from 'lucide-react';
import { EmergencyDrug, EmergencyCategoryKey } from '../types/clinical';
import { EMERGENCY_DRUGS_DATA, EMERGENCY_CATEGORIES } from '../data/emergencyDrugsData';

interface EmergencyDrugsSectionProps {
  drugs?: EmergencyDrug[];
}

export const EmergencyDrugsSection: React.FC<EmergencyDrugsSectionProps> = ({
  drugs = EMERGENCY_DRUGS_DATA,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategoryKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrugModal, setSelectedDrugModal] = useState<EmergencyDrug | null>(null);

  const filteredDrugs = drugs.filter((drug) => {
    const matchesCategory = selectedCategory === 'all' || drug.category === selectedCategory;
    const matchesSearch = 
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.indications.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Pill className="w-4 h-4" />
            <span>Emergency & Resuscitation Formulary (English & Arabic Monographs)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            دليل أدوية الطوارئ والإنعاش المصنف
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            تصنيفات شاملة لكافة أدوية الإنعاش، الصدمة، اضطرابات النظم، الترياقات، والمهدئات مع بروتوكولات التخفيف السريرية
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start md:self-auto">
          إجمالي الأدوية الطارئة: {drugs.length} دواء
        </div>
      </div>

      {/* REQUIREMENT 6: Clickable Category Tabs at the Top */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {EMERGENCY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const count = cat.key === 'all' 
            ? drugs.length 
            : drugs.filter(d => d.category === cat.key).length;

          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 ring-2 ring-rose-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="البحث باسم دواء الطوارئ، المادة الفعالة، دواعي الاستعمال أو الترياق..."
          className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-rose-500 shadow-sm"
        />
      </div>

      {/* Grid of Emergency Drugs */}
      {filteredDrugs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <Pill className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">لم يتم العثور على أدوية مطابقة للبحث</h3>
          <p className="text-xs text-slate-400 mt-1">جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrugs.map((drug) => (
            <div
              key={drug.id}
              onClick={() => setSelectedDrugModal(drug)}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {drug.categoryLabel}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {drug.id}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors mb-1">
                  {drug.name}
                </h3>
                <div className="text-xs text-sky-700 font-semibold mb-2.5">
                  {drug.genericName}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                  {drug.summary}
                </p>

                {/* Dose Preview Box */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs mb-3 space-y-1">
                  <span className="font-bold text-slate-800 block text-[11px]">الجرعة الإسعافية السريعة:</span>
                  <p className="text-slate-600 font-medium line-clamp-2 whitespace-pre-line text-[11.5px]">
                    {drug.adultDose}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-bold group-hover:underline">
                <span className="flex items-center gap-1">
                  <Syringe className="w-3.5 h-3.5" />
                  <span>بروتوكول التخفيف والموانع</span>
                </span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drug Detail Modal */}
      {selectedDrugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base md:text-lg text-white">
                    {selectedDrugModal.name}
                  </h3>
                  <p className="text-xs text-rose-300">
                    {selectedDrugModal.genericName} • [{selectedDrugModal.categoryLabel}]
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDrugModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs md:text-sm text-slate-800 leading-relaxed">
              
              {/* Indications */}
              <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-xl">
                <h4 className="font-bold text-sky-950 text-xs md:text-sm flex items-center gap-1.5 mb-1.5">
                  <CheckCircle className="w-4 h-4 text-sky-600" />
                  <span>دواعي الاستعمال في الطوارئ (Emergency Indications):</span>
                </h4>
                <p className="text-slate-700 font-medium">{selectedDrugModal.indications}</p>
              </div>

              {/* Adult Dosing */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <h4 className="font-bold text-slate-900 text-xs md:text-sm flex items-center gap-1.5 mb-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>الجرعات الإسعافية للبالغين (Adult Emergency Dosage):</span>
                </h4>
                <p className="text-slate-800 font-medium whitespace-pre-line bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs">
                  {selectedDrugModal.adultDose}
                </p>
              </div>

              {/* Pediatric Emergency Dosing if available */}
              {selectedDrugModal.pediatricDose && (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                  <h4 className="font-bold text-emerald-950 text-xs md:text-sm flex items-center gap-1.5 mb-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>جرعة الأطفال الإسعافية (Pediatric Resuscitation Dose):</span>
                  </h4>
                  <p className="text-emerald-900 font-medium whitespace-pre-line bg-white p-2.5 rounded-lg border border-emerald-200">
                    {selectedDrugModal.pediatricDose}
                  </p>
                </div>
              )}

              {/* Dilution and Administration */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <h4 className="font-bold text-slate-900 text-xs md:text-sm flex items-center gap-1.5 mb-1.5">
                  <Syringe className="w-4 h-4 text-sky-600" />
                  <span>بروتوكول التخفيف والتسريب الوريدي (Dilution & Infusion Rate):</span>
                </h4>
                <p className="text-slate-700 font-medium">{selectedDrugModal.dilution}</p>
              </div>

              {/* Contraindications */}
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl">
                <h4 className="font-bold text-red-950 text-xs md:text-sm flex items-center gap-1.5 mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>موانع الاستعمال والتحذيرات الصارمة (Contraindications & Black Box Warnings):</span>
                </h4>
                <p className="text-red-900 font-medium mb-1.5">{selectedDrugModal.contraindications}</p>
                {selectedDrugModal.warnings && (
                  <p className="text-xs text-red-800 bg-white/70 p-2 rounded border border-red-200 font-bold">
                    ⚠️ تنبيه: {selectedDrugModal.warnings}
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end">
              <button
                onClick={() => setSelectedDrugModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
