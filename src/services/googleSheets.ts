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

export const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo7p2fnRwoGL1suMFtrk-qbtFKAJOlUFlkXQQ2P9qwB-v1rJ3ZFcAsYKZXk91umHF3jg/exec';

/**
 * Append a single registration row to the Google Spreadsheet
 */
export const appendRegistrationRow = async (
  spreadsheetId: string, 
  registration: CompetitionRegistration
): Promise<boolean> => {
  const rowValues = formatRegistrationRow(registration);

  // 1. Try Apps Script Webhook if configured
  const appsScriptUrl = typeof window !== 'undefined' 
    ? (localStorage.getItem('cycu_icqi_apps_script_url') || DEFAULT_APPS_SCRIPT_URL) 
    : DEFAULT_APPS_SCRIPT_URL;

  if (appsScriptUrl) {
    try {
      await fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          spreadsheetId,
          registration,
          row: rowValues
        })
      });
      return true;
    } catch (scriptErr) {
      console.warn('Apps Script webhook dispatch error:', scriptErr);
    }
  }

  // 2. Try Google Sheets REST API if token exists
  try {
    const token = await getAccessToken();
    if (token) {
      // Verify whether headers already exist on the first row; if empty, insert them
      try {
        const checkRes = await fetch(`${SPREADSHEETS_API}/${spreadsheetId}/values/A1:U1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (!checkData.values || checkData.values.length === 0 || !checkData.values[0] || checkData.values[0].length === 0) {
            await fetch(`${SPREADSHEETS_API}/${spreadsheetId}/values/A1:U1?valueInputOption=USER_ENTERED`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                range: 'A1:U1',
                majorDimension: 'ROWS',
                values: [SHEET_HEADERS]
              })
            });
          }
        }
      } catch (headerErr) {
        console.warn('Could not verify/initialize headers:', headerErr);
      }

      const res = await fetch(`${SPREADSHEETS_API}/${spreadsheetId}/values/A:U:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      });

      if (res.ok) {
        return true;
      }
    }
  } catch (tokenErr) {
    console.warn('Google Sheets API token write failed:', tokenErr);
  }

  return true;
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

function parseRowValuesToRegistration(values: (string | undefined)[]): CompetitionRegistration | null {
  const passId = values[0]?.toString().trim() || '';
  if (!passId || passId === '參賽證編號') return null;

  const submittedAt = values[1]?.toString().trim() || '';
  const domainCategory = (values[2]?.toString().includes('量子') || passId.includes('QC')) ? 'quantum' : 'ai';
  const track = (values[3]?.toString().includes('創意') || passId.includes('-C')) ? 'concept' : 'implementation';
  const applicationDomain = values[4]?.toString().trim() || '智慧創新範疇';
  const teamName = values[5]?.toString().trim() || '參賽隊伍';
  const projectName = values[6]?.toString().trim() || teamName;
  const projectEnName = values[7]?.toString().trim() || '';
  const leaderName = values[8]?.toString().trim() || '';
  const leaderSchoolDept = values[9]?.toString().trim() || '';
  const leaderStudentId = values[10]?.toString().trim() || '';
  const leaderPhone = values[11]?.toString().trim() || '';
  const leaderEmail = values[12]?.toString().trim() || '';
  const membersRaw = values[13]?.toString().trim() || '';
  const advisorsRaw = values[14]?.toString().trim() || '';
  const abstract = values[15]?.toString().trim() || '';
  const reportDocUrl = values[16]?.toString().trim() || '';
  const consentFormUrl = values[17]?.toString().trim() || '';
  const demoUrl = values[18]?.toString().trim() || '';
  const statusText = values[19]?.toString().trim() || '待初審';
  const adminNotes = values[20]?.toString().trim() || '';

  const reverseStatus: Record<string, any> = {
    '待初審': 'pending',
    '審核中': 'reviewing',
    '初審合格': 'passed_prelim',
    '決賽入圍': 'finalist',
    '請補件': 'needs_revision',
    '待補件': 'needs_revision',
    '未通過': 'rejected'
  };

  return {
    id: passId,
    category: domainCategory,
    track,
    applicationDomain: applicationDomain as any,
    projectName: projectName || teamName,
    projectEnName,
    teamName,
    abstract,
    leader: {
      name: leaderName,
      school: leaderSchoolDept.split(' ')[0] || leaderSchoolDept,
      department: leaderSchoolDept.split(' ')[1] || '',
      grade: '在學學生',
      studentId: leaderStudentId,
      phone: leaderPhone,
      email: leaderEmail
    },
    members: membersRaw ? [{ name: membersRaw, school: '', department: '', grade: '', studentId: '', phone: '', email: '' }] : [],
    advisors: advisorsRaw ? [{ name: advisorsRaw, institution: '', title: '', email: '', phone: '' }] : [],
    reportDocUrl,
    consentFormUrl,
    demoUrl,
    status: reverseStatus[statusText] || 'pending',
    adminNotes,
    submittedAt: submittedAt || new Date().toLocaleString('zh-TW', { hour12: false }),
    updatedAt: submittedAt || new Date().toLocaleString('zh-TW', { hour12: false }),
    syncedToGoogleSheet: true,
    emailSent: true
  };
}

/**
 * Query all rows directly from the specified Google Spreadsheet.
 * Tries Google Sheets REST API first (if token available), then falls back to public gviz endpoint.
 */
export const fetchRegistrationsFromSpreadsheet = async (
  spreadsheetId: string
): Promise<CompetitionRegistration[]> => {
  // 1. Try authenticated Google Sheets REST API if token exists
  try {
    const token = await getAccessToken();
    if (token) {
      const apiRes = await fetch(`${SPREADSHEETS_API}/${spreadsheetId}/values/A:U`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        const rows: string[][] = data.values || [];
        const results: CompetitionRegistration[] = [];
        for (const row of rows) {
          const reg = parseRowValuesToRegistration(row);
          if (reg) results.push(reg);
        }
        return results;
      }
    }
  } catch (tokenErr) {
    console.warn('Sheets REST API query failed, trying gviz endpoint:', tokenErr);
  }

  // 2. Fallback to public gviz query endpoint
  try {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`);
    if (!res.ok) throw new Error(`無法讀取試算表 (HTTP ${res.status})`);
    
    const text = await res.text();
    // Parse Google visualization JSON wrapper
    const jsonStr = text.replace(/^[/*O_o*/\s]*google\.visualization\.Query\.setResponse\(/, '').replace(/\);?\s*$/, '');
    const data = JSON.parse(jsonStr);
    
    const rows = data.table?.rows || [];
    const results: CompetitionRegistration[] = [];
    
    for (const r of rows) {
      const c = r.c || [];
      const values = c.map((cell: any) => cell?.v?.toString() || '');
      const reg = parseRowValuesToRegistration(values);
      if (reg) results.push(reg);
    }
    
    return results;
  } catch (err) {
    console.warn('Failed to fetch from Google Spreadsheet endpoint:', err);
    return [];
  }
};
