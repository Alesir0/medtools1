export type DepartmentType = 'طوارئ' | 'ردهات' | 'غسل كلوي';

export interface VitalsRecord {
  timestamp: string;
  bp: string;
  hr: number;
  rr: number;
  spo2: number;
  gcs: number;
  pain: number;
  temp?: string;
  note?: string;
}

export interface AdministeredMedication {
  id: string;
  name: string;
  dose: string;
  route: string;
  time: string;
  givenBy?: string;
  notes?: string;
}

export interface EmergencyPatient {
  id: string;
  name: string;
  age: number;
  gender?: string;
  cc: string; // Chief Complaint
  triageLevel: 1 | 2 | 3 | 4 | 5;
  triageTitle: string;
  badgeClass: string;
  rationale: string;
  action: string;
  bp: string;
  hr: number;
  rr: number;
  spo2: number;
  gcs: number;
  pain: number;
  temp?: string;
  redflags?: string;
  vitalsHistory: VitalsRecord[];
  administeredMeds: AdministeredMedication[];
  entryTime: string;
  notes?: string;
  status: 'active' | 'discharged';
}

export interface WardPatient {
  id: string;
  name: string;
  doctor: string;
  bed: string;
  age?: number;
  gender?: string;
  cc: string;
  diagnosis: string;
  pmhx: string;
  pshx: string;
  bp: string;
  pulse: number;
  spo2: number;
  temp: string;
  rr?: number;
  medications: string;
  medicationList?: AdministeredMedication[];
  notes: string;
  entryTime: string;
  status: 'active' | 'discharged';
}

export interface HemodialysisPatient {
  id: string;
  name: string;
  schedule: string;
  access: string;
  dryWeight: number;
  preWeight: number;
  bp: string;
  k: number;
  urea: number;
  cr: number;
  hb: number;
  ca: number;
  po4: number;
  aiDecision: string;
  aiAdvice: string;
  status: 'active' | 'discharged';
}

export type DialysisProtocolCategory =
  | 'initiation'
  | 'maintenance'
  | 'acute_emergency'
  | 'ultrafiltration'
  | 'anticoagulation'
  | 'bath_electrolytes'
  | 'vascular_access'
  | 'anemia_mineral';

export interface DialysisProtocol {
  id: string;
  title: string;
  category: DialysisProtocolCategory;
  categoryLabel: string;
  targetPatients: string;
  indications: string;
  durationHours: string;
  bloodFlowRate: string;
  dialysateFlowRate: string;
  dialyzerType: string;
  anticoagulation: string;
  dialysateComposition: string;
  ultrafiltrationGoal: string;
  clinicalSteps: string[];
  precautions: string[];
  kdigoCitation: string;
}

export type ComplicationSeverity = 'life_threatening' | 'severe' | 'moderate' | 'mild';

export interface DialysisComplication {
  id: string;
  name: string;
  englishName: string;
  timing: string;
  severity: ComplicationSeverity;
  severityLabel: string;
  symptoms: string[];
  pathophysiology: string;
  immediateActions: string[];
  emergencyDrugs: string[];
  preventionTips: string[];
}

export interface DischargedPatient {
  id: string;
  patientName: string;
  department: DepartmentType;
  departmentLabel: string;
  dischargedAt: string;
  dischargeTimestamp: number;
  expiryTimestamp: number; // 30 days after discharge
  daysRemaining: number;
  finalDiagnosis: string;
  dischargeCondition: string;
  summaryNotes: string;
  originalRecord: any;
}

export interface PediatricDrug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  categoryKey: 'antipyretic' | 'antibiotic' | 'respiratory' | 'anticonvulsant' | 'fluids' | 'allergy_resuscitation' | 'gi_antiemetic' | 'steroids';
  mgPerKg: number;
  concMg: number;
  concMl: number;
  frequency: string;
  maxDoseMg?: number;
  route: string;
  indications: string;
  contraindications: string;
  counseling: string;
  emergencyUse?: boolean;
}

export type EmergencyCategoryKey = 
  | 'all'
  | 'resuscitation'
  | 'shock'
  | 'cardiac'
  | 'analgesia'
  | 'respiratory'
  | 'antidotes'
  | 'neuro'
  | 'bleeding';

export interface EmergencyDrug {
  id: string;
  name: string;
  genericName: string;
  category: EmergencyCategoryKey;
  categoryLabel: string;
  summary: string;
  indications: string;
  adultDose: string;
  pediatricDose?: string;
  dilution: string;
  contraindications: string;
  warnings: string;
}

export type IraqiPharmacyCategoryKey = 
  | 'all'
  | 'antibiotics'
  | 'cardio_htn'
  | 'diabetes'
  | 'gi'
  | 'pain_nsaids'
  | 'respiratory_allergy'
  | 'neuro_psych'
  | 'samarra_sdi';

export interface IraqiDrug {
  id: string;
  tradeName: string;
  genericName: string;
  sector: 'صيدليات أهلية (Private)' | 'كيماديا ومستشفيات (Kimadia)' | 'مشترك (Private & Kimadia)';
  manufacturer: string;
  category: IraqiPharmacyCategoryKey;
  categoryLabel: string;
  forms: string;
  indications: string;
  adultDose: string;
  pediatricDose: string;
  contraindications: string;
  counseling: string;
}

export interface AIAuditFinding {
  patientId: string;
  patientName: string;
  department: string;
  type: 'drug_conflict' | 'medical_error' | 'required_test';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  actionRequired: string;
  reference: string;
}

export interface ToolConfigItem {
  id: string;
  title: string;
  icon: string;
  visible: boolean;
  badgeCount?: number;
}
