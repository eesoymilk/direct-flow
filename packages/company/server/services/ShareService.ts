/**
 * Share Service - Centralized business logic for share operations
 * Handles all share-related database operations and business rules
 */

import {
  shareholders,
  shareholderShares,
} from '../database/schema/index';
import { eq } from 'drizzle-orm';
import { SHARE_TYPES } from '../../shared/utils/constants';
import type { DrizzleClient } from '../utils/drizzle';

export class ShareService {
  constructor(private db: DrizzleClient) {}

  // Share types are now static enums - no need for database methods
  // Frontend can import SHARE_TYPES and SHARE_TYPE_NAMES directly from constants

  // Share Holdings CRUD
  async createShareHolding(data: {
    shareholderId: number;
    shareType: string;
    quantity: number;
    pricePerShare: number;
  }) {
    const totalPrice = (data.quantity * data.pricePerShare).toFixed(2);
    
    const [newHolding] = await this.db
      .insert(shareholderShares)
      .values({
        shareholderId: data.shareholderId,
        shareType: data.shareType as any,
        quantity: data.quantity,
        pricePerShare: data.pricePerShare.toString(),
        totalPrice: totalPrice,
      })
      .returning();

    return newHolding;
  }

  async updateShareHolding(id: number, data: {
    quantity?: number;
    pricePerShare?: number;
  }) {
    const updateData: any = {};
    
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.pricePerShare !== undefined) updateData.pricePerShare = data.pricePerShare.toString();
    
    // Calculate new total price if both values are provided or if we need to update
    if (data.quantity !== undefined && data.pricePerShare !== undefined) {
      updateData.totalPrice = (data.quantity * data.pricePerShare).toFixed(2);
    } else if (data.quantity !== undefined || data.pricePerShare !== undefined) {
      // Need to fetch current values to calculate new total
      const current = await this.db.query.shareholderShares.findFirst({
        where: eq(shareholderShares.id, id)
      });
      
      if (current) {
        const quantity = data.quantity ?? current.quantity;
        const pricePerShare = data.pricePerShare ?? parseFloat(current.pricePerShare || '0');
        updateData.totalPrice = (quantity * pricePerShare).toFixed(2);
      }
    }

    const [updated] = await this.db
      .update(shareholderShares)
      .set(updateData)
      .where(eq(shareholderShares.id, id))
      .returning();

    return updated;
  }

  async deleteShareHolding(id: number) {
    await this.db
      .delete(shareholderShares)
      .where(eq(shareholderShares.id, id));
    
    return true;
  }

  // Get share holdings for a specific shareholder
  async getShareHoldingsByShareholder(shareholderId: number) {
    return await this.db.query.shareholderShares.findMany({
      where: eq(shareholderShares.shareholderId, shareholderId),
      orderBy: [shareholderShares.createdAt],
    });
  }

  // Get all share holdings for a company
  async getShareHoldingsByCompany(companyId: string) {
    return await this.db.query.shareholderShares.findMany({
      with: {
        shareholder: {
          with: {
            person: true,
          },
        },
      },
      where: eq(shareholders.companyId, companyId),
    });
  }

  // Calculate total shares by type for a company
  async calculateSharesByType(companyId: string) {
    const holdings = await this.getShareHoldingsByCompany(companyId);
    
    const sharesByType: Record<string, number> = {};
    for (const holding of holdings) {
      const shareType = holding.shareType;
      sharesByType[shareType] = (sharesByType[shareType] || 0) + holding.quantity;
    }
    
    return sharesByType;
  }

  // Validate share holdings
  async validateShareHoldings(holdings: Array<{
    shareType: string;
    quantity: number;
    pricePerShare: number;
  }>) {
    const errors: string[] = [];

    for (const holding of holdings) {
      if (holding.quantity <= 0) {
        errors.push(`股份數量必須大於 0`);
      }
      
      if (holding.pricePerShare <= 0) {
        errors.push(`每股價格必須大於 0`);
      }
      
      if (!SHARE_TYPES.includes(holding.shareType as any)) {
        errors.push(`無效的股份類型: ${holding.shareType}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Factory function for creating ShareService instances
export function createShareService(db: DrizzleClient): ShareService {
  return new ShareService(db);
}