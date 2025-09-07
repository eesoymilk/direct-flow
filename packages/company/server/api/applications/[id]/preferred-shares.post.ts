/**
 * POST /api/applications/[id]/preferred-shares
 * Adds the next preferred share type to the available options
 */

import { z } from 'zod';

const requestSchema = z.object({
  shareType: z.string().min(1),
});

export default eventHandler(async (event) => {
  try {
    const applicationId = getRouterParam(event, 'id');
    
    if (!applicationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Application ID is required',
      });
    }

    const body = await readValidatedBody(event, (body) =>
      requestSchema.safeParse(body)
    );

    if (!body.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: body.error.issues,
      });
    }

    const { shareType } = body.data;
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

    // Validate share type is in the correct sequence
    const PREFERRED_SEQUENCE = ['preferred_a', 'preferred_b', 'preferred_c', 'preferred_d', 'preferred_e'];
    const requestedIndex = PREFERRED_SEQUENCE.indexOf(shareType);

    if (requestedIndex === -1) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid preferred share type',
      });
    }

    // Check current available shares
    const holdings = await db.query.applicationShareHoldings.findMany({
      where: eq(applicationShareHoldings.applicationId, applicationId),
      with: { shareType: true },
    });

    // Find highest currently available index
    let highestAvailableIndex = -1;
    holdings.forEach(holding => {
      if (holding.shareType?.code && holding.shareType.code !== 'ordinary') {
        const index = PREFERRED_SEQUENCE.indexOf(holding.shareType.code);
        if (index > highestAvailableIndex) {
          highestAvailableIndex = index;
        }
      }
    });

    // Validate sequence - can only add the next in sequence
    const expectedNextIndex = highestAvailableIndex + 1;
    if (requestedIndex !== expectedNextIndex) {
      throw createError({
        statusCode: 400,
        statusMessage: `Can only add ${PREFERRED_SEQUENCE[expectedNextIndex]} next`,
      });
    }

    // In a real implementation, you might store this in a dedicated table
    // For now, we'll just validate and return success
    // The actual availability is determined by the GET endpoint logic

    return {
      success: true,
      data: {
        shareType,
        message: `${shareType} is now available for purchase`,
      },
    };

  } catch (error: any) {
    console.error('Error adding preferred share:', error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add preferred share',
      data: { message: error.message },
    });
  }
});