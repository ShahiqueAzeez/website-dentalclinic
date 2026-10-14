/**
 * Westside Dentist: saves website leads into this Google Sheet.
 *
 * Two kinds of rows land in one "Leads" tab:
 *   - "Call back"   : the hero "Book a visit" form (name + phone)
 *   - "Appointment" : a booking made on Cal.com (sent by a Cal.com webhook)
 *
 * Setup:
 *   1. Create a Google Sheet. Extensions > Apps Script. Replace Code.gs with this file.
 *   2. Change CAL_KEY below to any long random word (keep it private).
 *   3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Deploy, allow access.
 *   4. Copy the Web app URL (ends in /exec):
 *        - put it in assets/js/lead-capture.js (LEADS_SHEET_URL)
 *        - in Cal.com > Settings > Developer > Webhooks, add  <URL>?source=cal&key=<CAL_KEY>
 *          with the "Booking created" trigger.
 *   After editing this script later: Deploy > Manage deployments > edit > Version: New version.
 */
var SHEET_NAME = 'Leads';
var TIME_ZONE = 'Asia/Kolkata';
var CAL_KEY = 'CHANGE_ME_TO_A_LONG_RANDOM_WORD';
var HEADERS = ['S.No', 'Received At', 'Type', 'Name', 'Phone Number', 'Email', 'Appointment Time', 'Source'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    var row;
    if (p.source === 'cal') {
      if (p.key !== CAL_KEY) return reply_('forbidden');
      var body = JSON.parse(e.postData.contents || '{}');
      if (body.triggerEvent !== 'BOOKING_CREATED') return reply_('ignored');
      var b = body.payload || {};
      var att = (b.attendees || [])[0] || {};
      var r = b.responses || {};
      row = ['Appointment',
             att.name || nameOf_(val_(r.name)),
             att.phoneNumber || val_(r.attendeePhoneNumber) || val_(r.phone) || '',
             att.email || val_(r.email) || '',
             b.startTime ? fmt_(new Date(b.startTime)) : '',
             'Cal.com'];
    } else {
      var name = String(p.name || '').trim().slice(0, 100);
      var phone = String(p.phone || '').trim().slice(0, 30);
      if (!name || !phone) return reply_('missing');
      row = ['Call back', name, phone, '', '', 'Website form ' + String(p.page || '').slice(0, 80)];
    }
    var sh = sheet_();
    var sno = sh.getLastRow(); // row 1 is the header, so this is the next serial number
    sh.appendRow([sno, fmt_(new Date())].concat(row.map(text_)));
    return reply_('ok');
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return reply_('Westside Dentist lead capture is running'); }

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function val_(x) { return x && typeof x === 'object' && 'value' in x ? x.value : x; }
function nameOf_(n) { return n && typeof n === 'object' ? [n.firstName, n.lastName].filter(Boolean).join(' ') : (n || ''); }
function fmt_(d) { return Utilities.formatDate(d, TIME_ZONE, 'dd MMM yyyy, hh:mm a'); }
// Store as plain text: keeps "+91..." / leading zeros, keeps numbers as text and blocks formula injection (=, +, -, @).
function text_(v) { v = String(v == null ? '' : v); return /^[=+\-@\d]/.test(v) ? "'" + v : v; }
function reply_(msg) { return ContentService.createTextOutput(msg); }
