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
  /** Rendered as "6+ years", matching the CV summary. */
  yearsOfExperience: 6,
  focus: 'Full stack · DevOps',
  timezone: 'Asia/Manila',
  email: 'jaypeelacorte28@gmail.com',
  description:
    'Senior full stack engineer with 6+ years of experience building production web applications in TypeScript, Node.js, React, Next.js and Go — from client brief to CI/CD and the cloud bill.',
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
