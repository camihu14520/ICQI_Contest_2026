import React from 'react';
import { Award, Trophy, Medal, Sparkles, Star, Gift } from 'lucide-react';

export const AwardsSection: React.FC = () => {
  const mainPrizes = [
    {
      title: '第一名 (冠軍)',
      scope: '實作組 1 隊 / 創意構想組 1 隊',
      amount: 'NT$ 10,000',
      desc: '頒發獎金新臺幣壹萬元整，每位隊員與指導老師各獲頒榮譽獎狀一紙。',
      badge: 'Gold Award',
      highlight: true,
      color: 'from-amber-500 to-yellow-600',
      icon: Trophy
    },
    {
      title: '第二名 (亞軍)',
      scope: '實作組 1 隊 / 創意構想組 1 隊',
      amount: 'NT$ 7,000',
      desc: '頒發獎金新臺幣柒仟元整，每位隊員與指導老師各獲頒榮譽獎狀一紙。',
      badge: 'Silver Award',
      highlight: false,
      color: 'from-slate-400 to-slate-600',
      icon: Medal
    },
    {
      title: '第三名 (季軍)',
      scope: '實作組 1 隊 / 創意構想組 1 隊',
      amount: 'NT$ 5,000',
      desc: '頒發獎金新臺幣伍仟元整，每位隊員與指導老師各獲頒榮譽獎狀一紙。',
      badge: 'Bronze Award',
      highlight: false,
      color: 'from-amber-700 to-amber-900',
      icon: Award
    }
  ];

  const specialPrizes = [
    {
      title: '最佳創新實作獎',
      quota: '1 隊',
      amount: 'NT$ 6,000',
      desc: '表彰在軟硬體架構整合、工程可行性與技術落地最為傑出之實作專案。',
      icon: Sparkles
    },
    {
      title: '最佳創意獎',
      quota: '1 隊',
      amount: 'NT$ 6,000',
      desc: '表彰在人工智慧或量子計算演算法應用具有高度創新破壞性思考之構想。',
      icon: Star
    },
    {
      title: '佳作',
      quota: '4 隊',
      amount: 'NT$ 3,000',
      desc: '作品表現優異且具備良好研發潛力之團隊，各獲頒獎金參仟元與獎狀。',
      icon: Gift
    },
    {
      title: '入圍獎',
      quota: '入圍決賽隊伍',
      amount: '榮譽獎狀',
      desc: '通過初審評核晉級決賽之所有參賽隊伍，全體組員均獲頒入圍獎狀。',
      icon: Award
    }
  ];

  return (
    <section id="awards" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 mb-3">
            <Trophy className="w-3.5 h-3.5" />
            競賽獎金與榮譽
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            豐厚獎金與產學推薦殊榮
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            人工智慧與量子計算兩大科技領域共同角逐，設有多項高額獎金與特別獎項，為卓越團隊提供最高榮譽！
          </p>
        </div>

        {/* Podium / Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-stretch">
          {mainPrizes.map((prize, idx) => {
            const Icon = prize.icon;
            return (
              <div
                key={prize.title}
                className={`relative rounded-2xl p-8 transition-all flex flex-col justify-between ${
                  prize.highlight
                    ? 'bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-white border-2 border-amber-400 shadow-xl shadow-amber-500/10 order-first md:order-none'
                    : 'bg-white border border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-900 text-white">
                      {prize.badge}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${prize.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-1">
                    {prize.title}
                  </h3>

                  <div className="text-xs font-semibold text-blue-700 mb-4">
                    {prize.scope}
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                      {prize.amount}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">+ 各獲頒獎狀一紙</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {prize.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>得獎作品將獲中原大學官網與社群公開報導展示</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Special Awards Row */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              專題特別獎與佳作榮譽
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialPrizes.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {p.quota}
                    </span>
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{p.title}</h4>
                  <div className="text-xl font-black text-blue-600 font-mono mb-2">{p.amount}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-slate-500 text-center">
            * 備註：以上獎勵名額及金額得依實際報名隊伍數及評審委員會決議作適度調整。
          </div>
        </div>

      </div>
    </section>
  );
};
