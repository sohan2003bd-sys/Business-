/**
 * KHATABOOK <-> GOOGLE SHEET BRIDGE
 * ---------------------------------
 * Paste this into: Extensions > Apps Script (inside your Google Sheet)
 * Then: Deploy > New deployment > Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the resulting /exec URL into khatabook.html -> state.settings.sheetUrl
 *
 * It auto-creates the "Sales", "Purchase", "Expense" tabs with the
 * correct headers the first time each is used, so you don't need to
 * set anything up manually on the sheet itself.
 */

const HEADERS = ['id','date','ref','name','category','qty','price','party','payment','notes','total'];

function doGet(e) {
  const params = e.parameter;
  const sheetName = params.sheet;
  const action = params.action;

  if (!sheetName || HEADERS.indexOf('id') === -1) {
    return jsonOut({ error: 'Missing sheet param' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getOrCreateSheet_(sheetName);

    if (!action) {
      // Plain load request -> return all rows as JSON
      return jsonOut(readAll_(sheet));
    }

    const data = params.data ? JSON.parse(params.data) : {};

    if (action === 'add') {
      appendRow_(sheet, data);
    } else if (action === 'update') {
      updateRow_(sheet, data);
    } else if (action === 'delete') {
      deleteRow_(sheet, data.id);
    } else {
      return jsonOut({ error: 'Unknown action: ' + action });
    }

    return jsonOut({ status: 'ok' });
  } catch (err) {
    return jsonOut({ error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    // Force the "date" column (col 2) to Plain Text so Sheets never
    // auto-converts "2026-07-26" into a Date value with its own
    // timezone assumptions — this is what was causing entries to
    // fall outside "Today" on the dashboard.
    sheet.getRange(2, 2, 998, 1).setNumberFormat('@');
  }
  repairDateColumn_(sheet);
  return sheet;
}

// Re-applies Plain Text format to the date column and rewrites any
// cell that Sheets already turned into a real Date back into a
// yyyy-MM-dd string. Safe to run on every request.
function repairDateColumn_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const range = sheet.getRange(2, 2, lastRow - 1, 1);
  const tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  const values = range.getValues();
  let changed = false;
  const fixed = values.map(row => {
    const v = row[0];
    if (Object.prototype.toString.call(v) === '[object Date]') {
      changed = true;
      return [Utilities.formatDate(v, tz, 'yyyy-MM-dd')];
    }
    return [v];
  });
  range.setNumberFormat('@');
  if (changed) range.setValues(fixed);
}

function readAll_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  const rows = values.slice(1);
  return rows
    .filter(r => r.join('') !== '') // skip fully blank rows
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => {
        let v = r[i];
        if (['qty', 'price', 'total'].indexOf(h) !== -1) {
          v = (v === '' || v === null || v === undefined) ? undefined : Number(v);
        }
        // Dates stored as Date objects -> convert to yyyy-MM-dd string
        if (h === 'date' && Object.prototype.toString.call(v) === '[object Date]') {
          v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }
        obj[h] = v;
      });
      return obj;
    });
}

function appendRow_(sheet, data) {
  const row = HEADERS.map(h => (data[h] === undefined ? '' : data[h]));
  sheet.appendRow(row);
}

function findRowIndexById_(sheet, id) {
  const ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 0), 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2; // sheet row number (1-indexed, +header)
  }
  return -1;
}

function updateRow_(sheet, data) {
  const rowIdx = findRowIndexById_(sheet, data.id);
  if (rowIdx === -1) return; // not found, silently ignore
  const row = HEADERS.map(h => (data[h] === undefined ? '' : data[h]));
  sheet.getRange(rowIdx, 1, 1, HEADERS.length).setValues([row]);
}

function deleteRow_(sheet, id) {
  const rowIdx = findRowIndexById_(sheet, id);
  if (rowIdx === -1) return;
  sheet.deleteRow(rowIdx);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
