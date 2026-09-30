import type { ContactSubmission } from './schema';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapes user input before it goes into the notification email's HTML. */
export const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c] ?? c);

export interface ContactEmail {
  subject: string;
  html: string;
  replyTo: string;
}

/** Builds the notification email sent to the site owner. */
export function buildContactEmail({ name, email, company, message }: ContactSubmission): ContactEmail {
  const from = `<strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;`;
  const org = company ? ` — ${escapeHtml(company)}` : '';
  return {
    subject: `Portfolio enquiry from ${name}${company ? ` (${company})` : ''}`,
    html: `<p>${from}${org}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    replyTo: email,
  };
}
