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

var TO = "support@cybaethrex.com";

// Must match CONTACT_WEBHOOK_SECRET. Without it, anyone who learns the /exec
// URL can post straight to this script.
var SECRET = "change-me-to-a-long-random-string";

// Optional: paste a Google Sheet id to keep a log alongside the email.
// Leave empty to only send mail.
var SHEET_ID = "";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (SECRET && data.secret !== SECRET) {
      return json({ error: "forbidden" });
    }

    var to = data.to || TO;
    var subject = data.subject || "Website enquiry";

    MailApp.sendEmail({
      to: to,
      subject: subject,
      body: data.text || "",
      htmlBody: data.html || "",
      name: "Cybaethrex Website",
      // answering in the inbox reaches the person who wrote in
      replyTo: data.email,
    });

    if (SHEET_ID) logToSheet(data);

    return json({ ok: true });
  } catch (err) {
    return json({ error: String(err) });
  }
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
    data.receivedAt || new Date().toISOString(),
    data.name || "",
    data.company || "",
    data.email || "",
    (data.engagement || []).join(", "),
    data.context || "",
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
