import { useData } from 'vike-react/useData'
import type { HomeData } from './+data'

export default function Head() {
  const { homepage } = useData<HomeData>()
  const title = homepage?.seo?.metaTitle ?? 'Dr Obinna Awiaka | Life Coach, Speaker & Author'
  const description = homepage?.seo?.metaDescription ?? 'Transform your life with expert coaching, courses, and resources. Unlock your full potential with Dr Obinna Awiaka\'s proven frameworks.'
  const ogImage = homepage?.seo?.openGraphImage?.url ?? '/og-image.jpg'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://drobinnaawiaka.com/" />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
