/*
 * Floating WhatsApp chat button, loaded on every page.
 *
 * ── CONFIGURE ME ────────────────────────────────────────────────────────────
 * Put the clinic's real WhatsApp number in WHATSAPP_NUMBER, in international
 * format: country code + number, digits only (no "+", spaces or dashes).
 *   e.g. India +91 98765 43210  ->  "919876543210"
 * Until a real number is set the button is shown but does not open a chat.
 * ────────────────────────────────────────────────────────────────────────────
 */
(function () {
  var WHATSAPP_NUMBER = "919500470808"; // +91 95004 70808
  var MESSAGE = "Hello, I would like to enquire about a dental appointment.";

  // Avoid duplicates if the script is included twice.
  if (document.getElementById("wa-float")) return;

  var digits = String(WHATSAPP_NUMBER).replace(/[\s+\-()]/g, "");
  var configured = /^\d{8,15}$/.test(digits);
  var href = configured
    ? "https://wa.me/" + digits + "?text=" + encodeURIComponent(MESSAGE)
    : "#";

  var css =
    // Sits directly above the voice-booking orb (.mola-voice-root, bottom-right)
    "#wa-float{position:fixed;right:29px;bottom:106px;z-index:2147482990;width:52px;height:52px;" +
    "display:flex;align-items:center;justify-content:center;border-radius:50%;background:#25d366;" +
    "color:#fff;box-shadow:0 8px 24px rgba(1,31,35,.32);text-decoration:none;" +
    "transition:transform .18s ease,box-shadow .18s ease}" +
    "#wa-float:hover{transform:scale(1.07);box-shadow:0 10px 30px rgba(1,31,35,.42)}" +
    "#wa-float:focus-visible{outline:3px solid #24a3b1;outline-offset:4px}" +
    "#wa-float svg{width:28px;height:28px;display:block}" +
    "#wa-float[data-configured=false]{opacity:.55;cursor:not-allowed}" +
    // Hide while the voice panel is open so it never covers its controls
    "body:has(.mola-panel) #wa-float{display:none}" +
    "@media (max-width:640px){#wa-float{right:18px;bottom:86px;width:48px;height:48px}" +
    "#wa-float svg{width:26px;height:26px}}" +
    "@media print{#wa-float{display:none}}";

  var style = document.createElement("style");
  style.id = "wa-float-style";
  style.textContent = css;
  document.head.appendChild(style);

  var a = document.createElement("a");
  a.id = "wa-float";
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", "Chat with us on WhatsApp (opens in a new tab)");
  a.title = configured ? "Chat with us on WhatsApp" : "WhatsApp number not configured yet";
  a.setAttribute("data-configured", configured ? "true" : "false");
  a.innerHTML =
    '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.04 3C9.4 3 4 8.36 4 14.96c0 2.1.56 4.16 1.62 5.97L4 29l8.3-2.17a12.1 12.1 0 0 0 3.74.6C22.68 27.43 28 22.06 28 15.47 28 8.36 22.68 3 16.04 3Zm0 22.4c-1.2 0-2.38-.2-3.5-.6l-.6-.2-4.92 1.29 1.3-4.78-.3-.5a9.84 9.84 0 0 1-1.52-5.25c0-5.47 4.47-9.92 9.56-9.92 5.47 0 9.9 4.45 9.9 10.03 0 5.48-4.43 9.93-9.92 9.93Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"/></svg>';

  if (!configured) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.console) console.warn("[WhatsApp button] Set WHATSAPP_NUMBER in assets/js/whatsapp-button.js");
    });
  }

  function mount() { if (!document.getElementById("wa-float")) document.body.appendChild(a); }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
