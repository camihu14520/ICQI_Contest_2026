import { CompetitionRegistration, DomainCategory, TrackType, ReviewStatus } from '../types/competition';

const STORAGE_KEY = 'cycu_icqi_2026_registrations';
const SETTINGS_KEY = 'cycu_icqi_2026_settings';

export interface AppSettings {
  spreadsheetId: string;
  spreadsheetUrl: string;
  coordinatorEmail: string;
  autoSyncToSheet: boolean;
  autoSendEmail: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  spreadsheetId: '18APyNoO07AO4ZxM1QIrwCi0EzSHntOvBVc1C7sMFWdM',
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/18APyNoO07AO4ZxM1QIrwCi0EzSHntOvBVc1C7sMFWdM/edit?usp=sharing',
  coordinatorEmail: 'yihsuan@cycu.edu.tw',
  autoSyncToSheet: true,
  autoSendEmail: true,
};

// Seed realistic registrations for testing and demoing the status lookup and pass ID generation
const SEED_DATA: CompetitionRegistration[] = [
  {
    id: 'CYCU-AI-2026-P001',
    category: 'ai',
    track: 'implementation',
    applicationDomain: '智慧醫療與健康',
    projectName: '多模態生醫影像即時辨識與病灶邊界預測系統',
    projectEnName: 'Real-time Multimodal Biomedical Image Segmentation and Lesion Edge Prediction',
    teamName: '智醫先鋒隊',
    abstract: '本專案結合視覺卷積神經網路與邊緣運算硬體，針對超音波影像與MRI多模態生醫資料進行即時影像增強與微細病灶分割。透過輕量化模型架構設計，在嵌入式裝置即可達到 45 FPS 之即時推理速度，並達到 94.2% 之 Dice 係數精確度，有效輔助臨床前線醫師提高初步篩檢判讀效率與降低偽陽性率。',
    leader: {
      name: '林宇軒',
      school: '中原大學',
      department: '智慧運算與大數據學士班',
      grade: '四年級',
      studentId: '11027101',
      phone: '0912-345-678',
      email: 'lin.yh@example.edu.tw'
    },
    members: [
      {
        name: '張庭瑋',
        school: '中原大學',
        department: '資訊工程學系',
        grade: '三年級',
        studentId: '11127202',
        phone: '0922-111-222',
        email: 'chang.tw@example.edu.tw'
      },
      {
        name: '陳姿穎',
        school: '中原大學',
        department: '生物醫學工程學系',
        grade: '四年級',
        studentId: '11025303',
        phone: '0933-444-555',
        email: 'chen.ty@example.edu.tw'
      }
    ],
    advisors: [
      {
        name: '胡筱薇',
        institution: '中原大學 智慧運算與量子資訊學院',
        title: '副教授',
        email: 'cami@cycu.edu.tw',
        phone: '03-265-4080'
      }
    ],
    reportDocUrl: 'https://drive.google.com/file/d/sample-report-ai-01/view',
    consentFormUrl: 'https://drive.google.com/file/d/sample-consent-ai-01/view',
    demoUrl: 'https://youtu.be/sample-demo-ai01',
    submittedAt: '2026-10-02 14:32:00',
    updatedAt: '2026-10-02 14:32:00',
    status: 'passed_prelim',
    adminNotes: '書面資料與授權書完整，主題具臨床實用性，符合初審規格。',
    syncedToGoogleSheet: true,
    emailSent: true
  },
  {
    id: 'CYCU-QC-2026-P001',
    category: 'quantum',
    track: 'implementation',
    applicationDomain: '量子金融與商務',
    projectName: 'QAOA 量子近似最佳化演算法於動態投資組合避險策略之實作',
    projectEnName: 'Dynamic Portfolio Hedging Strategy Using Quantum Approximate Optimization Algorithm (QAOA)',
    teamName: '量子方舟',
    abstract: '針對非凸投資組合最佳化難題，本專案實作基於 QAOA (Quantum Approximate Optimization Algorithm) 的動態風險對沖模型。在 IBM Quantum 雲端環境與量子模擬器上進行標的資產權重分配與極值回測，證實在中大規模多資產條件下，相較於傳統二次規劃可在更短迭代收斂至近似全域最佳解，大幅降低極端市場波動下之回撤幅度。',
    leader: {
      name: '黃柏翰',
      school: '清華大學',
      department: '物理學系',
      grade: '碩士班二年級',
      studentId: 'M1130101',
      phone: '0988-777-666',
      email: 'huang.ph@example.edu.tw'
    },
    members: [
      {
        name: '李佳蓉',
        school: '中原大學',
        department: '財務金融學系',
        grade: '碩士班一年級',
        studentId: 'M1140502',
        phone: '0977-888-999',
        email: 'lee.jr@example.edu.tw'
      }
    ],
    advisors: [
      {
        name: '邱謙松',
        institution: '中原大學 量子資訊中心',
        title: '特聘教授兼院長',
        email: 'chiu.cs@cycu.edu.tw',
        phone: '03-265-4001'
      }
    ],
    reportDocUrl: 'https://drive.google.com/file/d/sample-report-qc-01/view',
    consentFormUrl: 'https://drive.google.com/file/d/sample-consent-qc-01/view',
    demoUrl: 'https://github.com/sample/qaoa-hedging',
    submittedAt: '2026-10-03 10:15:20',
    updatedAt: '2026-10-03 10:15:20',
    status: 'finalist',
    adminNotes: '演算法實作完整且有量子硬體驗證數據，入圍決賽。',
    syncedToGoogleSheet: true,
    emailSent: true
  },
  {
    id: 'CYCU-AI-2026-C001',
    category: 'ai',
    track: 'concept',
    applicationDomain: '智慧社會與公共治理',
    projectName: '微型邊緣 AI 驅動之社區防汛排水智慧預警網絡構想',
    projectEnName: 'Micro Edge-AI Driven Community Flood Warning Network Concept',
    teamName: '綠水保衛隊',
    abstract: '針對極端氣候強降雨引發之都會低窪地區淹水危機，本團隊構想以超低功耗微型攝影模組與TinyML技術，佈建於側溝與地下涵洞節點。藉由即時影像特徵辨識淤積落葉雜物與水位上升梯度，連鎖觸發社區蜂巢預警與抽水閘門自動啟閉機制，提出低成本、易維護之分散式智慧防災架構。',
    leader: {
      name: '王思涵',
      school: '成功大學',
      department: '都市計劃學系',
      grade: '三年級',
      studentId: 'E1408102',
      phone: '0966-333-222',
      email: 'wang.sh@example.edu.tw'
    },
    members: [
      {
        name: '柯冠宇',
        school: '中原大學',
        department: '土木工程學系',
        grade: '三年級',
        studentId: '11116201',
        phone: '0955-444-111',
        email: 'ko.ky@example.edu.tw'
      }
    ],
    advisors: [
      {
        name: '張文華',
        institution: '中原大學 電機資訊學院',
        title: '助理教授',
        email: 'chang.wh@cycu.edu.tw',
        phone: '03-265-4500'
      }
    ],
    reportDocUrl: 'https://drive.google.com/file/d/sample-report-ai-c01/view',
    consentFormUrl: 'https://drive.google.com/file/d/sample-consent-ai-c01/view',
    submittedAt: '2026-10-04 16:40:10',
    updatedAt: '2026-10-04 16:40:10',
    status: 'pending',
    syncedToGoogleSheet: true,
    emailSent: true
  }
];

export const getRegistrations = (): CompetitionRegistration[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load registrations:', e);
    return SEED_DATA;
  }
};

export const saveRegistration = (reg: CompetitionRegistration): void => {
  const current = getRegistrations();
  const index = current.findIndex(item => item.id === reg.id);
  if (index >= 0) {
    current[index] = reg;
  } else {
    current.unshift(reg);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const updateRegistrationStatus = (
  id: string, 
  status: ReviewStatus, 
  adminNotes?: string
): CompetitionRegistration | null => {
  const current = getRegistrations();
  const target = current.find(item => item.id === id);
  if (!target) return null;

  target.status = status;
  if (adminNotes !== undefined) target.adminNotes = adminNotes;
  target.updatedAt = new Date().toLocaleString('zh-TW', { hour12: false });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return target;
};

/**
 * Generate next sequential certificate / pass ID according to rules:
 * Category: AI -> AI, Quantum -> QC
 * Track: Implementation -> P (Practice/Project), Concept -> C (Creative Concept)
 * Year: 2026
 * Format: CYCU-[AI|QC]-2026-[P|C]XXX
 */
export const generateNextPassId = (category: DomainCategory, track: TrackType): string => {
  const current = getRegistrations();
  const domainCode = category === 'ai' ? 'AI' : 'QC';
  const trackCode = track === 'implementation' ? 'P' : 'C';
  const prefix = `CYCU-${domainCode}-2026-${trackCode}`;

  const matchingIds = current
    .map(r => r.id)
    .filter(id => id.startsWith(prefix));

  let maxNum = 0;
  matchingIds.forEach(id => {
    const numPart = id.replace(prefix, '');
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed) && parsed > maxNum) {
      maxNum = parsed;
    }
  });

  const nextNum = (maxNum + 1).toString().padStart(3, '0');
  return `${prefix}${nextNum}`;
};

export const getSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (newSettings: Partial<AppSettings>): AppSettings => {
  const updated = { ...getSettings(), ...newSettings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
};
