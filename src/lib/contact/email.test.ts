import { describe, expect, it } from 'vitest';
import { buildContactEmail, escapeHtml } from './email';
import { ContactSchema } from './schema';

describe('escapeHtml', () => {
  it('escapes every HTML-significant character', () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;',
    );
  });
});

describe('buildContactEmail', () => {
  const base = { name: 'Ada', email: 'ada@example.com', message: 'Hello, I have a role for you.' };

  it('sets reply-to to the sender and includes the company in the subject', () => {
    const email = buildContactEmail(ContactSchema.parse({ ...base, company: 'Acme' }));
    expect(email.replyTo).toBe('ada@example.com');
    expect(email.subject).toBe('Portfolio enquiry from Ada (Acme)');
  });

  it('never puts raw user HTML into the body', () => {
    const email = buildContactEmail(ContactSchema.parse({ ...base, message: '<script>alert(1)</script> hi there' }));
    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
  });
});
