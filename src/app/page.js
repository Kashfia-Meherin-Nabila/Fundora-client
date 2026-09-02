import ExploreCategories from "@/components/homePage/ExploreCategories";
import HeroSection from "@/components/homePage/HeroSection";
import HowItWorks from "@/components/homePage/HowItWorks";
import PlatformImpact from "@/components/homePage/PlatformImpact";
import TestimonialSection from "@/components/homePage/TestimonialSection";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <HeroSection/>
    <HowItWorks />

      <ExploreCategories />

      <PlatformImpact />

      <TestimonialSection />
    </div>
  );
}
