import { useEffect } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import '@/index.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()

  // Scroll to top on route change, or scroll to hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pageContext.urlPathname])

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-[73px]">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
