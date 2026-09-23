import ExploreCategories from "@/components/homePage/ExploreCategories";
import HeroSection from "@/components/homePage/HeroSection";
import HowItWorks from "@/components/homePage/HowItWorks";
import PlatformImpact from "@/components/homePage/PlatformImpact";
import TestimonialSection from "@/components/homePage/TestimonialSection";
import TopFundedCampaigns from "@/components/homePage/TopFundedCampaigns";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TopFundedCampaigns/>
      <HowItWorks />
      <ExploreCategories />
      <PlatformImpact />
      <TestimonialSection />
    </div>
  );
}
