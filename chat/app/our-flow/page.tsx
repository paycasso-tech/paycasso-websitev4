import BackgroundVideo from "@/components/our-flow/Landing/BackgroundVideo";
import CryptoBackground from "@/components/our-flow/Landing/CryptoBackground";
import HeroText from "@/components/our-flow/Landing/HeroText";
import LightOverlay from "@/components/our-flow/Landing/LightOverlay";
import Navbar from "@/components/layouts/navbar";
import LandingPage from "@/components/our-flow/Landing/LandingPage";
import CardPage from "@/components/our-flow/Card/CardPage";
import StarPage from "@/components/our-flow/Star/StarPage";
import FeedbackPage from "@/components/our-flow/FeedBack/FeedBackPage";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <CardPage />
      <StarPage />
      <FeedbackPage />
    </>
  );
}
