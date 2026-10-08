import React from 'react';
import { 
  Compass, 
  Cpu, 
  Atom, 
  Users, 
  FileCheck2, 
  Lightbulb, 
  Code2, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <Compass className="w-3.5 h-3.5" />
            競賽宗旨與辦法
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            推動尖端科技與產業跨域實踐
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            本競賽旨在鼓勵全國大專校院學生，運用<strong>「智慧運算」</strong>與<strong>「量子資訊」</strong>先進科技之專業知識與技能，
            結合學術與產業跨域資源，提出具有前瞻性與落地實踐價值的創新解決方案。
          </p>
        </div>

        {/* 2 Core Tech Domains */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Domain 1: AI */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 border border-blue-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>人工智慧領域 (AI Track)</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              涵蓋生成式 AI、機器學習、深度學習、電腦視覺、自然語言處理、語音辨識、邊緣運算與智慧物聯網等，探索在多元垂直領域之革新運用。
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span><strong>實作組：</strong>需有已落地的實際軟硬體系統、演算法模型、應用作法與具體成果展示。</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span><strong>創意構想組：</strong>提出具前瞻突破性之人工智慧創新設計架構、商業或社會痛點解決藍圖。</span>
              </div>
            </div>
          </div>

          {/* Domain 2: Quantum Computing */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-50/70 via-white to-indigo-50/40 border border-cyan-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center mb-6 shadow-md shadow-cyan-500/20">
              <Atom className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>量子計算領域 (Quantum Track)</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              以量子運算原理（疊加、糾纏、穿隧效應等）為核心，結合量子演算法、量子模擬器、量子通訊密鑰或量子金融商務運算，探索次世代指數級算力突破。
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0"></span>
                <span><strong>實作組：</strong>於量子雲端硬體或量子模擬平台（如 Qiskit、PennyLane 等）完成演算法與應用實作。</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0"></span>
                <span><strong>創意構想組：</strong>提出量子計算在金融對沖、新材料分子模擬、密碼學防護或最佳化演算法之創新構想。</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Feature Badges & Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
            <Users className="w-6 h-6 text-blue-600 mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">組隊規定</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              每組 <strong>1 至 4 位</strong> 大專校院學生組成，每人至多報名 1 組。歡迎跨系所、跨年級與跨校聯合組隊。
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
            <Lightbulb className="w-6 h-6 text-amber-600 mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">指導老師</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              每組得設 <strong>1 至 2 位</strong> 指導老師。由大專院校現職專兼任教師擔任，協助引導研究與技術發展。
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
            <FileCheck2 className="w-6 h-6 text-emerald-600 mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">書面報告書</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              繳交 1 份作品報告文件，上限 <strong>至多 10 頁</strong>（不含參考文獻）。另須檢附全體組員含指導老師簽署之授權同意書。
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
            <Code2 className="w-6 h-6 text-purple-600 mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">決賽展示審查</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              決賽入圍隊伍自印 <strong>A0 尺寸直式海報</strong> 現場展示，並進行 <strong>7 分鐘</strong> 之口頭簡報與評審問答（中英文皆可）。
            </p>
          </div>
        </div>

        {/* Organizations & Sponsors */}
        <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                主辦與共同主辦單位
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                中原大學智慧運算與量子資訊學院
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                全台首座專注於智慧運算與量子科技之特色學院。本競賽由中原大學智慧運算與量子資訊學院、電機資訊學院、商學院、量子資訊中心主辦，凱衛資訊股份有限公司共同主辦。
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-700 bg-white p-6 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-600">教育部高教深耕計畫及精進校務經營補助計畫</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">主辦單位：</span>
                <span className="text-slate-600">中原大學智慧運算與量子資訊學院、電機資訊學院、商學院、量子資訊中心</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">共同主辦單位：</span>
                <span className="text-blue-700 font-semibold">凱衛資訊股份有限公司</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
