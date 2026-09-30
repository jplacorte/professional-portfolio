import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '@/config/site';
import { renderOgImage, type OgImageContent } from '@/lib/og';
import { getProjects } from '@/lib/projects';

/**
 * Social preview images, generated at build time:
 *   /og/default.png           — every page without its own image
 *   /og/projects/<id>.png     — one per case study
 */
export const getStaticPaths = (async () => {
  const projects = (await getProjects()).filter((p) => p.data.caseStudy);

  const pages: { slug: string; content: OgImageContent }[] = [
    {
      slug: 'default',
      content: {
        eyebrow: SITE.availability.label,
        title: 'I build full-stack products and the systems that keep them running.',
        tags: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'DevOps'],
      },
    },
    ...projects.map((p) => ({
      slug: `projects/${p.id}`,
      content: {
        eyebrow: `Case study · ${p.data.year}`,
        title: p.data.title,
        description: p.data.summary,
        tags: p.data.stack,
      },
    })),
  ];

  return pages.map(({ slug, content }) => ({ params: { slug }, props: { content } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ content: OgImageContent }> = async ({ props }) =>
  new Response(new Uint8Array(await renderOgImage(props.content)), {
    headers: { 'Content-Type': 'image/png' },
  });
