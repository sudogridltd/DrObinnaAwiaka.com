import { useData } from 'vike-react/useData'
import type { ShopData } from './+data'
import ShopPage from '@/pages/ShopPage'

export default function Page() {
  const { products } = useData<ShopData>()
  return <ShopPage products={products} />
}
