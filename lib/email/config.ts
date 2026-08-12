/**
 * Resend configuration. When RESEND_API_KEY is unset (default in dev),
 * lib/email/index.ts falls back to a console.log mock instead of calling out.
 */
export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY ?? "",
  from: process.env.EMAIL_FROM ?? "YouthEsportsArena <noreply@youtharenaesports.eu>",
  adminNotificationEmail:
    process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@youtharenaesports.eu",
};

export const isEmailConfigured = () => emailConfig.apiKey.length > 0;
