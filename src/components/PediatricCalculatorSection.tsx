import React, { useState } from 'react';
import { 
  Baby, 
  Search, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Info,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { PediatricDrug } from '../types/clinical';
import { PEDIATRIC_DRUGS_DATA } from '../data/pediatricDrugsData';

interface PediatricCalculatorSectionProps {
  drugs?: PediatricDrug[];
}

export const PediatricCalculatorSection: React.FC<PediatricCalculatorSectionProps> = ({
  drugs = PEDIATRIC_DRUGS_DATA,
}) => {
  const [weight, setWeight] = useState<number | ''>(12);
  const [age, setAge] = useState<string>('2 سنة');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDrug, setSelectedDrug] = useState<PediatricDrug>(() => drugs[0] || PEDIATRIC_DRUGS_DATA[0]);

  // Keep selectedDrug synced if drugs list changes and selected is not found
  React.useEffect(() => {
    if (!drugs.some(d => d.id === selectedDrug.id) && drugs.length > 0) {
      setSelectedDrug(drugs[0]);
    }
  }, [drugs, selectedDrug]);

  const categories = [
    { key: 'all', label: 'كافة الأدوية (All)' },
    { key: 'antipyretic', label: 'خافضات الحرارة والمسكنات' },
    { key: 'antibiotic', label: 'المضادات الحيوية للأطفال' },
    { key: 'respiratory', label: 'الجهاز التنفسي والربو' },
    { key: 'anticonvulsant', label: 'مضادات التشنج والصرع' },
    { key: 'steroids', label: 'الستيرويدات ومضادات الالتهاب' },
    { key: 'allergy_resuscitation', label: 'الحساسية والإنعاش' },
    { key: 'fluids', label: 'السوائل والجفاف' },
    { key: 'gi_antiemetic', label: 'الجهاز الهضمي والقيء' },
  ];

  const filteredDrugs = drugs.filter((d) => {
    const matchesCategory = selectedCategory === 'all' || d.categoryKey === selectedCategory;
    const matchesSearch = 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.indications.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate dose
  const numericWeight = typeof weight === 'number' && weight > 0 ? weight : 0;
  let calculatedMg = numericWeight * selectedDrug.mgPerKg;
  let isMaxCapped = false;
  if (selectedDrug.maxDoseMg && calculatedMg > selectedDrug.maxDoseMg) {
    calculatedMg = selectedDrug.maxDoseMg;
    isMaxCapped = true;
  }
  const calculatedMl = selectedDrug.concMg > 0 ? ((calculatedMg / selectedDrug.concMg) * selectedDrug.concMl).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Baby className="w-4 h-4" />
            <span>Pediatric Formulary & Weight-Based Calculator</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            حاسبة ودليل جرعات أدوية الأطفال الشامل
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            حساب فوري دقيق لجرعات المليلتر والملغرام بحسب وزن الطفل، مستندة إلى أدلة طب الأطفال العالمية (BNF for Children & Nelson)
          </p>
        </div>
      </div>

      {/* Main Calculator Input Card */}
      <div className="bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/70 border border-emerald-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Weight Input */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>وزن الطفل بالكيلوغرام (Weight in kg):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="70"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="مثال: 12"
                className="w-full text-xl font-black text-slate-900 px-3 py-2 border-2 border-emerald-300 rounded-xl outline-none focus:border-emerald-600"
              />
              <span className="text-sm font-bold text-slate-500">kg</span>
            </div>
            {/* Quick Weight Presets */}
            <div className="flex flex-wrap gap-1 mt-2.5">
              {[5, 8, 10, 12, 15, 20, 25].map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(w)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-colors ${
                    weight === w ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {w} kg
                </button>
              ))}
            </div>
          </div>

          {/* Drug Selection */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs md:col-span-2 flex flex-col justify-between">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-sky-600" />
                <span>اختر الدواء المطلوب حسابه:</span>
              </label>
              <select
                value={selectedDrug.id}
                onChange={(e) => {
                  const found = PEDIATRIC_DRUGS_DATA.find(d => d.id === e.target.value);
                  if (found) setSelectedDrug(found);
                }}
                className="w-full text-xs md:text-sm font-bold text-slate-900 px-3 py-2.5 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500 bg-white"
              >
                {PEDIATRIC_DRUGS_DATA.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} • [{d.category}]
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>طريق الإعطاء: <strong className="text-slate-800">{selectedDrug.route}</strong></span>
              <span>•</span>
              <span>معامل الجرعة: <strong className="text-emerald-700">{selectedDrug.mgPerKg} mg/kg</strong></span>
            </div>
          </div>
        </div>

        {/* Calculation Result Display */}
        {numericWeight > 0 ? (
          <div className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">النتيجة السريرية الدقيقة</span>
                <h3 className="text-base md:text-lg font-black text-slate-900">
                  {selectedDrug.name} ({numericWeight} kg)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-center">
                {selectedDrug.frequency}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Calculated Volume */}
              <div className="bg-emerald-500/10 border border-emerald-300/60 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600 block">الحجم المحسوب للإعطاء بالمليلتر:</span>
                  <span className="text-2xl md:text-3xl font-black text-emerald-700">{calculatedMl} ml</span>
                </div>
                <div className="text-left text-xs font-semibold text-emerald-800">
                  <span>التركيز المعياري:</span>
                  <div className="font-bold">{selectedDrug.concMg}mg / {selectedDrug.concMl}ml</div>
                </div>
              </div>

              {/* Calculated Mg Dose */}
              <div className="bg-sky-500/10 border border-sky-300/60 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600 block">الجرعة المحسوبة بالملغرام:</span>
                  <span className="text-2xl md:text-3xl font-black text-sky-800">{calculatedMg.toFixed(1)} mg</span>
                </div>
                <div className="text-left text-xs font-semibold text-sky-800">
                  {isMaxCapped ? (
                    <span className="text-rose-600 font-bold block">تم تطبيق الحد الأقصى!</span>
                  ) : (
                    <span>({selectedDrug.mgPerKg} mg/kg)</span>
                  )}
                  {selectedDrug.maxDoseMg && (
                    <span className="text-slate-500 block text-[11px]">أقصى جرعة: {selectedDrug.maxDoseMg}mg</span>
                  )}
                </div>
              </div>
            </div>

            {/* Clinical Guidance and Warnings */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">دواعي الاستعمال: </strong>
                  <span className="text-slate-600 font-medium">{selectedDrug.indications}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">إرشادات السلامة والتحذيرات: </strong>
                  <span className="text-slate-600 font-medium">{selectedDrug.counseling}</span>
                </div>
              </div>
              {selectedDrug.contraindications && (
                <div className="flex items-start gap-2 text-rose-900 bg-rose-50/80 p-2 rounded-lg border border-rose-100">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">موانع الاستعمال: </strong>
                    <span>{selectedDrug.contraindications}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
            أدخل وزن الطفل بالكيلوغرام لحساب الجرعة الفورية.
          </div>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input for Formulary */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="البحث باسم دواء الأطفال أو التركيب العلمي أو دواعي الاستعمال..."
          className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-emerald-500 shadow-sm"
        />
      </div>

      {/* Grid of all Pediatric Medications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrugs.map((drug) => {
          const isCurrentSelected = selectedDrug.id === drug.id;
          const currentDoseMg = numericWeight > 0 ? (numericWeight * drug.mgPerKg).toFixed(1) : '-';
          const currentDoseMl = numericWeight > 0 && drug.concMg > 0 ? (((numericWeight * drug.mgPerKg) / drug.concMg) * drug.concMl).toFixed(1) : '-';

          return (
            <div
              key={drug.id}
              onClick={() => {
                setSelectedDrug(drug);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                isCurrentSelected ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {drug.category}
                  </span>
                  {drug.emergencyUse && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                      إسعافي
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 mb-1">{drug.name}</h4>
                <div className="text-[11px] text-sky-700 font-semibold mb-2">{drug.genericName}</div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1 mb-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">معيار الجرعة:</span>
                    <strong className="text-slate-900">{drug.mgPerKg} mg/kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">التركيز:</span>
                    <strong className="text-slate-900">{drug.concMg}mg / {drug.concMl}ml</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">التكرار:</span>
                    <span className="text-slate-800 font-medium truncate max-w-[170px]">{drug.frequency}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                  <strong>الاستطباب:</strong> {drug.indications}
                </p>
              </div>

              {numericWeight > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">لوزن ({numericWeight} kg):</span>
                  <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {currentDoseMl} ml ({currentDoseMg} mg)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
