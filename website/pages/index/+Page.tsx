import { useData } from 'vike-react/useData'
import type { HomeData } from './+data'
import Hero from '@/components/home/Hero'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import DriveWithAssurance from '@/components/home/DriveWithAssurance'
import LuxuryShowcase from '@/components/home/LuxuryShowcase'
import RecentSources from '@/components/home/RecentSources'
import BlogSection from '@/components/home/BlogSection'
import Newsletter from '@/components/home/Newsletter'

export default function Page() {
  const { homepage, featuredServices, testimonials, recentPosts } = useData<HomeData>()
  return (
    <>
      <Hero homepage={homepage} />
      <WhyChooseUs homepage={homepage} />
      <DriveWithAssurance homepage={homepage} />
      <LuxuryShowcase homepage={homepage} services={featuredServices} />
      <RecentSources testimonials={testimonials} />
      <BlogSection 
        posts={recentPosts} 
        title="Latest Articles & Insights"
        subtitle="Practical wisdom, coaching tips, and transformative stories to help you grow."
      />
      <Newsletter />
    </>
  )
}
