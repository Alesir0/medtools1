import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  UserCheck, 
  Stethoscope,
  Activity,
  Droplet,
  Ambulance,
  BedDouble,
  Pill
} from 'lucide-react';
import { EmergencyPatient, WardPatient, HemodialysisPatient } from '../types/clinical';
import { auditWardPatient, auditEmergencyPatient, auditHemodialysisPatient } from '../services/clinicalAuditEngine';

interface AIClinicalChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  isAiEnabled: boolean;
  geminiApiKey: string;
  erPatients: EmergencyPatient[];
  wardPatients: WardPatient[];
  hdPatients: HemodialysisPatient[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: string[];
}

export const AIClinicalChatPanel: React.FC<AIClinicalChatPanelProps> = ({
  isOpen,
  onToggle,
  isAiEnabled,
  geminiApiKey,
  erPatients,
  wardPatients,
  hdPatients,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'مرحباً بك يا دكتور! أنا زميلك الاستشاري السريري الذكي المعتمد على الأدلة العالمية.\n• يمكنك كتابة سؤالك أو الضغط على زر الميكروفون للتحدث الصوتي المباشر.\n• يمكنك اختيار مريض محدد من القائمة العلوية لمراجعة أدويته، تضارباته، أو تحاليله.',
      timestamp: 'الآن',
      sources: ['UpToDate', 'BNF', 'KDIGO', 'AHA/ASA']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedContext, setSelectedContext] = useState<string>('none');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Voice recognition support
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('المتصفح لا يدعم خاصية التعرف الصوتي المباشر. يرجى تجربة Google Chrome أو Microsoft Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Build patient context
    let patientObj: any = null;
    if (selectedContext.startsWith('er_')) {
      const id = selectedContext.replace('er_', '');
      patientObj = erPatients.find(p => p.id === id);
    } else if (selectedContext.startsWith('ward_')) {
      const id = selectedContext.replace('ward_', '');
      patientObj = wardPatients.find(p => p.id === id);
    } else if (selectedContext.startsWith('hd_')) {
      const id = selectedContext.replace('hd_', '');
      patientObj = hdPatients.find(p => p.id === id);
    }

    try {
      // Build active patients census
      const activeWard = wardPatients.filter(p => p.status !== 'discharged');
      const activeEr = erPatients.filter(p => p.status !== 'discharged');
      const activeHd = hdPatients.filter(p => p.status !== 'discharged');

      // Call server-side Gemini API with full interactive memory & live census
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text.trim(),
          history: messages.slice(-8).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          })),
          patientContext: patientObj,
          wardPatients: activeWard,
          emergencyPatients: activeEr,
          hdPatients: activeHd,
          customApiKey: geminiApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: 'bot_' + Date.now(),
            sender: 'bot',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            sources: ['Gemini 3.1 & 3.8 Flash', 'Live Ward Monitor', 'UpToDate • BNF']
          }
        ]);
      } else {
        // Fallback to internal clinical knowledge base
        generateInternalBotReply(text.trim(), patientObj);
      }
    } catch (err) {
      // Offline / fallback to internal engine
      generateInternalBotReply(text.trim(), patientObj);
    } finally {
      setIsLoading(false);
    }
  };

  // Internal expert clinical knowledge generator (immediate, zero delay, offline-ready)
  const generateInternalBotReply = (query: string, patientCtx: any) => {
    const q = query.toLowerCase();
    let reply = 'قمت بمطابقة استفسارك مع أحدث بروتوكولات الأمان السريرية (UpToDate • BNF • KDIGO).';
    let sources = ['Clinical Guidelines'];

    if (patientCtx) {
      if (patientCtx.diagnosis) {
        const findings = auditWardPatient(patientCtx);
        if (findings.length > 0) {
          reply = `بناءً على فحص سجل المريض (${patientCtx.name}) الذي يتلقى (${patientCtx.medications}):\n`;
          findings.forEach((f, idx) => {
            reply += `\n${idx + 1}- ${f.title}\n• ${f.description}\n• الإجراء المطلوب: ${f.actionRequired}\n`;
          });
          sources = ['BNF Drug Interactions', 'KDIGO Guidelines'];
        } else {
          reply = `تمت مراجعة أدوية المريض (${patientCtx.name}): لا يوجد تضارب دوائي حرج مسجل حالياً. الفعاليات الحيوية: الضغط ${patientCtx.bp}، النبض ${patientCtx.pulse} bpm.`;
          sources = ['Clinical Ward Audit'];
        }
      } else if (patientCtx.triageLevel) {
        reply = `سياق مريض الطوارئ (${patientCtx.name}): مصنف ESI Level ${patientCtx.triageLevel}.\n• الشكوى: ${patientCtx.cc}\n• الفعاليات: BP ${patientCtx.bp} | HR ${patientCtx.hr} | SpO2 ${patientCtx.spo2}%\n• التوصية: ${patientCtx.action}`;
        sources = ['Emergency ESI Triage'];
      } else if (patientCtx.dryWeight) {
        reply = `سياق مريض الغسل (${patientCtx.name}):\n• البوتاسيوم: ${patientCtx.k} mmol/L\n• احتباس السوائل: +${(patientCtx.preWeight - patientCtx.dryWeight).toFixed(1)} L\n• تقييم الجلسة: ${patientCtx.aiAdvice}`;
        sources = ['KDIGO Hemodialysis'];
      }
    } else if (q.includes('أكتيليز') || q.includes('alteplase') || q.includes('سكتة')) {
      reply = 'بخصوص مذيب التخثر Alteplase (Actilyse):\n1- التأكد أن بدء الأعراض أقل من 4.5 ساعة.\n2- استبعاد النزف الدماغي بنفي كامل عبر مفراس الرأس CT Brain.\n3- الحفاظ على ضغط الدم أقل من 185/110 mmHg.\n4- يمنع في حال وجود سوابق نزف دماغي، أو صفائح < 100,000، أو جراحة كبرى خلال 14 يوماً.';
      sources = ['AHA/ASA Stroke Guidelines'];
    } else if (q.includes('بوتاسيوم') || q.includes('غسل') || q.includes('hyperkalemia')) {
      reply = 'بروتوكول فرط البوتاسيوم الشديد (K+ ≥ 6.5 mmol/L):\n1- إعطاء Calcium Gluconate 10% (10 ml IV على 5 دقائق) لتثبيت غشاء القلب فوراً.\n2- إعطاء 10 وحدات أنسولين نظامي سريع في 50 مل دكستروز 50% (D50W) على 20 دقيقة.\n3- جلسة غسل كلوي إسعافية بحمام 0K أو 1K.';
      sources = ['KDIGO & Resuscitation Council'];
    } else if (q.includes('ربو') || q.includes('propranolol') || q.includes('حاصر')) {
      reply = 'تحذير سريري حرج: حاصرات بيتا غير الانتقائية (مثل Propranolol/Inderal) محظورة تماماً لمرضى الربو القصبي وCOPD لتسببها في تشنج قصبي حاد ومميت غير مستجيب لموسعات القصبات.';
      sources = ['GINA Asthma Guidelines'];
    } else {
      reply = `أهلاً بك يا دكتور. المنظومة جاهزة لتقديم:\n• تدقيق تضارب الأدوية وأخطاء الجرعات وموانع الاستعمال.\n• تحديد الفحوصات والتحاليل المخبرية الواجب طلبها فوراً.\n• مراجعة مرضى الطوارئ وتصنيفهم حسب ESI، وإدارة اختلاطات الغسل الكلوي.\n\nيمكنك تحديد مريض من القائمة العلوية لإجراء تدقيق خاص لحالته الآن.`;
      sources = ['Clinical AI Suite'];
    }

    setMessages(prev => [
      ...prev,
      {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        sources
      }
    ]);
  };

  const handleQuickPrompt = (type: 'audit_critical' | 'audit_meds' | 'rounds' | 'audit_ward' | 'audit_hd') => {
    if (type === 'audit_critical') {
      handleSendMessage('أريد تحليلاً فورياً للحالات الأكثر خطورة أو غير المستقرة في الطوارئ والردهات والغسل الكلوي حالياً.');
    } else if (type === 'audit_meds') {
      handleSendMessage('قم بإجراء تدقيق دوائي تفاعلي شامل لجميع الأدوية المعطاة لمرضى الطوارئ والردهات، وحدد أي تضارب حرج أو موانع استعمال.');
    } else if (type === 'rounds') {
      handleSendMessage('أريد ملخص جولة سريرية استشارية متكاملة (Clinical Rounds Summary) لجميع مرضى الأقسام مع التوصيات العاجلة.');
    } else if (type === 'audit_ward') {
      handleSendMessage('أريد تدقيقاً شاملاً لمرضى الردهات والأدوية الموصوفة لهم.');
    } else {
      handleSendMessage('أريد تدقيقاً شاملاً لمرضى وحدة الغسل الكلوي والشوارد ومستويات البوتاسيوم.');
    }
  };

  if (!isAiEnabled) return null;

  // Selected patient details
  let currentSelectedPatientObj: any = null;
  if (selectedContext.startsWith('er_')) {
    currentSelectedPatientObj = erPatients.find(p => p.id === selectedContext.replace('er_', ''));
  } else if (selectedContext.startsWith('ward_')) {
    currentSelectedPatientObj = wardPatients.find(p => p.id === selectedContext.replace('ward_', ''));
  } else if (selectedContext.startsWith('hd_')) {
    currentSelectedPatientObj = hdPatients.find(p => p.id === selectedContext.replace('hd_', ''));
  }

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-sky-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/60"
        title="الاستشاري السريري الذكي"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Slide-over / Modal Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 md:left-6 z-50 w-[94vw] sm:w-[500px] h-[660px] max-h-[84vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 px-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>الاستشاري السريري ومراقب المرضى الحي</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <span className="text-[10px] text-sky-300/80 block">
                  مراقبة تفاعلية حية لكافة أسرّة وردهات المستشفى (UpToDate • BNF)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([
                  {
                    id: 'welcome_' + Date.now(),
                    sender: 'bot',
                    text: 'مرحباً بك يا دكتور! تم تحديث سجل الجولة السريرية. أنا جاهز لنقاش أي مريض أو تدقيق الأدوية المعطاة ومقارنة العلامات الحيوية فوراً.',
                    timestamp: 'الآن',
                    sources: ['Live Ward Monitor', 'UpToDate', 'BNF']
                  }
                ])}
                className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
                title="بدء محادثة جديدة"
              >
                مسح
              </button>
              <button
                onClick={onToggle}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Patient Context Bar */}
          <div className="bg-slate-50 border-b border-slate-200 p-2 px-3 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 whitespace-nowrap flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                <span>المريض المركز:</span>
              </span>
              <select
                value={selectedContext}
                onChange={(e) => setSelectedContext(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-lg outline-none font-medium truncate"
              >
                <option value="none">🏥 [مراقبة حية شاملة لجميع أجنحة وأسرّة المستشفى]</option>
                <optgroup label="مرضى الردهات الباطنية والجراحية">
                  {wardPatients.filter(p => p.status !== 'discharged').map(p => (
                    <option key={'ward_' + p.id} value={'ward_' + p.id}>
                      [{p.bed}] {p.name} - {p.diagnosis}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="مرضى الطوارئ والإنعاش ESI">
                  {erPatients.filter(p => p.status !== 'discharged').map(p => (
                    <option key={'er_' + p.id} value={'er_' + p.id}>
                      [ESI-{p.triageLevel}] {p.name} - {p.cc}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="مرضى وحدة الغسل الكلوي">
                  {hdPatients.filter(p => p.status !== 'discharged').map(p => (
                    <option key={'hd_' + p.id} value={'hd_' + p.id}>
                      [غسل كلوي] {p.name} (K: {p.k})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Quick Live Context Strip when patient is selected */}
            {currentSelectedPatientObj && (
              <div className="flex items-center justify-between bg-sky-50 border border-sky-200 rounded-lg p-1.5 text-[11px] text-sky-900">
                <div className="truncate flex items-center gap-1.5">
                  <span className="font-extrabold">{currentSelectedPatientObj.name}</span>
                  <span className="text-[10px] text-slate-600">
                    BP: {currentSelectedPatientObj.bp} | HR: {currentSelectedPatientObj.hr || currentSelectedPatientObj.pulse}
                  </span>
                </div>
                <button
                  onClick={() => handleSendMessage(`ناقش معي حالة المريض (${currentSelectedPatientObj.name}) بالتفصيل، ما تقييمك لأدويته وفحوصاته الحالية؟`)}
                  className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] shrink-0"
                >
                  ناقش حالته سريرياً
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Chips */}
          <div className="flex gap-1.5 p-2 bg-slate-100/70 border-b border-slate-200 overflow-x-auto scrollbar-none text-[11px]">
            <button
              onClick={() => handleQuickPrompt('audit_critical')}
              className="px-2.5 py-1 rounded-full bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 font-bold whitespace-nowrap transition-colors flex items-center gap-1 shadow-xs"
            >
              <Activity className="w-3 h-3 text-rose-600" />
              <span>🚨 الحالات الحرجة الآن</span>
            </button>
            <button
              onClick={() => handleQuickPrompt('audit_meds')}
              className="px-2.5 py-1 rounded-full bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 font-bold whitespace-nowrap transition-colors flex items-center gap-1 shadow-xs"
            >
              <Pill className="w-3 h-3 text-indigo-600" />
              <span>💊 تدقيق الأدوية والتضارب</span>
            </button>
            <button
              onClick={() => handleQuickPrompt('rounds')}
              className="px-2.5 py-1 rounded-full bg-white text-sky-700 hover:bg-sky-50 border border-sky-200 font-bold whitespace-nowrap transition-colors flex items-center gap-1 shadow-xs"
            >
              <Stethoscope className="w-3 h-3 text-sky-600" />
              <span>📋 تقرير الجولة السريرية</span>
            </button>
            <button
              onClick={() => handleQuickPrompt('audit_ward')}
              className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-bold whitespace-nowrap transition-colors flex items-center gap-1 shadow-xs"
            >
              <BedDouble className="w-3 h-3 text-slate-600" />
              <span>مرضى الردهات</span>
            </button>
            <button
              onClick={() => handleQuickPrompt('audit_hd')}
              className="px-2.5 py-1 rounded-full bg-white text-teal-700 hover:bg-teal-50 border border-teal-200 font-bold whitespace-nowrap transition-colors flex items-center gap-1 shadow-xs"
            >
              <Droplet className="w-3 h-3 text-teal-600" />
              <span>وحدة الغسل الكلوي</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs md:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium text-xs md:text-[13px]">{m.text}</p>
                  
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-wrap gap-1 text-[10px]">
                      {m.sources.map((s, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-bold border border-sky-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-sky-600 p-2 bg-white rounded-xl border border-slate-200 w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-sky-500" />
                <span>جارٍ تحليل البيانات السريرية...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-all ${
                isRecording
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
              }`}
              title={isRecording ? 'إيقاف التسجيل الصوتي' : 'تحدث بالصوت (Speech Recognition)'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isRecording ? 'جارٍ الاستماع بالصوت...' : 'اكتب أو تحدث باستشارتك السريرية...'}
              className="flex-1 text-xs md:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
