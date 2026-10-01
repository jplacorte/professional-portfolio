import { z } from 'astro/zod';

/** ASCII control characters (incl. CR/LF), which have no place in a name or subject line. */
// eslint-disable-next-line no-control-regex -- matching control characters is the purpose
const CONTROL_CHARS = /[\u0000-\u001F\u007F]+/g;
/** Control characters except tab and newlines, which are legitimate in a message body. */
// eslint-disable-next-line no-control-regex -- matching control characters is the purpose
const CONTROL_CHARS_EXCEPT_WHITESPACE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * A single-line text field. Line breaks are collapsed to spaces so user input can never inject
 * extra lines into the email subject.
 */
const singleLine = (max: number) =>
  z
    .string()
    .transform((value) => value.replace(CONTROL_CHARS, ' ').trim())
    .pipe(z.string().max(max));

/** Validates a contact-form submission. Field names match components/contact/ContactForm.astro. */
export const ContactSchema = z.object({
  name: singleLine(100).pipe(z.string().min(1, 'Please add your name')),
  email: z.string().trim().max(200).pipe(z.email('Please use a valid email')),
  company: singleLine(120).optional().default(''),
  message: z
    .string()
    .transform((value) => value.replace(CONTROL_CHARS_EXCEPT_WHITESPACE, '').trim())
    .pipe(z.string().min(10, 'Message is a little short').max(5000)),
  /** Honeypot: hidden from people, so any value means a bot filled it in. */
  website: z.string().optional().default(''),
  'cf-turnstile-response': z.string().max(2048).optional(),
});

export type ContactSubmission = z.infer<typeof ContactSchema>;

export const isBot = (submission: ContactSubmission): boolean => submission.website.length > 0;
