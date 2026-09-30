/** "How I work" cards on the home page. */
export interface Principle {
  title: string;
  body: string;
}

export const PRINCIPLES: Principle[] = [
  {
    title: 'Stack decisions with a price tag',
    body: 'I pick technology against build cost, delivery timeline and who maintains it in two years — then own the cloud bill that follows.',
  },
  {
    title: 'Automate the path to production',
    body: 'Boilerplates, containerised services and CI/CD pipelines so shipping is a merge, not a ceremony.',
  },
  {
    title: 'Raise the team’s floor',
    body: 'Code review, pairing and written docs that shorten onboarding and make the next engineer faster than I was.',
  },
];
