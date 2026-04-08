import { useData } from 'vike-react/useData'
import type { BookingData } from './+data'
import BookingPage from '@/pages/BookingPage'

export default function Page() {
  const { bookingPage } = useData<BookingData>()
  return <BookingPage bookingPage={bookingPage} />
}
