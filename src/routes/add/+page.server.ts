import { getSession } from "$lib/server/session";
import type { Actions } from "./$types";

interface CouponResponse {
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
  couponValid: boolean;
  autoAddCoupon: boolean;
  rewardsCoupon: boolean;
  couponCodeDisplayable: boolean;
  couponRemovable: boolean;
  basketLevelCoupon: boolean
}

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const couponCode = form.get("coupon");
    if (!couponCode || (couponCode instanceof String && couponCode.trim().length !== 16)) {
      return { success: false, error: "Incorrect Coupon Format: must be a 16 digit code" };
    }
    const cartId = await getSession();
    console.log(cartId);

    if (!cartId) return { success: false, error: "An unexpected error occurred, contact /u/Arceus919" };

    const options = {
      method: "POST",
      body: JSON.stringify({ coupons: [couponCode] }),
      headers: { "Content-Type": "application/json" },
    };
    let res: Response = await fetch(`https://www.staples.com/cc/api/checkout/${cartId}/coupon`, options);
    let data = await res.json();

    console.log("coupon response");
    const coupon: CouponResponse = data.cartInfo.coupons[0];
    const tries = data.cartInfo.invalidCouponTries;
    console.log(coupon);
    console.log(tries);
    
    return {
      success: coupon.couponValid,
      message: coupon.description,
      error: coupon.errorMessage
    };
  }
} satisfies Actions;