import { EmergencyDrug, EmergencyCategoryKey } from '../types/clinical';

export const EMERGENCY_CATEGORIES: Array<{ key: EmergencyCategoryKey; label: string; icon: string }> = [
  { key: 'all', label: 'الكل (All Drugs)', icon: 'fa-table-cells' },
  { key: 'resuscitation', label: 'الإنعاش وتوقف القلب (ACLS)', icon: 'fa-heart-pulse' },
  { key: 'shock', label: 'الصدمة والرافعات الوعائية (Inotropes)', icon: 'fa-chart-line' },
  { key: 'cardiac', label: 'القلب واضطراب النظم (Cardio)', icon: 'fa-heart-circle-bolt' },
  { key: 'analgesia', label: 'المسكنات والمهدئات والتنبيب (RSI)', icon: 'fa-syringe' },
  { key: 'respiratory', label: 'الجهاز التنفسي والربو (Respiratory)', icon: 'fa-lungs' },
  { key: 'antidotes', label: 'الترياق وعلاج التسمم (Antidotes)', icon: 'fa-shield-virus' },
  { key: 'neuro', label: 'الأعصاب والتشنجات (Neuro)', icon: 'fa-brain' },
  { key: 'bleeding', label: 'النزف والتخثر ومذيبات الجلطة (Bleeding/rtPA)', icon: 'fa-droplet' },
];

export const EMERGENCY_DRUGS_DATA: EmergencyDrug[] = [
  // 1. الإنعاش وتوقف القلب (ACLS)
  {
    id: 'er_adrenaline',
    name: 'Adrenaline (Epinephrine) 1:10,000 & 1:1,000',
    genericName: 'Epinephrine',
    category: 'resuscitation',
    categoryLabel: 'الإنعاش وتوقف القلب (ACLS)',
    summary: 'الدواء الأول والأساسي لتوقف القلب (Cardiac Arrest) والصدمة التحسسية المفرطة (Anaphylaxis).',
    indications: 'توقف القلب بجميع أنواعه (VF, pVT, Asystole, PEA)، الصدمة التأقية، الخناق التنفسي الشديد.',
    adultDose: '• توقف القلب: 1 mg وريدياً (أمبولة 1:10,000 أو 1:1,000 مخففة في 10 مل ملحي) كل 3 إلى 5 دقائق.\n• صدمة الحساسية: 0.5 mg عضلياً IM (1:1,000) في الفخذ فوراً دون تأخير.',
    pediatricDose: '• توقف القلب: 0.01 mg/kg (0.1 ml/kg of 1:10,000) IV/IO كل 3-5 دقائق.\n• الحساسية: 0.01 mg/kg IM (1:1,000) أقصى جرعة 0.3-0.5 mg.',
    dilution: 'في توقف القلب: يُعطى Push وريدياً متبوعاً بدفعة 20 مل Flush من المحلول الملحي مع رفع الطرف.',
    contraindications: 'لا توجد موانع مطلقة إطلاقاً في حالات توقف القلب والصدمة التأقية المهددة للحياة.',
    warnings: 'احذر حقن تركيز 1:1,000 وريدياً مباشرة دون تخفيف لتفادي احتشاء عضلة القلب واللانظميات القاتلة.'
  },
  {
    id: 'er_amiodarone',
    name: 'Amiodarone (Cordarone 150mg / 3ml)',
    genericName: 'Amiodarone Hydrochloride',
    category: 'resuscitation',
    categoryLabel: 'الإنعاش وتوقف القلب (ACLS)',
    summary: 'مضاد اضطراب النظم من الصنف الثالث للرجفان والتسرع البطيني المقاوم للصدمة الكهربائية.',
    indications: 'الرجفان البطيني المقاوم للصدمة (Refractory VF)، التسرع البطيني عديم النبض (pVT)، التسرع البطيني المستقر (Stable VT).',
    adultDose: '• توقف القلب المقاوم للصدمات: 300 mg IV Push بعد الصدمة الثالثة، تليها جرعة إضافية 150 mg بعد الصدمة الخامسة.\n• التسرع البطيني المستقر: 150 mg تسريباً على 10 دقائق في 100 مل D5W، ثم صيانة 1 mg/min لـ 6 ساعات ثم 0.5 mg/min.',
    pediatricDose: '5 mg/kg IV/IO بولس في توقف القلب المقاوم للصدمة (أقصى جرعة 300 mg).',
    dilution: 'يُمدد حصراً في محلول دكستروز 5% (D5W)؛ غير متوافق نهائياً مع المحلول الملحي Normal Saline (يسبب ترسيباً).',
    contraindications: 'الحصار الأذيني البطيني من الدرجة الثانية والثالثة، بطء القلب الشديد، صدمة قلبية.',
    warnings: 'قد يسبب هبوطاً حاداً في ضغط الدم أثناء التسريب البطيء. استخدم فلتر وريدي في التسريب المستمر.'
  },
  {
    id: 'er_atropine',
    name: 'Atropine Sulfate (1mg / 1ml)',
    genericName: 'Atropine Sulfate',
    category: 'resuscitation',
    categoryLabel: 'الإنعاش وتوقف القلب (ACLS)',
    summary: 'مضاد للكولين لمعالجة بطء القلب العرضي الحاد وترياق أساسي للتسمم بالمبيدات الحشرية الفوسفورية.',
    indications: 'بطء القلب الجيبي العرضي (Symptomatic Bradycardia)، التسمم بالفوسفات العضوية (Organophosphates).',
    adultDose: '• بطء القلب: 1 mg IV Push كل 3-5 دقائق حتى جرعة قصوى 3 mg.\n• التسمم العضوي الفسفوري: 2-5 mg IV تتكرر كل 5-10 دقائق حتى تجف الإفرازات الصدرية (Atropinization).',
    pediatricDose: '0.02 mg/kg IV (الحد الأدنى 0.1 mg لتجنب بطء القلب الارتكاسي، أقصى جرعة للأطفال 0.5 mg).',
    dilution: 'يُعطى وريدياً سريعاً دون تخفيف متبوعاً بدفعة ملحية.',
    contraindications: 'لا يعتمد عليه في بطء القلب الناتج عن حصار القلب التام من الدرجة الثالثة بمركب QRS عريض (يحتاج منظم ضربات Pace).',
    warnings: 'الجرعات الأقل من 0.5 ملغ بالبالغين تسبب بطء قلب ارتكاسي متناقض (Paradoxical Bradycardia).'
  },
  {
    id: 'er_calcium_gluconate',
    name: 'Calcium Gluconate 10% (10ml Ampoule)',
    genericName: 'Calcium Gluconate 10%',
    category: 'resuscitation',
    categoryLabel: 'الإنعاش وتوقف القلب (ACLS)',
    summary: 'مثبت ومحمي لغشاء عضلة القلب من التوقف المفاجئ في حالات فرط بوتاسيوم الدم الحاد وتسمم حاصرات الكالسيوم.',
    indications: 'فرط بوتاسيوم الدم الشديد (K+ ≥ 6.5 mmol/L أو تغيرات ECG)، هبوط الكالسيوم الحاد مع تكزز، سمية المغنيسيوم.',
    adultDose: '10 مل (1 غرام) تسريباً وريدياً بطيئاً على 5-10 دقائق تحت مراقبة تخطيط القلب ECG المستمرة.',
    pediatricDose: '0.5 ml/kg (50 mg/kg) IV ببطء شديد على 10-20 دقيقة.',
    dilution: 'يمكن إعطاؤه مخففاً في 50-100 مل D5W أو محلول ملحي.',
    contraindications: 'تسمم الديجوكسين (خطر تحفيز توقف القلب بحالة انقباض "Stone Heart"). يفضل استبداله بـ Calcium Chloride في الصدمة الشديدة.',
    warnings: 'الكالسيوم غلوكونات أقل تخريشاً للأوردة مقارنة بـ Calcium Chloride، لكن يجب التأكد من سلامة الوريد.'
  },
  {
    id: 'er_sodium_bicarb',
    name: 'Sodium Bicarbonate 8.4% (50ml Vial - 1 mEq/ml)',
    genericName: 'Sodium Bicarbonate 8.4%',
    category: 'resuscitation',
    categoryLabel: 'الإنعاش وتوقف القلب (ACLS)',
    summary: 'عامل قلوي للدم لعلاج الحماض الأيضي الحاد والتسمم بمضادات الاكتئاب ثلاثية الحلقات (TCAs).',
    indications: 'التسمم بمضادات الاكتئاب ثلاثية الحلقات (Amitriptyline) مع اتساع QRS > 100ms، الحماض الاستقلابي الشديد (pH < 7.1)، فرط البوتاسيوم المقاوم.',
    adultDose: '50 mEq (50 ml من تركيز 8.4%) وريدياً ببطء على مدى 5 دقائق، ثم تسريب مستمر للحفاظ على pH بين 7.45 - 7.55.',
    pediatricDose: '1 mEq/kg وريدياً ببطء مخففاً 1:1 بماء معقم للرضع.',
    dilution: 'يُمنع خلطه مع الأدرينالين أو الكالسيوم في نفس الكانيولا لأنه يُعطل الأدرينالين ويرسب الكالسيوم فوراً.',
    contraindications: 'القلاء الاستقلابي أو التنفسي، هبوط البوتاسيوم.',
    warnings: 'يتحول في الجسم إلى CO2، لذا يجب التأكد من كفاءة التهوية الرئوية لطرد غاز ثاني أكسيد الكربون.'
  },

  // 2. الصدمة والرافعات الوعائية (Shock & Inotropes)
  {
    id: 'er_noradrenaline',
    name: 'Noradrenaline (Norepinephrine 4mg / 4ml)',
    genericName: 'Norepinephrine Bitartrate',
    category: 'shock',
    categoryLabel: 'الصدمة والرافعات الوعائية (Inotropes)',
    summary: 'الرافع الوعائي الأول المعتمد عالمياً للصدمة الإنتانية والتوزيعية وهبوط الضغط الشرياني المقاوم للسوائل.',
    indications: 'الصدمة الإنتانية (Septic Shock)، الصدمة التأقية المقاومة، الصدمة العصبية.',
    adultDose: 'يبدأ من 0.05 - 0.1 mcg/kg/min ويعدل بالتدريج للوصول لضغط شرياني وسطي MAP ≥ 65 mmHg (جرعة قصوى 1-2 mcg/kg/min).',
    dilution: 'تخفف أمبولة 4 ملغ في 50 مل D5W عبر مضخة تسريب حقنية Syringe Pump، ويفضل إعطاؤه عبر قسطرة وريد مركزي CVC.',
    contraindications: 'نقص الحجم الدوراني غير المعوض (يجب إعطاء السوائل البلورية أولاً).',
    warnings: 'تسرب الدواء خارج الوريد يسبب تنخر موضعي حاد وموت الأنسجة. يعالج فوراً بـ Phentolamine موضعي.'
  },
  {
    id: 'er_dopamine',
    name: 'Dopamine (200mg / 5ml)',
    genericName: 'Dopamine Hydrochloride',
    category: 'shock',
    categoryLabel: 'الصدمة والرافعات الوعائية (Inotropes)',
    summary: 'منبه دوباميني وأدرينالي لرفع الضغط والنبض في بطء القلب العرضي والصدمة.',
    indications: 'الصدمة المصحوبة ببطء قلب، بطء القلب المقاوم للأتروبين كبديل قبل وضع منظم ضربات خارجي.',
    adultDose: '• جرعة منبهة للقلب (Inotropic): 5 - 10 mcg/kg/min.\n• جرعة رافعة للضغط (Vasopressor): 10 - 20 mcg/kg/min.',
    dilution: 'يخفف 200 ملغ في 250 مل D5W أو Normal Saline ويعطى عبر مضخة تسريب دقيقة.',
    contraindications: 'ورم القواتم (Pheochromocytoma)، الرجفان البطيني.',
    warnings: 'قد يسبب تسرع قلب حاد (Tachyarrhythmias) وازدياد حاجة عضلة القلب للأكسجين.'
  },
  {
    id: 'er_dobutamine',
    name: 'Dobutamine (250mg / 20ml)',
    genericName: 'Dobutamine',
    category: 'shock',
    categoryLabel: 'الصدمة والرافعات الوعائية (Inotropes)',
    summary: 'محفز بيتا-1 إيجابي لقوة تقلص عضلة القلب بدون تضييق وعائي كبير.',
    indications: 'الصدمة القلبية (Cardiogenic Shock)، قصور القلب الحاد الاحتقاني المصحوب بضعف النتاج القلبي.',
    adultDose: 'يبدأ من 2.5 - 5 mcg/kg/min وتعدل الجرعة حتى 20 mcg/kg/min حسب الاستجابة.',
    dilution: 'تخفف أمبولة 250 ملغ في 250 مل D5W أو محلول ملحي.',
    contraindications: 'اعتلال عضلة القلب الضخامي الانسدادي (HOCM)، تضيق الصمام الأبهري الشديد.',
    warnings: 'قد يسبب هبوطاً طفيفاً بالضغط بسبب توسعه الوعائي المحيطي الخفيف، لذا يفضل دعمه بالنورأدرينالين إن كان الضغط منخفضاً.'
  },

  // 3. القلب واضطراب النظم (Cardiology)
  {
    id: 'er_adenosine',
    name: 'Adenosine (6mg / 2ml Vial)',
    genericName: 'Adenosine',
    category: 'cardiac',
    categoryLabel: 'القلب واضطراب النظم (Cardio)',
    summary: 'العلاج النوعي الأول لإنهاء تسرع القلب فوق البطيني الانتيابي (PSVT / SVT).',
    indications: 'تسرع القلب فوق البطيني منتظم وسريع بمركب ضيق (Narrow-complex Regular SVT).',
    adultDose: '• الجرعة الأولى: 6 mg IV دفعة سريعة جداً خلال 1-2 ثانية.\n• الجرعة الثانية: 12 mg IV بعد 1-2 دقيقة إذا لم ينتهِ التسرع.\n• جرعة ثالثة 12 mg إذا لزم الأمر.',
    pediatricDose: '0.1 mg/kg الجرعة الأولى (أقصى 6 mg)، ثم 0.2 mg/kg (أقصى 12 mg).',
    dilution: 'يجب حقنه في أقرب كانيولا للقلب (Cubital Fossa) كدفعة نفاثة سريعة متبوعة بـ 20 مل محلول ملحي سريعاً ورفع الذراع فوراً.',
    contraindications: 'الربو القصبي الشديد، حصار القلب AV block من الدرجة الثانية أو الثالثة، متلازمة الجيوب الأنفية المريضة.',
    warnings: 'يحدث توقف قلب مؤقت (Asystole) لعدة ثوانٍ مع شعور ضيق صدر لدى المريض، يجب طمأنة المريض مسبقاً.'
  },
  {
    id: 'er_labetalol',
    name: 'Labetalol IV (100mg / 20ml)',
    genericName: 'Labetalol Hydrochloride',
    category: 'cardiac',
    categoryLabel: 'القلب واضطراب النظم (Cardio)',
    summary: 'حاصر ألفا وبيتا المزدوج للتحكم بفرط ضغط الدم الطارئ وتسلخ الشريان الأبهري والنزف الدماغي.',
    indications: 'طوارئ ارتفاع ضغط الدم (Hypertensive Emergency)، تسلخ الأبهر (Aortic Dissection)، ارتفاع الضغط بالسكتة قبل إعطاء أكتيليز.',
    adultDose: '• بولس وريدي: 10 - 20 mg IV بطيء على دقيقتين، يمكن تكرار 20-80 mg كل 10 دقائق حتى الوصول للهدف (أقصى 300 mg).\n• أو تسريب: 0.5 - 2 mg/min.',
    dilution: 'يمكن إعطاؤه غير مخفف بالحقن البطيء، أو مخففاً في D5W أو Normal Saline للتسريب المستمر.',
    contraindications: 'الربو القصبي، بطء القلب الشديد (< 60 bpm)، قصور القلب اللا معاوض الحاد.',
    warnings: 'يحافظ على التروية الدماغية والكلوية دون هبوط حاد مفاجئ، وهو الخط الأول في تسمم الحمل (Preeclampsia).'
  },
  {
    id: 'er_gtn',
    name: 'Nitroglycerin / Glyceryl Trinitrate (GTN 50mg / 50ml)',
    genericName: 'Glyceryl Trinitrate',
    category: 'cardiac',
    categoryLabel: 'القلب واضطراب النظم (Cardio)',
    summary: 'موسع للأوردة والشرايين التاجية لعلاج الذبحة الصدرية الحادة ووذمة الرئة الحادة.',
    indications: 'متلازمة الشريان التاجي الحادة (ACS/Angina)، وذمة الرئة القلبية الحادة (Acute Pulmonary Edema).',
    adultDose: 'يبدأ من 5 - 10 mcg/min ويزاد بمقدار 5-10 mcg كل 5 دقائق حتى زوال ألم الصدر أو خفض الضغط (أقصى جرعة 200 mcg/min).',
    dilution: 'تخفف أمبولة 50 ملغ في 250 مل D5W أو Normal Saline وتُعطى عبر أنابيب غير ماصة (Non-PVC Tubing).',
    contraindications: 'احتشاء البطين الأيمن (Right Ventricular Infarction)، تناول أدوية الضعف الجنسي (Sildenafil/Tadalafil) خلال 24-48 ساعة، انخفاض SBP < 90 mmHg.',
    warnings: 'الجمع مع الفياغرا يسبب انهياراً دورانياً مميتاً غير مستجيب للسوائل!'
  },

  // 4. المسكنات والمهدئات والتنبيب (Analgesia, Sedation & RSI)
  {
    id: 'er_fentanyl',
    name: 'Fentanyl (100mcg / 2ml)',
    genericName: 'Fentanyl Citrate',
    category: 'analgesia',
    categoryLabel: 'المسكنات والمهدئات والتنبيب (RSI)',
    summary: 'أفيوني صناعي سريع وقوي جداً (أقوى من المورفين بـ 100 مرة) مع ثباتية دورانية عالية.',
    indications: 'التسكين السريع للكسور والحروق الكبرى، التسكين أثناء التنبيب الرغامي السريع (RSI)، تسكين آلام الصدر.',
    adultDose: '50 - 100 mcg (1-2 mcg/kg) وريدياً ببطء على مدى 1-2 دقيقة، ويمكن تكراره كل 30-60 دقيقة.',
    pediatricDose: '1 - 2 mcg/kg IV بطيء أو عبر بخاخ الأنف (Intranasal).',
    dilution: 'يُحقن ببطء غير مخفف أو مخففاً بـ 10 مل محلول ملحي.',
    contraindications: 'تثبيط تنفسي شديد، عدم استقرار مجرى الهواء دون توفر أجهزة الإنعاش.',
    warnings: 'الحقن الوريدي السريع جداً يسبب تصلب جدار الصدر الخشبي (Chest Wall Rigidity) وصعوبة تهوية المريض. الترياق: Naloxone.'
  },
  {
    id: 'er_ketamine',
    name: 'Ketamine (500mg / 10ml)',
    genericName: 'Ketamine Hydrochloride',
    category: 'analgesia',
    categoryLabel: 'المسكنات والمهدئات والتنبيب (RSI)',
    summary: 'مهدئ تفارقي مثالي للتنبيب والإجراءات المؤلمة بفضل الحفاظ على ضغط الدم والتنفس وتوسيعه للقصبات.',
    indications: 'التنويم للتنبيب الرغامي (RSI) خاصة بمرضى الصدمة أو أزمة الربو الحادة، التهدئة للإجراءات الجراحية المؤلمة، التسكين دون تنويم.',
    adultDose: '• التنويم للتنبيب (RSI): 1.5 - 2 mg/kg IV بطيء على دقيقة.\n• التسكين دون تنويم (Sub-dissociative Analgesia): 0.2 - 0.3 mg/kg تسريباً على 15 دقيقة.',
    pediatricDose: '1 - 2 mg/kg IV أو 3 - 4 mg/kg IM.',
    dilution: 'يخفف في Normal Saline لتفادي التثبيط المفاجئ.',
    contraindications: 'ارتفاع ضغط دم غير مسيطر عليه إطلاقاً، الذهان الفصامي النشط الحاد.',
    warnings: 'مثالي لمرضى الربو الشديد لخصائصه الموسعة للقصبات، ويحافظ على النتاج القلبي في مرضى الصدمة.'
  },
  {
    id: 'er_propofol',
    name: 'Propofol 1% (200mg / 20ml)',
    genericName: 'Propofol',
    category: 'analgesia',
    categoryLabel: 'المسكنات والمهدئات والتنبيب (RSI)',
    summary: 'منوم وريدي فائق السرعة للتنبيب الرغامي وتعديل النظم القلبي بالصدمة (Cardioversion).',
    indications: 'التنبيب الرغامي السريع (RSI)، التهدئة السريعة لتقويم نظم القلب الكهربائي، تهدئة مرضى العناية على جهاز التنفس.',
    adultDose: '1.5 - 2.5 mg/kg IV بطيء على 30 ثانية حتى غياب رد الفعل الجفني.',
    dilution: 'يُعطى صافياً دون تخفيف عبر كانيولا وريدية واسعة (يسبب ألماً أثناء الحقن، يخفف بإضافة 10-20 ملغ ليدوكائين).',
    contraindications: 'هبوط الضغط الشديد، الصدمة، الحساسية الشديدة للبيض وفول الصويا.',
    warnings: 'يسبب هبوطاً حاداً بالضغط الشرياني وتثبيطاً تنفسياً؛ لا يعطى إلا بوجود طبيب متمرس على مجرى الهواء.'
  },

  // 5. الجهاز التنفسي والربو (Respiratory)
  {
    id: 'er_salbutamol_iv',
    name: 'Salbutamol Nebulizer & IV',
    genericName: 'Salbutamol (Ventolin)',
    category: 'respiratory',
    categoryLabel: 'الجهاز التنفسي والربو (Respiratory)',
    summary: 'موسع قصبات سريع المفعول ومنبه لمستقبلات بيتا-2 لعلاج نوبات الربو الحادة وخفض البوتاسيوم الطارئ.',
    indications: 'التشنج القصبي الحاد، نوبة الربو الشديدة والمهددة للحياة، فرط بوتاسيوم الدم الحاد.',
    adultDose: '• تبخير (Nebulization): 2.5 - 5 mg في 3 مل ملحي متواصلاً في الساعة الأولى.\n• فرط البوتاسيوم: 10 - 20 mg رذاذاً يخفض البوتاسيوم بمقدار 0.5-1 mmol/L خلال 30 دقيقة.',
    dilution: 'يمدد في محلول ملحي 0.9% Normal Saline.',
    contraindications: 'فرط الحساسية، عدم انتظام ضربات القلب المتسارع الشديد.',
    warnings: 'يسبب تسارع نبض ارتعاشاً بالعضلات وهبوطاً طفيفاً بالبوتاسيوم.'
  },
  {
    id: 'er_magnesium_sulfate',
    name: 'Magnesium Sulfate 50% (5g / 10ml)',
    genericName: 'Magnesium Sulfate',
    category: 'respiratory',
    categoryLabel: 'الجهاز التنفسي والربو (Respiratory)',
    summary: 'مرخٍ للعضلات الملساء لعلاج نوبات الربو المقاومة، واضطراب Torsades de Pointes وتشنجات الحمل (Eclampsia).',
    indications: 'نوبة الربو الشديدة المقاومة للتبخيرات، اضطراب النظم Torsades de Pointes، تسمم وتشنج الحمل (Eclampsia).',
    adultDose: '• الربو و Torsades: 2 g وريدياً تسريباً على 15-20 دقيقة في 100 مل D5W أو Saline.\n• تشنج الحمل: 4 g وريدياً على 15 دقيقة ثم 1 g/hr تسريباً مستمراً.',
    dilution: 'تخفف الجرعة (2 غرام = 4 مل من تركيز 50%) في 100 مل محلول ملحي.',
    contraindications: 'حصار القلب التام، الوهن العضلي الوبيل (Myasthenia Gravis)، الفشل الكلوي الحاد دون مراقبة.',
    warnings: 'مراقبة المنعكسات الوترية العميقة (DTR) ومعدل التنفس، ترياق السمية هو Calcium Gluconate.'
  },

  // 6. الترياق وعلاج التسمم (Antidotes & Toxicology)
  {
    id: 'er_naloxone',
    name: 'Naloxone (Narcan 0.4mg / 1ml)',
    genericName: 'Naloxone Hydrochloride',
    category: 'antidotes',
    categoryLabel: 'الترياق وعلاج التسمم (Antidotes)',
    summary: 'المعاكس النوعي الفوري لفرط جرعة وتسمم الأفيونات (Opioid Overdose).',
    indications: 'تثبيط التنفس والغيبوبة الناتجة عن الأفيونات (المورفين، الهيروين، الترامادول، الفنتانيل).',
    adultDose: '0.4 - 2 mg IV أو IM أو عبر الأنف، تعاد كل 2-3 دقائق حتى يستعيد المريض التنفس الطبيعي التلقائي.',
    pediatricDose: '0.01 - 0.1 mg/kg IV/IM.',
    dilution: 'يُعطى مباشرة وريدياً أو عضلياً أو داخل القصبة الهوائية.',
    contraindications: 'لا توجد موانع في التثبيط التنفسي المهدد للحياة.',
    warnings: 'عمره النصفي في الجسم أقصر من معظم الأفيونات؛ قد ينتكس المريض ويدخل في تثبيط تنفسي مجدداً بعد 30-45 دقيقة، يتطلب المراقبة المستمرة.'
  },
  {
    id: 'er_flumazenil',
    name: 'Flumazenil (0.5mg / 5ml)',
    genericName: 'Flumazenil',
    category: 'antidotes',
    categoryLabel: 'الترياق وعلاج التسمم (Antidotes)',
    summary: 'معاكس مستقبلات البنزوديازيبين لحالات فرط التهدئة أثناء الإجراءات التشخيصية.',
    indications: 'إلغاء التهدئة الناتجة عن البنزوديازيبين (ديازيبام، ميدازولام).',
    adultDose: '0.2 mg IV على 15 ثانية، تعاد بجرعة 0.3-0.5 mg كل دقيقة حتى الاستيقاظ (أقصى 3 mg).',
    dilution: 'حقن وريدي بطيء.',
    contraindications: 'يُمنع منعاً باتاً في التسمم المختلط بمضادات الاكتئاب ثلاثية الحلقات TCAs أو مرضى الصرع المزمن (يحفز نوبات صرع مميتة غير مستجيبة).',
    warnings: 'استخدامه مقيد بحالات التهدئة الإجرائية المحسوبة فقط، وليس التسمم الدوائي العشوائي.'
  },
  {
    id: 'er_parvolex',
    name: 'N-Acetylcysteine (Parvolex / Fluimucil IV)',
    genericName: 'Acetylcysteine (NAC)',
    category: 'antidotes',
    categoryLabel: 'الترياق وعلاج التسمم (Antidotes)',
    summary: 'الترياق المنقذ للحياة في حالات التسمم بالباراسيتامول لحماية الكبد من التنخر الحاد.',
    indications: 'فرط جرعة وتسمم الباراسيتامول الحاد (جرعة ابتلاع > 150 mg/kg أو حسب منحنى Rumack-Matthew).',
    adultDose: 'بروتوكول الـ 21 ساعة:\n1- جرعة التحميل: 150 mg/kg في 200 مل D5W على ساعة واحدة.\n2- جرعة ثانية: 50 mg/kg في 500 مل D5W على 4 ساعات.\n3- جرعة ثالثة: 100 mg/kg في 1000 مل D5W على 16 ساعة.',
    dilution: 'يمدد في دكستروز 5% D5W حصراً.',
    contraindications: 'لا توجد موانع، يعطى حتى لو ظهرت أعراض تحسسية طفيفة بتخفيض سرعة التسريب وإعطاء مضاد هيستامين.',
    warnings: 'أعلى فاعلية عند بدئه خلال الساعات الـ 8 الأولى من الابتلاع.'
  },

  // 7. الأعصاب والتشنجات (Neuro & Anticonvulsants)
  {
    id: 'er_mannitol',
    name: 'Mannitol 20% (100g / 500ml)',
    genericName: 'Mannitol 20%',
    category: 'neuro',
    categoryLabel: 'الأعصاب والتشنجات (Neuro)',
    summary: 'مدر أسمولي فوري لسحب السوائل وخفض الضغط داخل القحف (ICP) ووذمة الدماغ.',
    indications: 'ارتفاع الضغط داخل الجمجمة بعد إصابات الرأس، انفتاق الدماغ الوشيك، الوذمة الدماغية الحادة.',
    adultDose: '0.5 - 1 g/kg (أي 2.5 - 5 ml/kg من محلول 20%) تسريباً وريدياً سريعاً على مدى 15-20 دقيقة.',
    dilution: 'يُعطى المحلول مركزاً عبر فلتر وريدي لمنع دخول أي بلورات مترسبة.',
    contraindications: 'النزف داخل القحف النشط غير المسيطر عليه، هبوط الضغط الشرياني والصدمة، الفشل الكلوي الحاد مع انقطاع البول.',
    warnings: 'يجب التأكد من ثبات ضغط الدم الشرياني؛ هبوط الضغط بعد المانيتول ينقص التروية الدماغية CPP بشكل خطير.'
  },
  {
    id: 'er_hypertonic_saline',
    name: 'Hypertonic Saline 3% (500ml)',
    genericName: 'Sodium Chloride 3%',
    category: 'neuro',
    categoryLabel: 'الأعصاب والتشنجات (Neuro)',
    summary: 'محلول ملحي عالي التركيز لخفض وذمة الدماغ وهبوط الصوديوم الحاد المصحوب بتشنجات.',
    indications: 'انفتاق الدماغ الحاد، نقص صوديوم الدم الحاد الشديد مع تشنجات أو غيبوبة.',
    adultDose: '100 - 150 ml تسريباً وريدياً على 10-15 دقيقة، يمكن تكرارها مرة إضافية حتى تحسن الأعراض.',
    dilution: 'جاهز للاستعمال أو يُحضر بمزج 23.4% NaCl مع ملحي.',
    contraindications: 'فرط صوديوم الدم.',
    warnings: 'الرفع السريع جداً للصوديوم المزمن يسبب متلازمة انحلال الميالين الجسري (Osmotic Demyelination Syndrome).'
  },

  // 8. النزف والتخثر ومذيبات الجلطة (Bleeding & Thrombolysis)
  {
    id: 'er_txa',
    name: 'Tranexamic Acid (TXA / Cyclokapron 500mg / 5ml)',
    genericName: 'Tranexamic Acid',
    category: 'bleeding',
    categoryLabel: 'النزف والتخثر ومذيبات الجلطة (Bleeding/rtPA)',
    summary: 'مضاد انحلال الفبرين لتقليل الوفيات الناتجة عن النزف الرضحي الحاد والنزف التالي للولادة (PPH).',
    indications: 'النزف الرضحي الحاد (Polytrauma bleeding خلال 3 ساعات من الإصابة)، نزف ما بعد الولادة PPH، النزف الهضمي الحاد.',
    adultDose: '• الجرعة الأولى: 1 g IV تسريباً على 10 دقائق في 100 مل ملحي.\n• تليها جرعة صيانة: 1 g IV تسريباً مستمراً على مدى 8 ساعات (دراسة CRASH-2 العالمية).',
    dilution: 'تخفف في 100 مل Normal Saline أو D5W.',
    contraindications: 'الحقن بعد مرور أكثر من 3 ساعات على وقت الإصابة الرضحية (يزيد الوفيات!). الخثار الوريدي النشط.',
    warnings: 'الحقن السريع جداً يسبب هبوطاً حاداً في ضغط الدم.'
  },
  {
    id: 'er_alteplase',
    name: 'Alteplase (Actilyse 50mg Vial)',
    genericName: 'Recombinant Tissue Plasminogen Activator (rtPA)',
    category: 'bleeding',
    categoryLabel: 'النزف والتخثر ومذيبات الجلطة (Bleeding/rtPA)',
    summary: 'مذيب التخثر النوعي المعتمد للسكتة الدماغية الإقفارية الحادة خلال 4.5 ساعة والانصمام الرئوي الكتلي (Massive PE).',
    indications: 'السكتة الدماغية الإقفارية الحادة (خلال 4.5 ساعة)، الانصمام الرئوي الضخم المصحوب بهبوط ضغط (Massive PE with shock).',
    adultDose: '• السكتة الدماغية: 0.9 mg/kg (الحد الأقصى 90 mg)؛ يُعطى 10% منها كبولس وريدي على دقيقة واحدة، والباقي (90%) تسريباً على 60 دقيقة.\n• الانصمام الرئوي الضخم: 100 mg تسريباً على ساعتين (أو 50 mg بولس في توقف القلب الناجم عن PE).',
    dilution: 'يحل بالماء المعقم المرفق فقط بنسبة 1 mg/ml.',
    contraindications: 'أي نزيف دماغي سابق، عملية جراحية كبرى أو رضح خلال 14 يوماً، ضغط الدم > 185/110 mmHg غير المستجيب، الصفائح < 100,000.',
    warnings: 'يجب التحقق الصارم من قائمة موانع الاستعمال وتثبيت ضغط الدم المستمر كل 15 دقيقة.'
  },
  {
    id: 'er_protamine',
    name: 'Protamine Sulfate (50mg / 5ml)',
    genericName: 'Protamine Sulfate',
    category: 'bleeding',
    categoryLabel: 'النزف والتخثر ومذيبات الجلطة (Bleeding/rtPA)',
    summary: 'الترياق والمعاكس الفوري للهيبارين غير المجزأ وهيبارين الوزن الجزيئي المنخفض (Clexane).',
    indications: 'النزف الحاد المهدد للحياة الناتج عن جرعات الهيبارين أو الكلكسان.',
    adultDose: '1 mg بروتامين يعاكس 100 وحدة دولية هيبارين أعطيت خلال آخر ساعتين (أقصى جرعة مفردة 50 mg بطيئة على 10 دقائق).',
    dilution: 'حقن وريدي بطيء جداً على مدى 10 دقائق.',
    contraindications: 'حساسية الأسماك، سوابق حساسية للبروتامين.',
    warnings: 'الحقن السريع يسبب هبوط ضغط حاد، بطء قلب، ووذمة رئة تأقية.'
  }
];
