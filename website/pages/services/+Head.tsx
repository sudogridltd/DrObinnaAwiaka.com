import { useData } from 'vike-react/useData'
import type { ServicesData } from './+data'

export default function Head() {
  const { servicesPage } = useData<ServicesData>()
  const title = servicesPage?.seo?.metaTitle ?? 'Coaching Services | Dr Obinna Awiaka'
  const description = servicesPage?.seo?.metaDescription ?? 'Explore Dr Obinna Awiaka\'s coaching services: 1-on-1 life coaching, executive coaching, group programs, speaking engagements, and online courses.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://drobinnaawiaka.com/services" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
