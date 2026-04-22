import * as fs from 'fs';
import * as path from 'path';

// Sentinel values used to detect whether a record was manually changed in the admin.
// On first seed, these values are stored. On re-run, the DB value is compared to
// the stored sentinel — if they still match, the record is safe to update.
const SEED_STATE_PATH = path.join(__dirname, '..', 'database', 'seeds', '.seed-state.json');

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

async function seed() {
    console.log('🌱 Starting database seeding...');

    const { createStrapi } = await import('@strapi/strapi');
    const app = createStrapi();
    await app.load();

    const staticContentPath = path.join(__dirname, '..', 'database', 'seeds', 'static-content.json');
    const staticContent = JSON.parse(fs.readFileSync(staticContentPath, 'utf8'));

    const state = loadSeedState();

    try {
        // ── Global Settings ───────────────────────────────────────────────────
        console.log('📌 Seeding global settings...');
        const existingGlobal = await app.db.query('api::global.global').findOne();
        if (!existingGlobal) {
            await app.db.query('api::global.global').create({ data: staticContent.global });
            state.global = { siteTagline: staticContent.global.siteTagline };
            console.log('✅ Global settings seeded');
        } else {
            const storedSentinel = state.global?.siteTagline;
            if (storedSentinel === undefined || existingGlobal.siteTagline === storedSentinel) {
                await app.db.query('api::global.global').update({
                    where: { id: existingGlobal.id },
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
        const existingHomepage = await app.db.query('api::homepage.homepage').findOne();
        if (!existingHomepage) {
            await app.db.query('api::homepage.homepage').create({ data: staticContent.homepage });
            state.homepage = { heroTitle: staticContent.homepage.hero.title };
            console.log('✅ Homepage seeded');
        } else {
            const storedSentinel = state.homepage?.heroTitle;
            const currentTitle = existingHomepage.hero?.title ?? existingHomepage.heroTitle;
            if (storedSentinel === undefined || currentTitle === storedSentinel) {
                await app.db.query('api::homepage.homepage').update({
                    where: { id: existingHomepage.id },
                    data: staticContent.homepage,
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
        const existingAboutPage = await app.db.query('api::about-page.about-page').findOne();
        if (!existingAboutPage) {
            await app.db.query('api::about-page.about-page').create({ data: staticContent.aboutPage });
            state.aboutPage = { bioText: getFirstBioText(staticContent.aboutPage.bio) };
            console.log('✅ About page seeded');
        } else {
            const storedSentinel = state.aboutPage?.bioText;
            const currentBioText = getFirstBioText(existingAboutPage.bio);
            if (storedSentinel === undefined || currentBioText === storedSentinel) {
                await app.db.query('api::about-page.about-page').update({
                    where: { id: existingAboutPage.id },
                    data: staticContent.aboutPage,
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
        const existingServicesPage = await app.db.query('api::services-page.services-page').findOne();
        if (!existingServicesPage) {
            await app.db.query('api::services-page.services-page').create({ data: staticContent.servicesPage });
            state.servicesPage = { heroTitle: staticContent.servicesPage.hero.title };
            console.log('✅ Services page seeded');
        } else {
            const storedSentinel = state.servicesPage?.heroTitle;
            const currentTitle = existingServicesPage.hero?.title ?? existingServicesPage.heroTitle;
            if (storedSentinel === undefined || currentTitle === storedSentinel) {
                await app.db.query('api::services-page.services-page').update({
                    where: { id: existingServicesPage.id },
                    data: staticContent.servicesPage,
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
        const existingContactPage = await app.db.query('api::contact-page.contact-page').findOne();
        if (!existingContactPage) {
            await app.db.query('api::contact-page.contact-page').create({ data: staticContent.contactPage });
            state.contactPage = { heroTitle: staticContent.contactPage.hero.title };
            console.log('✅ Contact page seeded');
        } else {
            const storedSentinel = state.contactPage?.heroTitle;
            const currentTitle = existingContactPage.hero?.title ?? existingContactPage.heroTitle;
            if (storedSentinel === undefined || currentTitle === storedSentinel) {
                await app.db.query('api::contact-page.contact-page').update({
                    where: { id: existingContactPage.id },
                    data: staticContent.contactPage,
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
        const existingBookingPage = await app.db.query('api::booking-page.booking-page').findOne();
        if (!existingBookingPage) {
            await app.db.query('api::booking-page.booking-page').create({ data: staticContent.bookingPage });
            state.bookingPage = { heroTitle: staticContent.bookingPage.hero.title };
            console.log('✅ Booking page seeded');
        } else {
            const storedSentinel = state.bookingPage?.heroTitle;
            const currentTitle = existingBookingPage.hero?.title ?? existingBookingPage.heroTitle;
            if (storedSentinel === undefined || currentTitle === storedSentinel) {
                await app.db.query('api::booking-page.booking-page').update({
                    where: { id: existingBookingPage.id },
                    data: staticContent.bookingPage,
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
            const existing = await app.db.query('api::service.service').findOne({
                where: { slug: service.slug },
            });
            if (!existing) {
                await app.db.query('api::service.service').create({ data: service });
                console.log(`  ✅ Service created: ${service.title}`);
            } else {
                await app.db.query('api::service.service').update({
                    where: { id: existing.id },
                    data: service,
                });
                console.log(`  🔄 Service updated: ${service.title}`);
            }
        }

        // ── Products (upsert by slug) ─────────────────────────────────────────
        console.log('📌 Seeding products...');
        for (const product of staticContent.products) {
            const existing = await app.db.query('api::product.product').findOne({
                where: { slug: product.slug },
            });
            if (!existing) {
                await app.db.query('api::product.product').create({ data: product });
                console.log(`  ✅ Product created: ${product.title}`);
            } else {
                await app.db.query('api::product.product').update({
                    where: { id: existing.id },
                    data: product,
                });
                console.log(`  🔄 Product updated: ${product.title}`);
            }
        }

        // ── Email Templates (create only — never overwrite manual edits) ───────
        console.log('📌 Seeding email templates...');
        const emailTemplatesPath = path.join(__dirname, '..', 'database', 'seeds', 'email-templates.json');
        const emailTemplatesData = JSON.parse(fs.readFileSync(emailTemplatesPath, 'utf8'));
        const emailTemplates = emailTemplatesData.emailTemplates || emailTemplatesData;

        const existingEmailTemplates = await app.db.query('api::email-template.email-template').findMany();
        if (existingEmailTemplates.length === 0) {
            for (const template of emailTemplates) {
                await app.db.query('api::email-template.email-template').create({ data: template });
            }
            console.log(`✅ ${emailTemplates.length} email templates seeded`);
        } else {
            console.log(`⏭️  ${existingEmailTemplates.length} email templates already exist, skipping`);
        }

        // ── Blog Categories (upsert by slug) ──────────────────────────────────
        console.log('📌 Seeding blog categories...');
        for (const category of staticContent.blogCategories) {
            const existing = await app.db.query('api::blog-category.blog-category').findOne({
                where: { slug: category.slug },
            });
            if (!existing) {
                await app.db.query('api::blog-category.blog-category').create({ data: category });
                console.log(`  ✅ Category created: ${category.name}`);
            } else {
                await app.db.query('api::blog-category.blog-category').update({
                    where: { id: existing.id },
                    data: category,
                });
                console.log(`  🔄 Category updated: ${category.name}`);
            }
        }

        // ── Blog Posts (upsert by slug) ───────────────────────────────────────
        console.log('📌 Seeding blog posts...');
        const allCats = await app.db.query('api::blog-category.blog-category').findMany();
        const categoryMap: Record<string, any> = {};
        allCats.forEach((cat: any) => {
            categoryMap[cat.slug] = cat;
        });

        for (const post of staticContent.blogPosts) {
            let categoryId: number | null = null;
            if (post.tags) {
                const tagTexts = post.tags.map((t: any) => t.text);
                if (tagTexts.some((t: string) => ['Leadership', 'Executive Coaching'].includes(t))) {
                    categoryId = categoryMap['leadership']?.id ?? null;
                } else if (tagTexts.some((t: string) => ['Mindset', 'Confidence'].includes(t))) {
                    categoryId = categoryMap['mindset']?.id ?? null;
                } else if (tagTexts.some((t: string) => ['Relationships', 'Boundaries'].includes(t))) {
                    categoryId = categoryMap['relationships']?.id ?? null;
                } else if (tagTexts.some((t: string) => ['Personal Development', 'Success Habits'].includes(t))) {
                    categoryId = categoryMap['personal-growth']?.id ?? null;
                }
            }

            const existing = await app.db.query('api::blog-post.blog-post').findOne({
                where: { slug: post.slug },
            });

            if (!existing) {
                await app.db.query('api::blog-post.blog-post').create({
                    data: { ...post, category: categoryId },
                });
                console.log(`  ✅ Blog post created: ${post.title}`);
            } else {
                await app.db.query('api::blog-post.blog-post').update({
                    where: { id: existing.id },
                    data: { ...post, category: categoryId },
                });
                console.log(`  🔄 Blog post updated: ${post.title}`);
            }
        }

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    } finally {
        await app.destroy();
    }
}

seed()
    .then(() => {
        console.log('✨ Seed script finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Seed script failed:', error);
        process.exit(1);
    });
