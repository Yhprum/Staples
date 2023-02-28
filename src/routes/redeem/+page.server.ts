import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
  return { type: url.searchParams.get("type") };
}) satisfies PageServerLoad;