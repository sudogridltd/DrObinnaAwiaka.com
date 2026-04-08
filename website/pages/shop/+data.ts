import type { PageContextServer } from 'vike/types'
import { strapiClient } from '@/lib/strapi'
import type { StrapiProduct } from '@/types/strapi'

export type ShopData = {
  products: StrapiProduct[]
}

export async function data(_pageContext: PageContextServer): Promise<ShopData> {
  try {
    const products = await strapiClient.getProducts()
    return { products }
  } catch {
    return { products: [] }
  }
}
