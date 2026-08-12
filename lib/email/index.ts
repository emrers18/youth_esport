import { Resend } from "resend";
import { emailConfig, isEmailConfigured } from "./config";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

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
        <li><strong>Team:</strong> ${teamName}</li>
        <li><strong>Country:</strong> ${country}</li>
        <li><strong>Captain:</strong> ${captainEmail}</li>
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
      <p><strong>${teamName}</strong>'s YouthEsportsArena application has been approved. Your team will now be shown on the Teams page and you can create events.</p>
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
      <p><strong>${teamName}</strong>'s YouthEsportsArena application was not approved at this stage.</p>
      ${rejectionNote ? `<p><strong>Note:</strong> ${rejectionNote}</p>` : ""}
      <p>Feel free to reach out to us with any questions.</p>
    `,
  });
}
