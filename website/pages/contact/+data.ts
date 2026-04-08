import type { PageContextServer } from 'vike/types'
import { strapiClient } from '@/lib/strapi'
import type { StrapiContactPage, StrapiGlobal } from '@/types/strapi'

export type ContactData = {
  contactPage: StrapiContactPage | null
  global: StrapiGlobal | null
}

export async function data(_pageContext: PageContextServer): Promise<ContactData> {
  const [contactPage, global] = await Promise.allSettled([
    strapiClient.getContactPage(),
    strapiClient.getGlobal(),
  ])

  return {
    contactPage: contactPage.status === 'fulfilled' ? contactPage.value : null,
    global: global.status === 'fulfilled' ? global.value : null,
  }
}
