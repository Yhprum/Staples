import { db } from "$lib/server/db";
import type { PageServerLoad } from './$types';
 
export const load = (async () => {
  const couponTypes = await db.couponType.findMany({
    include: {
      _count: {
        select: { Coupon: { where: { expiration: { gte: new Date() }}}},
      },
    },
  });
  return {
    couponTypes,
  };
}) satisfies PageServerLoad;
