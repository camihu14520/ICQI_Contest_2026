import React from 'react';
import { Calendar, Clock, CheckCircle2, MapPin, Send, AlertCircle } from 'lucide-react';

interface TimelineSectionProps {
  onRegisterClick: () => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ onRegisterClick }) => {
  // Determine timeline status dynamically based on current date
  const now = new Date();

  const stepsConfig = [
    {
      num: '01',
      title: '線上報名與書面報告繳交',
      date: '即日起 至 2026年11月18日(星期三) 23:59 截止',
      startDate: new Date('2026-01-01T00:00:00'),
      endDate: new Date('2026-11-18T23:59:59'),
      defaultBadge: '開放收件',
      desc: '於本網站完成線上報名表單填寫，自動取得專屬參賽證號。須檢附 1 份作品報告書（至多10頁，可參閱範例說明）與全組（含指導老師）簽署之著作權授權暨個資使用同意書。',
      location: '線上受理 (本站或指定表單)'
    },
    {
      num: '02',
      title: '專家書面初審作業',
      date: '2026年11月19日(四) 至 11月24日(二)',
      startDate: new Date('2026-11-19T00:00:00'),
      endDate: new Date('2026-11-24T23:59:59'),
      defaultBadge: '審核階段',
      desc: '由產學研專家評審團依據「作品創新性 (35%)」、「應用可行性 (35%)」、「書面資料完整性 (30%)」進行書面審核評分，擇優遴選晉級決賽隊伍。',
      location: '評審委員會評核'
    },
    {
      num: '03',
      title: '公布決賽入圍名單',
      date: '2026年11月25日(星期三)',
      startDate: new Date('2026-11-25T00:00:00'),
      endDate: new Date('2026-12-03T23:59:59'),
      defaultBadge: '名單公布',
      desc: '正式入圍決賽隊伍名單將公告於本競賽網站最新消息，競賽辦公室並將同步以 Email 發送決賽入圍通知與報到須知至各隊長與指導老師信箱。',
      location: '官網公告 & 電子郵件個別通知'
    },
    {
      num: '04',
      title: '決賽實體展示、審查與頒獎典禮',
      date: '2026年12月4日(星期五) 09:00 ~ 17:00',
      startDate: new Date('2026-12-04T00:00:00'),
      endDate: new Date('2026-12-04T23:59:59'),
      defaultBadge: '實體決賽',
      desc: '參賽隊伍需展示其實體作品、系統Demo或成果影片。上午 09:00 前完成攤位佈置。每隊進行 7 分鐘作品展示簡報與評審委員提問答詢。當日舉行頒獎典禮。',
      location: '中原大學體育館 2 樓副館 (桃園市中壢區中北路200號)'
    }
  ];

  const steps = stepsConfig.map((step) => {
    const isPast = now > step.endDate;
    const isCurrent = now >= step.startDate && now <= step.endDate;

    let status = 'upcoming';
    let badge = step.defaultBadge;

    if (isCurrent) {
      status = 'active';
      badge = '進行中';
    } else if (isPast) {
      status = 'completed';
      badge = '已完成';
    }

    return {
      ...step,
      status,
      badge
    };
  });

  return (
    <section id="timeline" className="py-16 sm:py-20 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            活動重要時程表
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            競賽關鍵時程與節點
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            請各參賽團隊特別留意各階段截止時間。書面資料提早繳交可避免網路擁塞，若需補件競賽辦公室亦能及時通知。
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div 
              key={step.num}
              className={`relative rounded-2xl p-6 transition-all border flex flex-col justify-between ${
                step.status === 'active'
                  ? 'bg-white border-blue-400 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white/80 border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-black font-mono ${
                    step.status === 'active' ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {step.num}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    step.status === 'active'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {step.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-3">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{step.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{step.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Quick Callout */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                重要提醒：請及早完成線上報名與授權書上傳
              </h4>
              <p className="text-sm text-slate-600">
                報名截止日為 2026/11/18(三) 23:59。完成線上送出後系統將即時產生「專屬參賽證號」，負責人亦將收到審核通知信。
              </p>
            </div>
          </div>

          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>前往報名表單</span>
          </button>
        </div>

      </div>
    </section>
  );
};
