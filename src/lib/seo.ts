/** Builders for schema.org structured data (JSON-LD) embedded in page heads. */
import { SITE } from '@/config/site';
import type { Project } from '@/lib/projects';

type JsonLd = Record<string, unknown>;

export function personJsonLd(): JsonLd {
  const sameAs = [SITE.links.github, SITE.links.linkedin].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    alternateName: 'Jaypee Lacorte',
    jobTitle: SITE.role,
    url: SITE.url,
    email: `mailto:${SITE.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Quezon City', addressCountry: 'PH' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Central Philippine University' },
    knowsAbout: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Hono',
      'Nest.js',
      'Go',
      'PostgreSQL',
      'Firestore',
      'Docker',
      'Google Cloud Platform',
      'AWS',
      'CI/CD',
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function projectJsonLd({ data }: Project): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.title,
    description: data.summary,
    author: { '@type': 'Person', name: SITE.name },
    dateCreated: data.year,
    keywords: data.stack.join(', '),
    ...(data.links.live ? { url: data.links.live } : {}),
    ...(data.links.repo ? { codeRepository: data.links.repo } : {}),
  };
}
