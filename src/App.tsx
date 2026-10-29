import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmergencySection } from './components/EmergencySection';
import { WardSection } from './components/WardSection';
import { HemodialysisSection } from './components/HemodialysisSection';
import { DischargedSection } from './components/DischargedSection';
import { PediatricCalculatorSection } from './components/PediatricCalculatorSection';
import { EmergencyDrugsSection } from './components/EmergencyDrugsSection';
import { IraqiPharmacySection } from './components/IraqiPharmacySection';
import { ClinicalCalculators } from './components/ClinicalCalculators';
import { AIClinicalChatPanel } from './components/AIClinicalChatPanel';
import { AdminPanel } from './components/AdminPanel';

import { 
  EmergencyPatient, 
  WardPatient, 
  HemodialysisPatient, 
  DischargedPatient, 
  DepartmentType,
  ToolConfigItem,
  PediatricDrug,
  EmergencyDrug,
  IraqiDrug
} from './types/clinical';

import { PEDIATRIC_DRUGS_DATA } from './data/pediatricDrugsData';
import { EMERGENCY_DRUGS_DATA } from './data/emergencyDrugsData';
import { IRAQI_PHARMACY_DRUGS_DATA } from './data/iraqiPharmacyData';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default function App() {
  // 1. Sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('tab-er-triage');

  // 2. Tools Config State (persisted in localStorage)
  const [toolsConfig, setToolsConfig] = useState<ToolConfigItem[]>(() => {
    const saved = localStorage.getItem('md_tools_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'tab-er-triage', title: 'فرز وإدارة مرضى الطوارئ (ESI Triage)', icon: 'fa-truck-medical', visible: true },
      { id: 'tab-ward-patients', title: 'سجلات مرضى الردهات والأقسام', icon: 'fa-bed-pulse', visible: true },
      { id: 'tab-hd-patients', title: 'وحدة الغسل الكلوي (Hemodialysis)', icon: 'fa-droplet', visible: true },
      { id: 'tab-discharged', title: 'الحالات التي تم تخريجها (أرشيف شهر)', icon: 'fa-archive', visible: true },
      { id: 'tab-peds', title: 'حاسبة ودليل جرعات الأطفال بالوزن', icon: 'fa-baby', visible: true },
      { id: 'tab-er-drugs', title: 'دليل أدوية الطوارئ المصنف', icon: 'fa-pills', visible: true },
      { id: 'tab-iraqi-rx', title: 'صيدلية العراق الشاملة (Iraqi Rx)', icon: 'fa-prescription-bottle-medical', visible: true },
      { id: 'tab-actilyse', title: 'موانع مذيب التخثر أكتيليز (rtPA)', icon: 'fa-ban', visible: true },
      { id: 'tab-head-ct', title: 'معايير مفراس الرأس الكندية (CT Brain)', icon: 'fa-x-ray', visible: true },
      { id: 'tab-gcs', title: 'مقياس كلاسكو للغيبوبة (GCS)', icon: 'fa-brain', visible: true },
      { id: 'tab-heart', title: 'مقياس HEART Score لآلام الصدر', icon: 'fa-heart-pulse', visible: true },
      { id: 'tab-admin', title: 'لوحة الإدارة والتحكم (محمية بباسورد)', icon: 'fa-lock', visible: true },
    ];
  });

  // 3. System Config & Password
  const [wardTitle, setWardTitle] = useState(() => localStorage.getItem('md_ward_title') || 'منظومة الطبيب الذكي الشاملة');
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('md_admin_password') || localStorage.getItem('md_admin_pin') || 'admin123';
  });

  const [bannerConfig, setBannerConfig] = useState(() => {
    return {
      active: localStorage.getItem('md_banner_active') !== 'false',
      text: localStorage.getItem('md_banner_text') || 'تنبيه مناوبة عامة: يرجى التحقق من أجهزة الإنعاش ومطابقة الفرز الفوري للمرضى.',
      type: localStorage.getItem('md_banner_type') || 'banner-warning',
    };
  });

  // 4. AI Engine Settings
  const [isAiEnabled, setIsAiEnabled] = useState(() => localStorage.getItem('md_ai_enabled') !== 'false');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('md_gemini_key') || '');
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // 5. Dynamic Drug Formularies (Pediatric, Emergency, Iraqi Pharmacy)
  const [pediatricDrugs, setPediatricDrugs] = useState<PediatricDrug[]>(() => {
    const saved = localStorage.getItem('md_peds_drugs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PEDIATRIC_DRUGS_DATA;
  });

  const [emergencyDrugs, setEmergencyDrugs] = useState<EmergencyDrug[]>(() => {
    const saved = localStorage.getItem('md_er_drugs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return EMERGENCY_DRUGS_DATA;
  });

  const [iraqiDrugs, setIraqiDrugs] = useState<IraqiDrug[]>(() => {
    const saved = localStorage.getItem('md_iraqi_rx');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return IRAQI_PHARMACY_DRUGS_DATA;
  });

  // 6. Emergency Patients
  const [erPatients, setErPatients] = useState<EmergencyPatient[]>(() => {
    const saved = localStorage.getItem('md_triage_patients');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'er_101',
        name: 'حسين علي مهدي',
        age: 58,
        cc: 'ألم عاصر خلف القص مع تعرق بارد وضيق تنفس حاد بدأ قبل 30 دقيقة',
        triageLevel: 1,
        triageTitle: 'المستوى 1: إنعاش فوري مهدد للحياة',
        badgeClass: 'bg-red-100 text-red-800 border-red-300',
        rationale: 'هبوط ضغط شرياني حرج، ألم صدري إقفاري مهدد للحياة، ونقص أكسجة حاد.',
        action: 'تخطيط قلب خلال 5 دقائق، أكسجين عالي التدفق، تركيب كانيولتين 16G، وتجهيز قسطرة قلبية فورية.',
        bp: '85/55',
        hr: 118,
        rr: 26,
        spo2: 90,
        gcs: 15,
        pain: 9,
        redflags: 'chest_stemi',
        entryTime: '14:05',
        vitalsHistory: [
          { timestamp: '14:20', bp: '105/65', hr: 96, rr: 20, spo2: 95, gcs: 15, pain: 6, note: 'بعد بولس ملحي ونيتروجلسرين' },
          { timestamp: '14:05', bp: '85/55', hr: 118, rr: 26, spo2: 90, gcs: 15, pain: 9, note: 'عند الدخول' }
        ],
        administeredMeds: [
          { id: 'm_1', name: 'Aspirin chewable', dose: '300 mg', route: 'Oral', time: '14:08', givenBy: 'ممرض الطوارئ' },
          { id: 'm_2', name: 'Clopidogrel (Plavix)', dose: '300 mg', route: 'Oral', time: '14:10', givenBy: 'ممرض الطوارئ' },
          { id: 'm_3', name: 'Normal Saline 0.9%', dose: '500 ml IV', route: 'IV Push', time: '14:12', givenBy: 'طبيب الطوارئ' },
        ],
        notes: 'الاشتباه عالي بجلطة تاجية حادة STEMI في الجدار السفلي.',
        status: 'active'
      },
      {
        id: 'er_102',
        name: 'زينب جواد كاظم',
        age: 34,
        cc: 'نوبة ربو حادة شديدة وصفير صدري مسموع مع عسرة نطق الجمل',
        triageLevel: 2,
        triageTitle: 'المستوى 2: طارئ حرج (< 15 دقيقة)',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
        rationale: 'تسرع تنفسي حاد، انخفاض الأكسجين إلى 89%، وعلامات إجهاد عضلات التنفس الإضافية.',
        action: 'جلسات رذاذ فنتولين مع أتروفنت بالأكسجين، كورتيزون وريدي، وإعادة تقييم فوري.',
        bp: '135/85',
        hr: 112,
        rr: 28,
        spo2: 89,
        gcs: 15,
        pain: 5,
        entryTime: '14:25',
        vitalsHistory: [
          { timestamp: '14:25', bp: '135/85', hr: 112, rr: 28, spo2: 89, gcs: 15, pain: 5, note: 'عند الوصول' }
        ],
        administeredMeds: [
          { id: 'm_4', name: 'Salbutamol + Atrovent Neb', dose: '5 mg + 0.5 mg', route: 'Nebulizer', time: '14:28', givenBy: 'كادر التنفسية' },
          { id: 'm_5', name: 'Hydrocortisone IV', dose: '100 mg', route: 'IV', time: '14:30', givenBy: 'طبيب الطوارئ' }
        ],
        status: 'active'
      }
    ];
  });

  // 7. Ward Patients
  const [wardPatients, setWardPatients] = useState<WardPatient[]>(() => {
    const saved = localStorage.getItem('md_patients');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ward_201',
        name: 'أمير حيدر العبيدي',
        doctor: 'د. أسامة الربيعي',
        bed: 'سرير 4 (باطنية)',
        age: 62,
        cc: 'ألم بطني مع غثيان وضيق تنفس خفيف',
        diagnosis: 'التهاب مرارة حاد مع تاريخ ربو قصبي وذبحة مستقرة',
        pmhx: 'ربو قصبي مزمن (Bronchial Asthma), داء السكري النوع الثاني',
        pshx: 'لا توجد',
        bp: '130/80',
        pulse: 88,
        spo2: 96,
        temp: '38.4',
        medications: 'Ceftriaxone 1g IV q12h, Propranolol 40mg bid, Paracetamol 1g IV, Warfarin 5mg nocte, Brufen 400mg tid',
        notes: 'ملاحظة: المريض لديه تاريخ ربو وموصوف له بروبرانولول وبروفين مع وارفارين!',
        entryTime: 'أمس 18:30',
        status: 'active'
      },
      {
        id: 'ward_202',
        name: 'مريم صادق البغدادي',
        doctor: 'د. فاطمة الهاشمي',
        bed: 'سرير 9 (جراحة)',
        age: 48,
        cc: 'متابعة بعد عملية استئصال الزائدة الدودية',
        diagnosis: 'Post-Appendectomy Recovery',
        pmhx: 'لا توجد سوابق مرضية',
        pshx: 'Appendectomy',
        bp: '118/75',
        pulse: 74,
        spo2: 99,
        temp: '37.1',
        medications: 'Cefotaxime 1g IV q8h, Paracetamol 1g IV PRN, Metronidazole 500mg IV q8h',
        notes: 'الجرح نظيف والمريضة بدأت بتناول السوائل الفموية.',
        entryTime: 'اليوم 09:15',
        status: 'active'
      }
    ];
  });

  // 8. Hemodialysis Patients
  const [hdPatients, setHdPatients] = useState<HemodialysisPatient[]>(() => {
    const saved = localStorage.getItem('md_hd_patients_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'hd_301',
        name: 'عبد الجبار كاظم',
        schedule: 'السبت - الاثنين - الأربعاء (صباحي)',
        access: 'AV Fistula (شرياني وريدي طبيعي)',
        dryWeight: 70.0,
        preWeight: 74.8,
        bp: '175/100',
        k: 6.7,
        urea: 165,
        cr: 9.8,
        hb: 9.2,
        ca: 8.6,
        po4: 6.4,
        aiDecision: 'Urgent Membrane Stabilization',
        aiAdvice: 'خطر فرط بوتاسيوم مميت (6.7 mmol/L)! إعطاء Calcium Gluconate 10% IV فوراً لحماية القلب، واستخدام حمام غسل 1K.',
        status: 'active'
      }
    ];
  });

  // 9. Discharged Patients Archive (Auto 1-month purge)
  const [dischargedPatients, setDischargedPatients] = useState<DischargedPatient[]>(() => {
    const saved = localStorage.getItem('md_discharged_patients');
    if (saved) {
      try {
        const parsed: DischargedPatient[] = JSON.parse(saved);
        const now = Date.now();
        return parsed
          .filter(p => now - p.dischargeTimestamp <= THIRTY_DAYS_MS)
          .map(p => {
            const elapsedDays = Math.floor((now - p.dischargeTimestamp) / (24 * 60 * 60 * 1000));
            return {
              ...p,
              daysRemaining: Math.max(0, 30 - elapsedDays),
            };
          });
      } catch (e) {}
    }
    return [];
  });

  // 10. Alteplase and CT Rules
  const [actilyseRules, setActilyseRules] = useState(() => {
    const saved = localStorage.getItem('md_actilyse_rules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      abs: [
        'نزيف داخل القحف / الدماغ حالي أو سابق مثبت في أي وقت مضى',
        'إصابة رأس شديدة أو رضح خطير أو جراحة دماغية/نخاعية خلال آخر 3 أشهر',
        'وجود نزيف داخلي نشط غير خاضع للضغط المباشر',
        'اشتباه سريري قوي بحدوث نزيف تحت العنكبوتية (Subarachnoid Hemorrhage)',
        'وجود ورم خبيث بالدماغ، أو تشوه شرياني وريدي (AVM) أو أم دم بالجمجمة',
        'ضغط دم حرج غير مستجيب: الانقباضي > 185 mmHg أو الانبساطي > 110 mmHg رغم الخوافض الوريدية السريعة',
        'عدد الصفائح الدموية أقل من 100,000 / mm³',
        'تناول مضادات التخثر الفموية الحديثة (NOACs) خلال 48 ساعة أو تحليل INR > 1.7'
      ],
      rel: [
        'أعراض السكتة الدماغية طفيفة جداً أو تتحسن سريعاً وتلقائياً',
        'جراحة كبرى أو رضح جسدي خطير خلال آخر 14 يوماً',
        'نزيف في الجهاز الهضمي أو البولي خلال آخر 21 يوماً',
        'نوبة تشنج صرعي تزامنت مع بداية ظهور أعراض السكتة',
        'الحمل أو الولادة الحديثة (أقل من أسبوعين)'
      ]
    };
  });

  const [ctRules, setCtRules] = useState(() => {
    const saved = localStorage.getItem('md_ct_rules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      high: [
        'مقياس كلاسكو GCS أقل من 15 بعد ساعتين من وقت الإصابة',
        'اشتباه سريري بكسر منخسف أو مفتوح في عظام الجمجمة',
        'أي علامة سريرية لكسر قاعدة الجمجمة (عيون الراكون، علامة باتل خلف الأذن، سيلان دم أو سائل نخاعي)',
        'حدوث نوبتين أو أكثر من التقيؤ الصريح المقذوف',
        'عمر المصاب 65 سنة فما فوق'
      ],
      med: [
        'فقدان الذاكرة للأحداث التي سبقت الإصابة (Retrograde Amnesia) لأكثر من 30 دقيقة',
        'آلية إصابة شديدة العنف: دهس مشاة، قذف المصاب خارج المركبة، أو السقوط من ارتفاع يفوق 3 أقدام'
      ]
    };
  });

  // Persistent synchronizations
  useEffect(() => {
    localStorage.setItem('md_triage_patients', JSON.stringify(erPatients));
  }, [erPatients]);

  useEffect(() => {
    localStorage.setItem('md_patients', JSON.stringify(wardPatients));
  }, [wardPatients]);

  useEffect(() => {
    localStorage.setItem('md_hd_patients_list', JSON.stringify(hdPatients));
  }, [hdPatients]);

  useEffect(() => {
    localStorage.setItem('md_discharged_patients', JSON.stringify(dischargedPatients));
  }, [dischargedPatients]);

  useEffect(() => {
    localStorage.setItem('md_tools_config', JSON.stringify(toolsConfig));
  }, [toolsConfig]);

  useEffect(() => {
    localStorage.setItem('md_actilyse_rules', JSON.stringify(actilyseRules));
  }, [actilyseRules]);

  useEffect(() => {
    localStorage.setItem('md_ct_rules', JSON.stringify(ctRules));
  }, [ctRules]);

  useEffect(() => {
    localStorage.setItem('md_admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem('md_ward_title', wardTitle);
  }, [wardTitle]);

  useEffect(() => {
    localStorage.setItem('md_ai_enabled', isAiEnabled ? 'true' : 'false');
  }, [isAiEnabled]);

  useEffect(() => {
    localStorage.setItem('md_gemini_key', geminiApiKey);
  }, [geminiApiKey]);

  useEffect(() => {
    localStorage.setItem('md_peds_drugs', JSON.stringify(pediatricDrugs));
  }, [pediatricDrugs]);

  useEffect(() => {
    localStorage.setItem('md_er_drugs', JSON.stringify(emergencyDrugs));
  }, [emergencyDrugs]);

  useEffect(() => {
    localStorage.setItem('md_iraqi_rx', JSON.stringify(iraqiDrugs));
  }, [iraqiDrugs]);

  // Drug Handlers
  const handleAddPediatricDrug = (drug: PediatricDrug) => {
    setPediatricDrugs(prev => [drug, ...prev]);
  };

  const handleUpdatePediatricDrug = (updated: PediatricDrug) => {
    setPediatricDrugs(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleDeletePediatricDrug = (id: string) => {
    setPediatricDrugs(prev => prev.filter(d => d.id !== id));
  };

  const handleAddEmergencyDrug = (drug: EmergencyDrug) => {
    setEmergencyDrugs(prev => [drug, ...prev]);
  };

  const handleUpdateEmergencyDrug = (updated: EmergencyDrug) => {
    setEmergencyDrugs(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleDeleteEmergencyDrug = (id: string) => {
    setEmergencyDrugs(prev => prev.filter(d => d.id !== id));
  };

  const handleAddIraqiDrug = (drug: IraqiDrug) => {
    setIraqiDrugs(prev => [drug, ...prev]);
  };

  const handleUpdateIraqiDrug = (updated: IraqiDrug) => {
    setIraqiDrugs(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleDeleteIraqiDrug = (id: string) => {
    setIraqiDrugs(prev => prev.filter(d => d.id !== id));
  };

  // Quick Add Patient
  const handleQuickAdd = (name: string, dept: DepartmentType) => {
    if (!name.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    if (dept === 'طوارئ') {
      const newEr: EmergencyPatient = {
        id: 'er_' + Date.now(),
        name: name.trim(),
        age: 35,
        cc: 'فحص وتقييم طوارئ عام',
        triageLevel: 3,
        triageTitle: 'المستوى 3: حاد ومستقر',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        rationale: 'إدخال سريع بالاسم؛ يتطلب استكمال الفعاليات الحيوية والتقييم السريري.',
        action: 'قياس الفعاليات الحيوية، وأخذ القصة السريرية.',
        bp: '120/80',
        hr: 80,
        rr: 18,
        spo2: 98,
        gcs: 15,
        pain: 2,
        entryTime: timeStr,
        vitalsHistory: [
          { timestamp: timeStr, bp: '120/80', hr: 80, rr: 18, spo2: 98, gcs: 15, pain: 2, note: 'تسجيل دخول سريع' }
        ],
        administeredMeds: [],
        status: 'active'
      };
      setErPatients(prev => [newEr, ...prev]);
      setActiveTab('tab-er-triage');
      alert(`تمت إضافة المريض (${name}) إلى قسم الطوارئ بنجاح!`);
    } else if (dept === 'ردهات') {
      const newWard: WardPatient = {
        id: 'ward_' + Date.now(),
        name: name.trim(),
        doctor: 'د. الطبيب المقيم',
        bed: `سرير ${wardPatients.length + 1}`,
        age: 45,
        cc: 'تنويم ومتابعة سريرية',
        diagnosis: 'قيد التقييم والفحوصات',
        pmhx: 'لا توجد سوابق مسجلة بعد',
        pshx: 'لا توجد',
        bp: '120/80',
        pulse: 78,
        spo2: 98,
        temp: '37.0',
        medications: '',
        notes: 'تسجيل سريع بالاسم، قيد استكمال الملف السريري.',
        entryTime: timeStr,
        status: 'active'
      };
      setWardPatients(prev => [newWard, ...prev]);
      setActiveTab('tab-ward-patients');
      alert(`تمت إضافة المريض (${name}) إلى الردهات بنجاح!`);
    } else {
      const newHd: HemodialysisPatient = {
        id: 'hd_' + Date.now(),
        name: name.trim(),
        schedule: 'السبت - الاثنين - الأربعاء (صباحي)',
        access: 'AV Fistula (شرياني وريدي طبيعي)',
        dryWeight: 70.0,
        preWeight: 73.0,
        bp: '150/90',
        k: 5.5,
        urea: 120,
        cr: 7.5,
        hb: 10.0,
        ca: 9.0,
        po4: 5.0,
        aiDecision: 'Proceed Standard Protocol',
        aiAdvice: 'المؤشرات ملائمة لجلسة الغسل، سحب السوائل المقدر 3 لتر.',
        status: 'active'
      };
      setHdPatients(prev => [newHd, ...prev]);
      setActiveTab('tab-hd-patients');
      alert(`تمت إضافة المريض (${name}) إلى وحدة الغسل الكلوي بنجاح!`);
    }
  };

  // Discharge patient and archive for 30 days
  const handleDischargePatient = (
    patientObj: EmergencyPatient | WardPatient | HemodialysisPatient,
    summaryNotes: string,
    condition: string
  ) => {
    const now = Date.now();
    const dateStr = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    let dept: DepartmentType = 'طوارئ';
    let diag = 'استقرار الحالة';

    if ('triageLevel' in patientObj) {
      dept = 'طوارئ';
      diag = patientObj.cc;
      setErPatients(prev => prev.filter(p => p.id !== patientObj.id));
    } else if ('doctor' in patientObj) {
      dept = 'ردهات';
      diag = patientObj.diagnosis;
      setWardPatients(prev => prev.filter(p => p.id !== patientObj.id));
    } else if ('dryWeight' in patientObj) {
      dept = 'غسل كلوي';
      diag = 'انتهاء جلسة الغسل الكلوي بنجاح';
      setHdPatients(prev => prev.filter(p => p.id !== patientObj.id));
    }

    const dischargedRecord: DischargedPatient = {
      id: 'dis_' + Date.now(),
      patientName: patientObj.name,
      department: dept,
      departmentLabel: dept,
      dischargedAt: dateStr,
      dischargeTimestamp: now,
      expiryTimestamp: now + THIRTY_DAYS_MS,
      daysRemaining: 30,
      finalDiagnosis: diag,
      dischargeCondition: condition,
      summaryNotes,
      originalRecord: patientObj,
    };

    setDischargedPatients(prev => [dischargedRecord, ...prev]);
    alert(`تم تخريج المريض (${patientObj.name}) بنجاح ونقله إلى قائمة الحالات المخرجة. سيتم حذف اسمه تلقائياً بعد مرور شهر.`);
  };

  // Restore discharged patient
  const handleRestoreDischarged = (p: DischargedPatient) => {
    if (p.department === 'طوارئ') {
      const orig = p.originalRecord as EmergencyPatient;
      setErPatients(prev => [{ ...orig, id: 'er_' + Date.now(), status: 'active' }, ...prev]);
      setActiveTab('tab-er-triage');
    } else if (p.department === 'ردهات') {
      const orig = p.originalRecord as WardPatient;
      setWardPatients(prev => [{ ...orig, id: 'ward_' + Date.now(), status: 'active' }, ...prev]);
      setActiveTab('tab-ward-patients');
    } else {
      const orig = p.originalRecord as HemodialysisPatient;
      setHdPatients(prev => [{ ...orig, id: 'hd_' + Date.now(), status: 'active' }, ...prev]);
      setActiveTab('tab-hd-patients');
    }

    setDischargedPatients(prev => prev.filter(x => x.id !== p.id));
    alert(`تمت استعادة المريض (${p.patientName}) بنجاح إلى قسم ${p.department}!`);
  };

  // Wipe data handler
  const handleWipeData = (type: 'ward' | 'triage' | 'dialysis' | 'discharged' | 'all') => {
    if (type === 'ward') {
      setWardPatients([]);
      localStorage.removeItem('md_patients');
    } else if (type === 'triage') {
      setErPatients([]);
      localStorage.removeItem('md_triage_patients');
    } else if (type === 'dialysis') {
      setHdPatients([]);
      localStorage.removeItem('md_hd_patients_list');
    } else if (type === 'discharged') {
      setDischargedPatients([]);
      localStorage.removeItem('md_discharged_patients');
    } else if (type === 'all') {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Tajawal',sans-serif] text-slate-900 selection:bg-sky-500 selection:text-white" dir="rtl">
      
      {/* Top Header */}
      <Header
        wardTitle={wardTitle}
        aiStatus={geminiApiKey ? 'الذكاء السريري (Gemini API) نشط' : 'الذكاء السريري الداخلي نشط'}
        isAiEnabled={isAiEnabled}
        dischargedCount={dischargedPatients.length}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onQuickAddPatient={(name, dept) => handleQuickAdd(name, dept)}
        onNavigateToDischarged={() => setActiveTab('tab-discharged')}
        bannerConfig={bannerConfig}
        onDismissBanner={() => setBannerConfig(prev => ({ ...prev, active: false }))}
      />

      {/* Dynamic Slide-over Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        toolsConfig={toolsConfig}
        triageCount={erPatients.filter(p => p.status !== 'discharged').length}
        wardCount={wardPatients.filter(p => p.status !== 'discharged').length}
        hdCount={hdPatients.filter(p => p.status !== 'discharged').length}
        dischargedCount={dischargedPatients.length}
      />

      {/* Main Clinical Work Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {/* 1. ER TRIAGE & EMERGENCY PATIENTS */}
        {activeTab === 'tab-er-triage' && (
          <EmergencySection
            patients={erPatients}
            onAddPatient={(pData) => {
              const now = new Date();
              const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
              const newP: EmergencyPatient = {
                ...pData,
                id: 'er_' + Date.now(),
                entryTime: timeStr,
                status: 'active',
                vitalsHistory: [
                  { timestamp: timeStr, bp: pData.bp, hr: pData.hr, rr: pData.rr, spo2: pData.spo2, gcs: pData.gcs, pain: pData.pain, note: 'وقت الدخول' }
                ],
                administeredMeds: [],
              };
              setErPatients(prev => [newP, ...prev]);
            }}
            onUpdatePatient={(updated) => {
              setErPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
            }}
            onDischargePatient={(p, summary, condition) => handleDischargePatient(p, summary, condition)}
            onQuickAdd={(name) => handleQuickAdd(name, 'طوارئ')}
            pediatricDrugs={pediatricDrugs}
            emergencyDrugs={emergencyDrugs}
            iraqiDrugs={iraqiDrugs}
          />
        )}

        {/* 2. WARD INPATIENTS */}
        {activeTab === 'tab-ward-patients' && (
          <WardSection
            patients={wardPatients}
            onAddPatient={(pData) => {
              const now = new Date();
              const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
              const newP: WardPatient = {
                ...pData,
                id: 'ward_' + Date.now(),
                entryTime: timeStr,
                status: 'active',
              };
              setWardPatients(prev => [newP, ...prev]);
            }}
            onUpdatePatient={(updated) => {
              setWardPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
            }}
            onDischargePatient={(p, summary, condition) => handleDischargePatient(p, summary, condition)}
            onQuickAdd={(name) => handleQuickAdd(name, 'ردهات')}
            onTriggerFullWardAudit={() => setIsAiChatOpen(true)}
            pediatricDrugs={pediatricDrugs}
            emergencyDrugs={emergencyDrugs}
            iraqiDrugs={iraqiDrugs}
          />
        )}

        {/* 3. HEMODIALYSIS UNIT */}
        {activeTab === 'tab-hd-patients' && (
          <HemodialysisSection
            patients={hdPatients}
            onAddPatient={(pData) => {
              const newP: HemodialysisPatient = {
                ...pData,
                id: 'hd_' + Date.now(),
                status: 'active',
              };
              setHdPatients(prev => [newP, ...prev]);
            }}
            onUpdatePatient={(updated) => {
              setHdPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
            }}
            onDischargePatient={(p, summary, condition) => handleDischargePatient(p, summary, condition)}
            onQuickAdd={(name) => handleQuickAdd(name, 'غسل كلوي')}
          />
        )}

        {/* 4. DISCHARGED CASES ARCHIVE (30-DAY AUTO PURGE) */}
        {activeTab === 'tab-discharged' && (
          <DischargedSection
            dischargedPatients={dischargedPatients}
            onRestorePatient={handleRestoreDischarged}
            onDeletePatientPermanent={(id) => {
              setDischargedPatients(prev => prev.filter(x => x.id !== id));
            }}
            onClearOldDischarged={() => {
              const now = Date.now();
              setDischargedPatients(prev => prev.filter(p => now - p.dischargeTimestamp <= THIRTY_DAYS_MS));
            }}
          />
        )}

        {/* 5. PEDIATRIC DOSE CALCULATOR (USES DYNAMIC DRUGS LIST) */}
        {activeTab === 'tab-peds' && (
          <PediatricCalculatorSection drugs={pediatricDrugs} />
        )}

        {/* 6. EMERGENCY DRUGS (USES DYNAMIC DRUGS LIST) */}
        {activeTab === 'tab-er-drugs' && (
          <EmergencyDrugsSection drugs={emergencyDrugs} />
        )}

        {/* 7. IRAQI PHARMACY FORMULARY (USES DYNAMIC DRUGS LIST) */}
        {activeTab === 'tab-iraqi-rx' && (
          <IraqiPharmacySection drugs={iraqiDrugs} />
        )}

        {/* 8. CLINICAL CALCULATORS (ACTILYSE, CT, GCS, HEART) */}
        {(activeTab === 'tab-actilyse' || activeTab === 'tab-head-ct' || activeTab === 'tab-gcs' || activeTab === 'tab-heart') && (
          <ClinicalCalculators
            activeTab={activeTab as any}
            actilyseRules={actilyseRules}
            ctRules={ctRules}
          />
        )}

        {/* 9. ADMIN PANEL (FULL PASSWORD & DRUG FORMULARY MANAGER) */}
        {activeTab === 'tab-admin' && (
          <AdminPanel
            toolsConfig={toolsConfig}
            onUpdateToolsConfig={(newCfg) => setToolsConfig(newCfg)}
            wardTitle={wardTitle}
            onUpdateWardTitle={(title) => setWardTitle(title)}
            bannerConfig={bannerConfig}
            onUpdateBannerConfig={(banner) => setBannerConfig(banner)}
            isAiEnabled={isAiEnabled}
            onToggleAi={(enabled) => setIsAiEnabled(enabled)}
            geminiApiKey={geminiApiKey}
            onUpdateGeminiApiKey={(key) => setGeminiApiKey(key)}
            actilyseRules={actilyseRules}
            onUpdateActilyseRules={(rules) => setActilyseRules(rules)}
            ctRules={ctRules}
            onUpdateCTRules={(rules) => setCtRules(rules)}
            onWipeData={handleWipeData}
            adminPassword={adminPassword}
            onUpdateAdminPassword={(pass) => setAdminPassword(pass)}
            pediatricDrugs={pediatricDrugs}
            onAddPediatricDrug={handleAddPediatricDrug}
            onUpdatePediatricDrug={handleUpdatePediatricDrug}
            onDeletePediatricDrug={handleDeletePediatricDrug}
            emergencyDrugs={emergencyDrugs}
            onAddEmergencyDrug={handleAddEmergencyDrug}
            onUpdateEmergencyDrug={handleUpdateEmergencyDrug}
            onDeleteEmergencyDrug={handleDeleteEmergencyDrug}
            iraqiDrugs={iraqiDrugs}
            onAddIraqiDrug={handleAddIraqiDrug}
            onUpdateIraqiDrug={handleUpdateIraqiDrug}
            onDeleteIraqiDrug={handleDeleteIraqiDrug}
          />
        )}

      </main>

      {/* Floating AI Consultant Chat Panel */}
      <AIClinicalChatPanel
        isOpen={isAiChatOpen}
        onToggle={() => setIsAiChatOpen(prev => !prev)}
        isAiEnabled={isAiEnabled}
        geminiApiKey={geminiApiKey}
        erPatients={erPatients}
        wardPatients={wardPatients}
        hdPatients={hdPatients}
      />

    </div>
  );
}
