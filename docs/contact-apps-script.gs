/**
 * Cybaethrex contact form -> email, via Google Apps Script.
 *
 * Delivers website enquiries to the support inbox using the Google account
 * this script runs as. No paid service, no API key, no DNS changes.
 *
 * SETUP
 *   1. script.google.com -> New project. Paste this file in, replacing the
 *      default Code.gs contents.
 *   2. Set SECRET below to any long random string.
 *   3. Deploy -> New deployment -> type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Authorise it when prompted. Google will warn that the app is
 *      unverified because you wrote it yourself: continue.
 *   4. Copy the /exec URL it gives you.
 *   5. In Vercel -> Settings -> Environment Variables:
 *        CONTACT_WEBHOOK_URL     = the /exec URL
 *        CONTACT_WEBHOOK_SECRET  = the same string as SECRET
 *      Redeploy.
 *
 * Re-deploying this script after an edit needs Deploy -> Manage deployments
 * -> edit -> New version, or the /exec URL keeps serving the old code.
 *
 * QUOTAS  Consumer Gmail allows roughly 100 recipients a day, Workspace
 * 1500. A contact form does not come close.
 */

// Where enquiries land. Fixed here rather than taken from the request, so that
// even a caller holding the secret cannot use this script to mail anyone else.
var TO = "support@cybaethrex.com";

// Must match CONTACT_WEBHOOK_SECRET. Without it, anyone who learns the /exec
// URL can post straight to this script. The script refuses every request
// while this is empty or still the placeholder, so it can never be deployed
// open by accident. Generate one with: openssl rand -hex 32
var SECRET = "change-me-to-a-long-random-string";
var PLACEHOLDER_SECRET = "change-me-to-a-long-random-string";

// Optional: paste a Google Sheet id to keep a log alongside the email.
// Leave empty to only send mail.
var SHEET_ID = "";

function doPost(e) {
  try {
    if (!SECRET || SECRET === PLACEHOLDER_SECRET || SECRET.length < 16) {
      console.error("contact: SECRET is not set; refusing all requests");
      return json({ error: "unconfigured" });
    }

    var data = JSON.parse(e.postData.contents);

    if (!safeEqual(String(data.secret || ""), SECRET)) {
      return json({ error: "forbidden" });
    }

    // the subject is a single header line
    var subject = String(data.subject || "Website enquiry")
      .replace(/[\r\n]+/g, " ")
      .slice(0, 250);
    var email = String(data.email || "");
    var mail = {
      to: TO,
      subject: subject,
      body: String(data.text || ""),
      htmlBody: String(data.html || ""),
      name: "Cybaethrex Website",
    };
    // answering in the inbox reaches the person who wrote in
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) mail.replyTo = email;

    MailApp.sendEmail(mail);

    if (SHEET_ID) logToSheet(data);

    return json({ ok: true });
  } catch (err) {
    // the detail goes to the Apps Script execution log, not to the caller
    console.error("contact: " + err);
    return json({ error: "failed" });
  }
}

/** Compares without stopping at the first differing character. */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * A cell that starts with = + - @ is read by Sheets as a formula, so a
 * visitor could plant one (a HYPERLINK, an IMPORTXML that leaks other cells)
 * in the log. A leading apostrophe keeps it as plain text.
 */
function cell(value) {
  var s = String(value == null ? "" : value);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function logToSheet(data) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Received",
      "Name",
      "Company",
      "Email",
      "Interested in",
      "Message",
    ]);
  }
  sheet.appendRow([
    cell(data.receivedAt || new Date().toISOString()),
    cell(data.name),
    cell(data.company),
    cell(data.email),
    cell((data.engagement || []).join(", ")),
    cell(data.context),
  ]);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Run this once from the editor to check delivery before wiring the site up.
 * Select sendTestEmail in the function dropdown, press Run, authorise, then
 * look in the support inbox.
 */
function sendTestEmail() {
  MailApp.sendEmail({
    to: TO,
    subject: "Cybaethrex contact form: test",
    body: "If this arrived, the script can send mail and the address is right.",
    name: "Cybaethrex Website",
  });
}
