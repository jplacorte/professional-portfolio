import { describe, expect, it } from 'vitest';
import { ContactSchema, isBot } from './schema';

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello, I have a role for you.' };

describe('ContactSchema', () => {
  it('accepts a valid submission and fills defaults', () => {
    const result = ContactSchema.parse(valid);
    expect(result).toMatchObject({ ...valid, company: '', website: '' });
  });

  it('trims whitespace', () => {
    expect(ContactSchema.parse({ ...valid, name: '  Ada  ' }).name).toBe('Ada');
  });

  it.each([
    ['missing name', { ...valid, name: '   ' }, 'Please add your name'],
    ['invalid email', { ...valid, email: 'not-an-email' }, 'Please use a valid email'],
    ['short message', { ...valid, message: 'hi' }, 'Message is a little short'],
  ])('rejects %s with a friendly message', (_label, input, message) => {
    const result = ContactSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(message);
  });
});

describe('isBot', () => {
  it('flags submissions where the honeypot is filled', () => {
    expect(isBot(ContactSchema.parse({ ...valid, website: 'spam.example' }))).toBe(true);
    expect(isBot(ContactSchema.parse(valid))).toBe(false);
  });
});
