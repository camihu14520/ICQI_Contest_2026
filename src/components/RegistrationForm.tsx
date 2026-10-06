import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  AlertCircle,
  HelpCircle,
  Link as LinkIcon,
  Layers,
  Cpu,
  Atom,
  Users,
  User,
  GraduationCap
} from 'lucide-react';
import { 
  CompetitionRegistration, 
  DomainCategory, 
  TrackType, 
  ApplicationField, 
  StudentMember, 
  AdvisorMember 
} from '../types/competition';
import { generateNextPassId, saveRegistration, getSettings } from '../services/storage';
import { appendRegistrationRow } from '../services/googleSheets';
import { sendRegistrationNotificationEmail, DEFAULT_COORDINATOR_EMAIL } from '../services/gmail';

interface RegistrationFormProps {
  onSuccessfulSubmit: (reg: CompetitionRegistration) => void;
  onNavigateLookup?: () => void;
}

const DOMAIN_OPTIONS: { id: DomainCategory; name: string; icon: any; desc: string }[] = [
  { 
    id: 'ai', 
    name: '人工智慧領域 (AI)', 
    icon: Cpu, 
    desc: '生成式AI、機器學習、深度視覺、NLP、邊緣運算及多元場域應用' 
  },
  { 
    id: 'quantum', 
    name: '量子計算領域 (Quantum)', 
    icon: Atom, 
    desc: '量子演算法、量子模擬器、QAOA、量子金融、密鑰協議與前瞻突破' 
  }
];

const TRACK_OPTIONS: { id: TrackType; name: string; desc: string; badge: string }[] = [
  {
    id: 'implementation',
    name: '實作組 (Implementation Track)',
    desc: '需具備實際軟硬體系統、演算法模型、具體成果展示或可驗證 Demo',
    badge: '系統成果'
  },
  {
    id: 'concept',
    name: '創意構想組 (Concept Track)',
    desc: '提出前瞻人工智慧或量子計算之創新架構設計構想與商業解決方案',
    badge: '前瞻構想'
  }
];

const APPLICATION_FIELDS: ApplicationField[] = [
  '智慧醫療與健康',
  '量子金融與商務',
  '工程與科學運算',
  '智慧社會與公共治理',
  '前瞻AI創新應用',
  '國防與永續創新',
  '其他'
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccessfulSubmit,
  onNavigateLookup
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState<DomainCategory>('ai');
  const [track, setTrack] = useState<TrackType>('implementation');
  const [applicationDomain, setApplicationDomain] = useState<ApplicationField>('智慧醫療與健康');
  const [customDomain, setCustomDomain] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectEnName, setProjectEnName] = useState('');
  const [teamName, setTeamName] = useState('');

  // Leader
  const [leader, setLeader] = useState<StudentMember>({
    name: '',
    school: '',
    department: '',
    grade: '三年級',
    studentId: '',
    phone: '',
    email: ''
  });

  // Additional members (0 to 3)
  const [members, setMembers] = useState<StudentMember[]>([]);

  // Advisors (1 to 2)
  const [advisors, setAdvisors] = useState<AdvisorMember[]>([
    {
      name: '',
      institution: '',
      title: '教授',
      email: '',
      phone: ''
    }
  ]);

  // Abstract & Files
  const [abstract, setAbstract] = useState('');
  const [reportDocUrl, setReportDocUrl] = useState('');
  const [consentFormUrl, setConsentFormUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  // Confirmation dialog state for Workspace mutating operations
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState<CompetitionRegistration | null>(null);
  const [submittedRegistration, setSubmittedRegistration] = useState<CompetitionRegistration | null>(null);

  const handleResetForm = () => {
    setSubmittedRegistration(null);
    setCurrentStep(1);
    setCategory('ai');
    setTrack('implementation');
    setApplicationDomain('智慧醫療與健康');
    setCustomDomain('');
    setProjectName('');
    setProjectEnName('');
    setTeamName('');
    setLeader({
      name: '',
      school: '',
      department: '',
      grade: '三年級',
      studentId: '',
      phone: '',
      email: ''
    });
    setMembers([]);
    setAdvisors([
      {
        name: '',
        institution: '',
        title: '教授',
        email: '',
        phone: ''
      }
    ]);
    setAbstract('');
    setReportDocUrl('');
    setConsentFormUrl('');
    setDemoUrl('');
    setErrorMessage('');
  };

  // Dynamic Members Handling
  const handleAddMember = () => {
    if (members.length >= 3) {
      alert('每隊至多 4 位學生（隊長 1 位 + 組員至多 3 位）！');
      return;
    }
    setMembers([
      ...members,
      {
        name: '',
        school: leader.school || '',
        department: '',
        grade: '三年級',
        studentId: '',
        phone: '',
        email: ''
      }
    ]);
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleUpdateMember = (idx: number, field: keyof StudentMember, value: string) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: value };
    setMembers(updated);
  };

  // Dynamic Advisors Handling
  const handleAddAdvisor = () => {
    if (advisors.length >= 2) {
      alert('每組至多 2 位指導老師！');
      return;
    }
    setAdvisors([
      ...advisors,
      {
        name: '',
        institution: advisors[0]?.institution || '',
        title: '助理教授',
        email: '',
        phone: ''
      }
    ]);
  };

  const handleRemoveAdvisor = (idx: number) => {
    if (advisors.length <= 1) {
      alert('每組至少需有 1 位指導老師！');
      return;
    }
    setAdvisors(advisors.filter((_, i) => i !== idx));
  };

  const handleUpdateAdvisor = (idx: number, field: keyof AdvisorMember, value: string) => {
    const updated = [...advisors];
    updated[idx] = { ...updated[idx], [field]: value };
    setAdvisors(updated);
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    setErrorMessage(null);

    if (step === 1) {
      if (!projectName.trim()) {
        setErrorMessage('請填寫作品中文名稱');
        return false;
      }
      if (!teamName.trim()) {
        setErrorMessage('請填寫隊伍名稱');
        return false;
      }
      if (applicationDomain === '其他' && !customDomain.trim()) {
        setErrorMessage('選擇「其他」應用領域時，請自行填寫具體領域名稱');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!leader.name.trim()) {
        setErrorMessage('請填寫隊長姓名');
        return false;
      }
      if (!leader.school.trim() || !leader.department.trim()) {
        setErrorMessage('請填寫隊長就讀學校與科系');
        return false;
      }
      if (!leader.studentId.trim()) {
        setErrorMessage('請填寫隊長學號');
        return false;
      }
      if (!leader.phone.trim() || !leader.email.trim()) {
        setErrorMessage('請填寫隊長聯絡電話與 Email');
        return false;
      }
      // Check each member
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m.name.trim() || !m.school.trim() || !m.studentId.trim()) {
          setErrorMessage(`請完整填寫組員 ${i + 1} 的姓名、學校及學號`);
          return false;
        }
      }
      return true;
    }

    if (step === 3) {
      for (let i = 0; i < advisors.length; i++) {
        const a = advisors[i];
        if (!a.name.trim() || !a.institution.trim()) {
          setErrorMessage(`請填寫指導老師 ${i + 1} 的姓名與服務學校/機構`);
          return false;
        }
      }
      return true;
    }

    if (step === 4) {
      if (!abstract.trim() || abstract.trim().length < 50) {
        setErrorMessage('作品摘要請詳實填寫（建議 300 ~ 500 字，目前不足 50 字）');
        return false;
      }
      if (!reportDocUrl.trim()) {
        setErrorMessage('請提供書面報告書（上限10頁）之雲端硬碟公開分享連結');
        return false;
      }
      if (!consentFormUrl.trim()) {
        setErrorMessage('請提供著作權授權暨個資使用同意書（含指導老師簽署）之雲端公開連結');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Prepare submission & preview
  const handleInitiateSubmit = () => {
    if (!validateStep(4)) return;

    const passId = generateNextPassId(category, track);
    const nowStr = new Date().toLocaleString('zh-TW', { hour12: false });
    const finalDomain = (applicationDomain === '其他' && customDomain.trim()) 
      ? `其他 - ${customDomain.trim()}` 
      : applicationDomain;

    const newReg: CompetitionRegistration = {
      id: passId,
      category,
      track,
      applicationDomain: finalDomain as ApplicationField,
      projectName,
      projectEnName,
      teamName,
      leader,
      members,
      advisors,
      abstract,
      reportDocUrl,
      consentFormUrl,
      demoUrl,
      submittedAt: nowStr,
      updatedAt: nowStr,
      status: 'pending',
      syncedToGoogleSheet: false,
      emailSent: false
    };

    setPendingRegistration(newReg);
    setShowConfirmModal(true);
  };

  // Perform Final Execution (including Workspace API confirmations)
  const handleConfirmAndExecute = async () => {
    if (!pendingRegistration) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    const reg = { ...pendingRegistration };

    try {
      const settings = getSettings();

      // 1. Google Spreadsheet Sync
      if (settings.spreadsheetId) {
        try {
          await appendRegistrationRow(settings.spreadsheetId, reg);
          reg.syncedToGoogleSheet = true;
        } catch (sheetErr) {
          console.warn('Google Sheet append error:', sheetErr);
        }
      }

      // 2. Automated Gmail Notification to Competition Director / Organizer
      if (settings.autoSendEmail) {
        try {
          const recipient = settings.coordinatorEmail || DEFAULT_COORDINATOR_EMAIL;
          await sendRegistrationNotificationEmail(reg, recipient);
          reg.emailSent = true;
        } catch (emailErr) {
          console.warn('Gmail sending error:', emailErr);
        }
      }

      // 3. Persist locally to platform database
      saveRegistration(reg);

      // 4. Directly display completed view
      setSubmittedRegistration(reg);

      // 5. Notify parent
      onSuccessfulSubmit(reg);

    } catch (err: any) {
      alert(`報名處理過程發生錯誤：${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: '領域與題目' },
    { num: 2, title: '團隊與隊長' },
    { num: 3, title: '指導老師' },
    { num: 4, title: '摘要與檔案' },
    { num: 5, title: '預覽與確認' }
  ];

  return (
    <section id="register" className="py-16 sm:py-20 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {submittedRegistration ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 sm:p-12 text-center animate-fadeIn max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                報名完成
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                報名已完成！
              </h3>
              <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                感謝您參與 2026 全國智慧運算與量子資訊創新應用競賽，您的報名資料已正式受理。
              </p>
            </div>

            {/* Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase">參賽證編號</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-blue-700">
                  {submittedRegistration.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 block">參賽隊伍：</span>
                  <span className="font-bold text-slate-900 text-sm">{submittedRegistration.teamName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">參賽組別：</span>
                  <span className="font-semibold text-slate-900">
                    {submittedRegistration.category === 'ai' ? '人工智慧' : '量子計算'} · {submittedRegistration.track === 'implementation' ? '實作組' : '創意構想組'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block">作品名稱：</span>
                  <span className="font-semibold text-slate-900">{submittedRegistration.projectName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">隊長姓名：</span>
                  <span className="font-semibold text-slate-900">{submittedRegistration.leader.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">隊長 Email：</span>
                  <span className="font-semibold text-slate-900">{submittedRegistration.leader.email}</span>
                </div>
              </div>

              {/* Status indicators */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>報名資料已正式登記於競賽資料庫，核發專屬參賽證號</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed text-left">
              <strong>💡 貼心提醒：</strong>
              <p className="mt-1">
                請妥善記錄您的參賽證編號 <strong>{submittedRegistration.id}</strong>。
                初審結果預計於 2026/11/25 前公告，您可隨時至「參賽證查詢」專區輸入證號或隊長 Email 查詢最新審核進度。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
              >
                再填寫一筆報名
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onNavigateLookup) {
                    onNavigateLookup();
                  } else {
                    const lookupEl = document.getElementById('lookup');
                    if (lookupEl) lookupEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>前往進度查詢專區</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 mb-3">
                <FileText className="w-3.5 h-3.5" />
                線上報名系統
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                2026 全國競賽線上報名表單
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                請確實填寫參賽領域、團隊成員與作品檔案，送出後系統將即時核發專屬參賽證號。
              </p>
            </div>

        {/* Progress Bar Component */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-0 hidden sm:block"></div>
            {/* Active filled line */}
            <div 
              className="absolute top-5 left-0 h-1 bg-blue-600 -z-0 transition-all duration-300 hidden sm:block"
              style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
            ></div>

            {/* Steps indicator */}
            <div className="grid grid-cols-5 gap-2 relative z-10">
              {stepsList.map((s) => {
                const isCompleted = currentStep > s.num;
                const isCurrent = currentStep === s.num;
                return (
                  <div key={s.num} className="flex flex-col items-center text-center">
                    <button
                      type="button"
                      disabled={s.num > currentStep}
                      onClick={() => {
                        if (s.num < currentStep) setCurrentStep(s.num);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        isCompleted
                          ? 'bg-blue-600 text-white shadow-sm'
                          : isCurrent
                          ? 'bg-white border-2 border-blue-600 text-blue-600 ring-4 ring-blue-100 shadow-md'
                          : 'bg-slate-100 border border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                    </button>
                    <span className={`text-xs mt-2 font-medium truncate max-w-[80px] sm:max-w-none ${
                      isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10">

          {/* STEP 1: Domain & Project Title */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  步驟 1：選擇參賽領域、組別與作品資訊
                </h3>
                <p className="text-xs text-slate-500">
                  請選擇最符合您作品核心技術之領域及組別。
                </p>
              </div>

              {/* Category Radio Cards */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800">
                  1. 競賽領域 (科技主題) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DOMAIN_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = category === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setCategory(opt.id)}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-slate-900 text-base">{opt.name}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{opt.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Track Radio Cards */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800">
                  2. 參賽組別 (性質分組) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TRACK_OPTIONS.map((t) => {
                    const isSelected = track === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setTrack(t.id)}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900 text-base">{t.name}</span>
                          <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{t.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Field Select */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800">
                  3. 應用領域類別 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={applicationDomain}
                  onChange={(e) => setApplicationDomain(e.target.value as ApplicationField)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
                >
                  {APPLICATION_FIELDS.map(f => (
                    <option key={f} value={f}>
                      {f === '其他' ? '其他 (由參賽者自行填寫)' : f}
                    </option>
                  ))}
                </select>

                {applicationDomain === '其他' && (
                  <div className="pt-2 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      請自行填寫應用領域名稱 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="例：智慧農業與生態環境監測、低碳供應鏈最佳化、海洋能源預測等..."
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-blue-50/30"
                    />
                  </div>
                )}
              </div>

              {/* Titles */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    4. 作品中文名稱 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="例：多模態生醫影像即時辨識與病灶邊界預測系統"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    5. 作品英文名稱 (選填)
                  </label>
                  <input
                    type="text"
                    value={projectEnName}
                    onChange={(e) => setProjectEnName(e.target.value)}
                    placeholder="例：Real-time Multimodal Biomedical Image Segmentation"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    6. 隊伍名稱 (參賽隊名) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="例：智醫先鋒隊"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Team Leader & Members */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  步驟 2：隊長與團隊成員資料
                </h3>
                <p className="text-xs text-slate-500">
                  競賽規範：每組 1 至 4 位學生組成，每人至多報名 1 組，歡迎跨校或跨系聯合組隊。
                </p>
              </div>

              {/* Team Leader Box */}
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    代表
                  </div>
                  <h4 className="text-base font-bold text-slate-900">隊長資料 (主要聯絡窗口)</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      隊長姓名 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leader.name}
                      onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                      placeholder="例：林宇軒"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      就讀學校 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leader.school}
                      onChange={(e) => setLeader({ ...leader, school: e.target.value })}
                      placeholder="例：中原大學"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      學系 / 研究所 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leader.department}
                      onChange={(e) => setLeader({ ...leader, department: e.target.value })}
                      placeholder="例：智慧運算與大數據學士班"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      年級 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={leader.grade}
                      onChange={(e) => setLeader({ ...leader, grade: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="一年級">一年級</option>
                      <option value="二年級">二年級</option>
                      <option value="三年級">三年級</option>
                      <option value="四年級">四年級</option>
                      <option value="碩士班一年級">碩士班一年級</option>
                      <option value="碩士班二年級">碩士班二年級</option>
                      <option value="博士班">博士班</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      學號 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leader.studentId}
                      onChange={(e) => setLeader({ ...leader, studentId: e.target.value })}
                      placeholder="例：11027101"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      聯絡手機 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={leader.phone}
                      onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                      placeholder="例：0912-345-678"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      電子信箱 (將接收報名與審核通知) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={leader.email}
                      onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                      placeholder="例：lin.yh@example.edu.tw"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Members Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      其他團隊成員 ({members.length}/3 位)
                    </h4>
                    <span className="text-xs text-slate-500">若為個人參賽可無需新增成員</span>
                  </div>

                  {members.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="px-3.5 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>新增組員</span>
                    </button>
                  )}
                </div>

                {members.map((m, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">隊員 {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="移除組員"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-2xs font-semibold text-slate-600 mb-1">姓名 *</label>
                        <input
                          type="text"
                          required
                          value={m.name}
                          onChange={(e) => handleUpdateMember(idx, 'name', e.target.value)}
                          placeholder="姓名"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-semibold text-slate-600 mb-1">學校 *</label>
                        <input
                          type="text"
                          required
                          value={m.school}
                          onChange={(e) => handleUpdateMember(idx, 'school', e.target.value)}
                          placeholder="學校"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-semibold text-slate-600 mb-1">學系年級 *</label>
                        <input
                          type="text"
                          required
                          value={m.department}
                          onChange={(e) => handleUpdateMember(idx, 'department', e.target.value)}
                          placeholder="科系年級"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-semibold text-slate-600 mb-1">學號 *</label>
                        <input
                          type="text"
                          required
                          value={m.studentId}
                          onChange={(e) => handleUpdateMember(idx, 'studentId', e.target.value)}
                          placeholder="學號"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-semibold text-slate-600 mb-1">電話</label>
                        <input
                          type="tel"
                          value={m.phone}
                          onChange={(e) => handleUpdateMember(idx, 'phone', e.target.value)}
                          placeholder="手機號碼"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-semibold text-slate-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={m.email}
                          onChange={(e) => handleUpdateMember(idx, 'email', e.target.value)}
                          placeholder="電子郵件"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Advisors */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    步驟 3：指導老師名單 (1 至 2 位)
                  </h3>
                  <p className="text-xs text-slate-500">
                    請填妥大專校院現職指導老師資訊，將列入競賽名冊與獲獎獎狀。
                  </p>
                </div>

                {advisors.length < 2 && (
                  <button
                    type="button"
                    onClick={handleAddAdvisor}
                    className="px-3.5 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增第 2 位指導老師</span>
                  </button>
                )}
              </div>

              {advisors.map((adv, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <h4 className="text-base font-bold text-slate-900">
                        指導老師 {idx + 1} {idx === 0 && '(主要指導)'}
                      </h4>
                    </div>
                    {advisors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAdvisor(idx)}
                        className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>刪除</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        老師姓名 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={adv.name}
                        onChange={(e) => handleUpdateAdvisor(idx, 'name', e.target.value)}
                        placeholder="例：胡筱薇"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        服務單位 / 學校系所 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={adv.institution}
                        onChange={(e) => handleUpdateAdvisor(idx, 'institution', e.target.value)}
                        placeholder="例：中原大學 智慧運算與量子資訊學院"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        職稱 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={adv.title}
                        onChange={(e) => handleUpdateAdvisor(idx, 'title', e.target.value)}
                        placeholder="例：副教授 / 教授 / 助理教授"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        聯絡電話 / 分機
                      </label>
                      <input
                        type="tel"
                        value={adv.phone}
                        onChange={(e) => handleUpdateAdvisor(idx, 'phone', e.target.value)}
                        placeholder="例：03-265-4080"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        電子郵件 Email
                      </label>
                      <input
                        type="email"
                        value={adv.email}
                        onChange={(e) => handleUpdateAdvisor(idx, 'email', e.target.value)}
                        placeholder="例：advisor@cycu.edu.tw"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: Abstract & Document Links */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  步驟 4：作品摘要與書面檔案繳交
                </h3>
                <p className="text-xs text-slate-500">
                  書面報告上限至多 10 頁。請將檔案上傳至 Google 雲端硬碟、OneDrive 或 Dropbox 並設定為「知道連結的人皆可檢視」。
                </p>
              </div>

              {/* CRITICAL WARNING CALLOUT */}
              <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-950 flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <div className="font-black text-rose-800 text-sm sm:text-base flex items-center gap-1.5">
                    <span>⚠️ 雲端硬碟公開檢視權限特別警語（未設定將不予評分）：</span>
                  </div>
                  <p className="leading-relaxed font-bold text-rose-900">
                    請務必確認將雲端硬碟檔案之共用權限設定為「知道連結的人皆可檢視」！
                  </p>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    若權限設定錯誤，以致評審委員審查時無法點擊開啟閱讀，<strong>則該項目不予評分</strong>，請各隊務必在送出前使用瀏覽器「無痕視窗」確認不需登入即可順暢瀏覽。
                  </p>
                </div>
              </div>

              {/* Abstract */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-bold text-slate-800">
                    作品中文摘要 (300 ~ 500 字) <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-xs ${
                    abstract.length >= 300 && abstract.length <= 600 ? 'text-emerald-600 font-bold' : 'text-slate-400'
                  }`}>
                    已輸入 {abstract.length} 字 (建議 300 ~ 500 字)
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="請簡明扼要說明本作品的研究背景痛點、所運用的智慧運算或量子技術架構、創新特色、實作成果或預期效益..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
                />
              </div>

              {/* Document 1: Report Doc */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                  <label className="block text-sm font-bold text-slate-900">
                    書面報告書雲端分享連結 (至多 10 頁) <span className="text-rose-500">*</span>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  請依照官方格式範本撰寫（至多10頁，PDF 檔為佳），上傳至雲端硬碟後貼上公開檢視連結。
                </p>
                <div className="p-2.5 bg-amber-50 rounded-lg text-2xs text-amber-900 font-semibold border border-amber-200">
                  ⚠️ 請提供雲端硬碟公開檢視連結（若權限設定錯誤，以致無法閱讀，則不予評分）
                </div>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    required
                    value={reportDocUrl}
                    onChange={(e) => setReportDocUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Document 2: Consent Form */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <label className="block text-sm font-bold text-slate-900">
                    全組著作權授權暨個資使用同意書連結 <span className="text-rose-500">*</span>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  須包含全體參賽學生與指導老師親筆簽署（或電子簽名掃描檔），請提供雲端硬碟公開檢視連結。
                </p>
                <div className="p-2.5 bg-amber-50 rounded-lg text-2xs text-amber-900 font-semibold border border-amber-200">
                  ⚠️ 請提供雲端硬碟公開檢視連結（若權限設定錯誤，以致無法閱讀，則不予評分）
                </div>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    required
                    value={consentFormUrl}
                    onChange={(e) => setConsentFormUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Document 3: Demo video / repo (optional) */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                  <label className="block text-sm font-bold text-slate-900">
                    成果展示影片或系統演示連結 (選填)
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  可附 YouTube / Bilibili 影片或 GitHub / 線上系統 Demo 網址，實作組推薦附上。
                </p>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://youtu.be/... 或 https://github.com/..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 5: Final Preview & Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  步驟 5：報名資料總覽確認與參賽證號核發
                </h3>
                <p className="text-xs text-slate-500">
                  送出後系統將立即自動生成專屬參賽證編號並正式受理報名。
                </p>
              </div>

              {/* Generated Pass ID Banner Preview */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 text-white shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-2xs font-semibold text-cyan-300 uppercase tracking-widest">
                      系統預計核發參賽證號 (Anticipated Pass ID)
                    </span>
                    <div className="text-2xl font-black font-mono tracking-tight text-white mt-0.5">
                      {generateNextPassId(category, track)}
                    </div>
                  </div>
                  <div className="text-xs text-cyan-200 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                    {category === 'ai' ? '人工智慧' : '量子計算'} · {track === 'implementation' ? '實作組' : '創意組'}
                  </div>
                </div>
              </div>

              {/* Summary Review Card */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4 text-sm bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block">作品名稱</span>
                    <strong className="text-slate-900">{projectName}</strong>
                    {projectEnName && <span className="text-xs text-slate-500 block">{projectEnName}</span>}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">參賽隊伍</span>
                    <strong className="text-slate-900">{teamName}</strong>
                    <span className="text-xs text-blue-600 block">領域：{applicationDomain}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">隊長代表</span>
                    <span className="text-slate-800 font-semibold">{leader.name}</span>
                    <span className="text-xs text-slate-500 block">{leader.school} {leader.department} ({leader.grade})</span>
                    <span className="text-xs text-slate-500 block">學號：{leader.studentId} | {leader.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">團隊組員 ({members.length} 人)</span>
                    <span className="text-xs text-slate-700 block">
                      {members.length > 0 
                        ? members.map(m => `${m.name} (${m.school})`).join('、')
                        : '無其他成員 (個人參賽)'}
                    </span>
                    <span className="text-xs text-slate-400 block mt-2">指導老師 ({advisors.length} 位)</span>
                    <span className="text-xs text-slate-700 block">
                      {advisors.map(a => `${a.name} (${a.institution})`).join('、')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80">
                  <span className="text-xs text-slate-400 block mb-1">檔案檢視連結</span>
                  <div className="space-y-1 text-xs">
                    <p className="truncate">📄 報告書：<a href={reportDocUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">{reportDocUrl}</a></p>
                    <p className="truncate">📝 授權書：<a href={consentFormUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">{consentFormUrl}</a></p>
                    {demoUrl && <p className="truncate">🎬 成果Demo：<a href={demoUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">{demoUrl}</a></p>}
                  </div>
                </div>
              </div>

              {/* Submission readiness note */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">
                      線上報名資料即時受理
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      點擊下方「確認無誤，送出報名！」後，系統將正式核發專屬參賽證編號，並登記報名資料供隨時線上查詢。
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Navigation Buttons (Back & Next / Submit) */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>上一步</span>
              </button>
            ) : <div></div>}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>下一步</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleInitiateSubmit}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-base shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? '處理中...' : '確認無誤，送出報名！'}</span>
              </button>
            )}
          </div>

        </div>
        </>
        )}

      </div>

      {/* Confirmation Dialog */}
      {showConfirmModal && pendingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 text-blue-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">確認送出競賽報名</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              即將為隊伍 <strong>「{pendingRegistration.teamName}」</strong> 正式核發參賽證號：
              <span className="font-mono font-bold text-blue-600 ml-1">
                {pendingRegistration.id}
              </span>
            </p>

            <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-900 border border-blue-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>報名確認事項：</span>
              </div>
              <p>• 確認送出後，系統將正式核發專屬參賽證編號。</p>
              <p>• 報名資料將即時登記於競賽資料庫，供隨時線上查詢進度。</p>
              <p>• 請妥善保存參賽證編號，以供後續初審與決賽進度查詢。</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold cursor-pointer"
              >
                返回修改
              </button>
              <button
                type="button"
                onClick={handleConfirmAndExecute}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                確認送出
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
