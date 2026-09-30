import type { ContactEmail } from './email';

const RESEND_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Portfolio <onboarding@resend.dev>';

interface SendOptions {
  apiKey: string;
  to: string;
  from?: string | undefined;
}

/** Sends the notification through Resend's REST API (no SDK needed). Throws on failure. */
export async function sendWithResend(email: ContactEmail, { apiKey, to, from }: SendOptions): Promise<void> {
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from ?? DEFAULT_FROM,
      to: [to],
      reply_to: email.replyTo,
      subject: email.subject,
      html: email.html,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}
