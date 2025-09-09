import { formatNumber, formatCurrency } from "./formatting";

/**
 * Validation utilities for share calculations
 */

export interface ShareTotals {
  quantity: number;
  totalPrice: number;
}

export interface ShareholderShareData {
  ordinary: ShareTotals;
  preferred: ShareTotals;
  total: number;
}

/**
 * Get ordinary shares data for a shareholder
 */
export const getShareholderOrdinaryShares = (
  shareholder: ShareholderSchema
): ShareTotals => {
  const ordinary = shareholder.shares?.ordinary;
  return ordinary
    ? {
        quantity: ordinary.quantity,
        totalPrice: ordinary.totalPrice,
      }
    : { quantity: 0, totalPrice: 0 };
};

/**
 * Get preferred shares data for a shareholder
 */
export const getShareholderPreferredShares = (
  shareholder: ShareholderSchema
): ShareTotals => {
  let totalQuantity = 0;
  let totalPrice = 0;

  if (shareholder.shares) {
    // Sum all preferred share types (preferred_a through preferred_e)
    const preferredTypes = [
      "preferred_a",
      "preferred_b",
      "preferred_c",
      "preferred_d",
      "preferred_e",
    ] as const;

    for (const shareType of preferredTypes) {
      const share = shareholder.shares?.[shareType];
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
 * Get total share value for a shareholder
 */
export const getShareholderTotal = (shareholder: ShareholderSchema): number => {
  const ordinary = getShareholderOrdinaryShares(shareholder);
  const preferred = getShareholderPreferredShares(shareholder);
  return ordinary.totalPrice + preferred.totalPrice;
};
