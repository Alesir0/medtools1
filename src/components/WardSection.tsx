import React, { useState } from 'react';
import { 
  BedDouble, 
  Plus, 
  Search, 
  Activity, 
  Pill, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  FileCheck, 
  UserPlus, 
  Stethoscope,
  X,
  ShieldAlert,
  HelpCircle,
  Trash2,
  Edit3,
  Clock
} from 'lucide-react';
import { 
  WardPatient, 
  AIAuditFinding, 
  AdministeredMedication, 
  PediatricDrug, 
  EmergencyDrug, 
  IraqiDrug 
} from '../types/clinical';
import { auditWardPatient } from '../services/clinicalAuditEngine';
import { DrugSelectorInput } from './DrugSelectorInput';

interface WardSectionProps {
  patients: WardPatient[];
  onAddPatient: (patient: Omit<WardPatient, 'id' | 'entryTime' | 'status'>) => void;
  onUpdatePatient: (patient: WardPatient) => void;
  onDischargePatient: (patient: WardPatient, summaryNotes: string, condition: string) => void;
  onQuickAdd: (name: string) => void;
  onTriggerFullWardAudit: () => void;
  pediatricDrugs: PediatricDrug[];
  emergencyDrugs: EmergencyDrug[];
  iraqiDrugs: IraqiDrug[];
}

export const WardSection: React.FC<WardSectionProps> = ({
  patients,
  onAddPatient,
  onUpdatePatient,
  onDischargePatient,
  onQuickAdd,
  onTriggerFullWardAudit,
  pediatricDrugs,
  emergencyDrugs,
  iraqiDrugs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quickName, setQuickName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<WardPatient | null>(null);
  
  // Modal for viewing single patient AI Audit details
  const [selectedAuditPatient, setSelectedAuditPatient] = useState<{ patient: WardPatient; findings: AIAuditFinding[] } | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDoctor, setFormDoctor] = useState('');
  const [formBed, setFormBed] = useState('');
  const [formCc, setFormCc] = useState('');
  const [formDiag, setFormDiag] = useState('');
  const [formPmhx, setFormPmhx] = useState('');
  const [formPshx, setFormPshx] = useState('');
  const [formBp, setFormBp] = useState('120/80');
  const [formPulse, setFormPulse] = useState(80);
  const [formSpo2, setFormSpo2] = useState(98);
  const [formTemp, setFormTemp] = useState('37.0');
  const [formMeds, setFormMeds] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Discharge modal state
  const [dischargeTarget, setDischargeTarget] = useState<WardPatient | null>(null);
  const [dischargeCondition, setDischargeCondition] = useState('متحسن ومستقر سريرياً');
  const [dischargeSummary, setDischargeSummary] = useState('');

  // Modal for Adding Medication to a Specific Ward Patient
  const [addMedPatient, setAddMedPatient] = useState<WardPatient | null>(null);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedRoute, setNewMedRoute] = useState('IV');
  const [newMedTiming, setNewMedTiming] = useState('كل 12 ساعة (q12h)');

  // Modal for Editing Dose of an existing Medication on a Ward Patient
  const [editingMedState, setEditingMedState] = useState<{ patient: WardPatient; med: AdministeredMedication } | null>(null);
  const [editMedDose, setEditMedDose] = useState('');
  const [editMedRoute, setEditMedRoute] = useState('');
  const [editMedTiming, setEditMedTiming] = useState('');

  // Helper to extract or parse patient's medication list
  const getPatientMedList = (patient: WardPatient): AdministeredMedication[] => {
    if (patient.medicationList && patient.medicationList.length > 0) {
      return patient.medicationList;
    }
    if (!patient.medications || !patient.medications.trim()) {
      return [];
    }
    return patient.medications.split(',').map((item, idx) => {
      const trimmed = item.trim();
      return {
        id: 'med_' + idx + '_' + trimmed.replace(/\s+/g, '_').slice(0, 15),
        name: trimmed,
        dose: 'حسب الخطة',
        route: 'IV / فموي',
        time: 'يومياً',
      };
    });
  };

  const handleAddMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMedPatient || !newMedName.trim()) return;

    const currentList = getPatientMedList(addMedPatient);
    const newMed: AdministeredMedication = {
      id: 'med_' + Date.now(),
      name: newMedName.trim(),
      dose: newMedDose.trim() || 'حسب الجرعة المقررة',
      route: newMedRoute.trim() || 'IV',
      time: newMedTiming.trim() || 'يومياً',
    };

    const updatedList = [newMed, ...currentList];
    const medsSummary = updatedList.map(m => `${m.name} ${m.dose} (${m.route})`).join(', ');

    const updatedPatient: WardPatient = {
      ...addMedPatient,
      medicationList: updatedList,
      medications: medsSummary,
    };

    onUpdatePatient(updatedPatient);
    setAddMedPatient(null);
    setNewMedName('');
    setNewMedDose('');
  };

  const handleDeleteMed = (patient: WardPatient, medId: string) => {
    const currentList = getPatientMedList(patient);
    const updatedList = currentList.filter(m => m.id !== medId);
    const medsSummary = updatedList.map(m => `${m.name} ${m.dose} (${m.route})`).join(', ');

    const updatedPatient: WardPatient = {
      ...patient,
      medicationList: updatedList,
      medications: medsSummary,
    };

    onUpdatePatient(updatedPatient);
  };

  const handleEditMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedState || !editMedDose.trim()) return;

    const { patient, med } = editingMedState;
    const currentList = getPatientMedList(patient);
    const updatedList = currentList.map(m => {
      if (m.id === med.id) {
        return {
          ...m,
          dose: editMedDose.trim(),
          route: editMedRoute.trim() || m.route,
          time: editMedTiming.trim() || m.time,
        };
      }
      return m;
    });

    const medsSummary = updatedList.map(m => `${m.name} ${m.dose} (${m.route})`).join(', ');

    const updatedPatient: WardPatient = {
      ...patient,
      medicationList: updatedList,
      medications: medsSummary,
    };

    onUpdatePatient(updatedPatient);
    setEditingMedState(null);
  };

  const activePatients = patients.filter(p => p.status !== 'discharged');
  const filteredPatients = activePatients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.medications.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = (p?: WardPatient) => {
    if (p) {
      setEditingPatient(p);
      setFormName(p.name);
      setFormDoctor(p.doctor);
      setFormBed(p.bed);
      setFormCc(p.cc);
      setFormDiag(p.diagnosis);
      setFormPmhx(p.pmhx);
      setFormPshx(p.pshx);
      setFormBp(p.bp);
      setFormPulse(p.pulse);
      setFormSpo2(p.spo2);
      setFormTemp(p.temp);
      setFormMeds(p.medications);
      setFormNotes(p.notes);
    } else {
      setEditingPatient(null);
      setFormName('');
      setFormDoctor('د. الطبيب المقيم');
      setFormBed('سرير ' + (activePatients.length + 1));
      setFormCc('');
      setFormDiag('قيد التقييم السريري');
      setFormPmhx('لا توجد سوابق مرضية مسجلة');
      setFormPshx('لا توجد');
      setFormBp('120/80');
      setFormPulse(78);
      setFormSpo2(98);
      setFormTemp('37.0');
      setFormMeds('');
      setFormNotes('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingPatient) {
      const updated: WardPatient = {
        ...editingPatient,
        name: formName.trim(),
        doctor: formDoctor.trim() || 'د. الطبيب المعالج',
        bed: formBed.trim() || 'سرير 1',
        cc: formCc.trim() || 'متابعة سريرية',
        diagnosis: formDiag.trim() || 'قيد التقييم',
        pmhx: formPmhx.trim(),
        pshx: formPshx.trim(),
        bp: formBp.trim(),
        pulse: Number(formPulse),
        spo2: Number(formSpo2),
        temp: formTemp.trim(),
        medications: formMeds.trim(),
        notes: formNotes.trim(),
      };
      onUpdatePatient(updated);
    } else {
      onAddPatient({
        name: formName.trim(),
        doctor: formDoctor.trim() || 'د. الطبيب المعالج',
        bed: formBed.trim() || 'سرير ' + (activePatients.length + 1),
        cc: formCc.trim() || 'متابعة سريرية',
        diagnosis: formDiag.trim() || 'قيد التقييم',
        pmhx: formPmhx.trim() || 'لا توجد',
        pshx: formPshx.trim() || 'لا توجد',
        bp: formBp.trim(),
        pulse: Number(formPulse),
        spo2: Number(formSpo2),
        temp: formTemp.trim(),
        medications: formMeds.trim(),
        notes: formNotes.trim(),
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
    onDischargePatient(dischargeTarget, dischargeSummary.trim() || 'تم إنهاء التنويم والتخريج الطبي الآمن.', dischargeCondition);
    setDischargeTarget(null);
    setDischargeSummary('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BedDouble className="w-4 h-4" />
            <span>Inpatient Medical & Surgical Wards</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            سجلات مرضى الردهات والأقسام الباطنية والجراحية
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            عرض الفعاليات الحيوية والأدوية الحالية، مع التدقيق السريري التلقائي بالذكاء الاصطناعي لكشف تضارب الأدوية والأخطاء والفحوصات المطلوبة
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Add by Name */}
          <form onSubmit={handleQuickAddSubmit} className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <input
              type="text"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder="اسم المريض بالردهة..."
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none w-36 md:w-44 focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة سريعة</span>
            </button>
          </form>

          {/* AI Audit Trigger */}
          <button
            onClick={onTriggerFullWardAudit}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="تدقيق شامل لجميع مرضى الردهة عبر الذكاء الاصطناعي"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>تدقيق الذكاء السريري الشامل</span>
          </button>

          {/* Full Add Modal trigger */}
          <button
            onClick={() => openAddModal()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>إضافة مريض جديد (كامل)</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="البحث باسم مريض الردهة، التشخيص، الطبيب، أو اسم الدواء..."
          className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-sky-500 shadow-sm"
        />
      </div>

      {/* Ward Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">لا يوجد مرضى منومون في الردهات حالياً</h3>
          <p className="text-xs text-slate-400 mt-1">
            أدخل اسم المريض في شريط الإضافة السريعة أعلاه لتسجيل دخوله فوراً
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => {
            // Run clinical safety audit for this patient
            const auditFindings = auditWardPatient(patient);
            const criticalCount = auditFindings.filter(f => f.severity === 'critical').length;
            const warningCount = auditFindings.filter(f => f.severity === 'warning').length;
            const testCount = auditFindings.filter(f => f.type === 'required_test').length;

            return (
              <div
                key={patient.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                        <span>{patient.name}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {patient.bed}
                        </span>
                      </h3>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Stethoscope className="w-3 h-3 text-sky-600" />
                        <span>الطبيب: {patient.doctor}</span>
                      </span>
                    </div>
                  </div>

                  {/* Diagnosis & CC */}
                  <div className="mb-3 space-y-1">
                    <div className="bg-sky-50 border border-sky-100 p-2 rounded-lg text-xs font-bold text-sky-950 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>التشخيص: {patient.diagnosis || 'قيد الفحص السريري'}</span>
                    </div>
                    {patient.cc && (
                      <p className="text-xs text-slate-600 px-1 line-clamp-1">
                        <strong>الشكوى:</strong> {patient.cc}
                      </p>
                    )}
                  </div>

                  {/* REQUIREMENT 4: Vital Signs Prominently Displayed on the Card */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">الفعاليات الحيوية:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                        BP: {patient.bp}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                        Pulse: {patient.pulse} bpm
                      </span>
                      <span className={`px-2 py-1 rounded-md border text-[11px] font-bold ${
                        patient.spo2 < 92 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        SpO2: {patient.spo2}%
                      </span>
                      <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800">
                        Temp: {patient.temp}°C
                      </span>
                    </div>
                  </div>

                  {/* REQUIREMENT: Current Medications Displayed with Add, Edit Dose, and Delete */}
                  {(() => {
                    const medList = getPatientMedList(patient);
                    return (
                      <div className="mb-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Pill className="w-3.5 h-3.5 text-indigo-500" />
                            <span>الأدوية الحالية للمريض ({medList.length}):</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAddMedPatient(patient);
                              setNewMedName('');
                              setNewMedDose('');
                              setNewMedRoute('IV');
                              setNewMedTiming('كل 12 ساعة (q12h)');
                            }}
                            className="text-[11px] font-bold text-sky-700 hover:text-sky-800 bg-white hover:bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            title="إضافة دواء جديد للمريض من قاعدة البيانات أو يدوياً"
                          >
                            <Plus className="w-3 h-3 text-sky-600" />
                            <span>إضافة دواء</span>
                          </button>
                        </div>

                        {medList.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-1">لا توجد أدوية مسجلة حالياً لهذا المريض.</p>
                        ) : (
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                            {medList.map((m) => (
                              <div
                                key={m.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs hover:border-slate-300 transition-colors"
                              >
                                <div className="flex-1 min-w-0 pr-1">
                                  <div className="font-extrabold text-slate-900 truncate flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                    <span>{m.name}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                                    <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                                      {m.dose}
                                    </span>
                                    <span>•</span>
                                    <span>{m.route}</span>
                                    {m.time && (
                                      <>
                                        <span>•</span>
                                        <span className="text-slate-400 text-[10px]">{m.time}</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMedState({ patient, med: m });
                                      setEditMedDose(m.dose);
                                      setEditMedRoute(m.route);
                                      setEditMedTiming(m.time);
                                    }}
                                    className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    title="تعديل جرعة الدواء"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMed(patient, m.id);
                                    }}
                                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="حذف هذا الدواء من المريض"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* REQUIREMENT 4: Real-Time AI Review Badges (Drug conflicts, Medical errors, Required tests) */}
                  <div className="mb-3">
                    {auditFindings.length === 0 ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>تدقيق الذكاء الاصطناعي: لا توجد تعارضات أو أخطاء دوائية</span>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setSelectedAuditPatient({ patient, findings: auditFindings })}
                        className="cursor-pointer space-y-1.5 bg-red-50/70 hover:bg-red-50 border border-red-200 p-2.5 rounded-xl transition-colors"
                        title="انقر لعرض تفاصيل التدقيق السريري الكاملة"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-red-900 flex items-center gap-1">
                            <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
                            <span>تنبيه الذكاء السريري ({auditFindings.length}):</span>
                          </span>
                          <span className="text-[10px] text-sky-700 font-bold underline">عرض التقرير</span>
                        </div>
                        <div className="space-y-1">
                          {auditFindings.slice(0, 2).map((f, i) => (
                            <div key={i} className="text-[11px] font-bold text-slate-800 flex items-start gap-1">
                              <span>•</span>
                              <span className="line-clamp-1">{f.title}</span>
                            </div>
                          ))}
                          {auditFindings.length > 2 && (
                            <span className="text-[10px] text-red-700 font-bold block">
                              + {auditFindings.length - 2} تنبيهات أخرى...
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => openAddModal(patient)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    تعديل الملف
                  </button>
                  <button
                    onClick={() => {
                      setDischargeTarget(patient);
                      setDischargeSummary(`تشخيص الخروج: ${patient.diagnosis}. تم إعطاء العلاجات وحالة المريض مستقرة.`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1"
                    title="تخريج المريض وحفظه في سجل المخرجين لمدة شهر"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>تخريج المريض</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-sky-600" />
                <span>{editingPatient ? 'تعديل بيانات مريض الردهة' : 'إضافة مريض جديد للردهة'}</span>
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
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="اسم المريض الثلاثي..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الطبيب المعالج:</label>
                  <input
                    type="text"
                    value={formDoctor}
                    onChange={(e) => setFormDoctor(e.target.value)}
                    placeholder="د. اسم الطبيب..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم السرير / الردهة:</label>
                  <input
                    type="text"
                    value={formBed}
                    onChange={(e) => setFormBed(e.target.value)}
                    placeholder="مثال: سرير 4 - باطنية رجال"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الشكوى الأساسية:</label>
                  <input
                    type="text"
                    value={formCc}
                    onChange={(e) => setFormCc(e.target.value)}
                    placeholder="سبب الدخول..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">التشخيص السريري:</label>
                  <input
                    type="text"
                    value={formDiag}
                    onChange={(e) => setFormDiag(e.target.value)}
                    placeholder="التشخيص الحالي..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">ضغط الدم (BP):</label>
                  <input
                    type="text"
                    value={formBp}
                    onChange={(e) => setFormBp(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">النبض (Pulse):</label>
                  <input
                    type="number"
                    value={formPulse}
                    onChange={(e) => setFormPulse(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الأكسجين (SpO2):</label>
                  <input
                    type="number"
                    value={formSpo2}
                    onChange={(e) => setFormSpo2(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الحرارة (°C):</label>
                  <input
                    type="text"
                    value={formTemp}
                    onChange={(e) => setFormTemp(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الأدوية الموصوفة والجرعات (تخضع للتدقيق الذكي المباشر):
                </label>
                <textarea
                  rows={2}
                  value={formMeds}
                  onChange={(e) => setFormMeds(e.target.value)}
                  placeholder="مثال: Ceftriaxone 1g IV q12h, Paracetamol 1g IV, Propranolol 40mg..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">التاريخ المرضي السابق (PMHx):</label>
                  <input
                    type="text"
                    value={formPmhx}
                    onChange={(e) => setFormPmhx(e.target.value)}
                    placeholder="مثال: ربو قصبي، سكري، فشل كلوي..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">التاريخ الجراحي (PSHx):</label>
                  <input
                    type="text"
                    value={formPshx}
                    onChange={(e) => setFormPshx(e.target.value)}
                    placeholder="عمليات سابقة..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
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
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  حفظ وتطبيق التدقيق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Patient AI Audit Findings Modal */}
      {selectedAuditPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="font-black text-base text-slate-900">
                  تقرير السلامة والتدقيق السريري: {selectedAuditPatient.patient.name}
                </h3>
              </div>
              <button onClick={() => setSelectedAuditPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {selectedAuditPatient.findings.map((finding, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    finding.severity === 'critical'
                      ? 'bg-red-50 border-red-200 text-red-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <h4 className="font-black text-sm mb-1">{finding.title}</h4>
                  <p className="mb-2 font-medium">{finding.description}</p>
                  <div className="bg-white/80 p-2 rounded-lg border border-black/5 font-bold text-slate-900 mb-1">
                    <span className="text-rose-600">الإجراء السريري الإلزامي: </span>
                    {finding.actionRequired}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block text-left">
                    المرجع: {finding.reference}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 mt-4">
              <button
                onClick={() => setSelectedAuditPatient(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold"
              >
                إغلاق التقرير
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
              <span>تخريج المريض: {dischargeTarget.name}</span>
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
                  <option value="متحسن ومستقر سريرياً">متحسن ومستقر سريرياً</option>
                  <option value="شفاء تام واستكمال العلاج">شفاء تام واستكمال العلاج</option>
                  <option value="إحالة إلى مركز تخصصي">إحالة إلى مركز تخصصي</option>
                  <option value="خروج على مسؤوليته الخاصة">خروج على مسؤوليته الخاصة</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">تقرير وملخص التخريج:</label>
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

      {/* MODAL 1: ADD MEDICATION TO WARD PATIENT (AUTOCOMPLETE OR MANUAL) */}
      {addMedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-600" />
                <span>إضافة دواء للمريض: {addMedPatient.name}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {addMedPatient.bed}
                </span>
              </h3>
              <button onClick={() => setAddMedPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم الدواء (ابحث في قاعدة الأدوية أو اكتب يدوياً):
                </label>
                <DrugSelectorInput
                  value={newMedName}
                  onChange={(name, suggestedDose, suggestedRoute) => {
                    setNewMedName(name);
                    if (suggestedDose && !newMedDose) {
                      setNewMedDose(suggestedDose);
                    }
                    if (suggestedRoute) {
                      setNewMedRoute(suggestedRoute);
                    }
                  }}
                  pediatricDrugs={pediatricDrugs}
                  emergencyDrugs={emergencyDrugs}
                  iraqiDrugs={iraqiDrugs}
                  placeholder="ابحث بالاسم التجاري أو العلمي أو اكتب يدوياً..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة المقررة:</label>
                  <input
                    type="text"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    placeholder="مثال: 1g IV, 500mg, 40mg..."
                    required
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-bold text-indigo-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">طريق الإعطاء:</label>
                  <select
                    value={newMedRoute}
                    onChange={(e) => setNewMedRoute(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="IV">وريدي (IV)</option>
                    <option value="Oral">فموي (Oral)</option>
                    <option value="IV Infusion">تسريب وريدي (IV Infusion)</option>
                    <option value="IM">عضلي (IM)</option>
                    <option value="SC">تحت الجلد (SC)</option>
                    <option value="Nebulizer">تبخير / رذاذ (Nebulizer)</option>
                    <option value="Topical">موضعي (Topical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">التكرار والتوقيت السريري:</label>
                <select
                  value={newMedTiming}
                  onChange={(e) => setNewMedTiming(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="كل 12 ساعة (q12h)">كل 12 ساعة (q12h - مرتين يومياً)</option>
                  <option value="كل 8 ساعات (q8h)">كل 8 ساعات (q8h - ثلاث مرات يومياً)</option>
                  <option value="كل 6 ساعات (q6h)">كل 6 ساعات (q6h - أربع مرات يومياً)</option>
                  <option value="مرة واحدة يومياً (OD)">مرة واحدة يومياً (OD / q24h)</option>
                  <option value="جرعة مفردة فورية (Stat Dose)">جرعة مفردة فورية (Stat Dose)</option>
                  <option value="عند اللزوم (PRN)">عند اللزوم (PRN)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddMedPatient(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  إضافة الدواء للمريض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT MEDICATION DOSE ON WARD PATIENT */}
      {editingMedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>تعديل جرعة دواء: {editingMedState.med.name}</span>
              </h3>
              <button onClick={() => setEditingMedState(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditMedSubmit} className="space-y-3.5">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span>المريض: <strong>{editingMedState.patient.name}</strong> ({editingMedState.patient.bed})</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة المعدلة:</label>
                <input
                  type="text"
                  value={editMedDose}
                  onChange={(e) => setEditMedDose(e.target.value)}
                  placeholder="مثال: 500mg IV, 1g..."
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-bold text-indigo-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">طريق الإعطاء:</label>
                  <input
                    type="text"
                    value={editMedRoute}
                    onChange={(e) => setEditMedRoute(e.target.value)}
                    placeholder="IV, Oral, IM..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">التكرار / التوقيت:</label>
                  <input
                    type="text"
                    value={editMedTiming}
                    onChange={(e) => setEditMedTiming(e.target.value)}
                    placeholder="q12h, q8h..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMedState(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  حفظ تعديل الجرعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
