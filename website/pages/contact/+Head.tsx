import { useData } from 'vike-react/useData'
import type { ContactData } from './+data'

export default function Head() {
  const { contactPage } = useData<ContactData>()
  const title = contactPage?.seo?.metaTitle ?? 'Contact Dr Obinna Awiaka | Get in Touch'
  const description = contactPage?.seo?.metaDescription ?? 'Contact Dr Obinna Awiaka for coaching inquiries, speaking engagements, partnerships, or general questions. Reach out and start your journey today.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://drobinnaawiaka.com/contact" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
