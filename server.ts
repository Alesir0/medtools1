import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// Helper function for ultra-reliable Gemini medical generation with fallback
async function generateMedicalContent(
  client: GoogleGenAI, 
  contents: string | any[], 
  systemInstruction: string, 
  temperature = 0.3
): Promise<string> {
  // Try gemini-3.1-flash-lite first for instant response (1.1s latency), or gemini-3.8-flash
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature,
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Attempt with ${model} failed, trying next:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('فشلت جميع محاولات الاتصال بالذكاء الاصطناعي.');
}

// API Route for Clinical AI Assistant Chat - Live Interactive Ward & Patient Monitor
app.post('/api/gemini/chat', async (req, res) => {
  const { 
    prompt, 
    history, 
    patientContext, 
    wardPatients, 
    emergencyPatients, 
    hdPatients, 
    customApiKey 
  } = req.body;

  const apiKeyToUse = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKeyToUse) {
    return res.status(400).json({
      error: 'لم يتم توفير مفتاح Gemini API. تم التبديل للمحرك السريري الداخلي.',
      useFallback: true,
    });
  }

  try {
    const client = new GoogleGenAI({
      apiKey: apiKeyToUse,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `أنت استشاري طبي وسريري أول مناوب (Chief Clinical Consultant & Live Ward Monitor) مدمج في منظومة المستشفى الذكية.
أنت تمتلك ذكاءً سريرياً تفاعلياً حقيقياً ومراقبة مستمرة وشاملة لجميع المرضى في الطوارئ والردهات والغسل الكلوي.
مهامك وسلوكك التفاعلي مع الطبيب المعالج:
1- ناقش الحالات السريرية مع الطبيب المعالج بتفاعل حي كامل، وكأنك تجري معه جولة سريرية مشتركة (Clinical Rounds).
2- عندما يسألك الطبيب عن مريض أو دواء، اذكر فوراً تفاصيل المريض (السرير، الفعاليات الحيوية وتطوراتها، والأدوية الحالية) وناقش معه ملائمة الجرعة، أو تضارب الأدوية، أو البدائل الأكثر أماناً.
3- عندما يسألك عن حالة الردهة أو الأقسام بشكل عام، راجع بيانات جميع الأسرّة المرفقة، ونبه الطبيب فوراً لأي مريض يحمل علامات خطورة، هبوط أكسجين، ارتفاع بوتاسيوم، أو تضارب دوائي حرج.
4- اقترح الجرعات الدقيقة، طرق الإعطاء، الفحوصات المخبرية والإشعاعية الواجب طلبها فوراً، والتحذيرات السريرية.
5- اعتمد التوصيات المحدثة من كبرى المراجع العالمية باختصار واضح: (UpToDate, BNF, KDIGO, AHA/ASA, ESC, GINA).
6- أجب بلغة عربية طبية راقية وواثقة ومباشرة، مع تنسيق النقاط والتنبيهات بوضوح.`;

    // Build real-time hospital monitoring census snapshot
    let hospitalCensus = '';
    if ((wardPatients && wardPatients.length > 0) || (emergencyPatients && emergencyPatients.length > 0) || (hdPatients && hdPatients.length > 0)) {
      hospitalCensus = `\n\n[المراقبة الحية الشاملة لكافة أجنحة وأسرّة المستشفى]:\n`;

      if (wardPatients && wardPatients.length > 0) {
        hospitalCensus += `• مرضى الردهات (${wardPatients.length}):\n`;
        wardPatients.forEach((p: any) => {
          const medsSummary = p.medications || (p.medicationList?.map((m: any) => `${m.name} (${m.dose})`).join(', ')) || 'لا توجد أدوية';
          hospitalCensus += `  - [${p.bed || 'سرير'}] ${p.name} | التشخيص: ${p.diagnosis} | الفعاليات: BP ${p.bp}, HR ${p.pulse}, SpO2 ${p.spo2}%, Temp ${p.temp} | الأدوية: ${medsSummary}\n`;
        });
      }

      if (emergencyPatients && emergencyPatients.length > 0) {
        hospitalCensus += `• مرضى الطوارئ (${emergencyPatients.length}):\n`;
        emergencyPatients.forEach((p: any) => {
          const medsSummary = p.administeredMeds?.map((m: any) => `${m.name} (${m.dose} ${m.route})`).join(', ') || 'لم يُعطَ دواء بعد';
          hospitalCensus += `  - [ESI-${p.triageLevel}] ${p.name} (${p.age} سنة) | الشكوى: ${p.cc} | الفعاليات: BP ${p.bp}, HR ${p.hr}, SpO2 ${p.spo2}%, GCS ${p.gcs} | الأدوية المعطاة: ${medsSummary}\n`;
        });
      }

      if (hdPatients && hdPatients.length > 0) {
        hospitalCensus += `• مرضى الغسل الكلوي (${hdPatients.length}):\n`;
        hdPatients.forEach((p: any) => {
          hospitalCensus += `  - ${p.name} | K+: ${p.k} mmol/L | احتباس السوائل: +${(p.preWeight - p.dryWeight).toFixed(1)} L | BP: ${p.bp}\n`;
        });
      }
    }

    let currentPromptWithContext = prompt;
    if (patientContext) {
      currentPromptWithContext = `[المريض قيد النقاش المركز الآن]:\n${JSON.stringify(patientContext, null, 2)}\n\n[استفسار الطبيب]:\n${prompt}`;
    }

    if (hospitalCensus) {
      currentPromptWithContext = `${hospitalCensus}\n\n${currentPromptWithContext}`;
    }

    // Build multi-turn content if history is provided
    let contentsToGenerate: any;
    if (Array.isArray(history) && history.length > 0) {
      const formattedHistory = history.slice(-8).map((m: any) => ({
        role: m.sender === 'user' || m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
      contentsToGenerate = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: currentPromptWithContext }] }
      ];
    } else {
      contentsToGenerate = currentPromptWithContext;
    }

    const reply = await generateMedicalContent(client, contentsToGenerate, systemInstruction, 0.3);

    return res.json({
      reply: reply || 'تمت معالجة الاستشارة السريرية بنجاح.',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error?.message || 'حدث خطأ أثناء الاتصال بمحرك Gemini.',
      useFallback: true,
    });
  }
});

// API Route for Automated Multi-Patient Clinical Audit
app.post('/api/gemini/audit', async (req, res) => {
  const { patients, department, customApiKey } = req.body;
  const apiKeyToUse = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKeyToUse) {
    return res.status(400).json({
      error: 'لا يوجد مفتاح API. استخدام التدقيق الداخلي.',
      useFallback: true,
    });
  }

  try {
    const client = new GoogleGenAI({
      apiKey: apiKeyToUse,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const promptText = `قم بإجراء تدقيق سريري شامل وعاجل للمرضى التاليين في قسم (${department}):
${JSON.stringify(patients, null, 2)}

لكل مريض، حدد:
1- تضارب الأدوية (Drug Interactions).
2- أخطاء طبية أو موانع استعمال (Contraindications / Medical Errors).
3- الفحوصات والتحاليل المخبرية أو الإشعاعية الإلزامية التي يجب طلبها فوراً.
قدم التقرير ملخصاً في نقاط مركزة وواضحة سريرياً.`;

    const report = await generateMedicalContent(
      client, 
      promptText, 
      'أنت مدقق جودة وسلامة دوائية وسريرية أول بمستشفى تخصصي. أجب بالعربية السريرية باحترافية وتنبيهات بالألوان.',
      0.2
    );

    return res.json({
      report: report || 'اكتمل التدقيق السريري بنجاح.',
    });
  } catch (error: any) {
    console.error('Audit Error:', error);
    return res.status(500).json({
      error: error?.message || 'خطأ أثناء تدقيق المرضى.',
      useFallback: true,
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
}

startServer();
