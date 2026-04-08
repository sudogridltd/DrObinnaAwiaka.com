import * as fs from 'fs';
import * as path from 'path';

// This script is meant to be run with ts-node
// Usage: npm run seed

async function seed() {
    console.log('🌱 Starting database seeding...');

    // Dynamically import Strapi
    const { createStrapi } = await import('@strapi/strapi');

    // Initialize Strapi
    const app = createStrapi();
    await app.load();

    // Read static content
    const staticContentPath = path.join(__dirname, '..', 'database', 'seeds', 'static-content.json');
    const staticContent = JSON.parse(fs.readFileSync(staticContentPath, 'utf8'));

    try {
        // Seed Global Settings
        console.log('📌 Seeding global settings...');
        const existingGlobal = await app.db.query('api::global.global').findOne();
        if (!existingGlobal) {
            await app.db.query('api::global.global').create({
                data: staticContent.global,
            });
            console.log('✅ Global settings seeded');
        } else {
            console.log('⏭️  Global settings already exist, skipping');
        }

        // Seed Homepage
        console.log('📌 Seeding homepage...');
        const existingHomepage = await app.db.query('api::homepage.homepage').findOne();
        if (!existingHomepage) {
            await app.db.query('api::homepage.homepage').create({
                data: staticContent.homepage,
            });
            console.log('✅ Homepage seeded');
        } else {
            console.log('⏭️  Homepage already exists, skipping');
        }

        // Seed About Page
        console.log('📌 Seeding about page...');
        const existingAboutPage = await app.db.query('api::about-page.about-page').findOne();
        if (!existingAboutPage) {
            await app.db.query('api::about-page.about-page').create({
                data: staticContent.aboutPage,
            });
            console.log('✅ About page seeded');
        } else {
            console.log('⏭️  About page already exists, skipping');
        }

        // Seed Services Page
        console.log('📌 Seeding services page...');
        const existingServicesPage = await app.db.query('api::services-page.services-page').findOne();
        if (!existingServicesPage) {
            await app.db.query('api::services-page.services-page').create({
                data: staticContent.servicesPage,
            });
            console.log('✅ Services page seeded');
        } else {
            console.log('⏭️  Services page already exists, skipping');
        }

        // Seed Contact Page
        console.log('📌 Seeding contact page...');
        const existingContactPage = await app.db.query('api::contact-page.contact-page').findOne();
        if (!existingContactPage) {
            await app.db.query('api::contact-page.contact-page').create({
                data: staticContent.contactPage,
            });
            console.log('✅ Contact page seeded');
        } else {
            console.log('⏭️  Contact page already exists, skipping');
        }

        // Seed Booking Page
        console.log('📌 Seeding booking page...');
        const existingBookingPage = await app.db.query('api::booking-page.booking-page').findOne();
        if (!existingBookingPage) {
            await app.db.query('api::booking-page.booking-page').create({
                data: staticContent.bookingPage,
            });
            console.log('✅ Booking page seeded');
        } else {
            console.log('⏭️  Booking page already exists, skipping');
        }

        // Seed Services
        console.log('📌 Seeding services...');
        const existingServices = await app.db.query('api::service.service').findMany();
        if (existingServices.length === 0) {
            for (const service of staticContent.services) {
                await app.db.query('api::service.service').create({
                    data: service,
                });
            }
            console.log(`✅ ${staticContent.services.length} services seeded`);
        } else {
            console.log(`⏭️  ${existingServices.length} services already exist, skipping`);
        }

        // Seed Products
        console.log('📌 Seeding products...');
        const existingProducts = await app.db.query('api::product.product').findMany();
        if (existingProducts.length === 0) {
            for (const product of staticContent.products) {
                await app.db.query('api::product.product').create({
                    data: product,
                });
            }
            console.log(`✅ ${staticContent.products.length} products seeded`);
        } else {
            console.log(`⏭️  ${existingProducts.length} products already exist, skipping`);
        }

        // Seed Email Templates
        console.log('📌 Seeding email templates...');
        const emailTemplatesPath = path.join(__dirname, '..', 'database', 'seeds', 'email-templates.json');
        const emailTemplatesData = JSON.parse(fs.readFileSync(emailTemplatesPath, 'utf8'));
        const emailTemplates = emailTemplatesData.emailTemplates || emailTemplatesData;

        const existingEmailTemplates = await app.db.query('api::email-template.email-template').findMany();
        if (existingEmailTemplates.length === 0) {
            for (const template of emailTemplates) {
                await app.db.query('api::email-template.email-template').create({
                    data: template,
                });
            }
            console.log(`✅ ${emailTemplates.length} email templates seeded`);
        } else {
            console.log(`⏭️  ${existingEmailTemplates.length} email templates already exist, skipping`);
        }

        // Seed Blog Categories
        console.log('📌 Seeding blog categories...');
        const existingCategories = await app.db.query('api::blog-category.blog-category').findMany();
        if (existingCategories.length === 0) {
            for (const category of staticContent.blogCategories) {
                await app.db.query('api::blog-category.blog-category').create({
                    data: category,
                });
            }
            console.log(`✅ ${staticContent.blogCategories.length} blog categories seeded`);
        } else {
            console.log(`⏭️  ${existingCategories.length} blog categories already exist, skipping`);
        }

        // Seed Blog Posts
        console.log('📌 Seeding blog posts...');
        const existingPosts = await app.db.query('api::blog-post.blog-post').findMany();
        if (existingPosts.length === 0) {
            // Get categories to link to posts
            const categories = await app.db.query('api::blog-category.blog-category').findMany();
            
            const categoryMap: Record<string, any> = {};
            categories.forEach((cat: any) => {
                categoryMap[cat.slug] = cat;
            });

            for (const post of staticContent.blogPosts) {
                // Assign category based on tags/content
                let categoryId = null;
                if (post.tags) {
                    const tagTexts = post.tags.map((t: any) => t.text);
                    if (tagTexts.includes('Leadership') || tagTexts.includes('Executive Coaching')) {
                        categoryId = categoryMap['leadership']?.id;
                    } else if (tagTexts.includes('Mindset') || tagTexts.includes('Confidence')) {
                        categoryId = categoryMap['mindset']?.id;
                    } else if (tagTexts.includes('Relationships') || tagTexts.includes('Boundaries')) {
                        categoryId = categoryMap['relationships']?.id;
                    } else if (tagTexts.includes('Personal Development') || tagTexts.includes('Success Habits')) {
                        categoryId = categoryMap['personal-growth']?.id;
                    }
                }
                
                await app.db.query('api::blog-post.blog-post').create({
                    data: {
                        ...post,
                        category: categoryId || null,
                    },
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
    } finally {
        // Destroy Strapi instance
        await app.destroy();
    }
}

// Run the seed function
seed()
    .then(() => {
        console.log('✨ Seed script finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Seed script failed:', error);
        process.exit(1);
    });
