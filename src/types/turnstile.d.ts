/** The subset of Cloudflare Turnstile's browser API this site uses. https://developers.cloudflare.com/turnstile/ */
interface TurnstileApi {
  reset: (widget?: string | HTMLElement) => void;
}

interface Window {
  /** Present once https://challenges.cloudflare.com/turnstile/v0/api.js has loaded (contact page only). */
  turnstile?: TurnstileApi;
}
