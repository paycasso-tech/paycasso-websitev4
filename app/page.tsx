import HeroSection from "@/components/home/hero/hero-section";
import AboutSection from "@/components/home/about/BalanceSection";
import VisionSection from "@/components/home/features/vision-section";
import Footer from "@/components/layouts/footer";
import CallToAction from "@/components/home/features/call-to-action";
import WhyChooseUs from "@/components/home/services/why-choose-us";
import OurServices from "@/components/home/services/our-services";
import Navbar from "@/components/layouts/navbar";
import HeroBackgroundVideo from "@/components/home/hero/hero-background-video";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen relative">
        <HeroBackgroundVideo />
        <div className="relative z-10 overflow-hidden">
          <HeroSection />
          <AboutSection />
          <WhyChooseUs />
          <OurServices />
          <VisionSection />
          <CallToAction />
        </div>
      </main>
      <Footer />
    </>
  );
}
