/*
 * Saves "Book a visit" callback requests to the clinic's Google Sheet.
 * Paste the Apps Script Web app URL (ends in /exec) below; see google-sheets/Code.gs.
 * Until it is set, the form still opens WhatsApp but nothing is saved.
 */
(function () {
  var LEADS_SHEET_URL = "REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL"; // TODO

  window.saveLead = function (name, phone) {
    if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(LEADS_SHEET_URL)) return;
    try {
      fetch(LEADS_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        body: new URLSearchParams({ name: name, phone: phone, page: location.pathname })
      }).catch(function () {});
    } catch (_) {}
  };
})();
