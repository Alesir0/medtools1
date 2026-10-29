import { DialysisProtocol } from '../types/clinical';

export const DIALYSIS_PROTOCOLS_DATA: DialysisProtocol[] = [
  {
    id: 'proto_1',
    title: 'بروتوكول بدء الغسل الكلوي لأول مرة (First Hemodialysis Initiation Protocol)',
    category: 'initiation',
    categoryLabel: 'بدء الغسل الأول',
    targetPatients: 'مرضى الفشل الكلوي الحاد أو المزمن الذين يخضعون لأول جلسة غسل في حياتهم (Naïve Patients)',
    indications: 'تجنب متلازمة اختلال التوازن الدماغي القاتلة (Dialysis Disequilibrium Syndrome - DDS) الناتجة عن الانخفاض المفاجئ في أسمولية الدم.',
    durationHours: '2.0 - 2.5 ساعة فقط (تمنع الجلسات الطويلة في البداية)',
    bloodFlowRate: '150 - 200 ml/min كحد أقصى',
    dialysateFlowRate: '500 ml/min (أو 300 ml/min في الحالات شديدة الارتفاع باليوريا)',
    dialyzerType: 'Low-flux Dialyzer بمساحة سطح صغيرة (Surface Area ≤ 1.2 m²)',
    anticoagulation: 'جرعة هيبارين منخفضة: 1000 وحدة Bolus + 500 وحدة/ساعة، أو Saline flushes فقط إذا كان هناك خطر نزف.',
    dialysateComposition: 'البوتاسيوم K+ 2.0 أو 3.0 mEq/L (تجنب حمام 0 أو 1 لتفادي هبوط البوتاسيوم المفاجئ)، بيكربونات 32-35 mEq/L.',
    ultrafiltrationGoal: 'سحب سوائل طفيف جداً أو صفري (UF = 0 إلى 1.0 لتر كحد أقصى) ما لم تكن هناك وذمة رئوية صريحة.',
    clinicalSteps: [
      'فحص العلامات الحيوية، درجة الوعي (GCS)، ومستوى اليوريا والكرياتينين قبل الجلسة.',
      'بدء تدفق الدم تدريجياً من 100 ml/min ثم الرفع البطيء إلى 150-180 ml/min.',
      'مراقبة ضغط الدم كل 15 دقيقة طوال الساعتين.',
      'فحص المريض لأي بوادر صداع، غثيان، تشتت ذهني أو ارتعاشات عضلية.',
      'في الجلسة الثانية (اليوم التالي): تمديد الوقت إلى 3 ساعات مع رفع التدفق إلى 200-250 ml/min.',
      'في الجلسة الثالثة: الوصول إلى الجلسة القياسية (3.5 - 4 ساعات).'
    ],
    precautions: [
      'يمنع منعاً باتاً خفض مستوى اليوريا بأكثر من 30-40% في الجلسة الأولى لتجنب الوذمة الدماغية.',
      'في حال وجود يوريا شديدة الارتفاع (> 200 mg/dL)، يُعطى Mannitol 20% (100 ml IV) ببطء أثناء الجلسة كإجراء وقائي للأسمولية.'
    ],
    kdigoCitation: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury & UK Renal Association Haemodialysis Guidelines.'
  },
  {
    id: 'proto_2',
    title: 'بروتوكول جلسات الغسل الدوري القياسية (Standard Maintenance Hemodialysis)',
    category: 'maintenance',
    categoryLabel: 'الغسل الدوري المزمن',
    targetPatients: 'مرضى الفشل الكلوي النهائي (ESRD) المستقرين على جدول غسل دوري (3 جلسات أسبوعياً).',
    indications: 'تحقيق تصفية كافية لليوريا والسموم اليوريمية (Kt/V ≥ 1.4 و URR ≥ 65%) مع ضبط الضغط وتوازن الشوارد.',
    durationHours: '3.5 - 4.5 ساعات لكل جلسة (12 ساعة أسبوعياً كحد أدنى)',
    bloodFlowRate: '300 - 450 ml/min (وفقاً لكفاءة الوصلة الوعائية AV Fistula/Graft)',
    dialysateFlowRate: '500 - 800 ml/min',
    dialyzerType: 'High-flux Biocompatible Membrane (Polysulfone / Polynephron)',
    anticoagulation: 'Standard Heparin Protocol: Loading 2000-3000 IU وريدياً ثم صيانة 1000 IU/hr مع إيقافه قبل نصف ساعة من نهاية الجلسة.',
    dialysateComposition: 'Na 138-140 mEq/L, K 2.0 mEq/L, Ca 1.25-1.50 mEq/L, HCO3 34 mEq/L, Glucose 100-200 mg/dL.',
    ultrafiltrationGoal: 'السحب محسوب للوصول إلى الوزن الجاف (Dry Weight) بمعدل سحب لا يتجاوز 13 ml/kg/hr.',
    clinicalSteps: [
      'وزن المريض بدقة قبل الصعود على السرير وحساب كمية السوائل المكتسبة بين الجلسات (Interdialytic Weight Gain - IDWG).',
      'فحص موقع الوصلة الوعائية (Thrill و Bruit) والتطهير بمحلول Chlorhexidine 2%.',
      'برمجة جهاز الغسل: وقت الجلسة، حجم السحب الإجمالي UF، ومعدل سريان الدم BFR.',
      'مراقبة ضغط الدم ونبض القلب كل 30 دقيقة.',
      'إيقاف مضاد التخثر قبل 30-45 دقيقة من نهاية الجلسة لتسهيل إرقاء الوصلة الوعائية.',
      'إعادة الدم بالكامل بـ 150-200 ml Normal Saline ووزن المريض بعد الجلسة للتأكد من بلوغ الوزن الجاف.'
    ],
    precautions: [
      'ممنوع تجاوز معدل سحب 13 ml/kg/hr تجنباً لتثبيط عضلة القلب ونقص تروية الأعضاء (Myocardial Stunning).',
      'فحص الهيموغلوبين شهرياً (الهدف 10 - 11.5 g/dL) ومعايرة Ferritin و TSAT.'
    ],
    kdigoCitation: 'KDIGO 2024 Hemodialysis Adequacy Guidelines & European Best Practice Guidelines (EBPG).'
  },
  {
    id: 'proto_3',
    title: 'بروتوكول غسل الطوارئ والحالات الحرجة (Emergency / Acute Hemodialysis Protocol)',
    category: 'acute_emergency',
    categoryLabel: 'طوارئ الغسل الحرج',
    targetPatients: 'حالات فرط البوتاسيوم المهدد للحياة (K+ ≥ 6.5 mmol/L)، الوذمة الرئوية المقاومة لمدرات البول، الحماض الأيضي الشديد (pH < 7.15)، والتسممات القابلة للغسل (Lithium, Methanol, Ethylene glycol, Salicylates).',
    indications: 'إنقاذ فوري من السكتة القلبية اليوريمية أو الغرق الرئوي وتصحيح التوازن الحمضي القلوي الحاد.',
    durationHours: '2.5 - 3 ساعات (أو تكرار يومي مستمر في العناية المركزة)',
    bloodFlowRate: '200 - 300 ml/min',
    dialysateFlowRate: '500 - 800 ml/min لتحقيق أسرع تصفية ممكنة',
    dialyzerType: 'High-flux Hemodialyzer بكفاءة مساحية عالية',
    anticoagulation: 'Heparin-Free تماماً (Normal Saline Flush 100 ml كل 15-30 دقيقة) لحالات النزيف أو الحالات الجراحية والنزف الدماغي.',
    dialysateComposition: 'حمامات خاصة: K+ 1.0 mEq/L في فرط البوتاسيوم المقاوم، وبيكربونات مرتفعة HCO3 36-38 mEq/L في الحماض الحاد.',
    ultrafiltrationGoal: 'سحب سوائل مكثف إذا كانت الحالة وذمة رئوية حادة (Flash Pulmonary Edema) مع مراقبة الضغط الوريدي المركزي.',
    clinicalSteps: [
      'تثبيت غشاء القلب الفوري: في فرط البوتاسيوم مع تغيرات ECG، إعطاء Calcium Gluconate 10% (10-20 ml IV على 5 دقائق) قبل وصل خط الغسل.',
      'تركيب قسطرة غسل طارئة مؤقتة (Dual-lumen Non-tunneled Hemodialysis Catheter) في الوريد الوداجي الداخلي الأيمن تحت توجيه السونار.',
      'بدء الجلسة فوراً مع مراقبة مستمرة لتخطيط القلب ECG والضغط والتشبع بالأكسجين SpO2.',
      'إجراء غسيل الخط بالسالاين الدوري كل 20 دقيقة لمنع تخثر الفلتر في حالة الغسل بدون هيبارين.',
      'إعادة قياس البوتاسيوم والغازات الشريانية ABG بعد 60 دقيقة من بدء الجلسة.'
    ],
    precautions: [
      'تجنب الهبوط الشديد السريع في البوتاسيوم في المرضى الذين يتناولون الديجوكسين (خطر لانظميات مميتة).',
      'في الوذمة الرئوية مع صدمة قلبية وانخفاض ضغط، يفضل استخدام الترشيح الفائق المعزول (Isolated Ultrafiltration) أولاً ثم بدء الغسل.'
    ],
    kdigoCitation: 'KDIGO Acute Kidney Injury Guideline & Emergency Nephrology Resuscitation Pathways.'
  },
  {
    id: 'proto_4',
    title: 'بروتوكول تحديد الوزن الجاف ومعدل السحب الأقصى (Dry Weight & Ultrafiltration Rate [UFR])',
    category: 'ultrafiltration',
    categoryLabel: 'الوزن الجاف والترشيح',
    targetPatients: 'كافة مرضى الغسل الكلوي المزمن لضبط الحمل الحجمي للسوائل وتجنب تضخم البطين الأيسر.',
    indications: 'تحديد أدنى وزن يتحمله المريض بعد انتهاء الجلسة دون حدوث هبوط ضغط أو تشنجات أو دوخة (Dry Weight Clinical Titration).',
    durationHours: 'موزعة على كامل وقت الجلسة المجدولة (4 ساعات)',
    bloodFlowRate: 'حسب الخطة القياسية (350 ml/min)',
    dialysateFlowRate: '500 ml/min',
    dialyzerType: 'معياري',
    anticoagulation: 'معياري',
    dialysateComposition: 'صوديوم حمام 138 - 140 mEq/L (تجنب الصوديوم العالي لمنع العطش الشديد بين الجلسات)',
    ultrafiltrationGoal: 'الحد الأقصى المسموح: UFR ≤ 10 - 13 ml/kg/hour لحماية القلب والأمعاء والدماغ من نقص التروية.',
    clinicalSteps: [
      'معادلة حساب السحب الأقصى: أقصى حجم سحب في الجلسة (لتر) = (وزن المريض بالكغ × 13 × عدد ساعات الجلسة) ÷ 1000.',
      'تقييم علامات فرط السوائل قبل الجلسة: وذمة القدمين، احتقان أوردة العنق (JVP)، خراطيش الرئة بالسمّاعة، وارتفاع ضغط الدم قبل الجلسة.',
      'تقييم علامات نقص الحجم وسحب السوائل الزائد: هبوط الضغط الانتصابي بعد الجلسة، تشنج الساقين، والغثيان.',
      'تعديل الوزن الجاف بالتدريج: خفض أو رفع 0.2 - 0.5 كغ كل أسبوعين بناءً على الفحص السريري وقياس المقاومة الحيوية (Bioimpedance BCM).',
      'تطبيق السحب الخطي المتواصل طوال الجلسة وتجنب السحب السريع في الساعات الأولى.'
    ],
    precautions: [
      'تجاوز معدل 13 ml/kg/hr يرتبط بزيادة معدل الوفيات القلبية الوعائية بنسبة 70% وتندب عضلة القلب (Myocardial Stunning).',
      'إذا كان المريض يحتاج سحب أكثر من 4 لتر، يجب زيادة وقت الجلسة إلى 4.5 أو 5 ساعات أو إضافة جلسة رابعة استثنائية.'
    ],
    kdigoCitation: 'KDIGO 2024 Practice Guidelines on Volume Management & Ultrafiltration Rates in Hemodialysis.'
  },
  {
    id: 'proto_5',
    title: 'بروتوكول مضادات التخثر والهيبارين والغسل الخالي من الهيبارين (Anticoagulation & Heparin-Free Protocol)',
    category: 'anticoagulation',
    categoryLabel: 'التخثر ومضادات التجلط',
    targetPatients: 'مرضى الغسل الكلوي، مع فرز الحالات المعرضة للنزف أو النشطة جراحياً.',
    indications: 'منع تجلط فلتر الغسل وأنابيب الدوران الخارج-جسدي مع الحفاظ على الأمان النزفي التام للمريض.',
    durationHours: 'كامل مدة الجلسة',
    bloodFlowRate: '250 - 400 ml/min (في الغسل بدون هيبارين يفضل تدفق دم مرتفع ≥ 300 لمنع الركودة)',
    dialysateFlowRate: '500 ml/min',
    dialyzerType: 'Synthetic High-flux Membrane ذات خصائص مضادة للالتصاق',
    anticoagulation: 'تصنيف البروتوكول إلى 3 مسارات:\n1. المسار القياسي (Unfractionated Heparin): جرعة بدئية 2000-3000 وحدة، ثم 750-1000 وحدة/ساعة، إيقافها قبل 45 دقيقة من النهاية.\n2. مسار هيبارين منخفض الوزن (LMWH - Enoxaparin): 0.7 - 1.0 mg/kg تحقن في الخط الشرياني عند بدء الجلسة كجرعة مفردة.\n3. مسار الغسل الخالي من الهيبارين (Heparin-Free Protocol): للنزف الفعال، ما بعد العمليات، والتهاب التأمور اليوريمي.',
    dialysateComposition: 'معياري',
    ultrafiltrationGoal: 'معياري (مع خصم حجم السالاين المعطى للغسيل من صافي السحب)',
    clinicalSteps: [
      'في بروتوكول الغسل الخالي من الهيبارين (Heparin-Free): غسل الدارة مسبقاً بـ 2 لتر سالاين يحتوي 5000 وحدة هيبارين ثم تصريفها بالكامل قبل وصل المريض.',
      'تطبيق دفقات سالاين دورية (Saline Flushes): 100 ml Normal Saline كل 15 - 30 دقيقة عبر الخط الشرياني مع زيادة معدل السحب بنفس المقدار.',
      'مراقبة ضغط المدخل الوريدي (Venous Pressure) والضغط عبر الغشاء (TMP) لاكتشاف بوادر التخثر مبكراً.',
      'فحص حجرة التنقيط الوريدي ولون الفلتر (تحول اللون إلى خطوط سوداء داكنة يشير لتجلط الألياف).'
    ],
    precautions: [
      'يمنع استخدام الهيبارين في حالات: التهاب التأمور اليوريمي (خطر اندحاس القلب Hemopericardium)، النزف الدماغي الحديث، النزف الهضمي الفعال، وبعد العمليات الجراحية لمدة 48-72 ساعة.',
      'في حال الاشتباه بنقص الصفيحات المحدث بالهيبارين (HIT Type II)، يوقف الهيبارين فوراً ويستبدل بـ Argatroban أو Citrate.'
    ],
    kdigoCitation: 'KDIGO Clinical Practice Guideline on Extracorporeal Circuit Anticoagulation.'
  },
  {
    id: 'proto_6',
    title: 'بروتوكول ضبط شوارد حمام الغسل (Dialysate Bath & Electrolyte Profiling Protocol)',
    category: 'bath_electrolytes',
    categoryLabel: 'شوارد حمام الغسل',
    targetPatients: 'مرضى الغسل الذين يعانون من تذبذبات حادة في البوتاسيوم، الكالسيوم، أو هبوط الضغط المتكرر.',
    indications: 'تكييف تركيبة سائل الغسيل (Dialysate Bath) بما يتناسب بدقة مع التحاليل المخبرية الدورية للمريض.',
    durationHours: 'حسب خطة المريض السريرية',
    bloodFlowRate: 'معياري',
    dialysateFlowRate: '500 - 600 ml/min',
    dialyzerType: 'معياري',
    anticoagulation: 'معياري',
    dialysateComposition: 'تركيبات الحمام السريرية:\n• حمام 1K (K = 1.0 mEq/L): فقط لفرط البوتاسيوم الشديد (> 6.5) مع مراقبة دقيقة.\n• حمام 2K (K = 2.0 mEq/L): الحمام الأكثر أماناً واستخداماً لمعظم المرضى.\n• حمام 3K (K = 3.0 mEq/L): للمرضى المعرضين لهبوط البوتاسيوم أو الذين يتناولون ديجوكسين.\n• كالسيوم الحمام (Ca 1.25 mmol/L): يحافظ على توازن محايد للكالسيوم ويحمي من تكلس الشرايين.',
    ultrafiltrationGoal: 'معياري',
    clinicalSteps: [
      'فحص بوتاسيوم المريض قبل الجلسة لاختيار تركيز الحمام المناسب.',
      'تجنب التدرج الحاد بين بوتاسيوم الدم وبوتاسيوم الحمام (Gradient > 3 mEq/L) لتجنب اضطراب النظم البطيني.',
      'تطبيق تدرج الصوديوم (Sodium Modeling) للمرضى المعرضين لهبوط الضغط: البدء بتركيز 144 mEq/L في أول ساعتين والانتهاء بـ 138 mEq/L.',
      'ضبط درجة حرارة حمام الغسل (Dialysate Temperature): تبريد الحمام إلى 35.5 - 36.0°C يمنع هبوط الضغط عبر تحفيز التقبض الوعائي الانعكاسي.'
    ],
    precautions: [
      'يمنع استخدام حمام 0K أو 1K لمرضى القلب أو الذين يأخذون دواء Digoxin خوفاً من حدوث رجفان بطيني قاتل.',
      'الصوديوم المرتفع في الحمام يمنع هبوط الضغط لكنه يسبب عطشاً مفرطاً واحتباس سوائل هائل بين الجلسات.'
    ],
    kdigoCitation: 'KDIGO 2024 Clinical Update: Dialysate Composition and Temperature Optimization.'
  },
  {
    id: 'proto_7',
    title: 'بروتوكول رعاية وإقفال القساطر والوصلات الوعائية (Vascular Access & CVC Locking Protocol)',
    category: 'vascular_access',
    categoryLabel: 'الوصلات والقساطر الوريدية',
    targetPatients: 'مرضى الغسل الكلوي الذين يغسلون عبر قسطرة وريدية مركزية (Permacath / Temporary CVC) أو وصلة شريانية وريدية (AVF / AVG).',
    indications: 'منع تجلط القسطرة والحفاظ على سالكيتها ومنع تجرثم الدم المميت المرتبط بالقساطر (CRBSI).',
    durationHours: 'إجراءات ما قبل وما بعد كل جلسة غسل',
    bloodFlowRate: '≥ 300 ml/min للقسطرة الدائمة و ≥ 350 ml/min للناسور الشرياني الطبيعي',
    dialysateFlowRate: 'معياري',
    dialyzerType: 'معياري',
    anticoagulation: 'إقفال محدد بتركيز الهيبارين داخل القسطرة',
    dialysateComposition: 'معياري',
    ultrafiltrationGoal: 'معياري',
    clinicalSteps: [
      'إجراءات الفتح المعقمة: ارتداء ماسك وقفازات معقمة، مسح المحابس بـ Chlorhexidine 2% لمدة 30 ثانية وتركها لتجف.',
      'سحب قفل الهيبارين القديم بالكامل (3-5 ml من كل مأخذ) والتخلص منه في سلة النفايات (يمنع دفعه للمريض).',
      'فحص السريان السهل عبر سحب 10 ml دم بسرعة ثم غسل كل طرف بـ 10 ml Normal Saline.',
      'في نهاية الجلسة: غسل كل مأخذ بـ 10 ml سالاين ثم حقن حجم القفل الدقيق (Heparin Lock: 5000 IU/ml أو Taurolidine-Citrate) حسب الحجم المطبوع بدقة على كل خط.',
      'في حالات الناسور (AV Fistula): استخدام تقنية Buttonhole أو Rope-ladder لتدوير مواقع الوخز ومنع تمدد الأوعية الدموية (Aneurysm).'
    ],
    precautions: [
      'إذا كانت القسطرة مسدودة بالخثرة، يمنع الدفع بالقوة تجنباً لانفصال الجلطة وانتقالها للرئة (Pulmonary Embolism). يُستخدم مذيب التخثر Alteplase (rtPA 2mg) ويترك داخل القسطرة لساعتين.',
      'يمنع قياس الضغط أو سحب الدم أو تركيب كانيولا في الذراع التي تحوي ناسوراً شريانياً وريدياً (AV Fistula).'
    ],
    kdigoCitation: 'KDOQI Clinical Practice Guideline for Vascular Access: 2020 Update.'
  },
  {
    id: 'proto_8',
    title: 'بروتوكول فقر الدم ونقص الحديد والإريثروبويتين (Anemia & ESA/Iron Protocol in Hemodialysis)',
    category: 'anemia_mineral',
    categoryLabel: 'فقر الدم والحديد وEPO',
    targetPatients: 'مرضى الفشل الكلوي المزمن الخاضعين للغسل ولديهم فقر دم كلوي (Hb < 10 g/dL).',
    indications: 'الحفاظ على خضاب الدم في المجال المستهدف الآمن (Hb 10.0 - 11.5 g/dL) دون تجاوز 12 g/dL لتجنب الخثار والسكتات الدماغية.',
    durationHours: 'إعطاء دوري مع نهاية جلسات الغسل',
    bloodFlowRate: 'معياري',
    dialysateFlowRate: 'معياري',
    dialyzerType: 'High-flux',
    anticoagulation: 'معياري',
    dialysateComposition: 'معياري',
    ultrafiltrationGoal: 'معياري',
    clinicalSteps: [
      'فحص مخازن الحديد أولاً: الفيريتين Ferritin (الهدف 200 - 500 ng/mL) وتشبع الترانسفيرين TSAT (الهدف 20 - 30%).',
      'علاج نقص الحديد وريدياً أولاً: يُعطى Iron Sucrose 100 mg IV بطيئاً في الخط الوريدي نهاية كل جلسة حتى استكمال 1000 mg (10 جرعات).',
      'بدء محفزات تكوين الكريات الحمر (Erythropoietin - EPO): Epoetin alfa 50-100 U/kg وريدياً 3 مرات أسبوعياً، أو Mircera (Methoxy polyethylene glycol-epoetin beta) شهرياً.',
      'متابعة الهيموغلوبين كل أسبوعين إلى 4 أسابيع لتعديل الجرعة بنسبة 25% صعوداً أو هبوطاً.',
      'إذا ارتفع الـ Hb بأكثر من 1.0 g/dL خلال أسبوعين: خفض جرعة الـ EPO بنسبة 25-50% لتجنب التخثر.'
    ],
    precautions: [
      'لا يُعطى محفز الإريثروبويتين (EPO) إذا كان خضاب الدم Hb ≥ 11.5 g/dL لتفادي زيادة معدلات الجلطات القلبية والدماغية وارتفاع ضغط الدم الخبيث.',
      'يوقف الحديد الوريدي أثناء الإنتانات الدموية الحادة والحمى.'
    ],
    kdigoCitation: 'KDIGO Clinical Practice Guideline for Anemia in Chronic Kidney Disease.'
  }
];
