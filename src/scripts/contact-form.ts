/**
 * Progressive enhancement for the contact form (components/contact/ContactForm.astro).
 * Without JavaScript the form posts normally and the API redirects back with ?sent or ?error.
 */

const MESSAGES = {
  sent: 'Thanks — message sent. I’ll reply soon.',
  error: 'Something went wrong. Please email me directly.',
} as const;

async function submit(form: HTMLFormElement): Promise<void> {
  const res = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' },
  });
  if (res.ok) return;
  const body: unknown = await res.json().catch(() => null);
  const message =
    body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : MESSAGES.error;
  throw new Error(message);
}

function bind(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>('[data-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]');
  const label = form.querySelector<HTMLElement>('[data-label]');
  if (!status || !button || !label) return;

  const params = new URLSearchParams(location.search);
  if (params.has('sent')) status.textContent = MESSAGES.sent;
  if (params.has('error')) status.textContent = MESSAGES.error;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    button.disabled = true;
    label.textContent = 'Sending…';
    status.textContent = '';

    submit(form)
      .then(() => {
        form.reset();
        label.textContent = 'Sent ✓';
        status.textContent = MESSAGES.sent;
      })
      .catch((err: unknown) => {
        label.textContent = 'Send message';
        status.textContent = err instanceof Error ? err.message : MESSAGES.error;
      })
      .finally(() => {
        button.disabled = false;
        window.turnstile?.reset();
      });
  });
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (form) bind(form);
}
