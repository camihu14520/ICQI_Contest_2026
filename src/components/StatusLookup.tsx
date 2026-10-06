import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  User, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Table,
  RefreshCw
} from 'lucide-react';
import { CompetitionRegistration } from '../types/competition';
import { getRegistrations, getSettings } from '../services/storage';
import { fetchRegistrationsFromSpreadsheet } from '../services/googleSheets';

interface StatusLookupProps {
  onRegisterClick: () => void;
}

export const StatusLookup: React.FC<StatusLookupProps> = ({ onRegisterClick }) => {
  const [keyword, setKeyword] = useState('');
  const [searched, setSearched] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [result, setResult] = useState<CompetitionRegistration | null>(null);

  const TARGET_SPREADSHEET_ID = '18APyNoO07AO4ZxM1QIrwCi0EzSHntOvBVc1C7sMFWdM';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const trimmed = keyword.trim().toUpperCase();
    setIsQuerying(true);
    setSearched(false);

    try {
      // 1. Prioritize querying directly from the designated Google Spreadsheet
      const sheetRegistrations = await fetchRegistrationsFromSpreadsheet(TARGET_SPREADSHEET_ID);
      const foundInSheet = sheetRegistrations.find(r => 
        r.id.toUpperCase() === trimmed ||
        r.leader.email.toLowerCase() === keyword.trim().toLowerCase() ||
        r.teamName.toLowerCase().includes(keyword.trim().toLowerCase())
      );

      if (foundInSheet) {
        setResult(foundInSheet);
        setSearched(true);
        return;
      }

      // 2. Fallback to local storage
      const localAll = getRegistrations();
      const foundLocal = localAll.find(r => 
        r.id.toUpperCase() === trimmed ||
        r.leader.email.toLowerCase() === keyword.trim().toLowerCase() ||
        r.teamName.toLowerCase().includes(keyword.trim().toLowerCase())
      );

      setResult(foundLocal || null);
      setSearched(true);

    } catch (err) {
      console.warn('Error querying registrations:', err);
      // Fallback to local storage
      const localAll = getRegistrations();
      const foundLocal = localAll.find(r => 
        r.id.toUpperCase() === trimmed ||
        r.leader.email.toLowerCase() === keyword.trim().toLowerCase() ||
        r.teamName.toLowerCase().includes(keyword.trim().toLowerCase())
      );
      setResult(foundLocal || null);
      setSearched(true);
    } finally {
      setIsQuerying(false);
    }
  };

  const getStepActiveIndex = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'reviewing': return 2;
      case 'passed_prelim': return 3;
      case 'finalist': return 4;
      case 'needs_revision': return 2;
      default: return 1;
    }
  };

  return (
    <section id="lookup" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-3">
            <Search className="w-3.5 h-3.5" />
            報名狀態與參賽證查詢
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            參賽證編號與審核進度查詢
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            請輸入您的<strong>「參賽證編號」</strong>（例：CYCU-AI-2026-P001）或<strong>「隊長 Email」</strong>以即時查詢審核狀態與進度。
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <div className="flex items-center gap-3 px-3 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="輸入參賽證號 (例: CYCU-AI-2026-P001) 或隊長 Email..."
                className="w-full bg-transparent py-2.5 text-sm sm:text-base text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={isQuerying}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isQuerying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>查詢審核進度中...</span>
                </>
              ) : (
                <span>查詢審核進度</span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2 mt-2">
            <span>支援證號精確搜尋與隊長 Email 比對</span>
            <div className="flex items-center gap-2">
              <span>快速試查範例：</span>
              <button
                type="button"
                onClick={() => setKeyword('CYCU-AI-2026-P001')}
                className="text-blue-600 hover:underline font-mono"
              >
                CYCU-AI-2026-P001
              </button>
            </div>
          </div>
        </form>

        {/* Search Results Display */}
        {searched && (
          <div className="animate-fadeIn">
            {result ? (
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                
                {/* Result Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xl font-black text-blue-700">
                        {result.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                        {result.category === 'ai' ? '人工智慧' : '量子計算'} · {result.track === 'implementation' ? '實作組' : '創意組'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {result.projectName}
                    </h3>
                  </div>
                </div>

                {/* Progress Steps Tracker */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
                    審核流程即時進度 (Review Status Tracker)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                    {[
                      { step: 1, title: '報名受理', desc: '已核發參賽證號' },
                      { step: 2, title: '書面初審中', desc: '評審委員書面評析' },
                      { step: 3, title: '初審結果', desc: '公告初審通過' },
                      { step: 4, title: '晉級實體決賽', desc: '12/04 現場海報展示' },
                    ].map((s) => {
                      const activeIndex = getStepActiveIndex(result.status);
                      const isPast = activeIndex >= s.step;
                      const isCurrent = activeIndex === s.step;
                      return (
                        <div key={s.step} className={`p-3 rounded-lg border text-left ${
                          isCurrent
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                            : isPast
                            ? 'bg-emerald-50/50 border-emerald-300'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            {isPast ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="font-bold text-xs text-slate-900">{s.title}</span>
                          </div>
                          <p className="text-2xs text-slate-500 leading-tight">{s.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Notice & Feedback */}
                {result.adminNotes && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">競賽審核備註：</span>
                      <p className="mt-0.5 leading-relaxed">{result.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Team Details Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block mb-1">隊伍基本資料</span>
                    <p className="text-slate-800"><strong>隊伍名稱：</strong>{result.teamName}</p>
                    <p className="text-slate-800"><strong>隊長代表：</strong>{result.leader.name} {result.leader.school ? `(${result.leader.school} ${result.leader.department})` : ''}</p>
                    <p className="text-slate-800"><strong>聯絡信箱：</strong>{result.leader.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">指導老師與時程</span>
                    <p className="text-slate-800"><strong>指導老師：</strong>{result.advisors.map(a => a.name).join('、') || '無'}</p>
                    <p className="text-slate-800"><strong>受理時間：</strong>{result.submittedAt}</p>
                    <p className="text-slate-800"><strong>最後異動：</strong>{result.updatedAt}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">查無對應的報名紀錄</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  未查到該參賽證號或隊長 Email。請確認輸入的參賽證編號格式是否正確（例：CYCU-AI-2026-P001）。
                </p>
                <div className="pt-2">
                  <button
                    onClick={onRegisterClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <span>尚未報名？立即前往線上報名</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
