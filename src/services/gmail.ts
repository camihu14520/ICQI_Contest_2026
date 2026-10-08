import { CompetitionRegistration } from '../types/competition';
import { getAccessToken } from './googleAuth';

const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

// Default contest coordinator email at CYCU ICQI
export const DEFAULT_COORDINATOR_EMAIL = 'yihsuan@cycu.edu.tw';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Creates RFC 2822 base64url encoded raw message string
 */
function createRawEmail(params: {
  to: string;
  fromName?: string;
  subject: string;
  htmlContent: string;
}): string {
  const boundary = `__boundary_${Date.now()}__`;
  
  // RFC 2047 encoded subject for non-ASCII characters (Traditional Chinese)
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(params.subject)))}?=`;

  const emailLines = [
    `To: ${params.to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(params.htmlContent))),
    '',
    `--${boundary}--`
  ];

  const fullEmail = emailLines.join('\r\n');
  
  // Convert to base64url
  return btoa(unescape(encodeURIComponent(fullEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Send an automated notification email to the contest coordinator
 */
export const sendRegistrationNotificationEmail = async (
  registration: CompetitionRegistration,
  recipientEmail: string = DEFAULT_COORDINATOR_EMAIL
): Promise<SendEmailResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('未登入 Google 或缺少授權權杖');
  }

  // Strictly enforce destination email to yihsuan@cycu.edu.tw as requested by the organizer
  const finalRecipient = DEFAULT_COORDINATOR_EMAIL;

  const categoryName = registration.category === 'ai' ? '人工智慧領域 (AI)' : '量子計算領域 (QC)';
  const trackName = registration.track === 'implementation' ? '實作組' : '創意構想組';

  const membersHtml = registration.members.length > 0
    ? registration.members.map((m, idx) => `
        <li style="margin-bottom: 4px;">
          <strong>隊員 ${idx + 1}：</strong>${m.name} / ${m.school} ${m.department} (${m.grade}) / 學號：${m.studentId} / 信箱：${m.email} / 電話：${m.phone}
        </li>
      `).join('')
    : '<li><em>個人參賽 (無其他隊員)</em></li>';

  const advisorsHtml = registration.advisors.map((a, idx) => `
      <li style="margin-bottom: 4px;">
        <strong>指導老師 ${idx + 1}：</strong>${a.name} (${a.institution} - ${a.title}) / 信箱：${a.email} / 電話：${a.phone}
      </li>
    `).join('');

  const subject = `【2026全國智慧運算與量子資訊競賽】新報名成功通知：${registration.id} - ${registration.projectName}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #034694 0%, #0284c7 100%); color: #ffffff; padding: 28px 24px; text-align: center;">
          <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">2026 全國智慧運算與量子資訊創新應用競賽</h1>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">主辦單位：中原大學智慧運算與量子資訊學院｜共同主辦單位：凱衛資訊股份有限公司</p>
        </div>
        
        <div style="padding: 24px;">
          <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 16px; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: 600; color: #166534; font-size: 15px;">
              有一筆新的參賽報名已完成提交！以下為報名審核資料：
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; width: 140px; color: #64748b; font-weight: 600;">參賽證編號</td>
              <td style="padding: 10px 0; color: #0284c7; font-weight: 700; font-size: 16px;">${registration.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">報名組別</td>
              <td style="padding: 10px 0;"><strong>${categoryName}</strong> - <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px;">${trackName}</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">應用領域</td>
              <td style="padding: 10px 0; color: #0f172a;">${registration.applicationDomain}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">作品名稱</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${registration.projectName}</td>
            </tr>
            ${registration.projectEnName ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">英文名稱</td>
              <td style="padding: 10px 0; color: #475569;">${registration.projectEnName}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">隊伍名稱</td>
              <td style="padding: 10px 0; color: #0f172a;">${registration.teamName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">報名時間</td>
              <td style="padding: 10px 0; color: #64748b;">${registration.submittedAt}</td>
            </tr>
          </table>

          <h3 style="font-size: 15px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin: 20px 0 12px 0;">隊長與成員資訊</h3>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; font-size: 13.5px; margin-bottom: 16px;">
            <p style="margin: 0 0 6px 0;"><strong>隊長 (聯絡代表)：</strong>${registration.leader.name} (${registration.leader.school} ${registration.leader.department} ${registration.leader.grade})</p>
            <p style="margin: 0 0 6px 0;"><strong>學號：</strong>${registration.leader.studentId}</p>
            <p style="margin: 0 0 6px 0;"><strong>聯絡信箱：</strong><a href="mailto:${registration.leader.email}" style="color: #0284c7;">${registration.leader.email}</a></p>
            <p style="margin: 0;"><strong>聯絡電話：</strong>${registration.leader.phone}</p>
          </div>

          <p style="font-size: 14px; font-weight: 600; margin: 12px 0 6px 0;">其他隊員名單：</p>
          <ul style="font-size: 13.5px; color: #334155; padding-left: 20px; margin-top: 4px;">
            ${membersHtml}
          </ul>

          <h3 style="font-size: 15px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin: 20px 0 12px 0;">指導老師</h3>
          <ul style="font-size: 13.5px; color: #334155; padding-left: 20px; margin-top: 4px;">
            ${advisorsHtml}
          </ul>

          <h3 style="font-size: 15px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin: 20px 0 12px 0;">作品摘要 (300~500字)</h3>
          <div style="background: #f1f5f9; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.7; color: #334155; white-space: pre-wrap; margin-bottom: 20px;">
${registration.abstract}
          </div>

          <h3 style="font-size: 15px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin: 20px 0 12px 0;">繳交檔案與相關連結</h3>
          <div style="font-size: 13.5px;">
            <p style="margin: 8px 0;">📄 <strong>書面報告書 (至多10頁)：</strong> <a href="${registration.reportDocUrl}" target="_blank" style="color: #0284c7; word-break: break-all;">${registration.reportDocUrl}</a></p>
            <p style="margin: 8px 0;">📝 <strong>授權同意書 (全組含指導老師)：</strong> <a href="${registration.consentFormUrl}" target="_blank" style="color: #0284c7; word-break: break-all;">${registration.consentFormUrl}</a></p>
            ${registration.demoUrl ? `<p style="margin: 8px 0;">🎬 <strong>成果影片 / 系統展示：</strong> <a href="${registration.demoUrl}" target="_blank" style="color: #0284c7; word-break: break-all;">${registration.demoUrl}</a></p>` : ''}
          </div>

          <div style="margin-top: 30px; padding: 16px; background: #e0f2fe; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #0369a1;">
              本郵件由「2026全國智慧運算與量子資訊創新應用競賽平台」於報名完成時自動寄發至負責人專屬信箱 (${finalRecipient})。
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const raw = createRawEmail({
    to: finalRecipient,
    subject,
    htmlContent
  });

  const res = await fetch(GMAIL_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `Gmail 寄信失敗 (HTTP ${res.status})`);
  }

  const resultData = await res.json();
  return {
    success: true,
    messageId: resultData.id
  };
};
