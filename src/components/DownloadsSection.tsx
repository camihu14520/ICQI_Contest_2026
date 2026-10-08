import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Eye, ShieldCheck, Sparkles, ExternalLink, X, FolderOpen } from 'lucide-react';

export const DownloadsSection: React.FC = () => {
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1LmocN75Y_zw8W1ubraBJsBCwg6K4lbMj?usp=sharing";

  const downloadList = [
    {
      id: 'consent',
      title: '專題競賽「著作權授權暨個人資料使用」團體同意書 (公告版)',
      category: '必繳文件',
      desc: '全體組員含指導老師皆需親筆簽署（或電子簽名掃描檔），確認無抄襲行為並同意個資蒐集與競賽成果推廣使用。',
      format: 'ODT 格式 (LibreOffice / Word 開啟)',
      localPath: `${import.meta.env.BASE_URL}assets/2026全國智慧運算與量子資訊創新應用競賽_專題競賽「著作權授權暨個人資料使用」團體同意書_公告版.odt`,
      driveUrl: 'https://drive.google.com/file/d/1qhv0ncayTehma4A5HL4yypkv37fsgE2m/view?usp=sharing',
      filename: '2026全國智慧運算與量子資訊創新應用競賽_專題競賽「著作權授權暨個人資料使用」團體同意書_公告版.odt',
      badge: '必繳'
    },
    {
      id: 'report_template',
      title: '書面報告書範例與撰寫格式規範 (公告版，至多10頁)',
      category: '必繳文件',
      desc: '包含封面、研究動機與痛點、系統架構設計、核心演算法實作、實驗數據與應用效益、未來展望等章節規格。',
      format: 'ODT 格式 (LibreOffice / Word 開啟)',
      localPath: `${import.meta.env.BASE_URL}assets/2026全國智慧運算與量子資訊創新應用競賽_書面報告書範例_公告版.odt`,
      driveUrl: 'https://drive.google.com/file/d/1pHtGm5_O4SZyxdiWtl_YhRoqMycC1UHH/view?usp=sharing',
      filename: '2026全國智慧運算與量子資訊創新應用競賽_書面報告書範例_公告版.odt',
      badge: '範本'
    }
  ];

  return (
    <section id="downloads" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 mb-3">
            <Download className="w-3.5 h-3.5" />
            官方檔案下載專區
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            競賽文件、報告書範本與授權同意書
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            請下載正式公布之著作權授權同意書與 10 頁書面報告書範例。所有文件亦同步託管於主辦單位官方 Google 雲端資料夾中。
          </p>
        </div>

        {/* Official Google Drive Folder Card */}
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 text-white shadow-xl border border-sky-700/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-cyan-300 border border-sky-400/30 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 uppercase tracking-widest border border-cyan-400/30">
                  Google Drive 雲端共用
                </span>
                <span className="text-xs text-slate-300">公開檢視權限已開放</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                2026全國智慧運算與量子資訊競賽 官方雲端檔案庫
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                包含同意書、書面報告範本與最新版本規範文件，您可直接前往 Google Drive 線上預覽或儲存副本。
              </p>
            </div>
          </div>

          <a
            href={GOOGLE_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>開啟 Google 雲端官方資料夾</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Downloads Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {downloadList.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {item.category}
                  </span>
                  <span className="text-2xs font-semibold text-slate-400 font-mono">
                    {item.format}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100">
                {item.localPath ? (
                  <a
                    href={item.localPath}
                    download={item.filename}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>直接下載檔案</span>
                  </a>
                ) : (
                  <a
                    href={item.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>於雲端檢視下載</span>
                  </a>
                )}

                <a
                  href={item.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="在 Google Drive 開啟"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Google Drive 檢視</span>
                </a>

                <button
                  onClick={() => setActivePreview(item.id)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>說明</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Template Explanation Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>文件規範與撰寫說明</span>
              </h3>
              <button
                onClick={() => setActivePreview(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-900 border border-rose-200">
                <strong>⚠️ 權限特別叮嚀：</strong>
                <p>繳交時請務必設定為「知道連結的人皆可檢視」公開檢視權限。若權限設定錯誤以致評審委員無法開啟閱讀，則該項目不予評分！</p>
              </div>

              <div>
                <strong>格式上限：</strong>
                <p>書面報告上限至多 10 頁（含封面、目錄及參考文獻），超過者評審得酌予扣分。</p>
              </div>

              <div>
                <strong>建議書面報告書架構：</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>第一章：作品摘要與研究背景問題 (痛點分析)</li>
                  <li>第二章：創新技術架構與系統設計 (AI / 量子運算原理)</li>
                  <li>第三章：技術實作、實驗數據與原型驗證成果</li>
                  <li>第四章：產業應用可行性、預期效益與商業價值</li>
                  <li>第五章：未來發展與結論、參考資料文獻</li>
                </ul>
              </div>

              <div>
                <strong>簽章規範：</strong>
                <p>著作權授權同意書必須由全體學生隊員親筆簽名，並經 1~2 位指導老師簽名蓋章。</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setActivePreview(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
