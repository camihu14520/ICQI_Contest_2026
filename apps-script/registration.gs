var HEADERS = [
  '參賽證編號',
  '報名時間',
  '競賽領域',
  '競賽組別',
  '應用範疇',
  '參賽隊名',
  '作品中文名稱',
  '作品英文名稱',
  '隊長姓名',
  '隊長學校系所',
  '隊長學號',
  '隊長電話',
  '隊長Email',
  '其他組員',
  '指導老師',
  '作品摘要',
  '報告書連結',
  '授權同意書連結',
  'Demo影片連結',
  '審核狀態',
  '審核備註'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    locked = lock.tryLock(15000);
    if (!locked) {
      return jsonResponse({ result: 'error', message: '系統忙碌，請稍後再試' });
    }

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ result: 'error', message: '沒有收到報名資料' });
    }

    var data = JSON.parse(e.postData.contents);
    if (!data || !data.row || !data.row.length) {
      return jsonResponse({ result: 'error', message: '報名資料不完整' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      appendTextRow(sheet, HEADERS);
    }

    var row = toTextCells(data.row);
    var problem = validateRow(row);
    if (problem) {
      return jsonResponse({ result: 'error', message: problem });
    }
    row[0] = nextPassId(sheet, row[2], row[3]);
    appendTextRow(sheet, row);

    return jsonResponse({ result: 'success', id: row[0] });
  } catch (err) {
    return jsonResponse({ result: 'error', message: String(err) });
  } finally {
    if (locked) lock.releaseLock();
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function toTextCells(values) {
  var cells = [];
  var width = Math.min(values.length, HEADERS.length);
  for (var i = 0; i < width; i++) {
    var value = values[i];
    var text = value === null || value === undefined ? '' : String(value);
    if (text.length > 5000) text = text.substring(0, 5000);
    cells.push(text);
  }
  return cells;
}

function validateRow(row) {
  if (!row || row.length < 18) return '報名資料不完整';
  var required = [2, 3, 5, 6, 8, 9, 10, 11, 12, 15, 16, 17];
  for (var i = 0; i < required.length; i++) {
    if (!String(row[required[i]] || '').replace(/^\s+|\s+$/g, '')) return '報名資料不完整';
  }
  if (String(row[15]).replace(/^\s+|\s+$/g, '').length < 50) return '作品摘要不足，請至少填寫 50 字';
  if (!isEmailAddress(row[12])) return '請填寫有效的隊長 Email';
  if (!isHttpUrl(row[16])) return '書面報告書連結必須是 http 或 https 網址';
  if (!isHttpUrl(row[17])) return '授權同意書連結必須是 http 或 https 網址';
  var demo = String(row[18] || '').replace(/^\s+|\s+$/g, '');
  if (demo && demo !== '無' && !isHttpUrl(demo)) return 'Demo 連結必須是 http 或 https 網址';
  return '';
}

function isEmailAddress(value) {
  var text = String(value || '').replace(/^\s+|\s+$/g, '');
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

function isHttpUrl(value) {
  var text = String(value || '').replace(/^\s+|\s+$/g, '');
  var lower = text.toLowerCase();
  if (lower.indexOf('https://') !== 0 && lower.indexOf('http://') !== 0) return false;
  if (text.indexOf(' ') !== -1 || text.indexOf('\n') !== -1 || text.indexOf('\r') !== -1) return false;
  return true;
}

function appendTextRow(sheet, values) {
  var rowNumber = sheet.getLastRow() + 1;
  var range = sheet.getRange(rowNumber, 1, 1, values.length);
  var formulas = [values.map(textFormula)];
  range.setFormulas(formulas);
}

function textFormula(value) {
  var text = value === null || value === undefined ? '' : String(value);
  var lines = text.split(/\r\n|\n|\r/);
  var parts = [];
  for (var i = 0; i < lines.length; i++) {
    if (i > 0) parts.push('CHAR(10)');
    parts.push('"' + lines[i].replace(/"/g, '""') + '"');
  }
  return '=' + parts.join('&');
}

function nextPassId(sheet, domainName, trackName) {
  var domainCode = String(domainName || '').indexOf('量子') !== -1 ? 'QC' : 'AI';
  var trackCode = String(trackName || '').indexOf('創意') !== -1 ? 'C' : 'P';
  var prefix = 'CYCU-' + domainCode + '-2026-' + trackCode;
  var lastRow = sheet.getLastRow();
  var maxNum = 0;

  if (lastRow > 0) {
    var ids = sheet.getRange(1, 1, lastRow, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      var id = String(ids[i][0] || '');
      if (id.indexOf(prefix) === 0) {
        var num = parseInt(id.substring(prefix.length), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    }
  }

  var next = maxNum + 1;
  var padded = next < 1000 ? ('000' + next).slice(-3) : String(next);
  return prefix + padded;
}
