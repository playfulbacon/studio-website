/**
 * Kettle Games newsletter collector — Google Apps Script
 *
 * Appends newsletter signups from the website to the Google Sheet this
 * script is bound to. Free, no third-party service, and the sheet exports
 * to CSV whenever you want to import subscribers elsewhere.
 *
 * One-time setup (about 5 minutes):
 *   1. Create a Google Sheet (e.g. "Kettle newsletter signups").
 *      Optionally add a header row: date | email | source
 *   2. In the sheet: Extensions → Apps Script. Delete the sample code and
 *      paste this entire file.
 *   3. Click Deploy → New deployment → type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Click Deploy and authorize when prompted.
 *   4. Copy the Web app URL (ends in /exec) into `newsletterEndpoint` in
 *      src/data/site.ts, commit, and push.
 *
 * To update the script later: edit here, paste over the old code in the
 * Apps Script editor, then Deploy → Manage deployments → edit (pencil) →
 * New version. (Keeping this file in the repo keeps the script versioned.)
 */

var SHEET_NAME = 'Sheet1'; // tab name to append to

function doPost(e) {
  var email = ((e.parameter && e.parameter.email) || '').toString().trim();

  // Very light validation — real filtering happens when you export the list.
  var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length < 255;
  if (!valid) {
    return jsonResponse({ ok: false, error: 'invalid email' });
  }

  var lock = LockService.getScriptLock();
  lock.tryLock(5000); // avoid interleaved writes from concurrent signups

  try {
    var sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
      SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Skip duplicates so repeat signups don't clutter the list.
    var existing = sheet
      .getRange(1, 2, Math.max(sheet.getLastRow(), 1), 1)
      .getValues()
      .flat();
    if (existing.indexOf(email) === -1) {
      sheet.appendRow([new Date(), email, 'kettle.games']);
    }

    return jsonResponse({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
