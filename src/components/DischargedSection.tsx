import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Clock, 
  Calendar, 
  FileCheck, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Download
} from 'lucide-react';
import { DischargedPatient } from '../types/clinical';

interface DischargedSectionProps {
  dischargedPatients: DischargedPatient[];
  onRestorePatient: (patient: DischargedPatient) => void;
  onDeletePatientPermanent: (id: string) => void;
  onClearOldDischarged: () => void;
}

export const DischargedSection: React.FC<DischargedSectionProps> = ({
  dischargedPatients,
  onRestorePatient,
  onDeletePatientPermanent,
  onClearOldDischarged,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState<'all' | 'طوارئ' | 'ردهات' | 'غسل كلوي'>('all');

  const filtered = dischargedPatients.filter((p) => {
    const matchesSearch = 
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.finalDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summaryNotes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || p.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Archive className="w-4 h-4" />
            <span>Hospital Discharge & Retention Archive</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            قائمة الحالات التي تم تخريجها (أرشيف 30 يوماً)
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            يتم الاحتفاظ بملفات الحالات المخرجة لمدة شهر كامل (30 يوماً) ثم يتم حذفها تلقائياً من المنظومة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>إجمالي المخرجين المحفوظين: {dischargedPatients.length}</span>
          </div>
        </div>
      </div>

      {/* Auto-Purge Policy Alert Box */}
      <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-sm block mb-0.5">سياسة الحذف التلقائي بعد مرور شهر (30 Days Auto-Purge):</strong>
          ينص النظام السريري على أرشفة أي مريض يتم تخريجه من (الطوارئ، الردهات، أو الغسل الكلوي) في هذه القائمة مع احتساب عداد تنازلي دقيق. بعد مرور 30 يوماً من تاريخ التخريج، يتم حذف اسم المريض وملفه تلقائياً لتحقيق متطلبات الخصوصية وحماية بيانات المرضى.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث بالاسم أو التشخيص أو ملخص الخروج..."
            className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-amber-500 shadow-sm"
          />
        </div>
        <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
          {(['all', 'طوارئ', 'ردهات', 'غسل كلوي'] as const).map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterDept === dept
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {dept === 'all' ? 'جميع الأقسام' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Discharged Patients List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <Archive className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">لا توجد حالات مخرجة مسجلة حالياً</h3>
          <p className="text-xs text-slate-400 mt-1">
            عند تخريج أي مريض من الطوارئ أو الردهة ستظهر بياناته هنا لمدة 30 يوماً
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isNearExpiry = item.daysRemaining <= 5;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left side details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base text-slate-900">{item.patientName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      قسم {item.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.dischargeCondition}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-800">التشخيص عند الخروج: </span>
                    <span>{item.finalDiagnosis}</span>
                  </div>

                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700">ملخص وتوصيات الخروج: </span>
                    <span>{item.summaryNotes}</span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>تاريخ التخريج: {item.dischargedAt}</span>
                    </span>
                  </div>
                </div>

                {/* Right side: Countdown and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Countdown Badge */}
                  <div className={`px-3 py-2 rounded-xl text-center border ${
                    isNearExpiry 
                      ? 'bg-red-50 border-red-200 text-red-900' 
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <span className="text-[10px] block font-semibold text-slate-500">الحذف التلقائي</span>
                    <span className="text-xs font-black">
                      متبقي {item.daysRemaining} يوم
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRestorePatient(item)}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 flex items-center gap-1.5 shadow-sm transition-all"
                      title="إعادة تنويم المريض واستعادته للقسم النشط"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة للقسم</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل تريد بالتأكيد حذف سجل المريض (${item.patientName}) نهائياً الآن؟`)) {
                          onDeletePatientPermanent(item.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-500 transition-colors"
                      title="حذف نهائي الآن"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
