import * as fs from 'fs';
import * as path from 'path';

// Sentinel values used to detect whether a record was manually changed in the admin.
// On first seed, these values are stored. On re-run, the DB value is compared to
// the stored sentinel — if they still match, the record is safe to update.
const SEED_STATE_PATH = path.join(process.cwd(), 'database', 'seeds', '.seed-state.json');

interface SeedState {
    global?: { siteTagline: string };
    homepage?: { heroTitle: string };
    aboutPage?: { bioText: string };
    servicesPage?: { heroTitle: string };
    contactPage?: { heroTitle: string };
    bookingPage?: { heroTitle: string };
}

function loadSeedState(): SeedState {
    try {
        return JSON.parse(fs.readFileSync(SEED_STATE_PATH, 'utf8'));
    } catch {
        return {};
    }
}

function saveSeedState(state: SeedState): void {
    fs.writeFileSync(SEED_STATE_PATH, JSON.stringify(state, null, 2));
}

function getFirstBioText(bio: any[]): string {
    if (!Array.isArray(bio) || bio.length === 0) return '';
    const first = bio[0];
    if (first?.children?.[0]?.text) return first.children[0].text;
    return '';
}

export default async function seed(strapi: any) {
    console.log('🌱 Starting database seeding...');

    const staticContentPath = path.join(process.cwd(), 'database', 'seeds', 'static-content.json');
    const staticContent = JSON.parse(fs.readFileSync(staticContentPath, 'utf8'));

    const docs = strapi.documents;
    const state = loadSeedState();

    try {
        // ── Global Settings ───────────────────────────────────────────────────
        console.log('📌 Seeding global settings...');
        const existingGlobal = await docs('api::global.global').findFirst({});
        if (!existingGlobal) {
            await docs('api::global.global').create({ data: staticContent.global });
            state.global = { siteTagline: staticContent.global.siteTagline };
            console.log('✅ Global settings seeded');
        } else {
            const storedSentinel = state.global?.siteTagline;
            if (storedSentinel === undefined || existingGlobal.siteTagline === storedSentinel) {
                await docs('api::global.global').update({
                    documentId: existingGlobal.documentId,
                    data: staticContent.global,
                });
                state.global = { siteTagline: staticContent.global.siteTagline };
                console.log('✅ Global settings updated');
            } else {
                console.log('⏭️  Global settings manually modified, skipping');
            }
        }
        saveSeedState(state);

        // ── Homepage ──────────────────────────────────────────────────────────
        console.log('📌 Seeding homepage...');
        const existingHomepage = await docs('api::homepage.homepage').findFirst({});
        if (!existingHomepage) {
            await docs('api::homepage.homepage').create({
                data: staticContent.homepage,
                status: 'published',
            });
            state.homepage = { heroTitle: staticContent.homepage.hero.title };
            console.log('✅ Homepage seeded');
        } else {
            const storedSentinel = state.homepage?.heroTitle;
            const currentTitle = existingHomepage.hero?.title ?? existingHomepage.heroTitle;
            if (storedSentinel === undefined || currentTitle === storedSentinel) {
                await docs('api::homepage.homepage').update({
                    documentId: existingHomepage.documentId,
                    data: staticContent.homepage,
                    status: 'published',
                });
                state.homepage = { heroTitle: staticContent.homepage.hero.title };
                console.log('✅ Homepage updated');
            } else {
                console.log('⏭️  Homepage manually modified, skipping');
            }
        }
        saveSeedState(state);

        // ── About Page ────────────────────────────────────────────────────────
        console.log('📌 Seeding about page...');
        const existingAboutPage = await docs('api::about-page.about-page').findFirst({});
        if (!existingAboutPage) {
            await docs('api::about-page.about-page').create({
                data: staticContent.aboutPage,
                status: 'published',
            });
            state.aboutPage = { bioText: getFirstBioText(staticContent.aboutPage.bio) };
            console.log('✅ About page seeded');
        } else {
            const storedSentinel = state.aboutPage?.bioText;
            const currentBioText = getFirstBioText(existingAboutPage.bio);
            if (storedSentinel === undefined || currentBioText === storedSentinel) {
                await docs('api::about-page.about-page').update({
                    documentId: existingAboutPage.documentId,
                    data: staticContent.aboutPage,
                    status: 'published',
                });
                state.aboutPage = { bioText: getFirstBioText(staticContent.aboutPage.bio) };
                console.log('✅ About page updated');
            } else {
                console.log('⏭️  About page manually modified, skipping');
            }
        }
        saveSeedState(state);

        // ── Services Page ─────────────────────────────────────────────────────
        console.log('📌 Seeding services page...');
        const existingServicesPage = await docs('api::services-page.services-page').findFirst({});
        if (!existingServicesPage) {
            await docs('api::services-page.services-page').create({
                data: staticContent.servicesPage,
                status: 'published',
            });
            state.servicesPage = { heroTitle: staticContent.servicesPage.hero.title };
            console.log('✅ Services page seeded');
        } else {
            const storedSentinel = state.servicesPage?.heroTitle;
            const currentTitle = existingServicesPage.hero?.title ?? existingServicesPage.heroTitle;
            if (storedSentinel === undefined || currentTitle === storedSentinel) {
                await docs('api::services-page.services-page').update({
                    documentId: existingServicesPage.documentId,
                    data: staticContent.servicesPage,
                    status: 'published',
                });
                state.servicesPage = { heroTitle: staticContent.servicesPage.hero.title };
                console.log('✅ Services page updated');
            } else {
                console.log('⏭️  Services page manually modified, skipping');
            }
        }
        saveSeedState(state);

        // ── Contact Page ──────────────────────────────────────────────────────
        console.log('📌 Seeding contact page...');
        const existingContactPage = await docs('api::contact-page.contact-page').findFirst({});
        if (!existingContactPage) {
            await docs('api::contact-page.contact-page').create({
                data: staticContent.contactPage,
                status: 'published',
            });
            state.contactPage = { heroTitle: staticContent.contactPage.hero.title };
            console.log('✅ Contact page seeded');
        } else {
            const storedSentinel = state.contactPage?.heroTitle;
            const currentTitle = existingContactPage.hero?.title ?? existingContactPage.heroTitle;
            if (storedSentinel === undefined || currentTitle === storedSentinel) {
                await docs('api::contact-page.contact-page').update({
                    documentId: existingContactPage.documentId,
                    data: staticContent.contactPage,
                    status: 'published',
                });
                state.contactPage = { heroTitle: staticContent.contactPage.hero.title };
                console.log('✅ Contact page updated');
            } else {
                console.log('⏭️  Contact page manually modified, skipping');
            }
        }
        saveSeedState(state);

        // ── Booking Page ──────────────────────────────────────────────────────
        console.log('📌 Seeding booking page...');
        const existingBookingPage = await docs('api::booking-page.booking-page').findFirst({});
        if (!existingBookingPage) {
            await docs('api::booking-page.booking-page').create({
                data: staticContent.bookingPage,
                status: 'published',
            });
            state.bookingPage = { heroTitle: staticContent.bookingPage.hero.title };
            console.log('✅ Booking page seeded');
        } else {
            const storedSentinel = state.bookingPage?.heroTitle;
            const currentTitle = existingBookingPage.hero?.title ?? existingBookingPage.heroTitle;
            if (storedSentinel === undefined || currentTitle === storedSentinel) {
                await docs('api::booking-page.booking-page').update({
                    documentId: existingBookingPage.documentId,
                    data: staticContent.bookingPage,
                    status: 'published',
                });
                state.bookingPage = { heroTitle: staticContent.bookingPage.hero.title };
                console.log('✅ Booking page updated');
            } else {
                console.log('⏭️  Booking page manually modified, skipping');
            }
        }
        saveSeedState(state);

        // ── Services (upsert by slug) ──────────────────────────────────────────
        console.log('📌 Seeding services...');
        for (const service of staticContent.services) {
            const existing = await docs('api::service.service').findFirst({
                filters: { slug: service.slug },
            });
            if (!existing) {
                await docs('api::service.service').create({
                    data: service,
                    status: 'published',
                });
                console.log(`  ✅ Service created: ${service.title}`);
            } else {
                await docs('api::service.service').update({
                    documentId: existing.documentId,
                    data: service,
                    status: 'published',
                });
                console.log(`  🔄 Service updated: ${service.title}`);
            }
        }

        // ── Products (upsert by slug) ─────────────────────────────────────────
        console.log('📌 Seeding products...');
        for (const product of staticContent.products) {
            const existing = await docs('api::product.product').findFirst({
                filters: { slug: product.slug },
            });
            if (!existing) {
                await docs('api::product.product').create({
                    data: product,
                    status: 'published',
                });
                console.log(`  ✅ Product created: ${product.title}`);
            } else {
                await docs('api::product.product').update({
                    documentId: existing.documentId,
                    data: product,
                    status: 'published',
                });
                console.log(`  🔄 Product updated: ${product.title}`);
            }
        }

        // ── Email Templates (create only — never overwrite manual edits) ───────
        console.log('📌 Seeding email templates...');
        const emailTemplatesPath = path.join(process.cwd(), 'database', 'seeds', 'email-templates.json');
        const emailTemplatesData = JSON.parse(fs.readFileSync(emailTemplatesPath, 'utf8'));
        const emailTemplates = emailTemplatesData.emailTemplates || emailTemplatesData;

        const existingEmailTemplates = await docs('api::email-template.email-template').findMany({});
        if (existingEmailTemplates.length === 0) {
            for (const template of emailTemplates) {
                await docs('api::email-template.email-template').create({ data: template });
            }
            console.log(`✅ ${emailTemplates.length} email templates seeded`);
        } else {
            console.log(`⏭️  ${existingEmailTemplates.length} email templates already exist, skipping`);
        }

        // ── Blog Categories (upsert by slug) ──────────────────────────────────
        console.log('📌 Seeding blog categories...');
        for (const category of staticContent.blogCategories) {
            const existing = await docs('api::blog-category.blog-category').findFirst({
                filters: { slug: category.slug },
            });
            if (!existing) {
                await docs('api::blog-category.blog-category').create({
                    data: category,
                    status: 'published',
                });
                console.log(`  ✅ Category created: ${category.name}`);
            } else {
                await docs('api::blog-category.blog-category').update({
                    documentId: existing.documentId,
                    data: category,
                    status: 'published',
                });
                console.log(`  🔄 Category updated: ${category.name}`);
            }
        }

        // ── Blog Posts (upsert by slug) ───────────────────────────────────────
        console.log('📌 Seeding blog posts...');
        const allCats = await docs('api::blog-category.blog-category').findMany({});
        const categoryMap: Record<string, string> = {};
        allCats.forEach((cat: any) => {
            categoryMap[cat.slug] = cat.documentId;
        });

        for (const post of staticContent.blogPosts) {
            let categoryDocumentId: string | null = null;
            if (post.tags) {
                const tagTexts = post.tags.map((t: any) => t.text);
                if (tagTexts.some((t: string) => ['Leadership', 'Executive Coaching'].includes(t))) {
                    categoryDocumentId = categoryMap['leadership'] ?? null;
                } else if (tagTexts.some((t: string) => ['Mindset', 'Confidence'].includes(t))) {
                    categoryDocumentId = categoryMap['mindset'] ?? null;
                } else if (tagTexts.some((t: string) => ['Relationships', 'Boundaries'].includes(t))) {
                    categoryDocumentId = categoryMap['relationships'] ?? null;
                } else if (tagTexts.some((t: string) => ['Personal Development', 'Success Habits'].includes(t))) {
                    categoryDocumentId = categoryMap['personal-growth'] ?? null;
                }
            }

            const existing = await docs('api::blog-post.blog-post').findFirst({
                filters: { slug: post.slug },
            });

            if (!existing) {
                await docs('api::blog-post.blog-post').create({
                    data: { ...post, category: categoryDocumentId },
                    status: 'published',
                });
                console.log(`  ✅ Blog post created: ${post.title}`);
            } else {
                await docs('api::blog-post.blog-post').update({
                    documentId: existing.documentId,
                    data: { ...post, category: categoryDocumentId },
                    status: 'published',
                });
                console.log(`  🔄 Blog post updated: ${post.title}`);
            }
        }

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}
