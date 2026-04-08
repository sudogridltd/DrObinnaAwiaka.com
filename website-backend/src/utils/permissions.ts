/**
 * Auto-configures the Strapi Public role with the minimum permissions needed
 * by the frontend. Runs on every bootstrap but skips actions already granted.
 *
 * READ  — pages, services, products, testimonials, blog (no auth required)
 * CREATE — form submissions only (booking, contact, newsletter)
 */

const PUBLIC_PERMISSIONS = [
  // ── Single-type pages (read) ─────────────────────────────────────────────
  'api::global.global.find',
  'api::homepage.homepage.find',
  'api::about-page.about-page.find',
  'api::services-page.services-page.find',
  'api::contact-page.contact-page.find',
  'api::booking-page.booking-page.find',
  'api::shop-page.shop-page.find',
  'api::blog-page.blog-page.find',
  // ── Collection types (read) ──────────────────────────────────────────────
  'api::service.service.find',
  'api::service.service.findOne',
  'api::product.product.find',
  'api::product.product.findOne',
  'api::testimonial.testimonial.find',
  'api::testimonial.testimonial.findOne',
  'api::blog-post.blog-post.find',
  'api::blog-post.blog-post.findOne',
  'api::blog-category.blog-category.find',
  'api::blog-category.blog-category.findOne',
  // ── Form submissions (write only, no read) ───────────────────────────────
  'api::booking-submission.booking-submission.create',
  'api::contact-submission.contact-submission.create',
  'api::newsletter-subscriber.newsletter-subscriber.create',
];

export async function setupPermissions(strapi: any): Promise<void> {
  try {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' }, populate: ['permissions'] });

    if (!publicRole) {
      strapi.log.warn('[permissions] Public role not found — skipping');
      return;
    }

    const existingActions = new Set<string>(
      (publicRole.permissions ?? []).map((p: any) => p.action as string)
    );

    const toAdd = PUBLIC_PERMISSIONS.filter((action) => !existingActions.has(action));

    if (toAdd.length === 0) {
      strapi.log.info('[permissions] Public role already configured — skipping');
      return;
    }

    for (const action of toAdd) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }

    strapi.log.info(`[permissions] Granted ${toAdd.length} public permission(s): ${toAdd.join(', ')}`);
  } catch (err) {
    strapi.log.error('[permissions] Failed to configure public permissions:', err);
  }
}
