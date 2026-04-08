import { useData } from 'vike-react/useData'
import type { AboutData } from './+data'
import AboutPage from '@/pages/AboutPage'

export default function Page() {
  const { aboutPage } = useData<AboutData>()
  return <AboutPage aboutPage={aboutPage} />
}
