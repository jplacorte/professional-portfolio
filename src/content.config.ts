import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** One sentence shown on cards and used as the meta description. */
    summary: z.string().max(180),
    /** What you personally did: "Solo — design, backend, infra". */
    role: z.string(),
    stack: z.array(z.string()).min(1),
    status: z.enum(['live', 'complete', 'in-progress', 'archived']),
    year: z.string(),
    links: z
      .object({
        live: z.url().optional(),
        repo: z.url().optional(),
        video: z.url().optional(),
      })
      .default({}),
    /** Shown on the home page "Selected work" list. */
    featured: z.boolean().default(false),
    /** Lower numbers sort first. */
    order: z.number().default(100),
    /** Drafts render in `astro dev` only, never in production builds. */
    draft: z.boolean().default(false),
    /** false = list it in the archive table without a case-study page. */
    caseStudy: z.boolean().default(true),
  }),
});

export const collections = { projects };
