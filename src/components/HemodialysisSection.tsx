import React, { useState } from 'react';
import { 
  Droplet, 
  Plus, 
  Search, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  FileCheck, 
  UserPlus, 
  Edit3, 
  X,
  Activity,
  HeartCrack,
  Waves
} from 'lucide-react';
import { HemodialysisPatient } from '../types/clinical';

interface HemodialysisSectionProps {
  patients: HemodialysisPatient[];
  onAddPatient: (p: Omit<HemodialysisPatient, 'id' | 'status'>) => void;
  onUpdatePatient: (p: HemodialysisPatient) => void;
  onDischargePatient: (p: HemodialysisPatient, summary: string, condition: string) => void;
  onQuickAdd: (name: string) => void;
}

export const HemodialysisSection: React.FC<HemodialysisSectionProps> = ({
  patients,
  onAddPatient,
  onUpdatePatient,
  onDischargePatient,
  onQuickAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quickName, setQuickName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProtocolsOpen, setIsProtocolsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<HemodialysisPatient | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState('السبت - الاثنين - الأربعاء (صباحي)');
  const [access, setAccess] = useState('AV Fistula (شرياني وريدي طبيعي)');
  const [dryWeight, setDryWeight] = useState(70.0);
  const [preWeight, setPreWeight] = useState(73.5);
  const [bp, setBp] = useState('160/95');
  const [k, setK] = useState(5.8);
  const [urea, setUrea] = useState(140);
  const [cr, setCr] = useState(8.5);
  const [hb, setHb] = useState(9.8);
  const [ca, setCa] = useState(8.8);
  const [po4, setPo4] = useState(5.6);

  // Discharge modal state
  const [dischargeTarget, setDischargeTarget] = useState<HemodialysisPatient | null>(null);
  const [dischargeCondition, setDischargeCondition] = useState('متحسن ومستقر بعد الجلسة');
  const [dischargeSummary, setDischargeSummary] = useState('');

  const activePatients = patients.filter(p => p.status !== 'discharged');
  const filteredPatients = activePatients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.access.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.schedule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (patient?: HemodialysisPatient) => {
    if (patient) {
      setEditingPatient(patient);
      setName(patient.name);
      setSchedule(patient.schedule);
      setAccess(patient.access);
      setDryWeight(patient.dryWeight);
      setPreWeight(patient.preWeight);
      setBp(patient.bp);
      setK(patient.k);
      setUrea(patient.urea);
      setCr(patient.cr);
      setHb(patient.hb);
      setCa(patient.ca);
      setPo4(patient.po4);
    } else {
      setEditingPatient(null);
      setName('');
      setSchedule('السبت - الاثنين - الأربعاء (صباحي)');
      setAccess('AV Fistula (شرياني وريدي طبيعي)');
      setDryWeight(70.0);
      setPreWeight(73.5);
      setBp('160/95');
      setK(5.5);
      setUrea(130);
      setCr(8.0);
      setHb(10.0);
      setCa(9.0);
      setPo4(5.0);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let advice = "المؤشرات ملائمة للشروع بجلسة الغسل القياسية مع سحب السوائل الزائدة.";
    let decision = "Proceed Standard Protocol";
    const overload = preWeight - dryWeight;

    if (k >= 6.5) {
      advice = "خطر فرط بوتاسيوم مميت! إعطاء Calcium Gluconate 10% IV فوراً لحماية القلب قبل الشروع بالوصل، واستخدام حمام غسل 1K أو 0K.";
      decision = "Urgent Membrane Stabilization";
    } else if (overload > 4.0) {
      advice = `احتباس سوائل كبير (+${overload.toFixed(1)} L)؛ خطر هبوط الضغط الحاد (IDH) عند محاولة السحب السريع.`;
    }

    if (ca * po4 > 55) {
      advice += ` تنبيه: حاصل ضرب الكالسيوم والفوسفور (${(ca * po4).toFixed(1)}) مرتفع ويسبب تكلس الأوعية الدموية.`;
    }

    if (editingPatient) {
      const updated: HemodialysisPatient = {
        ...editingPatient,
        name: name.trim(),
        schedule,
        access,
        dryWeight: Number(dryWeight),
        preWeight: Number(preWeight),
        bp: bp.trim(),
        k: Number(k),
        urea: Number(urea),
        cr: Number(cr),
        hb: Number(hb),
        ca: Number(ca),
        po4: Number(po4),
        aiDecision: decision,
        aiAdvice: advice,
      };
      onUpdatePatient(updated);
    } else {
      onAddPatient({
        name: name.trim(),
        schedule,
        access,
        dryWeight: Number(dryWeight),
        preWeight: Number(preWeight),
        bp: bp.trim(),
        k: Number(k),
        urea: Number(urea),
        cr: Number(cr),
        hb: Number(hb),
        ca: Number(ca),
        po4: Number(po4),
        aiDecision: decision,
        aiAdvice: advice,
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    onQuickAdd(quickName.trim());
    setQuickName('');
  };

  const handleConfirmDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dischargeTarget) return;
    onDischargePatient(dischargeTarget, dischargeSummary.trim() || 'اكتمال جلسة الغسل واستقرار الفعاليات الحيوية.', dischargeCondition);
    setDischargeTarget(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Droplet className="w-4 h-4" />
            <span>Hemodialysis & Nephrology Suite</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            وحدة إدارة مرضى الغسل الكلوي والتقييم الذكي
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            متابعة دقيقة للوزن الجاف، احتباس السوائل، تحاليل البوتاسيوم والشوارد، وبروتوكولات طوارئ الغسل
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Add by Name */}
          <form onSubmit={handleQuickAddSubmit} className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <input
              type="text"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder="اسم مريض الغسل..."
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none w-36 md:w-44 focus:border-teal-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة سريعة</span>
            </button>
          </form>

          {/* Protocols Modal Button */}
          <button
            onClick={() => setIsProtocolsOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>بروتوكولات وطوارئ الغسل</span>
          </button>

          {/* Full Add Modal */}
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>إضافة مريض غسل (كامل)</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="البحث باسم مريض الغسل، الوردية، أو نوع المخرج (Fistula / Permcath)..."
          className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-teal-500 shadow-sm"
        />
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">لا يوجد مرضى غسل كلوي مسجلون حالياً</h3>
          <p className="text-xs text-slate-400 mt-1">استخدم شريط الإضافة السريعة لإدراج مريض فوراً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => {
            const fluidOverload = (patient.preWeight - patient.dryWeight).toFixed(1);
            const isCriticalK = patient.k >= 6.5;

            return (
              <div
                key={patient.id}
                className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isCriticalK ? 'border-r-4 border-r-red-500 border-slate-200' : 'border-r-4 border-r-teal-500 border-slate-200'
                }`}
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-teal-600" />
                      <span>{patient.name}</span>
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {patient.schedule}
                    </span>
                  </div>

                  {/* Access & Weights */}
                  <div className="text-xs space-y-1 mb-2.5 text-slate-600">
                    <div><strong>المخرج الوريدي:</strong> {patient.access}</div>
                    <div><strong>الوزن الجاف / الحالي:</strong> {patient.dryWeight} kg / {patient.preWeight} kg</div>
                  </div>

                  {/* Fluid Overload Highlight */}
                  <div className="bg-teal-50/80 border border-teal-100 p-2 rounded-xl text-xs font-bold text-teal-950 mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-teal-600" />
                      <span>احتباس السوائل المقدر:</span>
                    </span>
                    <span className="text-sm font-black text-teal-700">+{fluidOverload} L</span>
                  </div>

                  {/* AI Advice Badge */}
                  <div className={`p-2.5 rounded-xl border text-xs mb-3 leading-relaxed ${
                    isCriticalK ? 'bg-red-50 border-red-200 text-red-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-1 text-[11px] font-black text-teal-900 mb-0.5">
                      <Activity className="w-3 h-3 text-teal-600" />
                      <span>تقييم الذكاء السريري:</span>
                    </div>
                    {patient.aiAdvice}
                  </div>

                  {/* Lab Results Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                      BP: {patient.bp}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-black ${
                      isCriticalK ? 'bg-red-100 text-red-800 border-red-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      K+: {patient.k} mmol/L
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                      Urea: {patient.urea}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                      Cr: {patient.cr}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                      Hb: {patient.hb}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => openModal(patient)}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200"
                  >
                    تعديل التحاليل
                  </button>
                  <button
                    onClick={() => {
                      setDischargeTarget(patient);
                      setDischargeSummary(`اكتمال جلسة الغسل الكلوي، البوتاسيوم بعد الجلسة طبيعي، وضغط الدم ${patient.bp}.`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1"
                    title="تخريج المريض وحفظه في الأرشيف لمدة شهر"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>تخريج</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit HD Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-teal-600" />
                <span>{editingPatient ? 'تعديل بيانات وتحاليل مريض الغسل' : 'إضافة مريض لوحدة الغسل الكلوي'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم المريض (إلزامي):</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="الاسم الكامل..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">جدول الوردية:</label>
                  <select
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="السبت - الاثنين - الأربعاء (صباحي)">السبت - الاثنين - الأربعاء (صباحي)</option>
                    <option value="السبت - الاثنين - الأربعاء (مسائي)">السبت - الاثنين - الأربعاء (مسائي)</option>
                    <option value="الأحد - الثلاثاء - الخميس (صباحي)">الأحد - الثلاثاء - الخميس (صباحي)</option>
                    <option value="الأحد - الثلاثاء - الخميس (مسائي)">الأحد - الثلاثاء - الخميس (مسائي)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">مخرج الغسل (Vascular Access):</label>
                  <select
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="AV Fistula (شرياني وريدي طبيعي)">AV Fistula (طبيعي)</option>
                    <option value="AV Graft (وصلة صناعية)">AV Graft (صناعي)</option>
                    <option value="Permcath (قسطرة دائمية)">Permcath (دائمية)</option>
                    <option value="Temporary CVC (قسطرة مؤقتة)">Temporary CVC (مؤقتة)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الوزن الجاف (Dry Weight kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dryWeight}
                    onChange={(e) => setDryWeight(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الوزن الحالي (Pre-HD kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={preWeight}
                    onChange={(e) => setPreWeight(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">ضغط الدم (BP):</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-teal-700 block mb-2">نتائج التحاليل المخبرية الدورية:</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">K+ (mmol/L):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={k}
                      onChange={(e) => setK(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Urea (mg/dL):</label>
                    <input
                      type="number"
                      value={urea}
                      onChange={(e) => setUrea(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Cr (mg/dL):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cr}
                      onChange={(e) => setCr(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Hb (g/dL):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={hb}
                      onChange={(e) => setHb(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Ca (mg/dL):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ca}
                      onChange={(e) => setCa(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">PO4 (mg/dL):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={po4}
                      onChange={(e) => setPo4(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Protocols & Emergencies Modal */}
      {isProtocolsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <h3 className="font-extrabold text-base text-white">
                  بروتوكولات وطوارئ الغسل الكلوي وعلاج الاختلاطات السريرية
                </h3>
              </div>
              <button onClick={() => setIsProtocolsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3.5 text-xs md:text-sm text-slate-800 leading-relaxed">
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/60">
                <h4 className="font-bold text-red-950 flex items-center gap-1.5 mb-1">
                  <HeartCrack className="w-4 h-4 text-red-600" />
                  <span>1. هبوط الضغط أثناء الغسل (Intradialytic Hypotension - IDH):</span>
                </h4>
                <p className="text-slate-700"><strong>الأعراض:</strong> دوخة، غثيان، تشنج عضلي، تثاؤب متكرر، انخفاض SBP بأكثر من 20 mmHg.</p>
                <p className="text-slate-800 font-bold mt-1">
                  <strong>التدبير الفوري:</strong> إيقاف السحب فوراً (UF Rate = 0)، وضعية ترندلنبورغ (رفع الساقين)، خفض سرعة المضخة BFR إلى 100-150 ml/min، وإعطاء بولس 100-200 ml من المحلول الملحي 0.9% Normal Saline.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>2. متلازمة اختلال التوازن (Dialysis Disequilibrium Syndrome - DDS):</span>
                </h4>
                <p className="text-slate-700"><strong>الأعراض:</strong> صداع نابض، قيء، هياج وارتباك، وتشنجات صرعية ناتجة عن وذمة الدماغ الحادة بالسحب السريع لليوريا.</p>
                <p className="text-slate-800 font-bold mt-1">
                  <strong>التدبير الفوري:</strong> إيقاف الجلسة فوراً، تأمين مجرى التنفس، إعطاء مانيتول 20% (0.5 g/kg IV) أو محلول ملحي عالي التركيز 3% (100 ml IV على 15 دقيقة) لسحب السوائل من الدماغ.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/60">
                <h4 className="font-bold text-sky-950 flex items-center gap-1.5 mb-1">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span>3. تشنجات العضلات الحادة (Muscle Cramps):</span>
                </h4>
                <p className="text-slate-700"><strong>السبب:</strong> السحب السريع للترشيح الفائق ونقص أسمولية البلازما.</p>
                <p className="text-slate-800 font-bold mt-1">
                  <strong>التدبير الفوري:</strong> تقليل السحب، إعطاء 100 ml Normal Saline أو 25 ml من دكستروز عالي التركيز D50W لرفع الأسمولية.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end">
              <button
                onClick={() => setIsProtocolsOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                إغلاق الدليل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discharge Confirmation Modal */}
      {dischargeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <span>تخريج مريض الغسل: {dischargeTarget.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              سيتم نقل المريض إلى قائمة الحالات المخرجة وسيتم حذف اسمه تلقائياً بعد مرور شهر كامل.
            </p>

            <form onSubmit={handleConfirmDischarge} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">حالة المريض عند الخروج:</label>
                <select
                  value={dischargeCondition}
                  onChange={(e) => setDischargeCondition(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                >
                  <option value="متحسن ومستقر بعد الجلسة">متحسن ومستقر بعد الجلسة</option>
                  <option value="اكتمال جلسة الغسل بنجاح">اكتمال جلسة الغسل بنجاح</option>
                  <option value="إحالة إلى طوارئ القلب">إحالة إلى طوارئ القلب</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ملخص الجلسة:</label>
                <textarea
                  rows={3}
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDischargeTarget(null)}
                  className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  تأكيد التخريج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
