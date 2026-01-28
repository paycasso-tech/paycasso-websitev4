import HeroSection from "@/components/app/home/hero/hero-section";
import AboutSection from "@/components/app/home/about/AboutSection";
import WhyChooseUs from "@/components/app/home/WhyChooseUs/WhyChooseUs";
import OurServices from "@/components/app/home/OurServices/OurServices";
import VisionSection from "@/components/app/home/OurVision/OurVision";
import CallToAction from "@/components/app/home/CallToAction/CallToAction";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen relative">
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
