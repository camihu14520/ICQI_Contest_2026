import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, AlertCircle, X, ExternalLink, RefreshCw, Send } from 'lucide-react';
import { getRegistrations } from '../services/storage';
import { formatRegistrationRow, DEFAULT_APPS_SCRIPT_URL } from '../services/googleSheets';

interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({ isOpen, onClose }) => {
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const TARGET_SPREADSHEET_ID = '18APyNoO07AO4ZxM1QIrwCi0EzSHntOvBVc1C7sMFWdM';
  const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${TARGET_SPREADSHEET_ID}/edit?usp=sharing`;

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('cycu_icqi_apps_script_url') || DEFAULT_APPS_SCRIPT_URL;
      setAppsScriptUrl(saved);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndSync = async () => {
    const trimmed = appsScriptUrl.trim();
    if (!trimmed) {
      localStorage.removeItem('cycu_icqi_apps_script_url');
      setStatusMessage({ type: 'success', text: '已清除自訂 Apps Script 連線設定。' });
      return;
    }

    if (!trimmed.startsWith('https://script.google.com/')) {
      setStatusMessage({
        type: 'error',
        text: '請確認網址格式是否為 Google Apps Script 網頁應用程式網址（開頭應為 https://script.google.com/macros/s/.../exec）'
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      localStorage.setItem('cycu_icqi_apps_script_url', trimmed);

      // Push all local registrations to this webhook
      const localRegistrations = getRegistrations();
      if (localRegistrations.length > 0) {
        for (const reg of localRegistrations) {
          const rowValues = formatRegistrationRow(reg);
          await fetch(trimmed, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              spreadsheetId: TARGET_SPREADSHEET_ID,
              registration: reg,
              row: rowValues
            })
          });
        }
      }

      setStatusMessage({
        type: 'success',
        text: `連線設定已成功儲存！已將系統中 ${localRegistrations.length} 筆報名資料同步發送至您的 Google 試算表。`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `發送測試失敗：${err.message || '請確認網路與網址正確'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-blue-600">
            <Settings className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">
              主辦方 Google 試算表連線設定
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            您在 Google Apps Script 部署完成後，Google 會產生一串專屬的<strong>「網頁應用程式網址 (Web App URL)」</strong>。將該網址貼入下方後，參賽學生在網站填表報名時，系統就會在背景自動將資料寫入您的試算表中！
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-semibold text-slate-700">目標 Google 試算表：</div>
            <a
              href={SPREADSHEET_URL}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline font-mono break-all inline-flex items-center gap-1"
            >
              <span>{SPREADSHEET_URL}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            貼上 Google Apps Script 網頁應用程式網址 (Web App URL)
          </label>
          <input
            type="url"
            value={appsScriptUrl}
            onChange={(e) => setAppsScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-2xs text-slate-400 block">
            格式範例：https://script.google.com/macros/s/AKfycb.../exec（結尾須為 /exec）
          </span>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>{statusMessage.text}</div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          >
            關閉
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAndSync}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>儲存並同步中...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>儲存連線並同步現有資料</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
