/**
 * GET /api/applications/[id]/preferred-shares
 * Returns available preferred share types for an application
 */

export default eventHandler(async (event) => {
  try {
    const applicationId = getRouterParam(event, 'id');
    
    if (!applicationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Application ID is required',
      });
    }

    const db = useDrizzle();

    // Get application's preferred share configuration
    // For now, we'll store this in a simple way - you might want a dedicated table
    const application = await db.query.companyApplications.findFirst({
      where: eq(companyApplications.id, applicationId),
    });

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Application not found',
      });
    }

    // For now, determine available shares by checking existing holdings
    // In production, you'd want a dedicated table for this
    const holdings = await db.query.applicationShareHoldings.findMany({
      where: eq(applicationShareHoldings.applicationId, applicationId),
      with: { shareType: true },
    });

    // Determine which preferred shares are "unlocked" based on sequence
    const PREFERRED_SEQUENCE = ['preferred_a', 'preferred_b', 'preferred_c', 'preferred_d', 'preferred_e'];
    const availablePreferredShares: string[] = [];

    // Find the highest preferred share in use
    let highestUsedIndex = -1;
    holdings.forEach(holding => {
      if (holding.shareType?.code && holding.shareType.code !== 'ordinary') {
        const index = PREFERRED_SEQUENCE.indexOf(holding.shareType.code);
        if (index > highestUsedIndex) {
          highestUsedIndex = index;
        }
      }
    });

    // Make available all shares up to the highest used + 1
    for (let i = 0; i <= Math.min(highestUsedIndex + 1, PREFERRED_SEQUENCE.length - 1); i++) {
      availablePreferredShares.push(PREFERRED_SEQUENCE[i]);
    }

    // If no preferred shares are used yet, make the first one available
    if (highestUsedIndex === -1 && PREFERRED_SEQUENCE.length > 0) {
      availablePreferredShares.push(PREFERRED_SEQUENCE[0]);
    }

    return {
      success: true,
      data: availablePreferredShares,
    };

  } catch (error: any) {
    console.error('Error fetching preferred shares:', error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch preferred shares',
      data: { message: error.message },
    });
  }
});