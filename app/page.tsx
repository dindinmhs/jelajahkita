import { Navbar } from "@/components/navbar";
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper";
import {
  HeroSection,
  SearchSection,
  FeaturedUMKM,
  MapSection,
  CTASection,
  FAQSection,
  PartnershipSection,
  Footer,
} from "@/components/landing-page";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Navbar />
      {/* Hero Section - gradasi static, konten ter-animate */}
      <HeroSection />
      <ScrollAnimationWrapper>
        <div className="animate-on-scroll">
          <SearchSection />
        </div>
        <div className="animate-slide-left">
          <FeaturedUMKM />
        </div>
        <div className="animate-slide-right">
          <MapSection />
        </div>
        <div className="animate-zoom">
          <PartnershipSection />
        </div>
        <div className="animate-on-scroll">
          <FAQSection />
        </div>
        <div className="animate-slide-left">
          <CTASection />
        </div>
        <Footer />
      </ScrollAnimationWrapper>
    </main>
  );
}
