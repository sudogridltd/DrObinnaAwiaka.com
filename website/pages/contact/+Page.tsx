import { useData } from 'vike-react/useData'
import type { ContactData } from './+data'
import ContactPage from '@/pages/ContactPage'

export default function Page() {
  const { contactPage, global } = useData<ContactData>()
  return <ContactPage contactPage={contactPage} global={global} />
}
