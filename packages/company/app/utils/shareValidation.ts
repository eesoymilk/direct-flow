import { formatNumber, formatCurrency } from "./formatting";

/**
 * Validation utilities for share calculations
 */

export interface ShareTotals {
  quantity: number;
  totalPrice: number;
}

export interface PartnerShareData {
  ordinary: ShareTotals;
  preferred: ShareTotals;
  total: number;
}

/**
 * Get ordinary shares data for a partner
 */
export const getPartnerOrdinaryShares = (
  partner: PartnerSchema
): ShareTotals => {
  const ordinary = partner.shares?.ordinary;
  return ordinary
    ? {
        quantity: ordinary.quantity,
        totalPrice: ordinary.totalPrice,
      }
    : { quantity: 0, totalPrice: 0 };
};

/**
 * Get preferred shares data for a partner
 */
export const getPartnerPreferredShares = (
  partner: PartnerSchema
): ShareTotals => {
  let totalQuantity = 0;
  let totalPrice = 0;

  if (partner.shares) {
    // Sum all preferred share types (preferred, preferred_a through preferred_e)
    const preferredTypes = [
      "preferred",
      "preferred_a",
      "preferred_b",
      "preferred_c",
      "preferred_d",
      "preferred_e",
    ] as const;

    for (const shareType of preferredTypes) {
      const share = partner.shares?.[shareType];
      if (share) {
        totalQuantity += share.quantity;
        totalPrice += share.totalPrice;
      }
    }
  }

  return {
    quantity: totalQuantity,
    totalPrice: totalPrice,
  };
};

/**
 * Get total share value for a partner
 */
export const getPartnerTotal = (partner: PartnerSchema): number => {
  const ordinary = getPartnerOrdinaryShares(partner);
  const preferred = getPartnerPreferredShares(partner);
  return ordinary.totalPrice + preferred.totalPrice;
};
