import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Building2, 
  Pill, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  ArrowLeft,
  Sparkles,
  Flag
} from 'lucide-react';
import { IraqiDrug, IraqiPharmacyCategoryKey } from '../types/clinical';
import { IRAQI_PHARMACY_DRUGS_DATA, IRAQI_PHARMACY_CATEGORIES } from '../data/iraqiPharmacyData';

interface IraqiPharmacySectionProps {
  drugs?: IraqiDrug[];
}

export const IraqiPharmacySection: React.FC<IraqiPharmacySectionProps> = ({
  drugs = IRAQI_PHARMACY_DRUGS_DATA,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IraqiPharmacyCategoryKey>('all');
  const [selectedSector, setSelectedSector] = useState<'all' | 'private' | 'kimadia'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<IraqiDrug | null>(null);

  const filteredDrugs = drugs.filter((drug) => {
    const matchesCategory = selectedCategory === 'all' || drug.category === selectedCategory;
    
    let matchesSector = true;
    if (selectedSector === 'private') {
      matchesSector = drug.sector.includes('Private') || drug.sector.includes('أهلية');
    } else if (selectedSector === 'kimadia') {
      matchesSector = drug.sector.includes('Kimadia') || drug.sector.includes('كيماديا');
    }

    const matchesSearch = 
      drug.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.indications.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.forms.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Iraqi Community Pharmacy & Kimadia Formulary</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            دليل أدوية الصيدلية في العراق (القطاع الأهلي وكيماديا)
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            الأسماء التجارية المتداولة في السوق العراقي، أدوية سامراء الوطنية، الأشكال الصيدلانية، الجرعات، وإرشادات الصيدلي السريري
          </p>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl self-start md:self-auto">
          المتوفر في الدليل: {drugs.length} صنف تجاري عراقي
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {IRAQI_PHARMACY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const count = cat.key === 'all'
            ? drugs.length
            : drugs.filter(d => d.category === cat.key).length;

          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                isSelected
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20 ring-2 ring-purple-700/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Sector Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث بالاسم التجاري (مثل: بنادول، كونكور، أوغمنتين، كلوكوفاج، سامراء)..."
            className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm outline-none focus:border-purple-500 shadow-sm"
          />
        </div>
        <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setSelectedSector('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSector === 'all' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            كافة القطاعات
          </button>
          <button
            onClick={() => setSelectedSector('private')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSector === 'private' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            الصيدليات الأهلية
          </button>
          <button
            onClick={() => setSelectedSector('kimadia')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSector === 'kimadia' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            كيماديا والمستشفيات
          </button>
        </div>
      </div>

      {/* Iraqi Drugs Grid */}
      {filteredDrugs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <Pill className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">لم يتم العثور على أدوية عراقية مطابقة</h3>
          <p className="text-xs text-slate-400 mt-1">تأكد من كتابة الاسم التجاري بشكل صحيح</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrugs.map((drug) => (
            <div
              key={drug.id}
              onClick={() => setSelectedDrug(drug)}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Sector and Category Badge */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    drug.sector.includes('Private') 
                      ? 'bg-purple-50 text-purple-700 border-purple-200' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {drug.sector}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                    {drug.manufacturer}
                  </span>
                </div>

                {/* Trade Name & Generic */}
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700 transition-colors mb-1">
                  {drug.tradeName}
                </h3>
                <div className="text-xs text-sky-700 font-semibold mb-2">
                  {drug.genericName}
                </div>

                {/* Available Forms */}
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2">
                  <span className="font-bold text-slate-800">الأشكال في العراق: </span>
                  <span>{drug.forms}</span>
                </div>

                {/* Indications preview */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  <strong>الاستعمال:</strong> {drug.indications}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-bold group-hover:underline">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>الجرعات وإرشادات الصرف</span>
                </span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drug Detail Modal */}
      {selectedDrug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base md:text-lg text-white">
                    {selectedDrug.tradeName}
                  </h3>
                  <p className="text-xs text-purple-300">
                    {selectedDrug.genericName} • {selectedDrug.manufacturer}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDrug(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs md:text-sm text-slate-800 leading-relaxed">
              
              {/* Sector & Forms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-purple-50/70 border border-purple-200 p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-purple-900 block mb-0.5">القطاع والتوفر في العراق:</span>
                  <span className="font-bold text-slate-900">{selectedDrug.sector}</span>
                  <div className="text-[11px] text-slate-500 mt-1">الشركة المصنعة: {selectedDrug.manufacturer}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-700 block mb-0.5">الأشكال الصيدلانية والعيارات المتوفرة:</span>
                  <span className="font-bold text-slate-900">{selectedDrug.forms}</span>
                </div>
              </div>

              {/* Indications */}
              <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-xl">
                <h4 className="font-bold text-sky-950 text-xs md:text-sm flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4 text-sky-600" />
                  <span>دواعي الاستعمال السريرية (Indications):</span>
                </h4>
                <p className="text-slate-700 font-medium">{selectedDrug.indications}</p>
              </div>

              {/* Dosing: Adult and Pediatric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">جرعة البالغين القياسية:</h4>
                  <p className="text-slate-800 font-semibold">{selectedDrug.adultDose}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">جرعة الأطفال:</h4>
                  <p className="text-slate-800 font-semibold">{selectedDrug.pediatricDose}</p>
                </div>
              </div>

              {/* Pharmacist Counseling Tips */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                <h4 className="font-bold text-emerald-950 text-xs md:text-sm flex items-center gap-1.5 mb-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>إرشادات وتوجيهات الصيدلي للمريض عند الصرف (Pharmacist Patient Counseling):</span>
                </h4>
                <p className="text-emerald-900 font-medium bg-white/70 p-2.5 rounded-lg border border-emerald-200">
                  {selectedDrug.counseling}
                </p>
              </div>

              {/* Contraindications */}
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl">
                <h4 className="font-bold text-red-950 text-xs md:text-sm flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>موانع الاستعمال والتحذيرات (Contraindications):</span>
                </h4>
                <p className="text-red-900 font-medium">{selectedDrug.contraindications}</p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end">
              <button
                onClick={() => setSelectedDrug(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
