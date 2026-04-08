import type { PageContextServer } from 'vike/types'
import { strapiClient } from '@/lib/strapi'
import type { StrapiServicesPage, StrapiService } from '@/types/strapi'

export type ServicesData = {
  servicesPage: StrapiServicesPage | null
  services: StrapiService[]
}

export async function data(_pageContext: PageContextServer): Promise<ServicesData> {
  const [servicesPage, services] = await Promise.allSettled([
    strapiClient.getServicesPage(),
    strapiClient.getServices(),
  ])

  return {
    servicesPage: servicesPage.status === 'fulfilled' ? servicesPage.value : null,
    services: services.status === 'fulfilled' ? services.value : [],
  }
}
