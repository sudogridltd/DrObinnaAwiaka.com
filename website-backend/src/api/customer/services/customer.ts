import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::customer.customer', ({ strapi }) => ({
  /**
   * Find an existing customer by email or create a new one.
   * Always returns the customer document.
   */
  async findOrCreate(
    email: string,
    data: { firstName?: string; lastName?: string; phone?: string }
  ) {
    const existing = await strapi.documents('api::customer.customer').findFirst({
      filters: { email: { $eq: email } },
    });

    if (existing) {
      // Backfill missing fields if we now have them
      const updates: Record<string, unknown> = {};
      if (!existing.firstName && data.firstName) updates.firstName = data.firstName;
      if (!existing.lastName && data.lastName) updates.lastName = data.lastName;
      if (!existing.phone && data.phone) updates.phone = data.phone;

      if (Object.keys(updates).length > 0) {
        return strapi.documents('api::customer.customer').update({
          documentId: existing.documentId,
          data: updates,
        });
      }

      return existing;
    }

    return strapi.documents('api::customer.customer').create({
      status: 'published',
      data: { email, ...data },
    });
  },

  /** Add an amount to the customer's running total spent. */
  async addToTotalSpent(documentId: string, amount: number) {
    const customer = await strapi.documents('api::customer.customer').findOne({ documentId });
    if (!customer) return;

    await strapi.documents('api::customer.customer').update({
      documentId,
      data: { totalSpent: ((customer.totalSpent as number) || 0) + amount },
    });
  },
}));
