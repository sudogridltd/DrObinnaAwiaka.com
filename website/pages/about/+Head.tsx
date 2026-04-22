import { useData } from 'vike-react/useData'
import type { AboutData } from './+data'

export default function Head() {
  const { aboutPage } = useData<AboutData>()
  const title = aboutPage?.seo?.metaTitle ?? 'About Dr Obinna Awiaka | Doctor of Optometry & Life Coach'
  const description = aboutPage?.seo?.metaDescription ?? 'Learn about Dr Obinna Edwin Awiaka — multiple award-winning Doctor of Optometry, ICF-certified life coach, and international speaker with 20+ years of experience.'
  const ogImage = aboutPage?.seo?.openGraphImage?.url ?? aboutPage?.profilePhoto?.url ?? '/og-image.jpg'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://drobinnaawiaka.com/about" />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
