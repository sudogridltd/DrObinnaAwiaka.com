import { useData } from 'vike-react/useData'
import type { ServicesData } from './+data'
import ServicesPage from '@/pages/ServicesPage'

export default function Page() {
  const { servicesPage, services } = useData<ServicesData>()
  return <ServicesPage servicesPage={servicesPage} services={services} />
}
