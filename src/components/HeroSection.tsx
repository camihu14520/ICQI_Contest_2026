import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Atom, 
  Layers
} from 'lucide-react';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onLookupClick: () => void;
  onDownloadsClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  onLookupClick,
  onDownloadsClick
}) => {
  // Countdown to 2026-11-18 23:59:59 (Deadline)
  const deadlineDate = new Date('2026-11-18T23:59:59').getTime();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = deadlineDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [deadlineDate]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-14 sm:py-20">
      {/* Background ambient lighting and pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            2026 全國競賽 · 即日起開放線上報名中
          </span>
        </div>

        {/* Main Headings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-black tracking-widest uppercase">
                <span>— 2026 全國前瞻科技競賽 —</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white">
                <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-cyan-300 tracking-wider mb-1">
                  — 2026 全國 —
                </span>
                智慧運算與量子資訊<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300">
                  創新應用競賽
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              推動全國大專院校學生結合<strong>「人工智慧」</strong>及<strong>「量子計算」</strong>兩大尖端領域，
              內容涵蓋智慧運算在工程、社會、健康、金融、商務等領域之創新應用與實務落地！
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="text-slate-400">主辦單位</span>{' '}
              <span className="font-semibold text-white">中原大學智慧運算與量子資訊學院</span>
              <span className="mx-2 text-slate-600">｜</span>
              <span className="text-slate-400">共同主辦單位</span>{' '}
              <span className="font-semibold text-cyan-200">凱衛資訊股份有限公司</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onRegisterClick}
                className="px-6 py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
              >
                <span>立即填寫線上報名</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onLookupClick}
                className="px-5 py-3.5 rounded-xl font-semibold text-base bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center gap-2 backdrop-blur-xs cursor-pointer"
              >
                <Search className="w-4 h-4 text-cyan-300" />
                <span>參賽證與進度查詢</span>
              </button>

              <button
                onClick={onDownloadsClick}
                className="px-4 py-3.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>簡章與範本下載</span>
              </button>
            </div>

            {/* Feature Highlights Pill Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">專屬領域</div>
                  <div className="text-sm font-semibold text-slate-200">人工智慧 AI</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                  <Atom className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">前瞻科技</div>
                  <div className="text-sm font-semibold text-slate-200">量子計算 QC</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">雙軌組別</div>
                  <div className="text-sm font-semibold text-slate-200">實作組 / 創意組</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">組隊規定</div>
                  <div className="text-sm font-semibold text-slate-200">1~4人 (至多報1組)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Event Highlights & Countdown */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Event Highlights Summary Card */}
            <div className="rounded-2xl bg-gradient-to-b from-blue-950/80 to-slate-900/90 border border-cyan-500/30 p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-300">
                  競賽重點快訊
                </span>
                <span className="px-2.5 py-0.5 rounded text-2xs bg-blue-600/90 text-white font-semibold">
                  大專校院全國賽
                </span>
              </div>
              
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    1
                  </div>
                  <div>
                    <strong className="text-white block text-sm">兩大前瞻科技主題</strong>
                    人工智慧（AI）與量子計算（QC），鼓勵跨領域多元創新落地。
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    2
                  </div>
                  <div>
                    <strong className="text-white block text-sm">實作組與創意構想組雙軌</strong>
                    無論已有雛型原型或前瞻創意提案皆可報名角逐。
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    3
                  </div>
                  <div>
                    <strong className="text-white block text-sm">線上即時登記與證號核發</strong>
                    送出報名後立即核發參賽證號，可隨時查詢初審與決賽進度。
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-slate-700/80 p-5 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold tracking-wide uppercase">報名與繳件截止倒數</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                  2026/11/18 23:59 截止
                </span>
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.days}</div>
                  <div className="text-2xs text-slate-400 uppercase">天 (Days)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.hours}</div>
                  <div className="text-2xs text-slate-400 uppercase">時 (Hrs)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.minutes}</div>
                  <div className="text-2xs text-slate-400 uppercase">分 (Mins)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">{timeLeft.seconds}</div>
                  <div className="text-2xs text-slate-400 uppercase">秒 (Secs)</div>
                </div>
              </div>

              {/* Quick dates summary */}
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>11/25 (三) 公布決賽名單</span>
                <span className="text-slate-500">•</span>
                <span className="font-semibold text-cyan-300">12/04 (五) 實體決賽展評</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
