/**
 * GET /api/share-types
 * Returns all available share types with their details
 */

import { createShareService } from '../services/ShareService';

export default eventHandler(async (event) => {
  try {
    const db = useDrizzle();
    const shareService = createShareService(db);

    // Initialize share types if they don't exist
    const shareTypes = await shareService.initializeShareTypes();
    
    return {
      success: true,
      data: shareTypes,
    };

  } catch (error: any) {
    console.error('Error fetching share types:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch share types',
      data: {
        message: error.message,
      },
    });
  }
});