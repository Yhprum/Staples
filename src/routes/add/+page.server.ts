import { checkCoupon } from "$lib/server/coupons";
import { db } from "$lib/server/db";
import type { Actions } from "./$types";

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

    console.log("Attempting to add coupon " + couponCode);
    const coupon = await checkCoupon(couponCode);
    if (!coupon) return { success: false, error: "An unexpected error occurred" };

    const expirationDate = new Date(expiration);
    expirationDate.setUTCHours(5, 0, 0, 0);
    expirationDate.setDate(expirationDate.getDate() + 1);

    if (coupon.couponValid) {
      const requirement = coupon.description?.match(/\d+/g) ?? [];
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
      try {
        const c = await db.coupon.create({
          data: {
            code: coupon.code,
            expiration: expirationDate,
            couponTypeDiscount: couponType.discount,
            couponTypeRequirement: couponType.requirement
          }
        });
        console.log("Added coupon " + couponCode);
      } catch (e) {
        console.log("Failed to add successful coupon " + couponCode);
        return { success: false, message: "Failed to add coupon" };
      }
    } else {
      console.log("Failed to add coupon " + couponCode);
    }
    
    return {
      success: coupon.couponValid,
      message: coupon.couponValid ? `Coupon added: ${coupon.description}` : coupon.errorMessage,
    };
  }
} satisfies Actions;