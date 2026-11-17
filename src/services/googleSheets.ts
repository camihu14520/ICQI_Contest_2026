import { CompetitionRegistration } from '../types/competition';
import { getAccessToken } from './googleAuth';

const SPREADSHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

export const SHEET_HEADERS = [
  '參賽證編號',
  '報名時間',
  '競賽領域',
  '參賽組別',
  '應用領域',
  '隊伍名稱',
  '作品名稱(中文)',
  '作品名稱(英文)',
  '隊長姓名',
  '隊長學校系級',
  '隊長學號',
  '隊長聯絡電話',
  '隊長Email',
  '隊員名單',
  '指導老師名單',
  '作品摘要',
  '書面報告連結',
  '授權同意書連結',
  '展示作品/影片連結',
  '審核狀態',
  '審核備註'
];

export const formatRegistrationRow = (reg: CompetitionRegistration): string[] => {
  const membersText = reg.members.length > 0 
    ? reg.members.map((m, idx) => `${idx + 1}.${m.name}(${m.school} ${m.department} ${m.studentId})`).join('\n')
    : '無其他隊員(個人參賽)';

  const advisorsText = reg.advisors.map((a, idx) => `${idx + 1}.${a.name}(${a.institution} ${a.title})`).join('\n');

  const categoryName = reg.category === 'ai' ? '人工智慧' : '量子計算';
  const trackName = reg.track === 'implementation' ? '實作組' : '創意構想組';

  const statusMap: Record<string, string> = {
    pending: '待初審',
    reviewing: '審核中',
    passed_prelim: '初審合格',
    finalist: '決賽入圍',
    needs_revision: '請補件',
    rejected: '未通過'
  };

  return [
    reg.id,
    reg.submittedAt,
    categoryName,
    trackName,
    reg.applicationDomain,
    reg.teamName,
    reg.projectName,
    reg.projectEnName || '無',
    reg.leader.name,
    `${reg.leader.school} ${reg.leader.department} (${reg.leader.grade})`,
    reg.leader.studentId,
    reg.leader.phone,
    reg.leader.email,
    membersText,
    advisorsText,
    reg.abstract,
    reg.reportDocUrl,
    reg.consentFormUrl,
    reg.demoUrl || '無',
    statusMap[reg.status] || reg.status,
    reg.adminNotes || ''
  ];
};

/**
 * Creates a brand new Google Spreadsheet in the user's Google Drive with formatted headers.
 */
export const createNewCompetitionSheet = async (customTitle?: string): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('未登入 Google 或缺少授權權杖');

  const title = customTitle || `2026全國智慧運算與量子資訊創新應用競賽_報名名冊_${new Date().toISOString().slice(0, 10)}`;

  const createRes = await fetch(SPREADSHEETS_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title
      },
      sheets: [
        {
          properties: {
            title: '報名名冊總表',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errData = await createRes.json();
    throw new Error(errData.error?.message || '建立 Google 試算表失敗');
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write headers to Row 1
  await fetch(`${SPREADSHEETS_API}/${spreadsheetId}/values/報名名冊總表!A1:U1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: '報名名冊總表!A1:U1',
      majorDimension: 'ROWS',
      values: [SHEET_HEADERS]
    })
  });

  // Format header row style
  try {
    await fetch(`${SPREADSHEETS_API}/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.05, green: 0.35, blue: 0.75 }, // Blue
                  textFormat: {
                    bold: true,
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    fontSize: 11
                  },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          }
        ]
      })
    });
  } catch (styleErr) {
    console.warn('Could not apply header styling:', styleErr);
  }

  return { spreadsheetId, spreadsheetUrl };
};

export const DEFAULT_SPREADSHEET_ID = '18APyNoO07AO4ZxM1QIrwCi0EzSHntOvBVc1C7sMFWdM';
export const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo7p2fnRwoGL1suMFtrk-qbtFKAJOlUFlkXQQ2P9qwB-v1rJ3ZFcAsYKZXk91umHF3jg/exec';

/**
 * Append a single registration row to the Google Spreadsheet
 */
export const appendRegistrationRow = async (
  _spreadsheetId: string = DEFAULT_SPREADSHEET_ID,
  registration: CompetitionRegistration
): Promise<string> => {
  const rowValues = formatRegistrationRow(registration);
  const res = await fetch(DEFAULT_APPS_SCRIPT_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ row: rowValues })
  });

  if (!res.ok) {
    throw new Error(`試算表寫入未成功（HTTP ${res.status}）`);
  }

  let data: { result?: string; id?: string; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    throw new Error('試算表寫入結果無法確認');
  }

  if (data.result !== 'success' || !data.id) {
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    throw new Error(message && message.length <= 120 ? message : '試算表未確認寫入成功');
  }

  return data.id;
};

/**
 * Batch synchronize all registrations into the target spreadsheet
 */
export const syncAllRegistrationsToSheet = async (
  spreadsheetId: string,
  registrations: CompetitionRegistration[]
): Promise<number> => {
  const token = await getAccessToken();
  if (!token) throw new Error('未登入 Google 或缺少授權權杖');

  // Overwrite starting from row 1 with headers + all data rows
  const allRows = [SHEET_HEADERS, ...registrations.map(formatRegistrationRow)];

  const res = await fetch(`${SPREADSHEETS_API}/${spreadsheetId}/values/A1:U${allRows.length}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: `A1:U${allRows.length}`,
      majorDimension: 'ROWS',
      values: allRows
    })
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `批次同步試算表失敗 (HTTP ${res.status})`);
  }

  return registrations.length;
};

