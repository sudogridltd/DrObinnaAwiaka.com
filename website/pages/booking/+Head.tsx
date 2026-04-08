import { useData } from 'vike-react/useData'
import type { BookingData } from './+data'

export default function Head() {
  const { bookingPage } = useData<BookingData>()
  const title = bookingPage?.seo?.metaTitle ?? 'Book a Coaching Session | Dr Obinna Awiaka'
  const description = bookingPage?.seo?.metaDescription ?? 'Schedule your coaching session with Dr Obinna Awiaka. Choose from life coaching, executive coaching, couples coaching, and more. First discovery call is free.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://drobinnaawiaka.com/booking" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
