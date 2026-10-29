import React, { useState } from 'react';
import { 
  Plus, 
  AlertTriangle, 
  Ambulance, 
  Search, 
  Pill, 
  TrendingUp, 
  Clock, 
  Edit3, 
  CheckCircle,
  FileCheck,
  UserPlus,
  Trash2
} from 'lucide-react';
import { EmergencyPatient, PediatricDrug, EmergencyDrug, IraqiDrug } from '../types/clinical';
import { EmergencyDetailModal } from './EmergencyDetailModal';

interface EmergencySectionProps {
  patients: EmergencyPatient[];
  onAddPatient: (p: Omit<EmergencyPatient, 'id' | 'entryTime' | 'status' | 'vitalsHistory' | 'administeredMeds'>) => void;
  onUpdatePatient: (updated: EmergencyPatient) => void;
  onDischargePatient: (patient: EmergencyPatient, summaryNotes: string, condition: string) => void;
  onQuickAdd: (name: string) => void;
  pediatricDrugs: PediatricDrug[];
  emergencyDrugs: EmergencyDrug[];
  iraqiDrugs: IraqiDrug[];
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  patients,
  onAddPatient,
  onUpdatePatient,
  onDischargePatient,
  onQuickAdd,
  pediatricDrugs,
  emergencyDrugs,
  iraqiDrugs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<EmergencyPatient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickName, setQuickName] = useState('');

  // Add Full Patient Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [cc, setCc] = useState('');
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState<number>(85);
  const [rr, setRr] = useState<number>(18);
  const [spo2, setSpo2] = useState<number>(98);
  const [gcs, setGcs] = useState<number>(15);
  const [pain, setPain] = useState<number>(3);
  const [redflags, setRedflags] = useState('none');

  // Filtered list
  const activePatients = patients.filter(p => p.status !== 'discharged');
  const filteredPatients = activePatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const redCount = activePatients.filter(p => p.triageLevel === 1).length;
  const orangeCount = activePatients.filter(p => p.triageLevel === 2).length;
  const yellowCount = activePatients.filter(p => p.triageLevel >= 3).length;

  const handleOpenDetail = (patient: EmergencyPatient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let level: 1 | 2 | 3 | 4 | 5 = 3;
    let levelTitle = "المستوى 3: حاد ومستقر (Urgent)";
    let badgeClass = "bg-amber-100 text-amber-800 border-amber-300";
    let rationale = "العلامات الحيوية مستقرة نسبياً، يتطلب موارد تشخيصية وعلاجية متعددة.";
    let action = "حجز وريدي، سحب تحاليل دم، ومراقبة العلامات الحيوية كل 30 دقيقة.";

    const ageNum = typeof age === 'number' ? age : 40;

    if (redflags === 'cardiac_arrest' || gcs <= 8 || spo2 < 85 || hr < 40 || hr > 160) {
      level = 1;
      levelTitle = "المستوى 1: إنعاش فوري مهدد للحياة (Resuscitation)";
      badgeClass = "bg-red-100 text-red-800 border-red-300";
      rationale = "حالة مهددة للحياة فوراً؛ خطر توقف تنفسي أو قلبي وشيك مع فشل عصبي أو دوراني حاد.";
      action = "غرفة الإنعاش الأحمر، تأمين مجرى التنفس، مراقبة قلبية فورية، استدعاء اختصاصي الطوارئ.";
    } else if (redflags === 'chest_stemi' || redflags === 'shock_lethal' || redflags === 'stroke_focal' || pain >= 8 || hr > 120 || rr > 26 || spo2 < 92) {
      level = 2;
      levelTitle = "المستوى 2: طارئ حرج (< 15 دقيقة - Emergent)";
      badgeClass = "bg-orange-100 text-orange-800 border-orange-300";
      rationale = "حالة عالية الخطورة تشمل اشتباه جلطة قلبية أو سكتة أو صدمة مبكرة مع اضطراب في الفعاليات الحيوية.";
      action = "تخطيط قلب فوري، تأمين خطين وريديين، إعطاء أكسجين، والتدخل السريري خلال دقائق.";
    }

    onAddPatient({
      name: name.trim(),
      age: ageNum,
      cc: cc.trim() || 'فحص طوارئ عام',
      triageLevel: level,
      triageTitle: levelTitle,
      badgeClass,
      rationale,
      action,
      bp,
      hr,
      rr,
      spo2,
      gcs,
      pain,
      redflags,
    });

    setIsAddModalOpen(false);
    setName('');
    setAge('');
    setCc('');
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    onQuickAdd(quickName.trim());
    setQuickName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Ambulance className="w-4 h-4" />
            <span>Emergency AI Triage & Resuscitation Suite</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            وحدة فرز وإدارة مرضى الطوارئ (ESI Triage)
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            تصنيف ذكي فوري، متابعة تفاصيل الأدوية المعطاة، وتسجيل تغيرات الفعاليات الحيوية بين فترة وأخرى
          </p>
        </div>

        {/* Action Buttons & Quick Add */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Add inline by Name */}
          <form onSubmit={handleQuickAddSubmit} className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <input
              type="text"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder="اسم المريض السريع..."
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none w-36 md:w-44 focus:border-rose-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة سريعة</span>
            </button>
          </form>

          {/* Full Add Modal trigger */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-rose-400" />
            <span>فرز سريري متقدم (كامل)</span>
          </button>
        </div>
      </div>

      {/* ESI Triage Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100/60 border border-red-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-red-800 block">المستوى 1 (إنعاش فوري مهدد للحياة)</span>
            <span className="text-xs text-red-600">Immediate Resuscitation</span>
          </div>
          <span className="text-3xl font-black text-red-600">{redCount}</span>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/60 border border-orange-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-orange-800 block">المستوى 2 (طارئ حرج &lt; 15 دقيقة)</span>
            <span className="text-xs text-orange-600">Emergent High Risk</span>
          </div>
          <span className="text-3xl font-black text-orange-600">{orangeCount}</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-amber-800 block">المستوى 3 (حاد ومستقر نسبياً)</span>
            <span className="text-xs text-amber-600">Urgent Multi-Resource</span>
          </div>
          <span className="text-3xl font-black text-amber-600">{yellowCount}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="البحث بالاسم أو الشكوى أو الأدوية المعطاة..."
          className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-rose-500 shadow-sm"
        />
      </div>

      {/* Patients Cards Grid */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <Ambulance className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">لا يوجد مرضى طوارئ نشطون حالياً</h3>
          <p className="text-xs text-slate-400 mt-1">
            يمكنك إضافة مريض فوراً فقط بكتابة اسمه في شريط الإضافة السريعة أعلاه
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => {
            const hasHistory = patient.vitalsHistory && patient.vitalsHistory.length > 1;
            const oldestVitals = hasHistory ? patient.vitalsHistory[patient.vitalsHistory.length - 1] : null;

            return (
              <div
                key={patient.id}
                onClick={() => handleOpenDetail(patient)}
                className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative group ${
                  patient.triageLevel === 1 
                    ? 'border-r-4 border-r-red-500 border-slate-200' 
                    : patient.triageLevel === 2 
                    ? 'border-r-4 border-r-orange-500 border-slate-200' 
                    : 'border-r-4 border-r-amber-400 border-slate-200'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                        <span>{patient.name}</span>
                        <span className="text-xs text-slate-400 font-normal">({patient.age} سنة)</span>
                      </h3>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>دخول: {patient.entryTime}</span>
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${patient.badgeClass}`}>
                      ESI {patient.triageLevel}
                    </span>
                  </div>

                  {/* Chief Complaint */}
                  <div className="bg-amber-50/70 border border-amber-100 p-2 rounded-lg text-xs font-bold text-amber-900 mb-3 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{patient.cc}</span>
                  </div>

                  {/* Vitals Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                      BP: {patient.bp}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                      HR: {patient.hr}
                    </span>
                    <span className={`px-2 py-1 rounded-md border text-[11px] font-bold ${
                      patient.spo2 < 92 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      SpO2: {patient.spo2}%
                    </span>
                    <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                      GCS: {patient.gcs}/15
                    </span>
                    <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                      Pain: {patient.pain}/10
                    </span>
                  </div>

                  {/* REQUIREMENT 2: Administered Medications in the Card */}
                  <div className="mb-3 bg-rose-50/40 border border-rose-100/80 rounded-xl p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-rose-500" />
                        <span>الأدوية المعطاة ({patient.administeredMeds.length}):</span>
                      </span>
                    </div>
                    {patient.administeredMeds.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic block">لم تُعطَ أدوية بعد</span>
                    ) : (
                      <div className="space-y-1">
                        {patient.administeredMeds.slice(0, 4).map((m) => (
                          <div key={m.id} className="flex items-center justify-between text-[11px] bg-white px-2 py-1 rounded border border-rose-100 hover:border-rose-200 transition-colors">
                            <div className="flex-1 min-w-0 pr-1">
                              <span className="font-bold text-slate-800">{m.name}</span>
                              <span className="text-rose-700 font-bold mx-1">({m.dose})</span>
                              <span className="text-slate-400 text-[10px]">{m.route}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-slate-400 text-[10px]">{m.time}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = {
                                    ...patient,
                                    administeredMeds: patient.administeredMeds.filter(medItem => medItem.id !== m.id),
                                  };
                                  onUpdatePatient(updated);
                                }}
                                className="p-0.5 rounded text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="حذف هذا العلاج"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {patient.administeredMeds.length > 4 && (
                          <span className="text-[10px] text-sky-600 font-bold block text-left">
                            + {patient.administeredMeds.length - 4} أدوية إضافية...
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* REQUIREMENT 2: Vitals History and Trend Evolution between periods */}
                  {hasHistory && oldestVitals && (
                    <div className="mb-3 bg-sky-50/50 border border-sky-100 rounded-xl p-2.5 text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-sky-900 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                        <span>تغير الفعاليات الحيوية:</span>
                      </div>
                      <div className="text-slate-600 space-y-0.5 text-[10.5px]">
                        <div className="flex items-center justify-between">
                          <span>عند الدخول ({oldestVitals.timestamp}):</span>
                          <span className="font-semibold">{oldestVitals.bp} | HR {oldestVitals.hr} | SpO2 {oldestVitals.spo2}%</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-900 font-bold">
                          <span>الحالي:</span>
                          <span className="text-emerald-700">{patient.bp} | HR {patient.hr} | SpO2 {patient.spo2}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                  <span className="text-[11px] text-sky-600 font-bold group-hover:underline">
                    انقر لعرض التفاصيل الكاملة ←
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(patient);
                      }}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="تعديل معلومات المريض"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDischargePatient(patient, 'تم استقرار الحالة وتخريج المريض مع التوصيات الطبية.', 'متحسن ومستقر سريرياً');
                      }}
                      className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center gap-1"
                      title="تخريج المريض (ينتقل لقائمة المخرجين ويحذف بعد شهر)"
                    >
                      <FileCheck className="w-3 h-3 text-amber-600" />
                      <span>تخريج</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Full Patient Creation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-rose-600" />
                <span>إضافة وفرز مريض طوارئ متقدم</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم المريض (إلزامي):</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="الاسم الكامل..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">العمر:</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="العمر بالسنوات..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الشكوى الرئيسية (Chief Complaint):</label>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="مثال: ألم صدري حاد، ضيق تنفس، سقوط من علو..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الضغط (BP):</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">النبض (HR):</label>
                  <input
                    type="number"
                    value={hr}
                    onChange={(e) => setHr(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الأكسجين (SpO2):</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">التنفس (RR):</label>
                  <input
                    type="number"
                    value={rr}
                    onChange={(e) => setRr(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الوعي (GCS):</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    value={gcs}
                    onChange={(e) => setGcs(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الألم (0-10):</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={pain}
                    onChange={(e) => setPain(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">علامات خطورة وشيكة:</label>
                <select
                  value={redflags}
                  onChange={(e) => setRedflags(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                >
                  <option value="none">لا توجد علامات خطورة وشيكة</option>
                  <option value="cardiac_arrest">توقف قلب أو تنفس وشيك (إنعاش أحمر)</option>
                  <option value="shock_lethal">علامات صدمة حادة وهبوط ضغط شرياني</option>
                  <option value="chest_stemi">ألم صدري وصفي لجلطة قلبية STEMI</option>
                  <option value="stroke_focal">سكتة دماغية حادة خلال النافذة الزمنية</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  الفرز والتصنيف الفوري
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Patient Detail Modal (Opens when card is clicked) */}
      <EmergencyDetailModal
        patient={selectedPatient}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdatePatient={(updated) => {
          onUpdatePatient(updated);
          setSelectedPatient(updated);
        }}
        onDischargePatient={(p, summary, condition) => {
          onDischargePatient(p, summary, condition);
          setIsDetailModalOpen(false);
        }}
        pediatricDrugs={pediatricDrugs}
        emergencyDrugs={emergencyDrugs}
        iraqiDrugs={iraqiDrugs}
      />

    </div>
  );
};
