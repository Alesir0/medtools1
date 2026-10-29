import { WardPatient, EmergencyPatient, HemodialysisPatient, AIAuditFinding } from '../types/clinical';

export function auditWardPatient(patient: WardPatient): AIAuditFinding[] {
  const findings: AIAuditFinding[] = [];
  const medsLower = (patient.medications || '').toLowerCase();
  const pmhxLower = (patient.pmhx || '').toLowerCase();
  const ccLower = (patient.cc || '').toLowerCase();
  const diagLower = (patient.diagnosis || '').toLowerCase();

  // ----------------------------------------------------
  // 1. تضارب الأدوية الخطير (Drug-Drug Interactions)
  // ----------------------------------------------------

  // Warfarin / DOAC + NSAIDs or Aspirin
  const hasAnticoagulant = medsLower.includes('warfarin') || medsLower.includes('marivan') || medsLower.includes('rivaroxaban') || medsLower.includes('xarelto') || medsLower.includes('apixaban') || medsLower.includes('eliquis') || medsLower.includes('heparin') || medsLower.includes('clexane') || medsLower.includes('enoxaparin');
  const hasNSAID = medsLower.includes('ibuprofen') || medsLower.includes('brufen') || medsLower.includes('diclofenac') || medsLower.includes('voltaren') || medsLower.includes('cataflam') || medsLower.includes('ketoprofen') || medsLower.includes('profenid') || medsLower.includes('mefenamic') || medsLower.includes('ponstan') || medsLower.includes('aspirin') || medsLower.includes('aspicot');
  
  if (hasAnticoagulant && hasNSAID) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'drug_conflict',
      severity: 'critical',
      title: '🚨 تضارب دوائي حرج: مضاد تخثر + مسكن NSAID/Aspirin',
      description: 'تناول مضادات التخثر بالتزامن مع مضادات الالتهاب اللاستيرويدية يزيد خطر النزيف الهضمي الحاد بمقدار 4-6 أضعاف.',
      actionRequired: 'إيقاف مسكنات NSAID فوراً واستبدالها بالباراسيتامول Paracetamol، مع إضافة واقي معدة PPI (مثل Esomeprazole).',
      reference: 'BNF • British National Formulary Drug Interactions'
    });
  }

  // ACEi/ARB + Spironolactone / Potassium
  const hasRAAS = medsLower.includes('captopril') || medsLower.includes('enalapril') || medsLower.includes('lisinopril') || medsLower.includes('perindopril') || medsLower.includes('valsartan') || medsLower.includes('losartan') || medsLower.includes('candesartan') || medsLower.includes('exforge') || medsLower.includes('co-diovan');
  const hasKSpariing = medsLower.includes('spironolactone') || medsLower.includes('aldactone') || medsLower.includes('potassium') || medsLower.includes('kcl') || medsLower.includes('kalium');
  
  if (hasRAAS && hasKSpariing) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'drug_conflict',
      severity: 'critical',
      title: '⚠️ تضارب دوائي: خطر فرط بوتاسيوم الدم الحاد (Severe Hyperkalemia)',
      description: 'الجمع بين مثبطات ACE/ARBs ومدرات البول الحافظة للبوتاسيوم (Aldactone) يؤدي لارتفاع مميت في البوتاسيوم واضطراب نظم القلب.',
      actionRequired: 'مراقبة مستوى البوتاسيوم المصلي K+ يومياً وتخطيط القلب ECG، وتخفيض الجرعة في حال K+ > 5.2 mmol/L.',
      reference: 'KDIGO & ESC Heart Failure Guidelines'
    });
  }

  // Beta Blocker + Verapamil/Diltiazem
  const hasBetaBlocker = medsLower.includes('propranolol') || medsLower.includes('inderal') || medsLower.includes('bisoprolol') || medsLower.includes('concor') || medsLower.includes('metoprolol') || medsLower.includes('betaloc') || medsLower.includes('atenolol');
  const hasNonDHPCCB = medsLower.includes('verapamil') || medsLower.includes('isoptin') || medsLower.includes('diltiazem');

  if (hasBetaBlocker && hasNonDHPCCB) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'drug_conflict',
      severity: 'critical',
      title: '🚨 تضارب دوائي مميت: حاصرات بيتا + فيراباميل/ديلتيازيم',
      description: 'تثبيط مزدوج حاد لعقدة AV وقوة تقلص القلب، مهدداً بحصار قلبي تام (Complete Heart Block) وهبوط دوراني حاد.',
      actionRequired: 'يمنع هذا المزيج الوريدي قطعياً، يجب الفصل التام بينهما ومراقبة النبض وتخطيط القلب.',
      reference: 'ACC/AHA Guidelines for Arrhythmia Management'
    });
  }

  // Clarithromycin + Statin
  const hasMacrolide = medsLower.includes('clarithromycin') || medsLower.includes('klacid') || medsLower.includes('erythromycin');
  const hasStatin = medsLower.includes('simvastatin') || medsLower.includes('atorvastatin') || medsLower.includes('lipitor') || medsLower.includes('crestor');

  if (hasMacrolide && hasStatin) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'drug_conflict',
      severity: 'warning',
      title: '⚠️ تضارب دوائي: ماكروليد (Klacid) + ستاتين الدهون',
      description: 'تثبيط إنزيم CYP3A4 يؤدي لارتفاع هائل في تركيز الستاتين في الدم وخطر انحلال الربيدات العضلي (Rhabdomyolysis) والفشل الكلوي الحاد.',
      actionRequired: 'إيقاف الستاتين مؤقتاً طوال فترة العلاج بكلاريثروميسين، واستئنافه بعد يومين من انتهاء الكورس.',
      reference: 'FDA Drug Safety Alert & UpToDate'
    });
  }

  // Tramadol + SSRI
  const hasTramadol = medsLower.includes('tramadol') || medsLower.includes('tramal') || medsLower.includes('pethidine');
  const hasSSRI = medsLower.includes('escitalopram') || medsLower.includes('cipralex') || medsLower.includes('fluoxetine') || medsLower.includes('prozac') || medsLower.includes('sertraline');

  if (hasTramadol && hasSSRI) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'drug_conflict',
      severity: 'warning',
      title: '⚠️ تضارب دوائي: ترامادول + مضادات الاكتئاب SSRIs',
      description: 'خطر حدوث متلازمة السيروتونين (Serotonin Syndrome) مع هياج، تشنجات، وفرط حرارة خبيث.',
      actionRequired: 'تجنب إعطاء الترامادول واستبداله بمسكنات أخرى لا تؤثر على مسار السيروتونين.',
      reference: 'Maudsley Prescribing Guidelines'
    });
  }

  // ----------------------------------------------------
  // 2. أخطاء طبية وموانع استعمال (Medical Errors & Contraindications)
  // ----------------------------------------------------

  // Beta Blocker in Asthma / COPD
  if (hasBetaBlocker && (pmhxLower.includes('ربو') || pmhxLower.includes('asthma') || pmhxLower.includes('copd') || pmhxLower.includes('قصبي') || ccLower.includes('ربو'))) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'medical_error',
      severity: 'critical',
      title: '❌ خطأ طبي حرج: حاصرات بيتا لمريض ربو قصبي / COPD',
      description: `المريض لديه تاريخ ربو قصبي أو انسداد رئوي وموصوف له (${hasBetaBlocker ? 'حاصر بيتا' : 'دواء قلبي'})؛ يسبب تشنجاً قصبياً حاداً ومميتاً ومقاوماً للتبخيرات.`,
      actionRequired: 'إيقاف حاصرات بيتا فوراً واستبدالها بحاصرات قنوات الكالسيوم (Amlodipine) أو أدوية ضغط آمنة تنفسياً.',
      reference: 'GINA Global Initiative for Asthma Guidelines'
    });
  }

  // NSAID in Renal failure / Peptic ulcer
  if (hasNSAID && (pmhxLower.includes('فشل كلوي') || pmhxLower.includes('renal') || pmhxLower.includes('ckd') || pmhxLower.includes('قرحة') || pmhxLower.includes('ulcer') || diagLower.includes('renal'))) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'medical_error',
      severity: 'critical',
      title: '❌ مانع استعمال صريح: مسكن NSAID لمريض اعتلال كلوي أو قرحة نشطة',
      description: 'تثبيط البروستاغلاندين يسبب هبوطاً حاداً في التروية الكلوية ويفاقم القصور الكلوي أو يسبب انثقاب القرحة الهضمية.',
      actionRequired: 'إيقاف الفولتارين / البروفين نهائياً، استخدام Paracetamol IV وريدياً بجرعة معدلة.',
      reference: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury'
    });
  }

  // ----------------------------------------------------
  // 3. فحوصات وتحاليل إلزامية يجب إجراؤها (Required Tests)
  // ----------------------------------------------------

  // Anticoagulants require PT/INR or aPTT
  if (medsLower.includes('heparin') || medsLower.includes('warfarin') || medsLower.includes('clexane')) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'required_test',
      severity: 'warning',
      title: '🧪 فحص إلزامي: قياس زمن التخثر (PT/INR أو aPTT) والصفائح الدموية',
      description: 'المريض يتلقى علاجاً مضاداً للتخثر؛ يجب التأكد دورياً من معايير التخثر لمنع النزيف وتعديل الجرعة وتفادي هبوط الصفائح (HIT).',
      actionRequired: 'طلب فحص PT/INR فوراً، وفحص تعداد الدم الكامل CBC لمتابعة الصفائح.',
      reference: 'CHEST Antithrombotic Therapy Guidelines'
    });
  }

  // Chest pain / Angina requires Troponin & ECG
  if (ccLower.includes('صدر') || ccLower.includes('chest') || diagLower.includes('acs') || diagLower.includes('angina') || diagLower.includes('ذبحة') || diagLower.includes('جلطة')) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'required_test',
      severity: 'critical',
      title: '🧪 فحص إلزامي عاجل: إنزيمات القلب (Serial Troponin I/T) وتخطيط 12-Lead ECG',
      description: 'وجود ألم صدري أو تشخيص متلازمة إكليلية يفرض مراقبة إنزيمات القلب المتسلسلة لاستبعاد الاحتشاء العضلي القلبي الحاد (NSTEMI/STEMI).',
      actionRequired: 'إجراء تخطيط قلب 12 مسرى فوراً، وسحب التروبونين الآن ثم إعادته بعد 3 ساعات.',
      reference: 'ESC / AHA Non-ST-Elevation Acute Coronary Syndromes'
    });
  }

  // Diuretics (Lasix/Furosemide) require Renal function & Electrolytes
  if (medsLower.includes('furosemide') || medsLower.includes('lasix') || medsLower.includes('torsemide')) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'required_test',
      severity: 'info',
      title: '🧪 فحص دوري مطلوب: وظائف الكلى (Urea & Creatinine) وشوارد الدم (K+, Na+)',
      description: 'مدرات العروة البولية تسبب هبوط البوتاسيوم واضطراب الشوارد وتجفاف الحيز داخل الوعائي.',
      actionRequired: 'إجراء تحليل Serum Electrolytes & Renal Function كل 48 ساعة أثناء العلاج.',
      reference: 'NICE Clinical Guidelines on Acute Heart Failure'
    });
  }

  // High Fever (> 38.5) requires Blood Culture & CBC
  const tempNum = parseFloat(patient.temp || '37');
  if (tempNum >= 38.5 || ccLower.includes('حرارة عالية') || diagLower.includes('sepsis') || diagLower.includes('إنتان')) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'الردهات',
      type: 'required_test',
      severity: 'critical',
      title: '🧪 فحص عاجل: زرع دم (Blood Cultures x2) وتحليل CRP/Procalcitonin',
      description: 'الحرارة المرتفعة تشير لاحتمال متلازمة الإنتان الدموي (Sepsis)؛ يجب سحب مزارع الدم قبل البدء بالمضادات الحيوية واسعة الطيف.',
      actionRequired: 'سحب عينتي زرع دم من موقعين وريديين مختلفين + تعداد دم CBC مع الصيغة واللاكتات.',
      reference: 'Surviving Sepsis Campaign Guidelines'
    });
  }

  return findings;
}

export function auditEmergencyPatient(patient: EmergencyPatient): AIAuditFinding[] {
  const findings: AIAuditFinding[] = [];
  const ccLower = (patient.cc || '').toLowerCase();
  const bpParts = (patient.bp || '120/80').split('/');
  const sbp = parseInt(bpParts[0], 10) || 120;
  const dbp = parseInt(bpParts[1], 10) || 80;

  // Severe Hypotension / Shock
  if (sbp < 90 || patient.hr > 125) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'طوارئ',
      type: 'medical_error',
      severity: 'critical',
      title: '🚨 علامات صدمة حادة (Shock): هبوط ضغط شرياني وتسارع نبض',
      description: `ضغط الدم (${patient.bp}) والنبض (${patient.hr}) يشيران لفشل دوراني حاد واختلال تروية الأعضاء الحيوية.`,
      actionRequired: 'إنعاش فوري بالسوائل الوريدية البلورية (Crystalloids 20-30 ml/kg)، تأمين كانيولتين 16G، وتجهيز النورأدرينالين Noradrenaline في حال عدم الاستجابة.',
      reference: 'ATLS & Surviving Sepsis Bundle'
    });
  }

  // Chest pain in Emergency
  if (ccLower.includes('صدر') || ccLower.includes('خناق') || ccLower.includes('ألم عاصر')) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'طوارئ',
      type: 'required_test',
      severity: 'critical',
      title: '🧪 بروتوكول طوارئ إلزامي: تخطيط قلب 12-Lead ECG خلال 10 دقائق',
      description: 'أي مريض طوارئ يشكو من ألم صدري أو عسرة تنفسية يجب إجراء تخطيط قلب فوري لنفي احتشاء STEMI.',
      actionRequired: 'تخطيط قلب فوري، إعطاء أسبرين 300mg مضغ، كلوبيدوغريل 300mg، وسحب التروبونين الأولي.',
      reference: 'AHA/ACC Chest Pain Guidelines'
    });
  }

  // Acute stroke suspicion
  if (ccLower.includes('ثقل باللسان') || ccLower.includes('شلل') || ccLower.includes('سكتة') || ccLower.includes('ضعف طرف')) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'طوارئ',
      type: 'required_test',
      severity: 'critical',
      title: '🧪 بروتوكول السكتة الدماغية الحادة (Stroke Code): مفراس الرأس CT Brain العاجل',
      description: 'النافذة العلاجية لمذيب التخثر أكتيليز (Alteplase) هي 4.5 ساعة من بدء الأعراض. المفراس إلزامي لنفي النزيف الدماغي.',
      actionRequired: 'نقل المريض مباشرة إلى جهاز المفراس، قياس السكر بالدم، وتثبيت ضغط الدم أقل من 185/110 mmHg.',
      reference: 'AHA/ASA Acute Ischemic Stroke Guidelines'
    });
  }

  return findings;
}

export function auditHemodialysisPatient(patient: HemodialysisPatient): AIAuditFinding[] {
  const findings: AIAuditFinding[] = [];

  // Severe Hyperkalemia
  if (patient.k >= 6.5) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'غسل كلوي',
      type: 'medical_error',
      severity: 'critical',
      title: '🚨 خطر فرط بوتاسيوم مميت (K+ ≥ 6.5 mmol/L)',
      description: `مستوى البوتاسيوم (${patient.k} mmol/L) يهدد بتوقف القلب المفاجئ والرجفان البطيني (VT/VF).`,
      actionRequired: 'إعطاء 10 مل من Calcium Gluconate 10% وريدياً ببطء على 5 دقائق لحماية عضلة القلب قبل توصيل الغسل، واستخدام سائل غسل منخفض البوتاسيوم.',
      reference: 'KDIGO Clinical Practice Guideline'
    });
  }

  // Huge fluid overload
  const overload = patient.preWeight - patient.dryWeight;
  if (overload > 4.5) {
    findings.push({
      patientId: patient.id,
      patientName: patient.name,
      department: 'غسل كلوي',
      type: 'drug_conflict',
      severity: 'warning',
      title: '⚠️ فرط حمل سوائلي كبير (+ ' + overload.toFixed(1) + ' kg)',
      description: 'محاولة سحب هذه الكمية في جلسة واحدة قد تسبب هبوط ضغط حاد (Intradialytic Hypotension) أو اختلاجات عضلية شديدة.',
      actionRequired: 'تحديد معدل الترشيح الفائق UF بما لا يتجاوز 10-13 ml/kg/hr أو جدولة جلسة غسل إضافية قصيرة.',
      reference: 'KDOQI Hemodialysis Adequacy Guidelines'
    });
  }

  return findings;
}
