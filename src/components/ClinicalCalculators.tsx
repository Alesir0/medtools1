import React, { useState } from 'react';
import { 
  Ban, 
  Scan, 
  Brain, 
  HeartPulse, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon,
  ShieldAlert
} from 'lucide-react';

interface ClinicalCalculatorsProps {
  activeTab: 'tab-actilyse' | 'tab-head-ct' | 'tab-gcs' | 'tab-heart';
  actilyseRules: { abs: string[]; rel: string[] };
  ctRules: { high: string[]; med: string[] };
}

export const ClinicalCalculators: React.FC<ClinicalCalculatorsProps> = ({
  activeTab,
  actilyseRules,
  ctRules,
}) => {
  // 1. Actilyse Checklist State
  const [actilyseChoices, setActilyseChoices] = useState<{ [key: string]: boolean }>({});

  const toggleActilyse = (key: string, val: boolean) => {
    setActilyseChoices(prev => ({ ...prev, [key]: val }));
  };

  const hasAbsContra = actilyseRules.abs.some((_, i) => actilyseChoices[`abs_${i}`] === true);
  const hasRelContra = actilyseRules.rel.some((_, i) => actilyseChoices[`rel_${i}`] === true);

  // 2. CT Head Rule State
  const [ctChoices, setCtChoices] = useState<{ [key: string]: boolean }>({});

  const toggleCt = (key: string, val: boolean) => {
    setCtChoices(prev => ({ ...prev, [key]: val }));
  };

  const hasHighRiskCT = ctRules.high.some((_, i) => ctChoices[`high_${i}`] === true);
  const hasMedRiskCT = ctRules.med.some((_, i) => ctChoices[`med_${i}`] === true);

  // 3. GCS State
  const [gcsE, setGcsE] = useState<number>(4);
  const [gcsV, setGcsV] = useState<number>(5);
  const [gcsM, setGcsM] = useState<number>(6);
  const totalGcs = gcsE + gcsV + gcsM;

  // 4. HEART Score State
  const [heartH, setHeartH] = useState<number>(0);
  const [heartE, setHeartE] = useState<number>(0);
  const [heartA, setHeartA] = useState<number>(0);
  const [heartR, setHeartR] = useState<number>(0);
  const [heartT, setHeartT] = useState<number>(0);
  const totalHeart = heartH + heartE + heartA + heartR + heartT;

  return (
    <div className="space-y-6">
      
      {/* 1. ALTEPLASE (ACTILYSE) CHECKLIST */}
      {activeTab === 'tab-actilyse' && (
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Ban className="w-4 h-4" />
                <span>Thrombolysis Safety Screening Protocol</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                قائمة التحقق من موانع إعطاء مذيب التخثر أكتيليز (Alteplase / rtPA)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                النافذة الزمنية المعتمدة هي 4.5 ساعة من بدء أعراض السكتة الدماغية الإقفارية مع ثبات ضغط الدم &lt; 185/110 mmHg
              </p>
            </div>
            <button
              onClick={() => setActilyseChoices({})}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط القائمة</span>
            </button>
          </div>

          {/* Absolute Contraindications */}
          <div>
            <h3 className="text-sm font-black text-red-600 mb-3 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              <span>أولاً: الموانع المطلقة (Absolute Contraindications) - وجود أي منها يمنع الدواء قطعياً:</span>
            </h3>
            <div className="space-y-2">
              {actilyseRules.abs.map((rule, idx) => {
                const choice = actilyseChoices[`abs_${idx}`];
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 leading-relaxed">• {rule}</span>
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleActilyse(`abs_${idx}`, true)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          choice === true ? 'bg-red-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        نعم (موجود)
                      </button>
                      <button
                        onClick={() => toggleActilyse(`abs_${idx}`, false)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          choice === false ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Relative Contraindications */}
          <div>
            <h3 className="text-sm font-black text-amber-600 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>ثانياً: الموانع النسبية (Relative Contraindications) - موازنة العجز السريري مقابل خطورة النزيف:</span>
            </h3>
            <div className="space-y-2">
              {actilyseRules.rel.map((rule, idx) => {
                const choice = actilyseChoices[`rel_${idx}`];
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 leading-relaxed">• {rule}</span>
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleActilyse(`rel_${idx}`, true)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          choice === true ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        نعم (موجود)
                      </button>
                      <button
                        onClick={() => toggleActilyse(`rel_${idx}`, false)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          choice === false ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Decision Banner */}
          <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
            hasAbsContra 
              ? 'bg-red-50 border-red-400 text-red-950' 
              : hasRelContra 
              ? 'bg-amber-50 border-amber-400 text-amber-950' 
              : 'bg-emerald-50 border-emerald-400 text-emerald-950'
          }`}>
            {hasAbsContra ? (
              <>
                <AlertOctagon className="w-8 h-8 text-red-600 shrink-0" />
                <div>
                  <h4 className="font-black text-base text-red-900">القرار السريري: يمنع إعطاء مذيب التخثر أكتيليز (Alteplase) منعاً باتاً!</h4>
                  <p className="text-xs text-red-800 mt-0.5">
                    تم تحديد مانع مطلق؛ إعطاء الدواء يسبب خطراً كارثياً للنزف الدماغي القاتل طبقاً للدلائل الإرشادية [AHA/ASA Guidelines].
                  </p>
                </div>
              </>
            ) : hasRelContra ? (
              <>
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-black text-base text-amber-900">القرار السريري: مسموح بحذر شديد (Relative Contraindication)</h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    توجد موانع نسبية؛ يتطلب تقييم اختصاصي الأعصاب لموازنة شدة العجز العصبي مقابل خطورة النزيف.
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-black text-base text-emerald-900">القرار السريري: المريض مؤهل لتلقي مذيب التخثر (Eligible for rtPA)</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    لا توجد موانع مسجلة. تأكد أن وقت البداية أقل من 4.5 ساعة، نفي النزيف بمفراس الرأس، وضغط الدم &lt; 185/110 mmHg.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. CANADIAN CT HEAD RULE */}
      {activeTab === 'tab-head-ct' && (
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Scan className="w-4 h-4" />
                <span>Traumatic Brain Injury Decision Instrument</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                معايير مفراس الرأس الكندية لإصابات الرأس البسيطة (Canadian CT Head Rule)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                مخصصة لمرضى إصابات الرأس البسيطة (GCS 13-15) لتفادي التعريض غير الضروري للإشعاع
              </p>
            </div>
            <button
              onClick={() => setCtChoices({})}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          </div>

          {/* High Risk Criteria */}
          <div>
            <h3 className="text-sm font-black text-red-600 mb-3">
              أولاً: معايير الخطورة العالية (تتطلب تدخلاً جراحياً عصبياً عاجلاً):
            </h3>
            <div className="space-y-2">
              {ctRules.high.map((rule, idx) => {
                const choice = ctChoices[`high_${idx}`];
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 leading-relaxed">• {rule}</span>
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleCt(`high_${idx}`, true)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          choice === true ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        onClick={() => toggleCt(`high_${idx}`, false)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          choice === false ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Medium Risk Criteria */}
          <div>
            <h3 className="text-sm font-black text-amber-600 mb-3">
              ثانياً: معايير الخطورة المتوسطة (اشتباه آفة دماغية رضية):
            </h3>
            <div className="space-y-2">
              {ctRules.med.map((rule, idx) => {
                const choice = ctChoices[`med_${idx}`];
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 leading-relaxed">• {rule}</span>
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleCt(`med_${idx}`, true)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          choice === true ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        onClick={() => toggleCt(`med_${idx}`, false)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          choice === false ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decision */}
          <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
            hasHighRiskCT 
              ? 'bg-red-50 border-red-400 text-red-950' 
              : hasMedRiskCT 
              ? 'bg-amber-50 border-amber-400 text-amber-950' 
              : 'bg-emerald-50 border-emerald-400 text-emerald-950'
          }`}>
            {hasHighRiskCT ? (
              <>
                <AlertOctagon className="w-8 h-8 text-red-600 shrink-0" />
                <div>
                  <h4 className="font-black text-base text-red-900">القرار: يلزم إجراء مفراس الرأس (CT Brain) فوراً ودون أي تأخير!</h4>
                  <p className="text-xs text-red-800 mt-0.5">وجود مؤشر عالي الخطورة لاحتمال التدخل الجراحي العصبي العاجل.</p>
                </div>
              </>
            ) : hasMedRiskCT ? (
              <>
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-black text-base text-amber-900">القرار: يوصى بإجراء مفراس الرأس (CT Brain)</h4>
                  <p className="text-xs text-amber-800 mt-0.5">وجود مؤشر خطورة متوسطة لاحتمال وجود نزيف أو آفة دماغية رضية.</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-black text-base text-emerald-900">القرار: لا داعي لإجراء CT Brain حالياً</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">المريض منخفض الخطورة؛ يكتفى بالمراقبة السريرية الآمنة مع تزويد المرافق بتعليمات الرأس.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. GLASGOW COMA SCALE (GCS) */}
      {activeTab === 'tab-gcs' && (
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Brain className="w-4 h-4" />
              <span>Neurological Assessment Scale</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              مقياس كلاسكو للغيبوبة ودرجة الوعي (Glasgow Coma Scale - GCS)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <label className="text-xs font-bold text-slate-800 block mb-2">استجابة فتح العينين (Eye Opening - E):</label>
              <select
                value={gcsE}
                onChange={(e) => setGcsE(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl outline-none"
              >
                <option value={4}>عفوي وتلقائي (Spontaneous) - 4</option>
                <option value={3}>استجابة للنداء والأمر الصوتي (To Sound) - 3</option>
                <option value={2}>استجابة للمنبه المؤلم أو الضغط (To Pressure) - 2</option>
                <option value={1}>لا توجد استجابة إطلاقاً (None) - 1</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <label className="text-xs font-bold text-slate-800 block mb-2">الاستجابة اللفظية والكلام (Verbal - V):</label>
              <select
                value={gcsV}
                onChange={(e) => setGcsV(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl outline-none"
              >
                <option value={5}>واعٍ ومنسق الحديث بالكامل (Oriented) - 5</option>
                <option value={4}>مشوش ومرتبك لكنه يجيب (Confused) - 4</option>
                <option value={3}>كلمات غير ملائمة وغير مترابطة (Inappropriate) - 3</option>
                <option value={2}>أصوات وأنين غير مفهوم (Incomprehensible) - 2</option>
                <option value={1}>لا توجد استجابة لفظية (None) - 1</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <label className="text-xs font-bold text-slate-800 block mb-2">الاستجابة الحركية (Motor - M):</label>
              <select
                value={gcsM}
                onChange={(e) => setGcsM(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl outline-none"
              >
                <option value={6}>يمتثل وينفذ الأوامر الحركية (Obeys Commands) - 6</option>
                <option value={5}>يحدد موضع الألم بدقة ويزيله (Localises Pain) - 5</option>
                <option value={4}>انسحاب انثنائي طبيعي من الألم (Normal Flexion) - 4</option>
                <option value={3}>انثناء شاذ / تيبس قشري مخي (Decorticate) - 3</option>
                <option value={2}>انبساط شاذ وتمديد / تيبس جذع الدماغ (Decerebrate) - 2</option>
                <option value={1}>لا توجد حركة مطلقاً (None) - 1</option>
              </select>
            </div>
          </div>

          {/* GCS Result Banner */}
          <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${
            totalGcs <= 8 
              ? 'bg-red-50 border-red-300 text-red-950' 
              : totalGcs <= 12 
              ? 'bg-amber-50 border-amber-300 text-amber-950' 
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <Brain className="w-10 h-10 shrink-0 text-cyan-600" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold">المجموع الكلي:</span>
                <span className="text-2xl font-black">{totalGcs} / 15</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border border-black/10">
                  E{gcsE} V{gcsV} M{gcsM}
                </span>
              </div>
              <p className="text-xs md:text-sm font-semibold">
                {totalGcs <= 8 
                  ? 'غيبوبة وإصابة دماغية شديدة (GCS ≤ 8): تأمين مجرى الهواء والتنبيب الرغامي الفوري إلزامي (Intubate GCS ≤ 8 وفق بروتوكول ATLS).' 
                  : totalGcs <= 12 
                  ? 'إصابة دماغية متوسطة (GCS 9-12): تتطلب مراقبة عصبية دقيقة وإجراء مفراس الرأس فوراً.' 
                  : 'حالة عصبية طبيعية ووعي كامل (GCS 13-15).'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. HEART SCORE */}
      {activeTab === 'tab-heart' && (
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
              <HeartPulse className="w-4 h-4" />
              <span>Emergency Chest Pain Risk Stratification</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              مقياس HEART Score لتقييم آلام الصدر الإقفارية والتنبؤ بالجلطات
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <label className="text-xs font-bold text-slate-800 block mb-1">التاريخ والقصة السريرية (History - H):</label>
              <select
                value={heartH}
                onChange={(e) => setHeartH(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-xl"
              >
                <option value={0}>غير مشتبه به أو وصفي طفيفاً - 0</option>
                <option value={1}>مشتبه به باعتدال - 1</option>
                <option value={2}>عالي الشبهة بالخناق الإقفاري الحاد - 2</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <label className="text-xs font-bold text-slate-800 block mb-1">تخطيط القلب (ECG - E):</label>
              <select
                value={heartE}
                onChange={(e) => setHeartE(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-xl"
              >
                <option value={0}>تخطيط طبيعي تماماً - 0</option>
                <option value={1}>تغيرات غير نوعية في Repolarization أو LBBB قديم - 1</option>
                <option value={2}>انخفاض ملحوظ في ST دون ارتفاع صريح - 2</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <label className="text-xs font-bold text-slate-800 block mb-1">عمر المريض (Age - A):</label>
              <select
                value={heartA}
                onChange={(e) => setHeartA(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-xl"
              >
                <option value={0}>أقل من 45 سنة - 0</option>
                <option value={1}>بين 45 و 64 سنة - 1</option>
                <option value={2}>65 سنة فما فوق - 2</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <label className="text-xs font-bold text-slate-800 block mb-1">عوامل الخطورة (Risk factors - R):</label>
              <select
                value={heartR}
                onChange={(e) => setHeartR(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-xl"
              >
                <option value={0}>لا توجد عوامل خطورة مسجلة - 0</option>
                <option value={1}>عامل أو عاملان (سكري، ضغط، تدخين، دهون) - 1</option>
                <option value={2}>3 عوامل فأكثر أو سوابق جلطات وشبكات - 2</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl md:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-800 block mb-1">التروبونين الأولي (Troponin - T):</label>
              <select
                value={heartT}
                onChange={(e) => setHeartT(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-xl"
              >
                <option value={0}>أقل من الحد الطبيعي المعياري - 0</option>
                <option value={1}>أعلى من الطبيعي بمقدار 1 إلى 2 ضعف - 1</option>
                <option value={2}>أعلى من الطبيعي بأكثر من ضعفين (&gt; 2x) - 2</option>
              </select>
            </div>
          </div>

          {/* Result */}
          <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${
            totalHeart <= 3 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
              : totalHeart <= 6 
              ? 'bg-amber-50 border-amber-300 text-amber-950' 
              : 'bg-red-50 border-red-300 text-red-950'
          }`}>
            <HeartPulse className="w-10 h-10 shrink-0 text-rose-600" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold">النتيجة الكلية:</span>
                <span className="text-2xl font-black">{totalHeart} / 10</span>
              </div>
              <p className="text-xs md:text-sm font-semibold">
                {totalHeart <= 3 
                  ? 'خطورة منخفضة (0-3 نقاط): احتمال حدوث أحداث قلبية كبرى (MACE) هو 1.7% فقط. يمكن التخريج الآمن مع المتابعة.' 
                  : totalHeart <= 6 
                  ? 'خطورة متوسطة (4-6 نقاط): احتمال MACE هو 16.6%. يوصى بالتنويم والمراقبة وتكرار التروبونين وتخطيط القلب.' 
                  : 'خطورة عالية جداً (7-10 نقاط): احتمال MACE يفوق 50-65%! تستوجب التنويم العاجل في CCU وإجراء قسطرة قلبية سريعة.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
