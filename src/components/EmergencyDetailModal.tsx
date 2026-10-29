import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Pill, 
  Clock, 
  Plus, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Send,
  FileCheck,
  Trash2
} from 'lucide-react';
import { 
  EmergencyPatient, 
  AdministeredMedication, 
  VitalsRecord,
  PediatricDrug,
  EmergencyDrug,
  IraqiDrug 
} from '../types/clinical';
import { DrugSelectorInput } from './DrugSelectorInput';

interface EmergencyDetailModalProps {
  patient: EmergencyPatient | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePatient: (updated: EmergencyPatient) => void;
  onDischargePatient: (patient: EmergencyPatient, summaryNotes: string, condition: string) => void;
  pediatricDrugs: PediatricDrug[];
  emergencyDrugs: EmergencyDrug[];
  iraqiDrugs: IraqiDrug[];
}

export const EmergencyDetailModal: React.FC<EmergencyDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onUpdatePatient,
  onDischargePatient,
  pediatricDrugs,
  emergencyDrugs,
  iraqiDrugs,
}) => {
  if (!isOpen || !patient) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'meds' | 'vitals' | 'edit' | 'discharge'>('overview');

  // New medication form state
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medRoute, setMedRoute] = useState('IV Push');
  const [medNurse, setMedNurse] = useState('');

  // Edit administered medication dose state
  const [editingMedItem, setEditingMedItem] = useState<AdministeredMedication | null>(null);
  const [editDoseVal, setEditDoseVal] = useState('');
  const [editRouteVal, setEditRouteVal] = useState('');
  const [editTimeVal, setEditTimeVal] = useState('');

  // New vitals form state
  const [newBp, setNewBp] = useState(patient.bp);
  const [newHr, setNewHr] = useState(patient.hr);
  const [newRr, setNewRr] = useState(patient.rr);
  const [newSpo2, setNewSpo2] = useState(patient.spo2);
  const [newGcs, setNewGcs] = useState(patient.gcs);
  const [newPain, setNewPain] = useState(patient.pain);
  const [vitalsNote, setVitalsNote] = useState('');

  // Edit patient form state
  const [editName, setEditName] = useState(patient.name);
  const [editAge, setEditAge] = useState(patient.age);
  const [editCc, setEditCc] = useState(patient.cc);
  const [editLevel, setEditLevel] = useState<1 | 2 | 3 | 4 | 5>(patient.triageLevel);
  const [editNotes, setEditNotes] = useState(patient.notes || '');

  // Discharge form state
  const [dischargeCondition, setDischargeCondition] = useState('متحسن ومستقر سريرياً');
  const [dischargeSummary, setDischargeSummary] = useState('');

  // Handle adding a medication
  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !medDose.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newMed: AdministeredMedication = {
      id: 'med_' + Date.now(),
      name: medName.trim(),
      dose: medDose.trim(),
      route: medRoute,
      time: timeStr,
      givenBy: medNurse.trim() || 'كادر الطوارئ',
    };

    const updated = {
      ...patient,
      administeredMeds: [newMed, ...patient.administeredMeds],
    };

    onUpdatePatient(updated);
    setMedName('');
    setMedDose('');
    setMedNurse('');
  };

  // Handle deleting an administered medication
  const handleDeleteAdministeredMed = (medId: string) => {
    const updated = {
      ...patient,
      administeredMeds: patient.administeredMeds.filter(m => m.id !== medId),
    };
    onUpdatePatient(updated);
  };

  // Handle saving edited dose/details
  const handleSaveEditedMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedItem || !editDoseVal.trim()) return;
    const updated = {
      ...patient,
      administeredMeds: patient.administeredMeds.map(m => {
        if (m.id === editingMedItem.id) {
          return {
            ...m,
            dose: editDoseVal.trim(),
            route: editRouteVal.trim() || m.route,
            time: editTimeVal.trim() || m.time,
          };
        }
        return m;
      }),
    };
    onUpdatePatient(updated);
    setEditingMedItem(null);
  };

  // Handle adding a vitals check
  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newRecord: VitalsRecord = {
      timestamp: timeStr,
      bp: newBp,
      hr: Number(newHr),
      rr: Number(newRr),
      spo2: Number(newSpo2),
      gcs: Number(newGcs),
      pain: Number(newPain),
      note: vitalsNote.trim() || undefined,
    };

    const updated = {
      ...patient,
      bp: newBp,
      hr: Number(newHr),
      rr: Number(newRr),
      spo2: Number(newSpo2),
      gcs: Number(newGcs),
      pain: Number(newPain),
      vitalsHistory: [newRecord, ...patient.vitalsHistory],
    };

    onUpdatePatient(updated);
    setVitalsNote('');
    setActiveTab('vitals');
  };

  // Handle saving general edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...patient,
      name: editName.trim(),
      age: Number(editAge),
      cc: editCc.trim(),
      triageLevel: editLevel,
      triageTitle: editLevel === 1 ? 'المستوى 1: إنعاش فوري مهدد للحياة' : editLevel === 2 ? 'المستوى 2: طارئ حرج (< 15 دقيقة)' : 'المستوى 3: حاد ومستقر',
      badgeClass: editLevel === 1 ? 'bg-red-500/20 text-red-700 border-red-300' : editLevel === 2 ? 'bg-orange-500/20 text-orange-700 border-orange-300' : 'bg-amber-500/20 text-amber-700 border-amber-300',
      notes: editNotes.trim(),
    };
    onUpdatePatient(updated);
    setActiveTab('overview');
  };

  // Handle discharge
  const handleDischargeConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onDischargePatient(patient, dischargeSummary.trim() || 'تم استقرار الحالة وتخريج المريض مع التوصيات الطبية.', dischargeCondition);
    onClose();
  };

  const initialVitals = patient.vitalsHistory.length > 0 ? patient.vitalsHistory[patient.vitalsHistory.length - 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className={`w-3.5 h-3.5 rounded-full ${
              patient.triageLevel === 1 ? 'bg-red-500 animate-pulse' : patient.triageLevel === 2 ? 'bg-orange-500' : 'bg-amber-400'
            }`} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">{patient.name}</h3>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {patient.age} سنة
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${patient.badgeClass}`}>
                  ESI {patient.triageLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                دخول الطوارئ: {patient.entryTime} • الشكوى: {patient.cc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-4 py-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>نظرة عامة والفرز</span>
          </button>
          <button
            onClick={() => setActiveTab('meds')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'meds' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-rose-500" />
            <span>الأدوية المعطاة ({patient.administeredMeds.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vitals' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>تطور الفعاليات الحيوية ({patient.vitalsHistory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'edit' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>تعديل معلومات المريض</span>
          </button>
          <button
            onClick={() => setActiveTab('discharge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'discharge' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>تخريج الحالة</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 text-slate-800">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Current Vitals Cards */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-slate-500 block">ضغط الدم BP</span>
                  <span className="text-base font-extrabold text-slate-900">{patient.bp}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-slate-500 block">النبض HR</span>
                  <span className="text-base font-extrabold text-slate-900">{patient.hr} bpm</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-slate-500 block">الأكسجين SpO2</span>
                  <span className={`text-base font-extrabold ${patient.spo2 < 92 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {patient.spo2}%
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-slate-500 block">التنفس RR</span>
                  <span className="text-base font-extrabold text-slate-900">{patient.rr} /min</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-slate-500 block">الوعي GCS</span>
                  <span className="text-base font-extrabold text-slate-900">{patient.gcs}/15</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-slate-500 block">الألم Pain</span>
                  <span className="text-base font-extrabold text-slate-900">{patient.pain}/10</span>
                </div>
              </div>

              {/* Triage Decision Banner */}
              <div className={`p-4 rounded-xl border ${
                patient.triageLevel === 1 
                  ? 'bg-red-50 border-red-200 text-red-900' 
                  : patient.triageLevel === 2 
                  ? 'bg-orange-50 border-orange-200 text-orange-900' 
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="text-sm md:text-base">تقييم الذكاء الاصطناعي ومعايير الخطورة (ESI Rationale):</span>
                </div>
                <p className="text-sm leading-relaxed font-medium">{patient.rationale}</p>
                <div className="mt-2.5 pt-2.5 border-t border-black/10 flex items-center gap-2 text-xs font-bold">
                  <span>التدبير الفوري المقترح:</span>
                  <span className="text-sky-700 bg-white/80 px-2 py-0.5 rounded">{patient.action}</span>
                </div>
              </div>

              {/* Quick Summary of Administered Medications */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-rose-500" />
                    <span>الأدوية التي تم إعطاؤها للمريض في الطوارئ:</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('meds')}
                    className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إعطاء دواء جديد</span>
                  </button>
                </div>
                {patient.administeredMeds.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">لم يتم إعطاء أي دواء حتى الآن في هذا السجل.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {patient.administeredMeds.map((med) => (
                      <div key={med.id} className="bg-rose-50/60 border border-rose-100 p-2.5 rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-rose-900">{med.name}</div>
                          <div className="text-slate-600">{med.dose} • {med.route}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right text-[11px] text-slate-400">
                            <div>{med.time}</div>
                            <div className="text-slate-500">{med.givenBy}</div>
                          </div>
                          <div className="flex items-center gap-1 border-r border-rose-200 pr-1.5 mr-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMedItem(med);
                                setEditDoseVal(med.dose);
                                setEditRouteVal(med.route);
                                setEditTimeVal(med.time);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-rose-700 hover:bg-rose-100/60 transition-colors"
                              title="تعديل الجرعة"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAdministeredMed(med.id)}
                              className="p-1 rounded text-slate-400 hover:text-red-700 hover:bg-red-100/60 transition-colors"
                              title="حذف هذا الدواء"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              {patient.notes && (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">ملاحظات سريرية:</span>
                  <p className="text-slate-600 leading-relaxed">{patient.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEDICATIONS ADMINISTRATION */}
          {activeTab === 'meds' && (
            <div className="space-y-5">
              {/* Form to add a new medication with Autocomplete / Manual input */}
              <form onSubmit={handleAddMed} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-sky-600" />
                  <span>تسجيل إعطاء دواء جديد للمريض:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      اسم الدواء (ابحث في قاعدة أدوية الموقع أو اكتب يدوياً):
                    </label>
                    <DrugSelectorInput
                      value={medName}
                      onChange={(name, suggestedDose, suggestedRoute) => {
                        setMedName(name);
                        if (suggestedDose && !medDose) setMedDose(suggestedDose);
                        if (suggestedRoute && (suggestedRoute.includes('IV') || suggestedRoute.includes('Push'))) {
                          setMedRoute('IV Push');
                        } else if (suggestedRoute) {
                          setMedRoute(suggestedRoute);
                        }
                      }}
                      pediatricDrugs={pediatricDrugs}
                      emergencyDrugs={emergencyDrugs}
                      iraqiDrugs={iraqiDrugs}
                      placeholder="ابحث في أدوية الطوارئ وصيدلية العراق أو اكتب يدوياً..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة المعطاة:</label>
                    <input
                      type="text"
                      value={medDose}
                      onChange={(e) => setMedDose(e.target.value)}
                      placeholder="مثال: 1g IV, 1mg, 40mg..."
                      required
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 font-bold text-rose-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">طريق الإعطاء:</label>
                    <select
                      value={medRoute}
                      onChange={(e) => setMedRoute(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 bg-white"
                    >
                      <option value="IV Push">وريدي سريع (IV Push)</option>
                      <option value="IV Infusion">تسريب وريدي (IV Infusion)</option>
                      <option value="IM">عضلي (IM)</option>
                      <option value="SC">تحت الجلد (SC)</option>
                      <option value="Oral">فموي (Oral)</option>
                      <option value="Nebulizer">رذاذ / تبخير (Nebulizer)</option>
                      <option value="PR">تحاميل شرجية (PR)</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={medNurse}
                    onChange={(e) => setMedNurse(e.target.value)}
                    placeholder="اسم الممرض أو الطبيب المعطي..."
                    className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg w-64 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>تأكيد إعطاء الدواء</span>
                  </button>
                </div>
              </form>

              {/* Administered Medications Log Table */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-2">سجل الأدوية المحقونة بالكامل:</h4>
                {patient.administeredMeds.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    لا توجد أدوية مسجلة بعد لهذا المريض.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">اسم الدواء</th>
                          <th className="p-3">الجرعة</th>
                          <th className="p-3">طريق الإعطاء</th>
                          <th className="p-3">وقت الإعطاء</th>
                          <th className="p-3">المعطي</th>
                          <th className="p-3 text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {patient.administeredMeds.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{m.name}</td>
                            <td className="p-3 text-rose-700 font-bold">{m.dose}</td>
                            <td className="p-3 text-slate-600">{m.route}</td>
                            <td className="p-3 text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{m.time}</span>
                            </td>
                            <td className="p-3 text-slate-600">{m.givenBy}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMedItem(m);
                                    setEditDoseVal(m.dose);
                                    setEditRouteVal(m.route);
                                    setEditTimeVal(m.time);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                                  title="تعديل الجرعة والمعلومات"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdministeredMed(m.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="حذف هذا الدواء"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VITALS HISTORY & TRENDS */}
          {activeTab === 'vitals' && (
            <div className="space-y-5">
              {/* Form to record new vitals */}
              <form onSubmit={handleAddVitals} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>تسجيل قراءة فعاليات حيوية جديدة للمريض:</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">الضغط (BP):</label>
                    <input
                      type="text"
                      value={newBp}
                      onChange={(e) => setNewBp(e.target.value)}
                      required
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">النبض (HR):</label>
                    <input
                      type="number"
                      value={newHr}
                      onChange={(e) => setNewHr(Number(e.target.value))}
                      required
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">التنفس (RR):</label>
                    <input
                      type="number"
                      value={newRr}
                      onChange={(e) => setNewRr(Number(e.target.value))}
                      required
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">الأكسجين (SpO2 %):</label>
                    <input
                      type="number"
                      value={newSpo2}
                      onChange={(e) => setNewSpo2(Number(e.target.value))}
                      required
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">الوعي (GCS):</label>
                    <input
                      type="number"
                      min="3"
                      max="15"
                      value={newGcs}
                      onChange={(e) => setNewGcs(Number(e.target.value))}
                      required
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">الألم (0-10):</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={newPain}
                      onChange={(e) => setNewPain(Number(e.target.value))}
                      required
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={vitalsNote}
                    onChange={(e) => setVitalsNote(e.target.value)}
                    placeholder="ملاحظات القراءة (مثال: بعد إعطاء بولس ملحي)..."
                    className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg flex-1 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                  >
                    حفظ القراءة
                  </button>
                </div>
              </form>

              {/* Vitals Delta comparison if history exists */}
              {initialVitals && patient.vitalsHistory.length > 1 && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs">
                  <span className="font-bold text-sky-900 block mb-1.5">
                    مقارنة تطور الحالة بين وقت الدخول والوقت الحالي:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-500 block">ضغط الدم:</span>
                      <span className="font-bold">{initialVitals.bp} → {patient.bp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">النبض (HR):</span>
                      <span className="font-bold">{initialVitals.hr} → {patient.hr} bpm</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">الأكسجين (SpO2):</span>
                      <span className={`font-bold ${patient.spo2 >= initialVitals.spo2 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {initialVitals.spo2}% → {patient.spo2}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">درجة الوعي (GCS):</span>
                      <span className="font-bold">{initialVitals.gcs} → {patient.gcs}/15</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline list of all vitals */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-800">سجل القراءات الزمنية الكامل:</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {patient.vitalsHistory.map((v, idx) => (
                    <div key={idx} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                          {v.timestamp}
                        </span>
                        {v.note && <span className="text-sky-700 font-medium">({v.note})</span>}
                      </div>
                      <div className="flex items-center gap-3 font-semibold text-slate-700">
                        <span>BP: <strong className="text-slate-900">{v.bp}</strong></span>
                        <span>HR: <strong className="text-slate-900">{v.hr}</strong></span>
                        <span>SpO2: <strong className={v.spo2 < 92 ? 'text-red-600' : 'text-emerald-600'}>{v.spo2}%</strong></span>
                        <span>GCS: <strong className="text-slate-900">{v.gcs}</strong></span>
                        <span>Pain: <strong className="text-slate-900">{v.pain}/10</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDIT PATIENT INFO */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم المريض:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">العمر (سنة):</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    required
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">مستوى الفرز (ESI Level):</label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 bg-white"
                  >
                    <option value={1}>المستوى 1: إنعاش فوري (Red)</option>
                    <option value={2}>المستوى 2: طارئ حرج (Orange)</option>
                    <option value={3}>المستوى 3: حاد ومستقر (Yellow)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الشكوى الرئيسية (Chief Complaint):</label>
                <input
                  type="text"
                  value={editCc}
                  onChange={(e) => setEditCc(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ملاحظات وتقرير الحالة:</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="ملاحظات سريرية إضافية..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: DISCHARGE CASE */}
          {activeTab === 'discharge' && (
            <form onSubmit={handleDischargeConfirm} className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>تخريج المريض وحفظه في سجل المخرجين:</span>
                </div>
                سيتم نقل المريض مباشرة إلى <strong>قائمة الحالات التي تم تخريجها</strong>، وستظل بياناته محفوظة لمدة شهر كامل (30 يوماً) ليتم حذفها تلقائياً بعد مرور المدة كما ينص النظام.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">حالة المريض عند التخريج:</label>
                <select
                  value={dischargeCondition}
                  onChange={(e) => setDischargeCondition(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white"
                >
                  <option value="متحسن ومستقر سريرياً">متحسن ومستقر سريرياً (Improved & Stable)</option>
                  <option value="شفاء تام وزوال الأعراض">شفاء تام وزوال الأعراض (Resolved)</option>
                  <option value="تحويل إلى ردهة التنويم">تحويل إلى ردهة التنويم (Transferred to Inpatient Ward)</option>
                  <option value="إحالة إلى مركز تخصصي / قسطرة">إحالة إلى مركز تخصصي / قسطرة (Referred to Tertiary Center)</option>
                  <option value="خروج على مسؤوليته الخاصة">خروج على مسؤوليته الخاصة (DAMA)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ملخص الخروج والتوصيات الدوائية للمنزل:</label>
                <textarea
                  rows={4}
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                  placeholder="التشخيص النهائي، الأدوية الموصوفة للمنزل، موعد المراجعة القادمة..."
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>تأكيد تخريج الحالة وإرسالها للأرشيف</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>رقم الملف: {patient.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold"
          >
            إغلاق
          </button>
        </div>

      </div>

      {/* EDIT ADMINISTERED MED DOSE MODAL */}
      {editingMedItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-rose-600" />
                <span>تعديل جرعة دواء الطوارئ: {editingMedItem.name}</span>
              </h3>
              <button onClick={() => setEditingMedItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedMed} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة المعدلة:</label>
                <input
                  type="text"
                  value={editDoseVal}
                  onChange={(e) => setEditDoseVal(e.target.value)}
                  placeholder="مثال: 1g IV, 20mg..."
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500 font-bold text-rose-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">طريق الإعطاء:</label>
                  <select
                    value={editRouteVal}
                    onChange={(e) => setEditRouteVal(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500 bg-white"
                  >
                    <option value="IV Push">وريدي سريع (IV Push)</option>
                    <option value="IV Infusion">تسريب وريدي (IV Infusion)</option>
                    <option value="IM">عضلي (IM)</option>
                    <option value="SC">تحت الجلد (SC)</option>
                    <option value="Oral">فموي (Oral)</option>
                    <option value="Nebulizer">رذاذ / تبخير (Nebulizer)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">وقت الإعطاء:</label>
                  <input
                    type="text"
                    value={editTimeVal}
                    onChange={(e) => setEditTimeVal(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMedItem(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  حفظ التعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
