// Single source of truth for personal details used across the site.
// `url` must be the live domain: canonical links, the sitemap and social previews are built from it.

export const SITE = {
  url: 'https://john-phillip-lacorte.vercel.app',
  name: 'John Phillip Lacorte',
  shortName: 'John Phillip Lacorte',
  /** Used in first-person copy: "I'm John Phillip". */
  firstName: 'John Phillip',
  role: 'Full Stack Senior Software Engineer',
  location: 'Quezon City, Metro Manila, PH',
  city: 'Quezon City, PH',
  yearsOfExperience: 6,
  focus: 'Full stack · DevOps',
  timezone: 'Asia/Manila',
  email: 'jaypeelacorte28@gmail.com',
  description:
    'Full stack engineer with 6 years of experience building TypeScript products end to end — from Figma to production infrastructure, with an eye on cost, delivery and maintainability.',
  availability: {
    open: true,
    label: 'Open to senior and lead engineering roles',
  },
  links: {
    github: 'https://github.com/jplacorte',
    linkedin: 'https://www.linkedin.com/in/jaypee-lacorte/',
    resume: '/resume.pdf',
  },
} as const;

export const NAV = [
  { href: '/projects', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
