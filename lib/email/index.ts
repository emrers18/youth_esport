import { Resend } from "resend";
import { emailConfig, isEmailConfigured } from "./config";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

// Team name, country, captain email, and rejection notes all come from
// user-submitted form data and get interpolated into these HTML email
// bodies — escape them so a value like `<img src=x onerror=...>` can't
// inject markup into an admin's or captain's inbox.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function send({ to, subject, html }: SendArgs) {
  if (!isEmailConfigured()) {
    console.log("--- [MOCK EMAIL] ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(html);
    console.log("--------------------");
    return { mocked: true as const };
  }

  const resend = new Resend(emailConfig.apiKey);
  return resend.emails.send({
    from: emailConfig.from,
    to,
    subject,
    html,
  });
}

export async function sendTeamApplicationEmail(params: {
  teamName: string;
  country: string;
  captainEmail: string;
}) {
  const { teamName, country, captainEmail } = params;
  return send({
    to: emailConfig.adminNotificationEmail,
    subject: `New team application: ${teamName}`,
    html: `
      <p>A new team application has been received.</p>
      <ul>
        <li><strong>Team:</strong> ${escapeHtml(teamName)}</li>
        <li><strong>Country:</strong> ${escapeHtml(country)}</li>
        <li><strong>Captain:</strong> ${escapeHtml(captainEmail)}</li>
      </ul>
      <p>Visit the admin panel to review it.</p>
    `,
  });
}

export async function sendApprovalEmail(params: {
  teamName: string;
  captainEmail: string;
}) {
  const { teamName, captainEmail } = params;
  return send({
    to: captainEmail,
    subject: `${teamName} has been approved!`,
    html: `
      <p>Hello,</p>
      <p><strong>${escapeHtml(teamName)}</strong>'s YouthEsportsArena application has been approved. Your team will now be shown on the Teams page and you can create events.</p>
    `,
  });
}

export async function sendRejectionEmail(params: {
  teamName: string;
  captainEmail: string;
  rejectionNote?: string;
}) {
  const { teamName, captainEmail, rejectionNote } = params;
  return send({
    to: captainEmail,
    subject: `About your ${teamName} application`,
    html: `
      <p>Hello,</p>
      <p><strong>${escapeHtml(teamName)}</strong>'s YouthEsportsArena application was not approved at this stage.</p>
      ${rejectionNote ? `<p><strong>Note:</strong> ${escapeHtml(rejectionNote)}</p>` : ""}
      <p>Feel free to reach out to us with any questions.</p>
    `,
  });
}
