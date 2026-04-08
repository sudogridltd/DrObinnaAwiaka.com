import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import DriveWithAssurance from "@/components/home/DriveWithAssurance";
import LuxuryShowcase from "@/components/home/LuxuryShowcase";
import RecentSources from "@/components/home/RecentSources";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <DriveWithAssurance />
      <LuxuryShowcase />
      <RecentSources />
      <Newsletter />
    </>
  );
}
