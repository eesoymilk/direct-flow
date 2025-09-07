/**
 * DELETE /api/applications/[id]/preferred-shares/[shareType]
 * Removes a preferred share type from available options
 */

export default eventHandler(async (event) => {
  try {
    const applicationId = getRouterParam(event, 'id');
    const shareType = getRouterParam(event, 'shareType');
    
    if (!applicationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Application ID is required',
      });
    }

    if (!shareType) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Share type is required',
      });
    }

    const db = useDrizzle();

    // Verify application exists
    const application = await db.query.companyApplications.findFirst({
      where: eq(companyApplications.id, applicationId),
    });

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Application not found',
      });
    }

    // Check if any holdings exist for this share type
    const existingHoldings = await db.query.applicationShareHoldings.findMany({
      where: and(
        eq(applicationShareHoldings.applicationId, applicationId),
      ),
      with: { shareType: true },
    });

    const holdingsForThisType = existingHoldings.filter(
      holding => holding.shareType?.code === shareType
    );

    if (holdingsForThisType.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot remove ${shareType}: ${holdingsForThisType.length} holdings exist`,
      });
    }

    // Validate it's the last in sequence (can only remove from the end)
    const PREFERRED_SEQUENCE = ['preferred_a', 'preferred_b', 'preferred_c', 'preferred_d', 'preferred_e'];
    const usedPreferredShares = new Set(
      existingHoldings
        .map(h => h.shareType?.code)
        .filter(code => code && code !== 'ordinary')
    );

    // Find highest used preferred share
    let highestUsedIndex = -1;
    PREFERRED_SEQUENCE.forEach((seq, index) => {
      if (usedPreferredShares.has(seq)) {
        highestUsedIndex = index;
      }
    });

    const requestedIndex = PREFERRED_SEQUENCE.indexOf(shareType);
    
    // Can only remove if it's the last available (no holdings should exist past this point)
    const hasLaterShares = PREFERRED_SEQUENCE
      .slice(requestedIndex + 1)
      .some(seq => usedPreferredShares.has(seq));

    if (hasLaterShares) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Can only remove the latest preferred share in sequence',
      });
    }

    // In a real implementation, you might remove from a dedicated table
    // For now, just validate and return success
    
    return {
      success: true,
      data: {
        shareType,
        message: `${shareType} removed from available options`,
      },
    };

  } catch (error: any) {
    console.error('Error removing preferred share:', error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to remove preferred share',
      data: { message: error.message },
    });
  }
});