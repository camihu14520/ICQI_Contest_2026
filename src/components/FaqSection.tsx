import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Mail, Phone, ExternalLink } from 'lucide-react';
import { FaqItem } from '../types/competition';

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: '資格組隊',
    question: '請問可以跨校或跨系所組隊參賽嗎？',
    answer: '可以！非常歡迎全國大專校院（含大學部及碩士班）學生跨系所、跨年級甚至跨校聯合組隊。每組團隊成員為 1 至 4 人，每人至多報名 1 組。'
  },
  {
    id: 'faq-2',
    category: '資格組隊',
    question: '每隊一定要有指導老師嗎？可以有幾位？',
    answer: '是的，每組團隊須設有 1 至 2 位指導老師。指導老師須由現任大專校院專任或兼任教師擔任，協助團隊進行技術引導與研究規劃。'
  },
  {
    id: 'faq-3',
    category: '報告書格式',
    question: '書面報告書是否有頁數限制？繳交格式為何？',
    answer: '是的，書面報告書上限「至多 10 頁」（包含封面、摘要、研究動機、研究問題、文獻回顧與探討、研究方法及步驟、結果分析或預期成果討論、結論等。參考文獻不列入10頁的範圍）。請依照官方範例格式撰寫並轉存為 PDF 格式，上傳至雲端硬碟（如 Google Drive）並設定為「知道連結的人皆可檢視」公開分享。'
  },
  {
    id: 'faq-4',
    category: '報告書格式',
    question: '「著作權授權暨個資使用同意書」如何簽署？',
    answer: '請至網站「下載專區」下載同意書範本，由全體參賽學生隊員及指導老師親筆簽章（或使用具法律效力之清晰電子簽名掃描檔），匯整為單一 PDF 檔後提供雲端硬碟分享連結。'
  },
  {
    id: 'faq-5',
    category: '決賽評選',
    question: '決賽的海報展示規格為何？是由主辦單位印製還是參賽者印製？',
    answer: '決賽入圍隊伍須自行印製「A0 尺寸直式海報」（841mm × 1189mm）。決賽當日（2026年12月4日星期五）上午 09:00 前至中原大學體育館 2 樓副館完成攤位佈置與張貼。'
  },
  {
    id: 'faq-6',
    category: '決賽評選',
    question: '決賽現場口頭展示與評審答詢時間多長？',
    answer: '每組進行 7 分鐘作品展示簡報，語言可選擇中文或英文。簡報完畢後由產業與學術專家評審委員進行現場提問及答詢，主辦單位將視入圍隊伍數適度調整報告時間。'
  },
  {
    id: 'faq-7',
    category: '表單與通知',
    question: '報名完成後如何取得參賽證編號？',
    answer: '於本站線上報名表單填妥並點擊「確認送出」後，系統會依據您所選擇的領域與組別自動生成專屬參賽證號（如 CYCU-AI-2026-P001），並即時顯示已報名完成頁面。您可記下參賽證號，或於「參賽證查詢」專區隨時輸入證號或隊長 Email 查詢最新審查進度。'
  },
  {
    id: 'faq-8',
    category: '表單與通知',
    question: '線上報名送出後，如何確認主辦單位已收到？',
    answer: '報名送出後，系統會即時顯示「報名已完成」頁面並核發專屬參賽證編號。資料會正式登錄至競賽管理系統中，隊長亦可隨時至「參賽證查詢」專區輸入證號或 Email，確認報名資料已被妥善受理與目前的審查進度。'
  },
  {
    id: 'faq-9',
    category: '表單與通知',
    question: '若送出後發現資料填錯或需要更換書面報告連結，該如何修改？',
    answer: '在報名截止日（2026年11月18日 23:59）前，隊長可直接發信至競賽聯絡信箱（yihsuan@cycu.edu.tw），主旨註明「【資料更正】參賽證號 + 隊伍名稱」，競賽辦公室將即時協助更新試算表紀錄。'
  }
];

export const FaqSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部問題');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-7']);

  const categories = ['全部問題', '資格組隊', '報告書格式', '決賽評選', '表單與通知'];

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCat = selectedCategory === '全部問題' || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            常見問題 FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            參賽者常見問題與指引
          </h2>
          <p className="mt-4 text-base text-slate-600">
            整理參賽資格、隊員限制、書面報告撰寫、決賽展示與系統連線相關疑問。
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋常見問題關鍵字（例：跨校、報告書頁數、海報規格、參賽證號...）"
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white shadow-2xs"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 shrink-0">
                        {faq.category}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              查無符合條件的常見問題，歡迎直接聯絡競賽辦公室！
            </div>
          )}
        </div>

        {/* Contact Assistance Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-blue-950 mb-1">
              還有其他競賽疑問需要協助？
            </h4>
            <p className="text-xs text-blue-800">
              聯絡窗口：中原大學智慧運算與大數據碩士學位學程 廖小姐 (03) 265-4082
            </p>
          </div>
          <a
            href="mailto:yihsuan@cycu.edu.tw"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>寫信洽詢 (yihsuan@cycu.edu.tw)</span>
          </a>
        </div>

      </div>
    </section>
  );
};
