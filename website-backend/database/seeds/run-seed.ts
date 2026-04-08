import * as fs from 'fs';
import * as path from 'path';

export default async function seed(strapi: any) {
    console.log('🌱 Starting database seeding...');

    // Read static content (use process.cwd() so it works from both src and compiled dist)
    const staticContentPath = path.join(process.cwd(), 'database', 'seeds', 'static-content.json');
    const staticContent = JSON.parse(fs.readFileSync(staticContentPath, 'utf8'));

    const docs = strapi.documents;

    try {
        // Seed Global Settings
        console.log('📌 Seeding global settings...');
        const existingGlobal = await docs('api::global.global').findFirst({});
        if (!existingGlobal) {
            await docs('api::global.global').create({ data: staticContent.global });
            console.log('✅ Global settings seeded');
        } else {
            console.log('⏭️  Global settings already exist, continuing...');
            // Don't return - continue with other seeds
        }

        // Seed Homepage
        console.log('📌 Seeding homepage...');
        const existingHomepage = await docs('api::homepage.homepage').findFirst({});
        if (!existingHomepage) {
            await docs('api::homepage.homepage').create({
                data: staticContent.homepage,
                status: 'published',
            });
            console.log('✅ Homepage seeded');
        } else {
            console.log('⏭️  Homepage already exists, skipping');
        }

        // Seed About Page
        console.log('📌 Seeding about page...');
        const existingAboutPage = await docs('api::about-page.about-page').findFirst({});
        if (!existingAboutPage) {
            await docs('api::about-page.about-page').create({
                data: staticContent.aboutPage,
                status: 'published',
            });
            console.log('✅ About page seeded');
        } else {
            console.log('⏭️  About page already exists, skipping');
        }

        // Seed Services Page
        console.log('📌 Seeding services page...');
        const existingServicesPage = await docs('api::services-page.services-page').findFirst({});
        if (!existingServicesPage) {
            await docs('api::services-page.services-page').create({
                data: staticContent.servicesPage,
                status: 'published',
            });
            console.log('✅ Services page seeded');
        } else {
            console.log('⏭️  Services page already exists, skipping');
        }

        // Seed Contact Page
        console.log('📌 Seeding contact page...');
        const existingContactPage = await docs('api::contact-page.contact-page').findFirst({});
        if (!existingContactPage) {
            await docs('api::contact-page.contact-page').create({
                data: staticContent.contactPage,
                status: 'published',
            });
            console.log('✅ Contact page seeded');
        } else {
            console.log('⏭️  Contact page already exists, skipping');
        }

        // Seed Booking Page
        console.log('📌 Seeding booking page...');
        const existingBookingPage = await docs('api::booking-page.booking-page').findFirst({});
        if (!existingBookingPage) {
            await docs('api::booking-page.booking-page').create({
                data: staticContent.bookingPage,
                status: 'published',
            });
            console.log('✅ Booking page seeded');
        } else {
            console.log('⏭️  Booking page already exists, skipping');
        }

        // Seed Services
        console.log('📌 Seeding services...');
        const existingServices = await docs('api::service.service').findMany({});
        if (existingServices.length === 0) {
            for (const service of staticContent.services) {
                await docs('api::service.service').create({
                    data: service,
                    status: 'published',
                });
            }
            console.log(`✅ ${staticContent.services.length} services seeded`);
        } else {
            console.log(`⏭️  ${existingServices.length} services already exist, skipping`);
        }

        // Seed Products
        console.log('📌 Seeding products...');
        const existingProducts = await docs('api::product.product').findMany({});
        if (existingProducts.length === 0) {
            for (const product of staticContent.products) {
                await docs('api::product.product').create({
                    data: product,
                    status: 'published',
                });
            }
            console.log(`✅ ${staticContent.products.length} products seeded`);
        } else {
            console.log(`⏭️  ${existingProducts.length} products already exist, skipping`);
        }

        // Seed Email Templates
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

        // Seed Blog Categories
        console.log('📌 Seeding blog categories...');
        const blogCats = await docs('api::blog-category.blog-category').findMany({});
        if (blogCats.length === 0) {
            for (const category of staticContent.blogCategories) {
                await docs('api::blog-category.blog-category').create({
                    data: category,
                    status: 'published',
                });
            }
            console.log(`✅ ${staticContent.blogCategories.length} blog categories seeded`);
        } else {
            console.log(`⏭️  ${blogCats.length} blog categories already exist, skipping`);
        }

        // Seed Blog Posts
        console.log('📌 Seeding blog posts...');
        const existingPosts = await docs('api::blog-post.blog-post').findMany({});
        if (existingPosts.length === 0) {
            // Reload categories (may have just been created above)
            const allCats = await docs('api::blog-category.blog-category').findMany({});
            const categoryMap: Record<string, any> = {};
            allCats.forEach((cat: any) => {
                categoryMap[cat.slug] = cat.documentId;
            });

            for (const post of staticContent.blogPosts) {
                // Resolve category from tags
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

                await docs('api::blog-post.blog-post').create({
                    data: {
                        ...post,
                        category: categoryDocumentId,
                    },
                    status: 'published',
                });
            }
            console.log(`✅ ${staticContent.blogPosts.length} blog posts seeded`);
        } else {
            console.log(`⏭️  ${existingPosts.length} blog posts already exist, skipping`);
        }

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}
