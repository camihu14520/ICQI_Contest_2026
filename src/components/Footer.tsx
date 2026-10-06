import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building2, ExternalLink, ArrowUp, Settings } from 'lucide-react';
import { SheetSettingsModal } from './SheetSettingsModal';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/logo.png" 
                alt="CYCU ICQI Logo" 
                className="h-14 w-auto object-contain bg-white/95 p-1.5 rounded-xl"
              />
              <div>
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  中原大學 智慧運算與量子資訊學院
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  2026全國智慧運算與量子資訊創新應用競賽
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              以推動「智慧運算」與「量子資訊」先進科技為核心，整合學界與產業前瞻資源，培育新世代科技與跨領域應用創新人才。
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div>指導補助：教育部高等教育深耕計畫、精進校務經營補助計畫</div>
              <div>企業贊助：凱衛資訊股份有限公司 (KeyWare Information Technology)</div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              網站導覽快速連結
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => { setActiveTab('overview'); scrollToTop(); }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  競賽緣起與宗旨辦法
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('timeline'); scrollToTop(); }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  活動時程與重要節點
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('awards'); scrollToTop(); }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  競賽獎項與獎金名額
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('register'); scrollToTop(); }}
                  className="hover:text-cyan-400 transition-colors text-cyan-300 font-medium cursor-pointer"
                >
                  前往線上分步報名
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('lookup'); scrollToTop(); }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  參賽證編號與審核進度查詢
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('faq'); scrollToTop(); }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  常見問答 FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('downloads'); scrollToTop(); }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  簡章、報告書範本與同意書下載
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              競賽辦公室聯絡資訊
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>中原大學 智慧運算與量子資訊學院 廖助理</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>03-2654082</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:yihsuan@cycu.edu.tw" className="text-cyan-300 hover:underline">
                  yihsuan@cycu.edu.tw
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>中原大學知行領航館 215室 (決賽地點：中原大學體育館 2 樓副館)</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://icqi.cycu.edu.tw/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
                >
                  <span>訪問智慧運算與量子資訊學院官方網站</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 中原大學智慧運算與量子資訊學院 College of Intelligent Computing and Quantum Information. 版權所有.</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer text-2xs px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50"
              title="主辦方 Google 試算表 Webhook 連線設定"
            >
              <Settings className="w-3 h-3" />
              <span>試算表連線設定</span>
            </button>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>回到頂端</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Sheet Settings Modal */}
      <SheetSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </footer>
  );
};
