/**
 * Strapi API client for the Dr Obinna Awiaka website frontend.
 *
 * Usage:
 *   import { strapiClient } from '@/lib/strapi';
 *   const homepage = await strapiClient.getHomepage();
 */

import type {
  StrapiResponse,
  StrapiListResponse,
  StrapiGlobal,
  StrapiHomepage,
  StrapiAboutPage,
  StrapiServicesPage,
  StrapiShopPage,
  StrapiContactPage,
  StrapiBookingPage,
  StrapiBlogPage,
  StrapiService,
  StrapiProduct,
  StrapiProductCategory,
  StrapiBlogPost,
  StrapiBlogCategory,
  StrapiTestimonial,
  StrapiBookingSubmission,
  StrapiContactSubmission,
  StrapiNewsletterSubscriber,
  StrapiOrder,
  StrapiCustomer,
} from '@/types/strapi';

// On the server (SSR), read directly from process.env so the URL is always
// correct regardless of what was baked in at build time.
// On the client, prefer window.__ENV__ (injected by server.ts at runtime)
// which also reflects the live server env, falling back to the build-time
// import.meta.env values only as a last resort.
function getEnv(key: 'STRAPI_URL' | 'STRAPI_API_TOKEN', buildTimeFallback: string): string {
  // Server-side (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    const val = process.env[`VITE_${key}`] || process.env[key]
    if (val) return val
  }
  // Client-side runtime injection
  if (typeof window !== 'undefined' && (window as any).__ENV__?.[key]) {
    return (window as any).__ENV__[key]
  }
  return buildTimeFallback
}

const STRAPI_URL = getEnv('STRAPI_URL', import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337');
const STRAPI_API_TOKEN = getEnv('STRAPI_API_TOKEN', import.meta.env.VITE_STRAPI_API_TOKEN ?? '');

// ─────────────────────────────────────────────────────
// Core fetch helper
// ─────────────────────────────────────────────────────

async function fetchStrapi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${STRAPI_URL}/api${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    const method = options.method ?? 'GET';
    throw new Error(`Strapi ${res.status} ${method} ${url} — ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────
// Populate helpers
// Note: Strapi v5 uses separate populate params for each field
// ─────────────────────────────────────────────────────

const GLOBAL_POPULATE = 'populate=logo&populate=favicon&populate=socialLinks&populate=headerNavigation&populate=footerNavigation&populate=defaultSeo';

const HOMEPAGE_POPULATE = 'populate=hero&populate=stats&populate=whyChooseUsFeatures&populate=assuranceFeatures&populate=assuranceImage&populate=ctaButtons&populate=seo';

const ABOUT_PAGE_POPULATE = 'populate=hero&populate=stats&populate=seo&populate=profilePhoto&populate=teamMembers&populate=socialLinks';

const SERVICES_PAGE_POPULATE = 'populate=hero&populate=seo&populate=ctaButtons';

const SHOP_PAGE_POPULATE = 'populate=hero&populate=seo&populate=guaranteeImage&populate=ctaButtons';

const CONTACT_PAGE_POPULATE = 'populate=hero&populate=seo&populate=inquiryTopics';

const BOOKING_PAGE_POPULATE = 'populate=hero&populate=seo&populate=availableTimeSlots';

const BLOG_PAGE_POPULATE = 'populate=hero&populate=seo&populate=ctaButtons';

// Collection types - each populate as separate param
const SERVICE_POPULATE = 'populate=image&populate=seo';
const PRODUCT_POPULATE = 'populate=image&populate=seo';
const BLOG_POST_POPULATE = 'populate=featuredImage&populate=category&populate=authorPhoto&populate=seo&populate=relatedPosts';
const TESTIMONIAL_POPULATE = 'populate=avatar';

// ─────────────────────────────────────────────────────
// Single type endpoints
// ─────────────────────────────────────────────────────

async function getGlobal(): Promise<StrapiGlobal> {
  const res = await fetchStrapi<StrapiResponse<StrapiGlobal>>(
    `/global?${GLOBAL_POPULATE}`
  );
  return res.data;
}

async function getHomepage(): Promise<StrapiHomepage> {
  const res = await fetchStrapi<StrapiResponse<StrapiHomepage>>(
    `/homepage?${HOMEPAGE_POPULATE}`
  );
  return res.data;
}

async function getAboutPage(): Promise<StrapiAboutPage> {
  const res = await fetchStrapi<StrapiResponse<StrapiAboutPage>>(
    `/about-page?${ABOUT_PAGE_POPULATE}&populate=profilePhoto`
  );
  return res.data;
}

async function getServicesPage(): Promise<StrapiServicesPage> {
  const res = await fetchStrapi<StrapiResponse<StrapiServicesPage>>(
    `/services-page?${SERVICES_PAGE_POPULATE}`
  );
  return res.data;
}

async function getShopPage(): Promise<StrapiShopPage> {
  const res = await fetchStrapi<StrapiResponse<StrapiShopPage>>(
    `/shop-page?${SHOP_PAGE_POPULATE}`
  );
  return res.data;
}

async function getContactPage(): Promise<StrapiContactPage> {
  const res = await fetchStrapi<StrapiResponse<StrapiContactPage>>(
    `/contact-page?${CONTACT_PAGE_POPULATE}`
  );
  return res.data;
}

async function getBookingPage(): Promise<StrapiBookingPage> {
  const res = await fetchStrapi<StrapiResponse<StrapiBookingPage>>(
    `/booking-page?${BOOKING_PAGE_POPULATE}`
  );
  return res.data;
}

async function getBlogPage(): Promise<StrapiBlogPage> {
  const res = await fetchStrapi<StrapiResponse<StrapiBlogPage>>(
    `/blog-page?${BLOG_PAGE_POPULATE}`
  );
  return res.data;
}

// ─────────────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────────────

async function getServices(params?: {
  featured?: boolean;
  category?: string;
  sort?: string;
}): Promise<StrapiService[]> {
  const res = await fetchStrapi<StrapiListResponse<StrapiService>>(
    `/services?${SERVICE_POPULATE}&sort=${params?.sort ?? 'order:asc'}&pagination[pageSize]=100${params?.featured ? '&filters[isFeatured][$eq]=true' : ''}${params?.category ? `&filters[category][$eq]=${params.category}` : ''}`
  );
  return res.data;
}

async function getServiceBySlug(slug: string): Promise<StrapiService | null> {
  const res = await fetchStrapi<StrapiListResponse<StrapiService>>(
    `/services?filters[slug][$eq]=${slug}&${SERVICE_POPULATE}`
  );
  return res.data[0] ?? null;
}

// ─────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────

async function getProducts(params?: {
  featured?: boolean;
  category?: StrapiProductCategory;
  sort?: string;
}): Promise<StrapiProduct[]> {
  const queryParts = [
    PRODUCT_POPULATE,
    `sort=${params?.sort ?? 'publishedAt:desc'}`,
    'pagination[pageSize]=100',
    ...(params?.featured ? ['filters[isFeatured][$eq]=true'] : []),
    ...(params?.category ? [`filters[category][$eq]=${params.category}`] : []),
  ];
  const res = await fetchStrapi<StrapiListResponse<StrapiProduct>>(
    `/products?${queryParts.join('&')}`
  );
  return res.data;
}

async function getProductBySlug(slug: string): Promise<StrapiProduct | null> {
  const res = await fetchStrapi<StrapiListResponse<StrapiProduct>>(
    `/products?filters[slug][$eq]=${slug}&${PRODUCT_POPULATE}`
  );
  return res.data[0] ?? null;
}

// ─────────────────────────────────────────────────────
// Blog
// ─────────────────────────────────────────────────────

async function getBlogPosts(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  sort?: string;
}): Promise<StrapiListResponse<StrapiBlogPost>> {
  const queryParts = [
    BLOG_POST_POPULATE,
    `sort=${params?.sort ?? 'publishedAt:desc'}`,
    `pagination[page]=${params?.page ?? 1}`,
    `pagination[pageSize]=${params?.pageSize ?? 9}`,
    ...(params?.featured ? ['filters[isFeatured][$eq]=true'] : []),
    ...(params?.category ? [`filters[category][slug][$eq]=${params.category}`] : []),
  ];
  return fetchStrapi<StrapiListResponse<StrapiBlogPost>>(
    `/blog-posts?${queryParts.join('&')}`
  );
}

async function getBlogPostBySlug(slug: string): Promise<StrapiBlogPost | null> {
  const res = await fetchStrapi<StrapiListResponse<StrapiBlogPost>>(
    `/blog-posts?filters[slug][$eq]=${slug}&${BLOG_POST_POPULATE}`
  );
  return res.data[0] ?? null;
}

async function getBlogCategories(): Promise<StrapiBlogCategory[]> {
  const res = await fetchStrapi<StrapiListResponse<StrapiBlogCategory>>(
    '/blog-categories?populate=image&sort=name:asc'
  );
  return res.data;
}

// ─────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────

async function getTestimonials(params?: {
  featured?: boolean;
  serviceType?: string;
  limit?: number;
}): Promise<StrapiTestimonial[]> {
  const queryParts = [
    TESTIMONIAL_POPULATE,
    `sort=order:asc`,
    `pagination[pageSize]=${params?.limit ?? 50}`,
    ...(params?.featured ? ['filters[isFeatured][$eq]=true'] : []),
    ...(params?.serviceType ? [`filters[serviceType][$eq]=${params.serviceType}`] : []),
  ];
  const res = await fetchStrapi<StrapiListResponse<StrapiTestimonial>>(
    `/testimonials?${queryParts.join('&')}`
  );
  return res.data;
}

// ─────────────────────────────────────────────────────
// Form submissions
// ─────────────────────────────────────────────────────

async function submitBooking(
  data: Omit<StrapiBookingSubmission, 'id' | 'documentId' | 'status' | 'reference' | 'internalNotes' | 'createdAt' | 'updatedAt'>,
  captchaToken?: string | null
): Promise<{ success: boolean; reference?: number; message: string }> {
  try {
    const res = await fetchStrapi<StrapiResponse<StrapiBookingSubmission>>(
      '/booking-submissions',
      {
        method: 'POST',
        body: JSON.stringify({ data: { ...data, ...(captchaToken ? { captchaToken } : {}) } }),
      }
    );
    return {
      success: true,
      reference: res.data.id,
      message: 'Your booking request has been received. We will confirm shortly.',
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'An error occurred. Please try again.',
    };
  }
}

async function submitContact(
  data: Omit<StrapiContactSubmission, 'id' | 'documentId' | 'status' | 'reference' | 'internalNotes' | 'createdAt' | 'updatedAt'>,
  captchaToken?: string | null
): Promise<{ success: boolean; reference?: number; message: string }> {
  try {
    const res = await fetchStrapi<StrapiResponse<StrapiContactSubmission>>(
      '/contact-submissions',
      {
        method: 'POST',
        body: JSON.stringify({ data: { ...data, ...(captchaToken ? { captchaToken } : {}) } }),
      }
    );
    return {
      success: true,
      reference: res.data.id,
      message: "Thank you for reaching out! We'll get back to you within 24-48 hours.",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'An error occurred. Please try again.',
    };
  }
}

async function subscribeNewsletter(
  data: Pick<StrapiNewsletterSubscriber, 'email' | 'firstName'> & { source?: StrapiNewsletterSubscriber['source'] },
  captchaToken?: string | null
): Promise<{ success: boolean; message: string }> {
  try {
    await fetchStrapi('/newsletter-subscribers', {
      method: 'POST',
      body: JSON.stringify({ data: { ...data, status: 'subscribed', ...(captchaToken ? { captchaToken } : {}) } }),
    });
    return { success: true, message: "You're subscribed! Check your inbox for a welcome email." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    // Handle duplicate email gracefully
    if (msg.includes('unique')) {
      return { success: true, message: "You're already subscribed. Thank you!" };
    }
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

// ─────────────────────────────────────────────────────
// Payments
// ─────────────────────────────────────────────────────

export interface PaymentInitParams {
  type: 'product' | 'booking-deposit';
  // Product
  items?: Array<{ productId: string; quantity?: number }>;
  // Booking deposit
  serviceId?: string;
  bookingData?: Record<string, unknown>;
  captchaToken?: string;
  // Customer
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  callbackUrl?: string;
}

export interface PaymentInitResult {
  reference: string;
  authorizationUrl: string;
  orderId: string;
  bookingId?: string;
  amount: number;
}

async function initializePayment(params: PaymentInitParams): Promise<PaymentInitResult> {
  return fetchStrapi<PaymentInitResult>('/payments/initialize', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

async function verifyPayment(reference: string): Promise<{ success: boolean; message: string }> {
  return fetchStrapi(`/payments/verify?reference=${encodeURIComponent(reference)}`);
}

// ─────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────

async function getOrders(params?: {
  status?: StrapiOrder['status'];
  page?: number;
  pageSize?: number;
}): Promise<StrapiListResponse<StrapiOrder>> {
  const queryParts = [
    'populate[customer]=true',
    'populate[items][populate][product]=true',
    'populate[bookingSubmission]=true',
    `sort=createdAt:desc`,
    `pagination[page]=${params?.page ?? 1}`,
    `pagination[pageSize]=${params?.pageSize ?? 20}`,
    ...(params?.status ? [`filters[status][$eq]=${params.status}`] : []),
  ];
  return fetchStrapi<StrapiListResponse<StrapiOrder>>(`/orders?${queryParts.join('&')}`);
}

async function getOrderById(documentId: string): Promise<StrapiOrder | null> {
  try {
    const res = await fetchStrapi<StrapiResponse<StrapiOrder>>(
      `/orders/${documentId}?populate[customer]=true&populate[items][populate][product]=true&populate[bookingSubmission]=true`
    );
    return res.data;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────
// Customers
// ─────────────────────────────────────────────────────

async function getCustomers(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<StrapiListResponse<StrapiCustomer>> {
  const queryParts = [
    'populate[orders]=true',
    'populate[bookings]=true',
    `sort=createdAt:desc`,
    `pagination[page]=${params?.page ?? 1}`,
    `pagination[pageSize]=${params?.pageSize ?? 20}`,
    ...(params?.search
      ? [`filters[$or][0][email][$containsi]=${params.search}&filters[$or][1][firstName][$containsi]=${params.search}&filters[$or][2][lastName][$containsi]=${params.search}`]
      : []),
  ];
  return fetchStrapi<StrapiListResponse<StrapiCustomer>>(`/customers?${queryParts.join('&')}`);
}

async function getCustomerById(documentId: string): Promise<StrapiCustomer | null> {
  try {
    const res = await fetchStrapi<StrapiResponse<StrapiCustomer>>(
      `/customers/${documentId}?populate[orders][populate][items]=true&populate[bookings]=true&populate[tags]=true`
    );
    return res.data;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────
// Exported client
// ─────────────────────────────────────────────────────

export const strapiClient = {
  // Single types
  getGlobal,
  getHomepage,
  getAboutPage,
  getServicesPage,
  getShopPage,
  getContactPage,
  getBookingPage,
  getBlogPage,
  // Collections
  getServices,
  getServiceBySlug,
  getProducts,
  getProductBySlug,
  getBlogPosts,
  getBlogPostBySlug,
  getBlogCategories,
  getTestimonials,
  // Form submissions
  submitBooking,
  submitContact,
  subscribeNewsletter,
  // Payments
  initializePayment,
  verifyPayment,
  // Orders & customers (primarily used from admin, but available for account pages)
  getOrders,
  getOrderById,
  getCustomers,
  getCustomerById,
};

/** Helper: get the full URL for a Strapi media file */
export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}
