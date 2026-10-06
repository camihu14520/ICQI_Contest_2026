import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Award, 
  Calendar, 
  FileText, 
  Search, 
  HelpCircle, 
  Download 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: '競賽首頁', icon: Award },
    { id: 'timeline', label: '重要時程', icon: Calendar },
    { id: 'awards', label: '競賽獎項', icon: Award },
    { id: 'register', label: '線上報名', icon: FileText, highlight: true },
    { id: 'lookup', label: '參賽證查詢', icon: Search },
    { id: 'faq', label: '常見問題', icon: HelpCircle },
    { id: 'downloads', label: '下載專區', icon: Download }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Title emphasizing 全國競賽 without college logo or CYCU mention */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <span className="px-2.5 py-1 rounded-md text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-600 text-white tracking-wider shadow-2xs">
              全國競賽
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
              2026 智慧運算與量子資訊創新應用競賽
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    item.highlight
                      ? isActive
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800'
                      : isActive
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="開啟選單"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 text-left ${
                    item.highlight
                      ? 'bg-blue-600 text-white'
                      : isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
