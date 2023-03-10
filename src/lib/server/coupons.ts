import { getSession } from "./session";

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

export const checkCoupon = async (couponCode: string) => {
  const cartId = await getSession();
  if (!cartId) return;

  const options = {
    method: "POST",
    body: JSON.stringify({ coupons: [couponCode] }),
    headers: { "Content-Type": "application/json" },
  };
  let res = await fetch(`https://www.staples.com/cc/api/checkout/${cartId}/coupon`, options);
  let data = await res.json();

  const tries: number = data.cartInfo.invalidCouponTries;
  if (tries > 2) console.log("Invalid tries: " + tries);

  const coupon: CouponResponse = data.cartInfo.coupons[0];
  return coupon;
}
