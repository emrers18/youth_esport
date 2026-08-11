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
    subject: `Yeni takım başvurusu: ${teamName}`,
    html: `
      <p>Yeni bir takım başvurusu alındı.</p>
      <ul>
        <li><strong>Takım:</strong> ${teamName}</li>
        <li><strong>Ülke:</strong> ${country}</li>
        <li><strong>Kaptan:</strong> ${captainEmail}</li>
      </ul>
      <p>İncelemek için admin panelini ziyaret edin.</p>
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
    subject: `${teamName} takımı onaylandı!`,
    html: `
      <p>Merhaba,</p>
      <p><strong>${teamName}</strong> takımının YouthArenaEsports başvurusu onaylandı. Artık takımınız Takımlar sayfasında görüntülenecek ve etkinlik oluşturabileceksiniz.</p>
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
    subject: `${teamName} takımı başvurusu hakkında`,
    html: `
      <p>Merhaba,</p>
      <p><strong>${teamName}</strong> takımının YouthArenaEsports başvurusu bu aşamada reddedildi.</p>
      ${rejectionNote ? `<p><strong>Not:</strong> ${rejectionNote}</p>` : ""}
      <p>Sorularınız için bize ulaşabilirsiniz.</p>
    `,
  });
}
