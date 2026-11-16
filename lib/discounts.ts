// lib/discounts.ts

export const DISCOUNTS = {
  ONLINE_ORDER_PERCENT: 10,
  LOYALTY_PERCENT: 20,
  LOYALTY_POINTS_REQUIRED: 10,
  POINTS_PER_ORDER: 1,
} as const;

export interface DiscountBreakdown {
  subtotal: number;
  onlineDiscount: number;
  loyaltyDiscount: number;
  loyaltyApplied: boolean;
  pointsUsed: number;
  totalAfterDiscount: number;
  totalSaved: number;
  discountPercent: number;
}

export function calculateDiscounts(
  subtotal: number,
  userPoints: number,
  useLoyalty: boolean
): DiscountBreakdown {
  const onlineDiscount = subtotal * (DISCOUNTS.ONLINE_ORDER_PERCENT / 100);
  const afterOnline = subtotal - onlineDiscount;

  const canUseLoyalty =
    useLoyalty && userPoints >= DISCOUNTS.LOYALTY_POINTS_REQUIRED;

  const loyaltyDiscount = canUseLoyalty
    ? afterOnline * (DISCOUNTS.LOYALTY_PERCENT / 100)
    : 0;

  const totalDiscount = onlineDiscount + loyaltyDiscount;
  const totalAfterDiscount = subtotal - totalDiscount;

  return {
    subtotal,
    onlineDiscount: Math.round(onlineDiscount * 100) / 100,
    loyaltyDiscount: Math.round(loyaltyDiscount * 100) / 100,
    loyaltyApplied: canUseLoyalty,
    pointsUsed: canUseLoyalty ? DISCOUNTS.LOYALTY_POINTS_REQUIRED : 0,
    totalAfterDiscount: Math.round(totalAfterDiscount * 100) / 100,
    totalSaved: Math.round(totalDiscount * 100) / 100,
    discountPercent:
      subtotal > 0
        ? Math.round((totalDiscount / subtotal) * 1000) / 10
        : 0,
  };
}