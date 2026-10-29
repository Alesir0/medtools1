import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Settings, 
  Megaphone, 
  Palette, 
  Bot, 
  Ban, 
  Scan, 
  Trash2, 
  Key, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Pill,
  Plus,
  Search,
  Baby,
  FileText,
  Activity,
  Syringe,
  Building2,
  ShieldCheck,
  Edit3,
  X
} from 'lucide-react';
import { 
  ToolConfigItem, 
  PediatricDrug, 
  EmergencyDrug, 
  IraqiDrug, 
  EmergencyCategoryKey,
  IraqiPharmacyCategoryKey 
} from '../types/clinical';

interface AdminPanelProps {
  toolsConfig: ToolConfigItem[];
  onUpdateToolsConfig: (newConfig: ToolConfigItem[]) => void;
  wardTitle: string;
  onUpdateWardTitle: (title: string) => void;
  bannerConfig: { active: boolean; text: string; type: string };
  onUpdateBannerConfig: (banner: { active: boolean; text: string; type: string }) => void;
  isAiEnabled: boolean;
  onToggleAi: (enabled: boolean) => void;
  geminiApiKey: string;
  onUpdateGeminiApiKey: (key: string) => void;
  actilyseRules: { abs: string[]; rel: string[] };
  onUpdateActilyseRules: (rules: { abs: string[]; rel: string[] }) => void;
  ctRules: { high: string[]; med: string[] };
  onUpdateCTRules: (rules: { high: string[]; med: string[] }) => void;
  onWipeData: (type: 'ward' | 'triage' | 'dialysis' | 'discharged' | 'all') => void;
  adminPassword: string;
  onUpdateAdminPassword: (newPass: string) => void;
  // Dynamic drug lists and handlers
  pediatricDrugs: PediatricDrug[];
  onAddPediatricDrug: (drug: PediatricDrug) => void;
  onUpdatePediatricDrug: (drug: PediatricDrug) => void;
  onDeletePediatricDrug: (id: string) => void;
  emergencyDrugs: EmergencyDrug[];
  onAddEmergencyDrug: (drug: EmergencyDrug) => void;
  onUpdateEmergencyDrug: (drug: EmergencyDrug) => void;
  onDeleteEmergencyDrug: (id: string) => void;
  iraqiDrugs: IraqiDrug[];
  onAddIraqiDrug: (drug: IraqiDrug) => void;
  onUpdateIraqiDrug: (drug: IraqiDrug) => void;
  onDeleteIraqiDrug: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  toolsConfig,
  onUpdateToolsConfig,
  wardTitle,
  onUpdateWardTitle,
  bannerConfig,
  onUpdateBannerConfig,
  isAiEnabled,
  onToggleAi,
  geminiApiKey,
  onUpdateGeminiApiKey,
  actilyseRules,
  onUpdateActilyseRules,
  ctRules,
  onUpdateCTRules,
  onWipeData,
  adminPassword,
  onUpdateAdminPassword,
  pediatricDrugs,
  onAddPediatricDrug,
  onUpdatePediatricDrug,
  onDeletePediatricDrug,
  emergencyDrugs,
  onAddEmergencyDrug,
  onUpdateEmergencyDrug,
  onDeleteEmergencyDrug,
  iraqiDrugs,
  onAddIraqiDrug,
  onUpdateIraqiDrug,
  onDeleteIraqiDrug,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [activePane, setActivePane] = useState<'drugs' | 'banner' | 'tools' | 'ai' | 'actilyse' | 'ct' | 'wipe' | 'password'>('drugs');

  // Drug management sub-tab: peds | er | iraqi
  const [drugSection, setDrugSection] = useState<'peds' | 'er' | 'iraqi'>('peds');
  const [drugSearchTerm, setDrugSearchTerm] = useState('');

  // Drug editing states
  const [editingPedsDrug, setEditingPedsDrug] = useState<PediatricDrug | null>(null);
  const [editingErDrug, setEditingErDrug] = useState<EmergencyDrug | null>(null);
  const [editingIraqiDrug, setEditingIraqiDrug] = useState<IraqiDrug | null>(null);

  // Local Form States
  const [titleInput, setTitleInput] = useState(wardTitle);
  const [bText, setBText] = useState(bannerConfig.text);
  const [bType, setBType] = useState(bannerConfig.type);
  const [bActive, setBActive] = useState(bannerConfig.active);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);

  // New Rule inputs
  const [newActType, setNewActType] = useState<'abs' | 'rel'>('abs');
  const [newActText, setNewActText] = useState('');
  const [newCtType, setNewCtType] = useState<'high' | 'med'>('high');
  const [newCtText, setNewCtText] = useState('');

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);

  // ---------------------------------------------------------
  // New Drug Forms State
  // ---------------------------------------------------------
  // 1. Pediatric Drug Form State
  const [pedsName, setPedsName] = useState('');
  const [pedsGeneric, setPedsGeneric] = useState('');
  const [pedsCategoryKey, setPedsCategoryKey] = useState<PediatricDrug['categoryKey']>('antibiotic');
  const [pedsMgPerKg, setPedsMgPerKg] = useState<number>(20);
  const [pedsConcMg, setPedsConcMg] = useState<number>(250);
  const [pedsConcMl, setPedsConcMl] = useState<number>(5);
  const [pedsFrequency, setPedsFrequency] = useState('كل 8 ساعات');
  const [pedsMaxDose, setPedsMaxDose] = useState<number | ''>(1500);
  const [pedsRoute, setPedsRoute] = useState('فموي (Oral)');
  const [pedsIndications, setPedsIndications] = useState('');
  const [pedsContra, setPedsContra] = useState('');
  const [pedsCounseling, setPedsCounseling] = useState('');
  const [pedsEmergency, setPedsEmergency] = useState(false);

  // 2. Emergency Drug Form State
  const [erName, setErName] = useState('');
  const [erGeneric, setErGeneric] = useState('');
  const [erCategory, setErCategory] = useState<EmergencyCategoryKey>('resuscitation');
  const [erSummary, setErSummary] = useState('');
  const [erAdultDose, setErAdultDose] = useState('');
  const [erPediatricDose, setErPediatricDose] = useState('');
  const [erDilution, setErDilution] = useState('');
  const [erIndications, setErIndications] = useState('');
  const [erContra, setErContra] = useState('');
  const [erWarnings, setErWarnings] = useState('');

  // 3. Iraqi Pharmacy Drug Form State
  const [iqTradeName, setIqTradeName] = useState('');
  const [iqGenericName, setIqGenericName] = useState('');
  const [iqCategory, setIqCategory] = useState<IraqiPharmacyCategoryKey>('antibiotics');
  const [iqSector, setIqSector] = useState<'صيدليات أهلية (Private)' | 'كيماديا ومستشفيات (Kimadia)' | 'مشترك (Private & Kimadia)'>('مشترك (Private & Kimadia)');
  const [iqManufacturer, setIqManufacturer] = useState('');
  const [iqForms, setIqForms] = useState('');
  const [iqAdultDose, setIqAdultDose] = useState('');
  const [iqPediatricDose, setIqPediatricDose] = useState('');
  const [iqIndications, setIqIndications] = useState('');
  const [iqContra, setIqContra] = useState('');
  const [iqCounseling, setIqCounseling] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBannerConfig({
      active: bActive,
      text: bText.trim(),
      type: bType,
    });
    alert('تم حفظ إعدادات البنر التنبيهي بنجاح!');
  };

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    onUpdateWardTitle(titleInput.trim());
    alert('تم تحديث اسم الموقع بنجاح!');
  };

  const handleMoveTool = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= toolsConfig.length) return;
    const newConfig = [...toolsConfig];
    const temp = newConfig[index];
    newConfig[index] = newConfig[target];
    newConfig[target] = temp;
    onUpdateToolsConfig(newConfig);
  };

  const handleToggleToolVisibility = (index: number) => {
    const newConfig = [...toolsConfig];
    newConfig[index] = { ...newConfig[index], visible: !newConfig[index].visible };
    onUpdateToolsConfig(newConfig);
  };

  const handleAddActilyseRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActText.trim()) return;
    const updated = { ...actilyseRules };
    updated[newActType] = [...updated[newActType], newActText.trim()];
    onUpdateActilyseRules(updated);
    setNewActText('');
    alert('تمت إضافة المانع بنجاح!');
  };

  const handleDeleteActilyseRule = (type: 'abs' | 'rel', idx: number) => {
    const updated = { ...actilyseRules };
    updated[type] = updated[type].filter((_, i) => i !== idx);
    onUpdateActilyseRules(updated);
  };

  const handleAddCTRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCtText.trim()) return;
    const updated = { ...ctRules };
    updated[newCtType] = [...updated[newCtType], newCtText.trim()];
    onUpdateCTRules(updated);
    setNewCtText('');
    alert('تمت إضافة معيار المفراس بنجاح!');
  };

  const handleDeleteCTRule = (type: 'high' | 'med', idx: number) => {
    const updated = { ...ctRules };
    updated[type] = updated[type].filter((_, i) => i !== idx);
    onUpdateCTRules(updated);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPass !== adminPassword) {
      alert('كلمة المرور الحالية غير صحيحة!');
      return;
    }
    if (newPass.length < 4) {
      alert('يجب ألا تقل كلمة المرور الجديدة عن 4 خانات!');
      return;
    }
    if (newPass !== confirmPass) {
      alert('كلمة المرور الجديدة غير متطابقة في خانة التأكيد!');
      return;
    }
    onUpdateAdminPassword(newPass);
    alert('تم تغيير كلمة المرور (الباسورد) بنجاح!');
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  // ---------------------------------------------------------
  // Drug Submission Handlers
  // ---------------------------------------------------------
  const handleAddPedsDrugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pedsName.trim()) return;

    const categoryLabels: Record<string, string> = {
      antipyretic: 'خافضات الحرارة والمسكنات',
      antibiotic: 'المضادات الحيوية للأطفال',
      respiratory: 'الجهاز التنفسي والربو',
      anticonvulsant: 'مضادات التشنج والصرع',
      steroids: 'الستيرويدات ومضادات الالتهاب',
      allergy_resuscitation: 'الحساسية والإنعاش',
      fluids: 'السوائل والجفاف',
      gi_antiemetic: 'الجهاز الهضمي والقيء',
    };

    const newDrug: PediatricDrug = {
      id: 'peds_' + Date.now(),
      name: pedsName.trim(),
      genericName: pedsGeneric.trim() || pedsName.trim(),
      category: categoryLabels[pedsCategoryKey] || 'أدوية الأطفال',
      categoryKey: pedsCategoryKey,
      mgPerKg: Number(pedsMgPerKg),
      concMg: Number(pedsConcMg),
      concMl: Number(pedsConcMl),
      frequency: pedsFrequency.trim() || 'حسب إرشادات الطبيب',
      maxDoseMg: pedsMaxDose ? Number(pedsMaxDose) : undefined,
      route: pedsRoute,
      indications: pedsIndications.trim() || 'علاج سريري للأطفال',
      contraindications: pedsContra.trim() || 'فرط الحساسية للدواء',
      counseling: pedsCounseling.trim() || 'يرجى مراجعة الصيدلي للجرعة الدقيقة.',
      emergencyUse: pedsEmergency,
    };

    onAddPediatricDrug(newDrug);
    alert(`تمت إضافة دواء الأطفال (${pedsName}) بنجاح وهو متاح فوراً في الحاسبة!`);
    setPedsName('');
    setPedsGeneric('');
    setPedsIndications('');
    setPedsContra('');
    setPedsCounseling('');
  };

  const handleAddEmergencyDrugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!erName.trim()) return;

    const categoryLabels: Record<EmergencyCategoryKey, string> = {
      all: 'الكل',
      resuscitation: 'الإنعاش وتوقف القلب (ACLS)',
      shock: 'الصدمة والرافعات الوعائية (Inotropes)',
      cardiac: 'القلب واضطراب النظم (Cardio)',
      analgesia: 'المسكنات والمهدئات والتنبيب (RSI)',
      respiratory: 'الجهاز التنفسي والربو (Respiratory)',
      antidotes: 'الترياق وعلاج التسمم (Antidotes)',
      neuro: 'الأعصاب والتشنجات (Neuro)',
      bleeding: 'النزف والتخثر ومذيبات الجلطة (Bleeding/rtPA)',
    };

    const newDrug: EmergencyDrug = {
      id: 'er_' + Date.now(),
      name: erName.trim(),
      genericName: erGeneric.trim() || erName.trim(),
      category: erCategory,
      categoryLabel: categoryLabels[erCategory] || 'أدوية الطوارئ',
      summary: erSummary.trim() || erIndications.trim().substring(0, 100),
      indications: erIndications.trim() || 'دواعي طوارئ حرجة',
      adultDose: erAdultDose.trim() || 'جرعة إسعافية حسب البروتوكول',
      pediatricDose: erPediatricDose.trim() || undefined,
      dilution: erDilution.trim() || 'حسب تعليمات الشركة المصنعة',
      contraindications: erContra.trim() || 'لا توجد موانع في الحالات المهددة للحياة',
      warnings: erWarnings.trim() || 'مراقبة الفعاليات الحيوية وتخطيط القلب المستمر.',
    };

    onAddEmergencyDrug(newDrug);
    alert(`تمت إضافة دواء الطوارئ (${erName}) بنجاح وهو متاح فوراً في دليل الطوارئ!`);
    setErName('');
    setErGeneric('');
    setErSummary('');
    setErAdultDose('');
    setErPediatricDose('');
    setErDilution('');
    setErIndications('');
    setErContra('');
    setErWarnings('');
  };

  const handleAddIraqiDrugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iqTradeName.trim()) return;

    const categoryLabels: Record<IraqiPharmacyCategoryKey, string> = {
      all: 'كافة الأدوية',
      antibiotics: 'المضادات الحيوية',
      cardio_htn: 'الضغط والقلب والدهون',
      diabetes: 'السكري والأنسولين',
      gi: 'الجهاز الهضمي والمعدة',
      pain_nsaids: 'المسكنات والروماتيزم',
      respiratory_allergy: 'التنفس والحساسية',
      neuro_psych: 'الأعصاب والنفسية',
      samarra_sdi: 'صناعة سامراء الوطنية (SDI)',
    };

    const newDrug: IraqiDrug = {
      id: 'iq_' + Date.now(),
      tradeName: iqTradeName.trim(),
      genericName: iqGenericName.trim() || iqTradeName.trim(),
      category: iqCategory,
      categoryLabel: categoryLabels[iqCategory] || 'أدوية الصيدلية',
      sector: iqSector,
      manufacturer: iqManufacturer.trim() || 'معتمد بالعراق',
      forms: iqForms.trim() || 'حبوب / كبسول / شراب',
      indications: iqIndications.trim() || 'دواعي استعمال صيدلانية وسريرية',
      adultDose: iqAdultDose.trim() || 'حسب وصفة الطبيب المعالج',
      pediatricDose: iqPediatricDose.trim() || 'حسب وزن وعمر الطفل',
      contraindications: iqContra.trim() || 'الحساسية المفرطة للمادة الفعالة',
      counseling: iqCounseling.trim() || 'تناول الدواء بعد وجبة الطعام مع كأس ماء كامل.',
    };

    onAddIraqiDrug(newDrug);
    alert(`تمت إضافة الدواء العراقي (${iqTradeName}) بنجاح وهو متاح فوراً في صيدلية العراق!`);
    setIqTradeName('');
    setIqGenericName('');
    setIqManufacturer('');
    setIqForms('');
    setIqAdultDose('');
    setIqPediatricDose('');
    setIqIndications('');
    setIqContra('');
    setIqCounseling('');
  };

  return (
    <div className="space-y-6">
      
      {/* Locked Screen - Password Protected */}
      {!isUnlocked ? (
        <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-1">
            لوحة الإدارة والتحكم المركزية
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            اللوحة محمية بكلمة مرور (باسورد) للتحكم بالنظام وإضافة وتعديل الأدوية والجرعات (كلمة المرور الافتراضية: admin123)
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="أدخل كلمة المرور (الباسورد)..."
                autoFocus
                className="w-full text-center text-lg font-mono py-3 px-10 border-2 border-slate-200 rounded-2xl outline-none focus:border-sky-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {passwordError && (
              <span className="text-xs text-red-600 font-bold block animate-bounce">
                كلمة المرور (الباسورد) غير صحيحة! يرجى إعادة المحاولة.
              </span>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>تسجيل الدخول وفتح لوحة الإدارة</span>
            </button>
          </form>
        </div>
      ) : (
        /* Unlocked Admin Dashboard */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          {/* Admin Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Settings className="w-4 h-4" />
                <span>Super Administrator Control Panel</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                لوحة التحكم الشاملة بالنظام الطبي وإدارة الأدوية
              </h2>
            </div>
            <button
              onClick={() => setIsUnlocked(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>قفل اللوحة</span>
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: 'drugs', label: 'إدارة وإضافة الأدوية والجرعات', icon: Pill },
              { key: 'banner', label: 'البنرات والإعلانات', icon: Megaphone },
              { key: 'tools', label: 'تخصيص الأدوات والاسم', icon: Palette },
              { key: 'ai', label: 'إعدادات الذكاء الاصطناعي', icon: Bot },
              { key: 'actilyse', label: 'موانع أكتيليز', icon: Ban },
              { key: 'ct', label: 'معايير المفراس', icon: Scan },
              { key: 'wipe', label: 'تصفير وحذف البيانات', icon: Trash2 },
              { key: 'password', label: 'تغيير كلمة المرور (الباسورد)', icon: Key },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActivePane(tab.key as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activePane === tab.key
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* PANE: DRUGS MANAGEMENT (PEDIATRIC, EMERGENCY, IRAQI PHARMACY)   */}
          {/* ============================================================== */}
          {activePane === 'drugs' && (
            <div className="space-y-6">
              
              {/* Inner Tabs for the 3 Drug Sections */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl max-w-xl">
                <button
                  onClick={() => setDrugSection('peds')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    drugSection === 'peds' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Baby className="w-4 h-4" />
                  <span>جرعات أدوية الأطفال ({pediatricDrugs.length})</span>
                </button>
                <button
                  onClick={() => setDrugSection('er')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    drugSection === 'er' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>أدوية الطوارئ ({emergencyDrugs.length})</span>
                </button>
                <button
                  onClick={() => setDrugSection('iraqi')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    drugSection === 'iraqi' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>صيدلية العراق ({iraqiDrugs.length})</span>
                </button>
              </div>

              {/* 1. PEDIATRIC DRUGS FORM */}
              {drugSection === 'peds' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddPedsDrugSubmit} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm pb-2 border-b border-emerald-200">
                      <Baby className="w-5 h-5 text-emerald-600" />
                      <span>إضافة دواء جديد لحاسبة جرعات الأطفال بالوزن:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">اسم الدواء والعيار:</label>
                        <input
                          type="text"
                          value={pedsName}
                          onChange={(e) => setPedsName(e.target.value)}
                          placeholder="مثال: Cefotaxime Syrup (250mg/5ml)..."
                          required
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الاسم العلمي (المادة الفعالة):</label>
                        <input
                          type="text"
                          value={pedsGeneric}
                          onChange={(e) => setPedsGeneric(e.target.value)}
                          placeholder="مثال: Cefotaxime Sodium..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">التصنيف الدوائي للأطفال:</label>
                        <select
                          value={pedsCategoryKey}
                          onChange={(e) => setPedsCategoryKey(e.target.value as any)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-500"
                        >
                          <option value="antipyretic">خافضات الحرارة والمسكنات</option>
                          <option value="antibiotic">المضادات الحيوية للأطفال</option>
                          <option value="respiratory">الجهاز التنفسي والربو</option>
                          <option value="anticonvulsant">مضادات التشنج والصرع</option>
                          <option value="steroids">الستيرويدات ومضادات الالتهاب</option>
                          <option value="allergy_resuscitation">الحساسية والإنعاش</option>
                          <option value="fluids">السوائل والجفاف</option>
                          <option value="gi_antiemetic">الجهاز الهضمي والقيء</option>
                        </select>
                      </div>
                    </div>

                    {/* Pediatric Formula Parameters */}
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                      <span className="text-xs font-bold text-emerald-800 block mb-2">
                        معادلة حساب الجرعة الدقيقة بالوزن (mg/kg & ml):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">الجرعة (mg/kg):</label>
                          <input
                            type="number"
                            step="0.01"
                            value={pedsMgPerKg}
                            onChange={(e) => setPedsMgPerKg(Number(e.target.value))}
                            required
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none font-bold text-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">التركيز: ملغ (mg):</label>
                          <input
                            type="number"
                            step="0.1"
                            value={pedsConcMg}
                            onChange={(e) => setPedsConcMg(Number(e.target.value))}
                            required
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">في كل حجم: مل (ml):</label>
                          <input
                            type="number"
                            step="0.1"
                            value={pedsConcMl}
                            onChange={(e) => setPedsConcMl(Number(e.target.value))}
                            required
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">التكرار والجدول:</label>
                          <input
                            type="text"
                            value={pedsFrequency}
                            onChange={(e) => setPedsFrequency(e.target.value)}
                            placeholder="مثال: كل 8 ساعات"
                            required
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">الحد الأقصى (mg):</label>
                          <input
                            type="number"
                            value={pedsMaxDose}
                            onChange={(e) => setPedsMaxDose(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="اختياري..."
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">طريق الإعطاء:</label>
                        <select
                          value={pedsRoute}
                          onChange={(e) => setPedsRoute(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          <option value="فموي (Oral)">فموي (Oral)</option>
                          <option value="وريدي (IV)">وريدي (IV)</option>
                          <option value="عضلي (IM)">عضلي (IM)</option>
                          <option value="رذاذ تبخير (Nebulizer)">رذاذ تبخير (Nebulizer)</option>
                          <option value="شرجي (PR)">شرجي (PR)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pedsEmergency}
                            onChange={(e) => setPedsEmergency(e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>تمييز كدواء إسعافي طارئ للأطفال (Emergency Drug)</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">دواعي الاستعمال:</label>
                        <input
                          type="text"
                          value={pedsIndications}
                          onChange={(e) => setPedsIndications(e.target.value)}
                          placeholder="الاستطبابات السريرية..."
                          required
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">موانع الاستعمال والتحذيرات:</label>
                        <input
                          type="text"
                          value={pedsContra}
                          onChange={(e) => setPedsContra(e.target.value)}
                          placeholder="الموانع..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">إرشادات السلامة للمريض:</label>
                        <input
                          type="text"
                          value={pedsCounseling}
                          onChange={(e) => setPedsCounseling(e.target.value)}
                          placeholder="نصائح الصرف وتناول الدواء..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>حفظ وإدراج دواء الأطفال في الحاسبة</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Existing Pediatric Drugs with Delete */}
                  <div>
                    <h4 className="font-bold text-xs text-slate-700 mb-2">أدوية الأطفال الحالية في النظام (انقر للحذف إذا لزم الأمر):</h4>
                    <div className="space-y-1.5 max-h-80 overflow-y-auto">
                      {pediatricDrugs.map((d) => (
                        <div key={d.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{d.name}</span>
                            <span className="text-slate-500 mr-2 text-[11px]">({d.mgPerKg} mg/kg • {d.concMg}mg/{d.concMl}ml • {d.frequency})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingPedsDrug(d)}
                              className="text-emerald-600 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                              title="تعديل بيانات وجرعة الدواء"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`هل تريد بالتأكيد حذف الدواء (${d.name}) من الحاسبة؟`)) {
                                  onDeletePediatricDrug(d.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="حذف الدواء"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EMERGENCY DRUGS FORM */}
              {drugSection === 'er' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddEmergencyDrugSubmit} className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm pb-2 border-b border-rose-200">
                      <Activity className="w-5 h-5 text-rose-600" />
                      <span>إضافة دواء طوارئ جديد مع بروتوكولات الإنعاش والتخفيف:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">اسم دواء الطوارئ والتركيز:</label>
                        <input
                          type="text"
                          value={erName}
                          onChange={(e) => setErName(e.target.value)}
                          placeholder="مثال: Vasopressin 20 units/ml..."
                          required
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الاسم العلمي (المادة الفعالة):</label>
                        <input
                          type="text"
                          value={erGeneric}
                          onChange={(e) => setErGeneric(e.target.value)}
                          placeholder="مثال: Vasopressin / Arginine Vasopressin..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">التصنيف الإسعافي:</label>
                        <select
                          value={erCategory}
                          onChange={(e) => setErCategory(e.target.value as any)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-rose-500"
                        >
                          <option value="resuscitation">الإنعاش وتوقف القلب (ACLS)</option>
                          <option value="shock">الصدمة والرافعات الوعائية (Inotropes)</option>
                          <option value="cardiac">القلب واضطراب النظم (Cardio)</option>
                          <option value="analgesia">المسكنات والمهدئات والتنبيب (RSI)</option>
                          <option value="respiratory">الجهاز التنفسي والربو (Respiratory)</option>
                          <option value="antidotes">الترياق وعلاج التسمم (Antidotes)</option>
                          <option value="neuro">الأعصاب والتشنجات (Neuro)</option>
                          <option value="bleeding">النزف والتخثر ومذيبات الجلطة (Bleeding/rtPA)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ملخص سريري سريع (Summary):</label>
                      <input
                        type="text"
                        value={erSummary}
                        onChange={(e) => setErSummary(e.target.value)}
                        placeholder="سطر يلخص دور الدواء في الطوارئ..."
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة الإسعافية للبالغين:</label>
                        <textarea
                          rows={2}
                          value={erAdultDose}
                          onChange={(e) => setErAdultDose(e.target.value)}
                          placeholder="مثال: 40 units IV push مرة واحدة كبديل للجرعة الأولى من الأدرينالين..."
                          required
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة الإسعافية للأطفال (اختياري):</label>
                        <textarea
                          rows={2}
                          value={erPediatricDose}
                          onChange={(e) => setErPediatricDose(e.target.value)}
                          placeholder="مثال: 0.4 units/kg IV..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">بروتوكول التخفيف والتسريب الوريدي (Dilution & Infusion):</label>
                      <input
                        type="text"
                        value={erDilution}
                        onChange={(e) => setErDilution(e.target.value)}
                        placeholder="مثال: يمدد في 100 مل D5W أو محلول ملحي ويسرب عبر مضخة..."
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">دواعي الاستعمال في الطوارئ:</label>
                        <input
                          type="text"
                          value={erIndications}
                          onChange={(e) => setErIndications(e.target.value)}
                          placeholder="الحالات الطارئة..."
                          required
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">موانع الاستعمال المطلقة:</label>
                        <input
                          type="text"
                          value={erContra}
                          onChange={(e) => setErContra(e.target.value)}
                          placeholder="الموانع..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">التحذيرات ومخاطر الجرعة الزائدة:</label>
                        <input
                          type="text"
                          value={erWarnings}
                          onChange={(e) => setErWarnings(e.target.value)}
                          placeholder="تحذيرات الأمان..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>حفظ وإدراج دواء الطوارئ في الدليل</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Existing Emergency Drugs with Delete */}
                  <div>
                    <h4 className="font-bold text-xs text-slate-700 mb-2">أدوية الطوارئ الحالية في النظام:</h4>
                    <div className="space-y-1.5 max-h-80 overflow-y-auto">
                      {emergencyDrugs.map((d) => (
                        <div key={d.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{d.name}</span>
                            <span className="text-rose-700 mr-2 text-[11px] font-semibold">[{d.categoryLabel}]</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingErDrug(d)}
                              className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="تعديل بيانات دواء الطوارئ"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`هل تريد بالتأكيد حذف دواء الطوارئ (${d.name})؟`)) {
                                  onDeleteEmergencyDrug(d.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="حذف الدواء"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. IRAQI PHARMACY DRUGS FORM */}
              {drugSection === 'iraqi' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddIraqiDrugSubmit} className="bg-purple-50/50 border border-purple-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm pb-2 border-b border-purple-200">
                      <FileText className="w-5 h-5 text-purple-700" />
                      <span>إضافة دواء تجاري جديد لصيدلية العراق (أهلي أو كيماديا):</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الاسم التجاري بالعراق (Trade Name):</label>
                        <input
                          type="text"
                          value={iqTradeName}
                          onChange={(e) => setIqTradeName(e.target.value)}
                          placeholder="مثال: Panadol Joint, Concor AM..."
                          required
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الاسم العلمي (المادة الفعالة):</label>
                        <input
                          type="text"
                          value={iqGenericName}
                          onChange={(e) => setIqGenericName(e.target.value)}
                          placeholder="المادة الفعالة..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">التصنيف الدوائي:</label>
                        <select
                          value={iqCategory}
                          onChange={(e) => setIqCategory(e.target.value as any)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-purple-500"
                        >
                          <option value="antibiotics">المضادات الحيوية</option>
                          <option value="cardio_htn">الضغط والقلب والدهون</option>
                          <option value="diabetes">السكري والأنسولين</option>
                          <option value="gi">الجهاز الهضمي والمعدة</option>
                          <option value="pain_nsaids">المسكنات والروماتيزم</option>
                          <option value="respiratory_allergy">التنفس والحساسية</option>
                          <option value="neuro_psych">الأعصاب والنفسية</option>
                          <option value="samarra_sdi">صناعة سامراء الوطنية (SDI)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">القطاع والتوفر:</label>
                        <select
                          value={iqSector}
                          onChange={(e) => setIqSector(e.target.value as any)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-purple-500"
                        >
                          <option value="صيدليات أهلية (Private)">صيدليات أهلية (Private)</option>
                          <option value="كيماديا ومستشفيات (Kimadia)">كيماديا ومستشفيات (Kimadia)</option>
                          <option value="مشترك (Private & Kimadia)">مشترك (Private & Kimadia)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الشركة المصنعة والبلد:</label>
                        <input
                          type="text"
                          value={iqManufacturer}
                          onChange={(e) => setIqManufacturer(e.target.value)}
                          placeholder="مثال: SDI Samarra (العراق), GSK, Pfizer..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الأشكال الصيدلانية المتوفرة بالعراق:</label>
                        <input
                          type="text"
                          value={iqForms}
                          onChange={(e) => setIqForms(e.target.value)}
                          placeholder="مثال: أقراص 500mg، شراب 120mg/5ml، أمبولات..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة القياسية للبالغين:</label>
                        <input
                          type="text"
                          value={iqAdultDose}
                          onChange={(e) => setIqAdultDose(e.target.value)}
                          placeholder="مثال: قرص واحد مرتين يومياً مع وجبات الطعام..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">جرعة الأطفال (إن وجدت):</label>
                        <input
                          type="text"
                          value={iqPediatricDose}
                          onChange={(e) => setIqPediatricDose(e.target.value)}
                          placeholder="جرعة الأطفال..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">دواعي الاستعمال:</label>
                        <input
                          type="text"
                          value={iqIndications}
                          onChange={(e) => setIqIndications(e.target.value)}
                          placeholder="الاستطبابات السريرية..."
                          required
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">موانع الاستعمال والتحذيرات:</label>
                        <input
                          type="text"
                          value={iqContra}
                          onChange={(e) => setIqContra(e.target.value)}
                          placeholder="الموانع..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">إرشادات الصيدلي السريري عند الصرف:</label>
                        <input
                          type="text"
                          value={iqCounseling}
                          onChange={(e) => setIqCounseling(e.target.value)}
                          placeholder="نصائح تناول الدواء..."
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>حفظ وإدراج الدواء في صيدلية العراق</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Existing Iraqi Drugs with Delete */}
                  <div>
                    <h4 className="font-bold text-xs text-slate-700 mb-2">الأدوية المسجلة حالياً في صيدلية العراق:</h4>
                    <div className="space-y-1.5 max-h-80 overflow-y-auto">
                      {iraqiDrugs.map((d) => (
                        <div key={d.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{d.tradeName}</span>
                            <span className="text-slate-500 mr-2 text-[11px]">({d.genericName} • {d.sector})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingIraqiDrug(d)}
                              className="text-purple-600 hover:text-purple-800 p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                              title="تعديل بيانات الدواء"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`هل تريد بالتأكيد حذف الدواء (${d.tradeName}) من صيدلية العراق؟`)) {
                                  onDeleteIraqiDrug(d.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="حذف الدواء"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* PANE 2: BANNER */}
          {activePane === 'banner' && (
            <form onSubmit={handleSaveBanner} className="space-y-4 max-w-2xl bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-800">إدارة البنر الإعلاني والتنبيهي أعلى الموقع:</h3>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">نص البنر التنبيهي:</label>
                <input
                  type="text"
                  value={bText}
                  onChange={(e) => setBText(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">لون ونوع البنر:</label>
                  <select
                    value={bType}
                    onChange={(e) => setBType(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="banner-warning">تحذير أصفر (Warning)</option>
                    <option value="banner-danger">طارئ أحمر (Critical)</option>
                    <option value="banner-info">معلومة عامة أزرق (Info)</option>
                    <option value="banner-success">إيجابي أخضر (Success)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">حالة الظهور:</label>
                  <select
                    value={bActive ? 'true' : 'false'}
                    onChange={(e) => setBActive(e.target.value === 'true')}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="true">مفعل وظاهر أعلى الموقع</option>
                    <option value="false">معطل ومخفي</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                تطبيق وحفظ البنر
              </button>
            </form>
          )}

          {/* PANE 3: TOOLS & SITE TITLE */}
          {activePane === 'tools' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveTitle} className="flex gap-2 max-w-xl">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  حفظ اسم الموقع
                </button>
              </form>

              <div>
                <h4 className="font-bold text-xs text-slate-700 mb-2">ترتيب وتفعيل ظهور الأدوات بالقائمة الجانبية:</h4>
                <div className="space-y-2 max-w-2xl">
                  {toolsConfig.map((tool, idx) => (
                    <div key={tool.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-800">{tool.title}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleToolVisibility(idx)}
                          className={`p-1.5 rounded-lg border cursor-pointer ${tool.visible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-200 text-slate-500'}`}
                          title={tool.visible ? 'إخفاء الأداة' : 'إظهار الأداة'}
                        >
                          {tool.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveTool(idx, -1)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === toolsConfig.length - 1}
                          onClick={() => handleMoveTool(idx, 1)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PANE 4: AI ENGINE */}
          {activePane === 'ai' && (
            <div className="space-y-4 max-w-2xl bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <h3 className="font-extrabold text-sm text-slate-800">ضبط محرك واستشارات الذكاء الاصطناعي:</h3>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">حالة تشغيل العميل السريري الذكي:</span>
                  <span className="text-slate-500 text-[11px]">إظهار أو إخفاء الزر العائم ولوحة الاستشارات الذكية</span>
                </div>
                <button
                  onClick={() => onToggleAi(!isAiEnabled)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    isAiEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isAiEnabled ? 'مفعل ونشط' : 'معطل'}
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  مفتاح Google Gemini API Key (اختياري - يتم استدعاؤه server-side بأمان):
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdateGeminiApiKey(apiKeyInput.trim());
                    alert('تم حفظ مفتاح API بنجاح!');
                  }}
                  className="mt-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer"
                >
                  حفظ المفتاح
                </button>
              </div>
            </div>
          )}

          {/* PANE 5: ACTILYSE RULES */}
          {activePane === 'actilyse' && (
            <div className="space-y-4">
              <form onSubmit={handleAddActilyseRule} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs text-slate-800">إضافة مانع جديد لدواء أكتيليز:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">نوع المانع:</label>
                    <select
                      value={newActType}
                      onChange={(e) => setNewActType(e.target.value as 'abs' | 'rel')}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none"
                    >
                      <option value="abs">مانع مطلق (Absolute)</option>
                      <option value="rel">مانع نسبي (Relative)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">نص المانع بالعربي:</label>
                    <input
                      type="text"
                      value={newActText}
                      onChange={(e) => setNewActText(e.target.value)}
                      placeholder="نص المانع..."
                      required
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  إضافة المانع
                </button>
              </form>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">الموانع المطلقة الحالية:</span>
                {actilyseRules.abs.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 border border-red-200 text-xs">
                    <span className="font-semibold text-red-950">• {r}</span>
                    <button onClick={() => handleDeleteActilyseRule('abs', i)} className="text-red-700 hover:text-red-900 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <span className="text-xs font-bold text-slate-700 block pt-2">الموانع النسبية الحالية:</span>
                {actilyseRules.rel.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                    <span className="font-semibold text-amber-950">• {r}</span>
                    <button onClick={() => handleDeleteActilyseRule('rel', i)} className="text-amber-700 hover:text-amber-900 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANE 6: CT RULES */}
          {activePane === 'ct' && (
            <div className="space-y-4">
              <form onSubmit={handleAddCTRule} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs text-slate-800">إضافة معيار جديد لمفراس الرأس:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">مستوى الخطورة:</label>
                    <select
                      value={newCtType}
                      onChange={(e) => setNewCtType(e.target.value as 'high' | 'med')}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none"
                    >
                      <option value="high">خطورة عالية (High Risk)</option>
                      <option value="med">خطورة متوسطة (Medium Risk)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">نص المعيار بالعربي:</label>
                    <input
                      type="text"
                      value={newCtText}
                      onChange={(e) => setNewCtText(e.target.value)}
                      placeholder="نص المعيار..."
                      required
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  إضافة المعيار
                </button>
              </form>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">معايير الخطورة العالية:</span>
                {ctRules.high.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 border border-red-200 text-xs">
                    <span className="font-semibold text-red-950">• {r}</span>
                    <button onClick={() => handleDeleteCTRule('high', i)} className="text-red-700 hover:text-red-900 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <span className="text-xs font-bold text-slate-700 block pt-2">معايير الخطورة المتوسطة:</span>
                {ctRules.med.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                    <span className="font-semibold text-amber-950">• {r}</span>
                    <button onClick={() => handleDeleteCTRule('med', i)} className="text-amber-700 hover:text-amber-900 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANE 7: WIPE DATA */}
          {activePane === 'wipe' && (
            <div className="space-y-3 max-w-xl text-xs">
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 leading-relaxed font-medium mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mb-1" />
                تحذير: عمليات الحذف والتصفير نهائية ولا يمكن التراجع عنها.
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (confirm('هل تريد بالتأكيد حذف جميع مرضى الردهة؟')) onWipeData('ward');
                  }}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white font-bold transition-all text-right cursor-pointer"
                >
                  حذف مرضى الردهات
                </button>
                <button
                  onClick={() => {
                    if (confirm('هل تريد بالتأكيد حذف جميع مرضى فرز الطوارئ؟')) onWipeData('triage');
                  }}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white font-bold transition-all text-right cursor-pointer"
                >
                  حذف مرضى الطوارئ
                </button>
                <button
                  onClick={() => {
                    if (confirm('هل تريد بالتأكيد حذف جميع مرضى الغسل الكلوي؟')) onWipeData('dialysis');
                  }}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white font-bold transition-all text-right cursor-pointer"
                >
                  حذف مرضى الغسل الكلوي
                </button>
                <button
                  onClick={() => {
                    if (confirm('هل تريد بالتأكيد تصفير أرشيف الحالات المخرجة؟')) onWipeData('discharged');
                  }}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white font-bold transition-all text-right cursor-pointer"
                >
                  تصفير أرشيف المخرجين
                </button>
              </div>
              <button
                onClick={() => {
                  if (confirm('تحذير نهائي: هذا الإجراء سيعيد ضبط المصنع ويمسح كافة البيانات!')) onWipeData('all');
                }}
                className="w-full mt-4 p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs cursor-pointer"
              >
                إعادة ضبط المصنع الشامل (Factory Reset)
              </button>
            </div>
          )}

          {/* PANE 8: PASSWORD CHANGE */}
          {activePane === 'password' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-600" />
                <span>تغيير كلمة المرور (الباسورد) للوحة الإدارة:</span>
              </h3>
              <div>
                <label className="font-bold text-slate-700 block mb-1">كلمة المرور الحالية (الباسورد الحالي):</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  required
                  placeholder="كلمة المرور الحالية..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">كلمة المرور الجديدة (الباسورد الجديد):</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    placeholder="أدخل كلمة مرور جديدة (أحرف أو أرقام)..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none font-mono pr-3 pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">تأكيد كلمة المرور الجديدة:</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                  placeholder="أعد إدخال كلمة المرور الجديدة..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl cursor-pointer">
                تحديث كلمة المرور
              </button>
            </form>
          )}

        </div>
      )}

      {/* EDIT MODAL: PEDIATRIC DRUG */}
      {editingPedsDrug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-emerald-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <span>تعديل بيانات دواء الأطفال: {editingPedsDrug.name}</span>
              </h3>
              <button onClick={() => setEditingPedsDrug(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdatePediatricDrug(editingPedsDrug);
                setEditingPedsDrug(null);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم الدواء:</label>
                  <input
                    type="text"
                    value={editingPedsDrug.name}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, name: e.target.value })}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الاسم العلمي:</label>
                  <input
                    type="text"
                    value={editingPedsDrug.genericName}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, genericName: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">التصنيف:</label>
                  <select
                    value={editingPedsDrug.categoryKey}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, categoryKey: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="antipyretic">خافضات الحرارة والمسكنات</option>
                    <option value="antibiotic">المضادات الحيوية للأطفال</option>
                    <option value="respiratory">الجهاز التنفسي والربو</option>
                    <option value="anticonvulsant">مضادات التشنج والصرع</option>
                    <option value="steroids">الستيرويدات ومضادات الالتهاب</option>
                    <option value="allergy_resuscitation">الحساسية والإنعاش</option>
                    <option value="fluids">السوائل والجفاف</option>
                    <option value="gi_antiemetic">الجهاز الهضمي والقيء</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الجرعة mg/kg:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPedsDrug.mgPerKg}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, mgPerKg: Number(e.target.value) })}
                    required
                    className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">التركيز mg:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPedsDrug.concMg}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, concMg: Number(e.target.value) })}
                    required
                    className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">في حجم ml:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPedsDrug.concMl}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, concMl: Number(e.target.value) })}
                    required
                    className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">التكرار:</label>
                  <input
                    type="text"
                    value={editingPedsDrug.frequency}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, frequency: e.target.value })}
                    required
                    className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">الحد الأقصى mg:</label>
                  <input
                    type="number"
                    value={editingPedsDrug.maxDoseMg || ''}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, maxDoseMg: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">دواعي الاستعمال:</label>
                  <input
                    type="text"
                    value={editingPedsDrug.indications}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, indications: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الموانع والتحذيرات:</label>
                  <input
                    type="text"
                    value={editingPedsDrug.contraindications}
                    onChange={(e) => setEditingPedsDrug({ ...editingPedsDrug, contraindications: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPedsDrug(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL: EMERGENCY DRUG */}
      {editingErDrug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-rose-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-rose-600" />
                <span>تعديل دواء الطوارئ: {editingErDrug.name}</span>
              </h3>
              <button onClick={() => setEditingErDrug(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateEmergencyDrug(editingErDrug);
                setEditingErDrug(null);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم الدواء:</label>
                  <input
                    type="text"
                    value={editingErDrug.name}
                    onChange={(e) => setEditingErDrug({ ...editingErDrug, name: e.target.value })}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الاسم العلمي:</label>
                  <input
                    type="text"
                    value={editingErDrug.genericName}
                    onChange={(e) => setEditingErDrug({ ...editingErDrug, genericName: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">التصنيف الإسعافي:</label>
                  <select
                    value={editingErDrug.category}
                    onChange={(e) => setEditingErDrug({ ...editingErDrug, category: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="resuscitation">الإنعاش وتوقف القلب (ACLS)</option>
                    <option value="shock">الصدمة والرافعات الوعائية (Inotropes)</option>
                    <option value="cardiac">القلب واضطراب النظم (Cardio)</option>
                    <option value="analgesia">المسكنات والمهدئات والتنبيب (RSI)</option>
                    <option value="respiratory">الجهاز التنفسي والربو (Respiratory)</option>
                    <option value="antidotes">الترياق وعلاج التسمم (Antidotes)</option>
                    <option value="neuro">الأعصاب والتشنجات (Neuro)</option>
                    <option value="bleeding">النزف والتخثر ومذيبات الجلطة (Bleeding/rtPA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة للبالغين:</label>
                  <textarea
                    rows={2}
                    value={editingErDrug.adultDose}
                    onChange={(e) => setEditingErDrug({ ...editingErDrug, adultDose: e.target.value })}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">بروتوكول التمديد والتسريب:</label>
                  <textarea
                    rows={2}
                    value={editingErDrug.dilution}
                    onChange={(e) => setEditingErDrug({ ...editingErDrug, dilution: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">دواعي الاستعمال في الطوارئ:</label>
                  <input
                    type="text"
                    value={editingErDrug.indications}
                    onChange={(e) => setEditingErDrug({ ...editingErDrug, indications: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">التحذيرات وموانع الاستعمال:</label>
                  <input
                    type="text"
                    value={editingErDrug.contraindications || editingErDrug.warnings}
                    onChange={(e) => setEditingErDrug({ ...editingErDrug, contraindications: e.target.value, warnings: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingErDrug(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL: IRAQI PHARMACY DRUG */}
      {editingIraqiDrug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-purple-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-700" />
                <span>تعديل دواء صيدلية العراق: {editingIraqiDrug.tradeName}</span>
              </h3>
              <button onClick={() => setEditingIraqiDrug(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateIraqiDrug(editingIraqiDrug);
                setEditingIraqiDrug(null);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الاسم التجاري بالعراق:</label>
                  <input
                    type="text"
                    value={editingIraqiDrug.tradeName}
                    onChange={(e) => setEditingIraqiDrug({ ...editingIraqiDrug, tradeName: e.target.value })}
                    required
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الاسم العلمي:</label>
                  <input
                    type="text"
                    value={editingIraqiDrug.genericName}
                    onChange={(e) => setEditingIraqiDrug({ ...editingIraqiDrug, genericName: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">القطاع:</label>
                  <select
                    value={editingIraqiDrug.sector}
                    onChange={(e) => setEditingIraqiDrug({ ...editingIraqiDrug, sector: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="صيدليات أهلية (Private)">صيدليات أهلية (Private)</option>
                    <option value="كيماديا ومستشفيات (Kimadia)">كيماديا ومستشفيات (Kimadia)</option>
                    <option value="مشترك (Private & Kimadia)">مشترك (Private & Kimadia)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الشركة والبلد المصنع:</label>
                  <input
                    type="text"
                    value={editingIraqiDrug.manufacturer}
                    onChange={(e) => setEditingIraqiDrug({ ...editingIraqiDrug, manufacturer: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الأشكال المتوفرة بالعراق:</label>
                  <input
                    type="text"
                    value={editingIraqiDrug.forms}
                    onChange={(e) => setEditingIraqiDrug({ ...editingIraqiDrug, forms: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الجرعة القياسية للبالغين:</label>
                  <input
                    type="text"
                    value={editingIraqiDrug.adultDose}
                    onChange={(e) => setEditingIraqiDrug({ ...editingIraqiDrug, adultDose: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">دواعي الاستعمال:</label>
                  <input
                    type="text"
                    value={editingIraqiDrug.indications}
                    onChange={(e) => setEditingIraqiDrug({ ...editingIraqiDrug, indications: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingIraqiDrug(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
