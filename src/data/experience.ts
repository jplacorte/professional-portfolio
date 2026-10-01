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
      'Architected and maintained high-performance backend services in Node.js and Hono on Google Cloud Platform, enforcing runtime validation and end-to-end type safety with Zod schemas shared between API and client.',
      'Built and maintained production Go services alongside the team’s senior Go engineer, shipping features across both the Go and TypeScript codebases.',
      'Containerized services with Docker for consistent local development and Google Cloud Platform deployments, working in a Turborepo monorepo that shared types, configs, and build tooling across apps and packages.',
      'Designed REST API contracts and Firestore data models for new features — structuring collections, documents, and composite indexes around query patterns to balance read performance, cost, and backward compatibility.',
      'Owned features end to end — technical scoping and estimates with product and design, implementation, release, and production support.',
      'Diagnosed and resolved production issues, profiling slow endpoints and queries and hardening error handling and logging to prevent repeat incidents.',
      'Wrote unit and integration tests with Vitest for Hono API services and Zod validation layers, plus Playwright end-to-end tests for critical flows, all running in CI to catch regressions before release.',
      'Led code reviews across the team to enforce clean-code, security, and testing standards, reducing technical debt and production defects.',
      'Evaluated and introduced new tools and language features, and authored technical documentation and feature references that shortened developer onboarding.',
    ],
  },
  {
    company: 'Cell 5 (contracted to Aphex)',
    title: 'Software Engineer',
    period: 'Oct 2022 — Feb 2025',
    location: 'London, England (Remote)',
    highlights: [
      'Onboarded directly with the Aphex CTO to master a complex production architecture on Google Cloud Platform with Firestore as the primary database, then owned feature delivery across the platform for more than two years.',
      'Drove the incremental migration of a legacy codebase to type-safe Next.js and TypeScript, moving module by module alongside ongoing feature work to improve maintainability and cut runtime errors.',
      'Developed and ran services in Docker containers so local environments matched Google Cloud Platform production, reducing environment-specific issues and speeding up setup for new engineers.',
      'Planned migration and feature work with the CTO and Head of UI/UX, breaking product requirements into technical tasks, estimates, and implementation plans.',
      'Built and maintained a shared React and Tailwind CSS component library as a Turborepo package, documented in Storybook, giving every app in the monorepo consistent, reusable UI building blocks.',
      'Added Jest and React Testing Library coverage to migrated Next.js components and Cypress end-to-end tests for key user journeys, reducing regressions during the legacy migration.',
      'Improved front-end performance through server-side rendering, code splitting, and leaner client-side state, speeding up page loads on key screens.',
      'Supported newer engineers joining the codebase through code review and pairing on architecture and conventions.',
    ],
  },
  {
    company: 'Startup Project Ventures',
    title: 'Software Developer I',
    period: 'Jun 2019 — Feb 2021',
    location: 'Iloilo City, Philippines',
    highlights: [
      'Sole full-stack developer of SwipeSwap, a swipe-based barter marketplace — owned architecture, API, frontend, and AWS EC2 deployment from concept to production, working directly with the product designer.',
      'Implemented SwipeSwap’s freemium model, enforcing a 20-swipe free tier and gating unlimited swipes behind a premium plan.',
      'Chose MongoDB for SwipeSwap’s data layer so items could carry flexible, category-specific attributes without schema migrations.',
      'Built HRS, an internal HR system with employee time-in/time-out tracking (React, Node.js, Express, MongoDB), removing the company’s need for a paid HR subscription.',
      'Delivered 3 web applications end to end, from requirements gathering through production release, and provisioned and maintained their AWS hosting and databases.',
      'Spearheaded the team’s adoption of Node.js and React, moving delivery off PHP and jQuery and improving application scalability.',
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
  { group: 'Databases & ORM', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firestore', 'Firebase', 'Prisma', 'GraphQL'] },
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
  'Firestore',
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
