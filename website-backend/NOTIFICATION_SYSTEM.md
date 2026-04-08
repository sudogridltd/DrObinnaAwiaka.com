# Email Template Management & Notification System

This document describes the comprehensive email template management and notification system implemented in the Strapi backend.

## Overview

The system provides:
- **Email Template Management**: Create, edit, and manage email templates through the CMS
- **Email Notifications**: Send notifications to subscribers via email
- **SMS Notifications**: Backup SMS notifications for important communications (via Termii)
- **Notification Queue**: Queue and process notifications asynchronously
- **Subscriber Management**: Manage subscriber preferences and notification settings

## Architecture

### Content Types

1. **Email Template** (`api::email-template.email-template`)
   - Manage email templates with variables
   - Support for HTML and plain text versions
   - Template types: new-post, new-service, welcome, booking-confirmation, order-confirmation, etc.

2. **Email Log** (`api::email-log.email-log`)
   - Track all sent emails
   - Monitor delivery status, opens, and clicks
   - Store error messages for failed sends

3. **SMS Log** (`api::sms-log.sms-log`)
   - Track all sent SMS messages
   - Monitor delivery status
   - Store Twilio message SIDs for tracking

4. **Notification Queue** (`api::notification-queue.notification-queue`)
   - Queue notifications for batch processing
   - Support for scheduled notifications
   - Retry mechanism for failed notifications

5. **Newsletter Subscriber** (`api::newsletter-subscriber.newsletter-subscriber`)
   - Extended with phone number field
   - Notification preferences (email, SMS, notification types)
   - Track notification count and last notified date

### Services

1. **Email Service** (`src/services/email.ts`)
   - Nodemailer integration for sending emails
   - Support for HTML and plain text emails
   - Bulk email sending capability

2. **SMS Service** (`src/services/sms.ts`)
   - Termii integration for SMS sending
   - Phone number formatting for Nigerian numbers
   - Balance checking capability

3. **Notification Service** (`src/services/notification.ts`)
   - Orchestrate notifications to subscribers
   - Template variable replacement
   - Email and SMS coordination
   - Queue processing

### Lifecycle Hooks

1. **Blog Post** (`src/api/blog-post/content-types/blog-post/lifecycles.ts`)
   - Triggers notifications when new posts are published
   - Sends email notifications to all active subscribers

2. **Service** (`src/api/service/content-types/service/lifecycles.ts`)
   - Triggers notifications when new services are added
   - Sends email notifications to all active subscribers

3. **Order** (`src/api/order/content-types/order/lifecycles.ts`)
   - Triggers notifications when orders are created
   - Sends notifications on order status changes (confirmed, processing, shipped, delivered, cancelled)
   - Sends notifications on payment status changes (paid, failed)
   - Uses SMS for urgent notifications (cancelled, payment failed)

4. **Booking Submission** (`src/api/booking-submission/content-types/booking-submission/lifecycles.ts`)
   - Triggers notifications when bookings are created
   - Sends notifications on booking status changes (confirmed, cancelled, completed, rescheduled)
   - Uses SMS for urgent notifications (cancelled)

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@drobinnaawiaka.com
SMTP_FROM_NAME="Dr. Obinna Awiaka"
SMTP_REPLY_TO=contact@drobinnaawiaka.com

# SMS Configuration (Termii)
TERMII_API_KEY=your-termii-api-key
TERMII_SENDER_ID=DrObinna
TERMII_BASE_URL=https://v3.api.termii.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### 2. Install Dependencies

The system uses built-in Node.js fetch API for SMS and nodemailer for email. Install nodemailer:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 3. Seed Database

Run the seed script to populate the database with initial data (pages, services, products, and email templates):

```bash
npm run seed
```

This will seed:
- Global settings
- Homepage
- About page
- Services page
- Contact page
- Booking page
- Services
- Products
- Email templates

### 4. Configure Strapi Admin

1. Start the Strapi server: `npm run develop`
2. Navigate to the admin panel
3. Configure roles and permissions for the new content types
4. Set up API tokens if needed

## Usage

### Creating Email Templates

1. Navigate to **Content Manager** > **Email Template**
2. Click **Create new entry**
3. Fill in the template details:
   - **Name**: Template name
   - **Slug**: Unique identifier (e.g., `new-post`)
   - **Subject**: Email subject with variables (e.g., `New Post: {{postTitle}}`)
   - **HTML Body**: HTML content with variables
   - **Text Body**: Plain text version (optional)
   - **Template Type**: Select from predefined types
   - **Variables**: JSON array of available variables
   - **Category**: notification, marketing, transactional, system
   - **Priority**: low, normal, high, urgent

### Template Variables

Use double curly braces for variables: `{{variableName}}`

Common variables:
- `{{subscriberName}}`: Subscriber's first name
- `{{subscriberEmail}}`: Subscriber's email
- `{{unsubscribeUrl}}`: Unsubscribe link
- `{{postTitle}}`: Blog post title
- `{{postExcerpt}}`: Blog post excerpt
- `{{postUrl}}`: Blog post URL
- `{{serviceName}}`: Service name
- `{{servicePrice}}`: Service price
- `{{serviceUrl}}`: Service page URL

### Managing Subscribers

1. Navigate to **Content Manager** > **Newsletter Subscriber**
2. Add or edit subscribers
3. Configure notification preferences:
   - Email notifications enabled/disabled
   - SMS notifications enabled/disabled
   - Notification types (new posts, new services, promotions, updates)

### Viewing Logs

1. **Email Logs**: Track all sent emails, delivery status, and errors
2. **SMS Logs**: Track all sent SMS messages and delivery status
3. **Notification Queue**: Monitor pending, processing, and failed notifications

## API Endpoints

### Email Templates
- `GET /api/email-templates`: List all templates
- `GET /api/email-templates/:id`: Get template by ID
- `POST /api/email-templates`: Create new template
- `PUT /api/email-templates/:id`: Update template
- `DELETE /api/email-templates/:id`: Delete template

### Email Logs
- `GET /api/email-logs`: List all email logs
- `GET /api/email-logs/:id`: Get email log by ID

### SMS Logs
- `GET /api/sms-logs`: List all SMS logs
- `GET /api/sms-logs/:id`: Get SMS log by ID

### Notification Queue
- `GET /api/notification-queues`: List all queued notifications
- `GET /api/notification-queues/:id`: Get notification by ID
- `POST /api/notification-queues`: Create new notification
- `PUT /api/notification-queues/:id`: Update notification

### Newsletter Subscribers
- `GET /api/newsletter-subscribers`: List all subscribers
- `GET /api/newsletter-subscribers/:id`: Get subscriber by ID
- `POST /api/newsletter-subscribers`: Create new subscriber
- `PUT /api/newsletter-subscribers/:id`: Update subscriber
- `DELETE /api/newsletter-subscribers/:id`: Delete subscriber

## Notification Flow

### Automatic Notifications (New Posts/Services)

1. Admin publishes a new blog post or service
2. Lifecycle hook triggers `afterCreate` or `afterUpdate`
3. Notification service fetches all active subscribers
4. For each subscriber:
   - Load appropriate email template
   - Replace template variables with actual data
   - Send email via email service
   - Log email in Email Log
   - If SMS enabled and priority is high/urgent, send SMS
   - Log SMS in SMS Log

### Automatic Notifications (Orders/Bookings)

1. Customer creates an order or booking
2. Lifecycle hook triggers `afterCreate`
3. Notification service sends confirmation to customer
4. On status updates:
   - Lifecycle hook triggers `afterUpdate`
   - Notification service sends status update to customer
   - SMS sent for urgent notifications (cancelled, payment failed)
   - All notifications logged in Email Log and SMS Log

### Queued Notifications

1. Create notification in Notification Queue
2. Set scheduled time (optional)
3. Process queue manually or via cron job
4. Notification service processes pending notifications
5. Updates status to sent/failed
6. Retries failed notifications (max 3 attempts)

## SMS Notifications (Backup)

SMS notifications are sent only for:
- **Urgent** priority notifications
- **High** priority notifications
- When explicitly requested via channel setting

This ensures SMS costs are minimized while maintaining communication for important updates.

## Customization

### Adding New Template Types

1. Update `templateType` enum in `email-template/schema.json`
2. Add new template type to notification service
3. Create corresponding email template in CMS

### Modifying Notification Behavior

Edit `src/services/notification.ts` to:
- Change notification frequency
- Add filtering logic for subscribers
- Customize SMS message content
- Add additional notification channels

### Custom Email Templates

Create custom templates with any HTML/CSS. The system supports:
- Responsive design
- Inline CSS
- Template variables
- Conditional content (using Handlebars-style syntax)

## Troubleshooting

### Emails Not Sending

1. Check SMTP credentials in `.env`
2. Verify SMTP server is accessible
3. Check Email Logs for error messages
4. Ensure email template is active

### SMS Not Sending

1. Check Termii API key in `.env`
2. Verify Termii account has sufficient balance
3. Check SMS Logs for error messages
4. Ensure phone numbers are in correct format

### Notifications Not Triggering

1. Verify lifecycle hooks are properly loaded
2. Check Strapi logs for errors
3. Ensure subscribers have status "subscribed"
4. Verify email template exists and is active

## Security Considerations

1. **Environment Variables**: Never commit `.env` file to version control
2. **API Keys**: Rotate API keys regularly
3. **Subscriber Data**: Protect subscriber personal information
4. **Email Validation**: Validate email addresses before sending
5. **Rate Limiting**: Implement rate limiting for notification endpoints
6. **Unsubscribe**: Always include unsubscribe link in emails

## Performance Optimization

1. **Batch Processing**: Process notifications in batches
2. **Queue System**: Use notification queue for large subscriber lists
3. **Async Processing**: Process notifications asynchronously
4. **Database Indexing**: Add indexes on frequently queried fields
5. **Caching**: Cache email templates for faster rendering

## Support

For issues or questions, contact the development team or refer to:
- Strapi Documentation: https://docs.strapi.io
- Nodemailer Documentation: https://nodemailer.com
- Termii Documentation: https://developer.termii.com
