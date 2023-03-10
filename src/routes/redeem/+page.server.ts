import { checkCoupon } from '$lib/server/coupons';
import { db } from '$lib/server/db';
import type { Coupon } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
  const type = url.searchParams.get("type");
  if (!type) return {};
  let [discount, requirement] = type.split(",").map((s) => parseInt(s));
  if (!discount || !requirement) return {};

  let coupon: Coupon | null = null;
  while (!coupon) {
    coupon = await db.coupon.findFirst({
      where: {
        AND: [
          { type: { discount, requirement }},
        ],
      },
      orderBy: { expiration: "asc" },
    });
    if (!coupon) break;

    const check = await checkCoupon(coupon.code);
    if (!check?.couponValid) {
      const c = await db.coupon.delete({ where: { id: coupon.id }});
      console.log(`Coupon code ${coupon.code} deleted with message "${check?.errorMessage}"`);

      coupon = null;
    }
  }

  if (coupon) {
    setTimeout(async (coupon) => {
      const check = await checkCoupon(coupon.code);
      if (!check) {
        console.log(`Error in checkCoupon() for coupon ${coupon.code}`);
      } else if (!check.couponValid) {
        const c = await db.coupon.delete({ where: { id: coupon.id }});
        console.log(c);
        console.log(`Coupon code ${coupon.code} deleted with message "${check?.errorMessage}"`);
      }
    }, 60 * 1000, coupon);
  }

  return { coupon };
}) satisfies PageServerLoad;