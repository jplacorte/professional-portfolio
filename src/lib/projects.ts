import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
type ProjectData = Project['data'];

export const statusLabel: Record<ProjectData['status'], string> = {
  live: 'Live',
  complete: 'Complete',
  'in-progress': 'In progress',
  archived: 'Archived',
};

/** Drafts are visible while developing and never in production builds. */
export const isPublished = (data: Pick<ProjectData, 'draft'>, isDev: boolean): boolean => isDev || !data.draft;

/** Explicit `order` first; ties go to the more recent year. Returns a new array. */
export function sortProjects<T extends { data: Pick<ProjectData, 'order' | 'year'> }>(projects: readonly T[]): T[] {
  return [...projects].sort((a, b) => a.data.order - b.data.order || b.data.year.localeCompare(a.data.year));
}

/** Featured case studies, falling back to the first few case studies if none are flagged. */
export function pickFeatured<T extends { data: Pick<ProjectData, 'featured' | 'caseStudy'> }>(
  projects: readonly T[],
  fallbackCount = 4,
): T[] {
  const caseStudies = projects.filter((p) => p.data.caseStudy);
  const featured = caseStudies.filter((p) => p.data.featured);
  return featured.length ? featured : caseStudies.slice(0, fallbackCount);
}

/** Published projects in display order. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => isPublished(data, import.meta.env.DEV));
  return sortProjects(entries);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return pickFeatured(await getProjects());
}
