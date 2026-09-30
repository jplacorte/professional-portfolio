import { z } from 'astro/zod';

/** Validates a contact-form submission. Field names match the form in pages/contact.astro. */
export const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Please add your name').max(100),
  email: z.email('Please use a valid email').max(200),
  company: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(10, 'Message is a little short').max(5000),
  /** Honeypot: hidden from people, so any value means a bot filled it in. */
  website: z.string().optional().default(''),
  'cf-turnstile-response': z.string().optional(),
});

export type ContactSubmission = z.infer<typeof ContactSchema>;

export const isBot = (submission: ContactSubmission): boolean => submission.website.length > 0;
