import { db } from "$lib/server/db";
import { getSession } from "$lib/server/session";
import type { Actions } from "./$types";

interface CouponSuccessResponse {
  couponValid: true;
  code: string;
  couponType: string;
  description: string;
  errorReason: string;
  errorMessage: string;
  discountAmount: { currency: string };
  couponValue: number;
  discountType: string;
  checkoutOnly: boolean;
  isMembershipBenefit: boolean;
  couponQualified: boolean;
  autoAddCoupon: boolean;
  rewardsCoupon: boolean;
  couponCodeDisplayable: boolean;
  couponRemovable: boolean;
  basketLevelCoupon: boolean;
}

interface CouponFailureResponse {
  couponValid: false;
  code: string;
  errorReason: string;
  errorMessage: string;
  discountAmount: { currency: string };
  isMembershipBenefit: boolean;
  couponQualified: boolean;
  autoAddCoupon: boolean;
  rewardsCoupon: boolean;
  couponCodeDisplayable: boolean;
  couponRemovable: boolean;
  basketLevelCoupon: boolean;
}

type CouponResponse = CouponSuccessResponse | CouponFailureResponse;

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const couponCode = form.get("coupon");
    const expiration = form.get("expiration");
    if (typeof couponCode !== "string" || couponCode.trim().length !== 16) {
      return { success: false, error: "Incorrect Coupon Format: must be a 16 digit code" };
    }
    if (typeof expiration !== "string") {
      return { success: false, error: "Invalid request" };
    }

    const cartId = await getSession();
    if (!cartId) return { success: false, error: "An unexpected error occurred" };

    const options = {
      method: "POST",
      body: JSON.stringify({ coupons: [couponCode] }),
      headers: { "Content-Type": "application/json" },
    };
    let res = await fetch(`https://www.staples.com/cc/api/checkout/${cartId}/coupon`, options);
    let data = await res.json();

    const coupon: CouponResponse = data.cartInfo.coupons[0];
    console.log(coupon);
    const tries: number = data.cartInfo.invalidCouponTries;
    console.log("Invalid tries: " + tries);

    if (coupon.couponValid) {
      const requirement = coupon.description?.match(/\d+/g) ?? [];
      // console.log(JSON.stringify({
      //   code: coupon.code,
      //   description: coupon.description,
      //   discount: coupon.couponValue,
      //   requirement: parseInt(requirement[1]),
      //   expiration,
      // }));
      const couponType = await db.couponType.upsert({
        where: {
          discount_requirement: {
            discount: coupon.couponValue,
            requirement: parseInt(requirement[1]),
          }
        },
        update: {},
        create: {
          discount: coupon.couponValue,
          requirement: parseInt(requirement[1]),
          description: coupon.description,
        }
      });
      const c = await db.coupon.create({
        data: {
          code: coupon.code,
          expiration: new Date(expiration),
          couponTypeDiscount: couponType.discount,
          couponTypeRequirement: couponType.requirement
        }
      });
    }
    
    return {
      success: coupon.couponValid,
      message: coupon.couponValid ? `Coupon added: ${coupon.description}` : coupon.errorMessage,
    };
  }
} satisfies Actions;