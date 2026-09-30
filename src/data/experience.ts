// Mirrors the CV in public/resume.pdf — wording, dates and order.
// When the CV changes, update this file in the same commit so the site and the PDF never disagree.

export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  /** The first highlight is also used as the one-line summary on the home page. */
  highlights: string[];
}

export const EXPERIENCE: Role[] = [
  {
    company: 'Tatak Studio',
    title: 'Full Stack Senior Software Engineer',
    period: 'Feb 2026 — Present',
    location: 'Quezon City, Philippines',
    highlights: [
      'Serve as technical point of contact for client projects, translating business requirements into scope, stack, and delivery decisions.',
      'Evaluate and select the technology stack for each new project, weighing build cost, delivery timeline, and long-term maintenance burden.',
      'Own cloud and SaaS spend across Google Cloud Platform, Vercel, and Cloudways; audit usage and right-size plans to reduce recurring infrastructure costs.',
      'Mentor junior developers through code review, pairing, and onboarding documentation, raising code quality and shortening review cycles.',
      'Built reusable project boilerplates and deployment scripts that shorten new-project setup and standardize delivery across the team.',
      'Implemented CI/CD pipelines with GitHub Actions to automate build, test, and deployment, shortening release cycles and eliminating manual deployment steps.',
      'Designed and deployed containerized backend services with Docker, standardizing environments across development and production.',
      'Built responsive, pixel-perfect UI component libraries from Figma designs using React and Tailwind CSS, and authored technical documentation to streamline onboarding.',
    ],
  },
  {
    company: 'Aphex',
    title: 'Backend Developer',
    period: 'Feb 2025 — Jan 2026',
    location: 'London, England (Remote)',
    highlights: [
      'Architected and maintained high-performance backend services in Node.js and Hono, enforcing runtime validation and end-to-end type safety with Zod schemas.',
      'Wrote unit and integration tests with Vitest for Hono API services and Zod validation layers, plus Playwright end-to-end tests for critical flows, all running in CI to catch regressions before release.',
      'Led code reviews across the team to enforce clean-code standards, reducing technical debt and production defects.',
      'Partnered with the Head of UI/UX to clarify requirements and translate design specifications into technical implementations.',
      'Authored technical documentation and feature references that shortened developer onboarding.',
      'Evaluated and introduced new tools and language features to keep the stack modern and maintainable.',
    ],
  },
  {
    company: 'Cell 5 (contracted to Aphex)',
    title: 'Software Engineer',
    period: 'Oct 2022 — Feb 2025',
    location: 'London, England (Remote)',
    highlights: [
      'Onboarded directly with the Aphex CTO to master a complex production architecture, then owned feature delivery across the platform.',
      'Led the migration of legacy code to a type-safe Next.js and TypeScript ecosystem alongside senior engineers, improving maintainability and reducing runtime errors.',
      'Added Jest and React Testing Library coverage to migrated Next.js components and Cypress end-to-end tests for key user journeys, reducing regressions during the legacy migration.',
      'Engineered scalable frontend components in React and Tailwind CSS to pixel-perfect design specifications.',
      'Worked directly with the Head of UI/UX to align technical output with product and design intent.',
    ],
  },
  {
    company: 'Startup Project Ventures',
    title: 'Software Developer I',
    period: 'Jun 2019 — Feb 2021',
    location: 'Iloilo City, Philippines',
    highlights: [
      'Led end-to-end development and deployment of 3 web applications, from requirements gathering through production release.',
      'Spearheaded the team’s adoption of Node.js and React, moving delivery off PHP and jQuery and improving application scalability.',
      'Managed AWS-hosted databases, ensuring availability and reliability across production workloads.',
    ],
  },
  {
    company: 'Freelance',
    title: 'Software Developer',
    period: '2020 — 2022',
    location: 'Iloilo City, Philippines',
    highlights: [
      'Delivered inventory and registration web applications end to end — requirements, database design, build, and deployment — using PHP, MySQL, jQuery, and Bootstrap.',
      'Ran client communication remotely and delivered ahead of the agreed schedule.',
    ],
  },
];

export interface SkillGroup {
  group: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    group: 'Languages & frameworks',
    items: [
      'TypeScript',
      'JavaScript',
      'Node.js',
      'React.js',
      'Next.js',
      'Nest.js',
      'Hono',
      'Vue.js',
      'Go',
      'Python',
      'PHP',
      'Tailwind CSS',
    ],
  },
  { group: 'Databases & ORM', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma', 'GraphQL', 'Google Firebase'] },
  {
    group: 'DevOps & cloud',
    items: [
      'Docker',
      'Google Cloud Platform',
      'AWS',
      'Terraform',
      'GitHub Actions',
      'CI/CD pipeline design',
      'Git',
      'Vercel',
      'Cloudways',
    ],
  },
  { group: 'Testing', items: ['Vitest', 'Jest', 'React Testing Library', 'Playwright', 'Cypress'] },
  {
    group: 'Engineering practice',
    items: [
      'Technology selection and cost analysis',
      'Cloud cost management',
      'Code review and mentorship',
      'Client requirements gathering',
      'Technical documentation',
    ],
  },
  { group: 'Libraries & tools', items: ['Redux', 'Storybook', 'Turborepo', 'WordPress', 'Shopify'] },
];

/** Technologies in the home-page ticker. */
export const MARQUEE = [
  'TypeScript',
  'Next.js',
  'React',
  'Node.js',
  'Hono',
  'Nest.js',
  'Vue',
  'Go',
  'PostgreSQL',
  'Prisma',
  'Docker',
  'Terraform',
  'GCP',
  'AWS',
  'GitHub Actions',
  'Vercel',
  'Playwright',
  'Vitest',
];
