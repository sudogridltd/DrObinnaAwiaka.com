import type { PageContextServer } from 'vike/types'
import { strapiClient } from '@/lib/strapi'
import type { StrapiBookingPage } from '@/types/strapi'

export type BookingData = {
  bookingPage: StrapiBookingPage | null
}

export async function data(_pageContext: PageContextServer): Promise<BookingData> {
  try {
    const bookingPage = await strapiClient.getBookingPage()
    return { bookingPage }
  } catch {
    return { bookingPage: null }
  }
}
