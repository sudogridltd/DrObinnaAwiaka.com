import type { PageContextServer } from 'vike/types'
import { strapiClient } from '@/lib/strapi'
import type { StrapiAboutPage } from '@/types/strapi'

export type AboutData = {
  aboutPage: StrapiAboutPage | null
}

export async function data(_pageContext: PageContextServer): Promise<AboutData> {
  try {
    const aboutPage = await strapiClient.getAboutPage()
    return { aboutPage }
  } catch {
    return { aboutPage: null }
  }
}
