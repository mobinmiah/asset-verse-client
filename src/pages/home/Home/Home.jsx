import React from "react";
import { Helmet } from "react-helmet";
import Packages from "../Packages/Packages";
import About from "../About/About";
import Banner from "../Banner/Banner";
import HowItWorks from "../HowItWorks/HowItWorks";
import SecurityTrust from "../SecurityTrust/SecurityTrust";
import Stats from "../Stats/Stats";
import RoleBasedBenefits from "../RoleBasedBenefits/RoleBasedBenefits";
import Testimonials from "../Testimonials/Testimonials";
import FAQ from "../FAQ/FAQ";
import Newsletter from "../Newsletter/Newsletter";
import CallToAction from "../CallToAction/CallToAction";

const Home = () => {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
      <Helmet>
        <title>AssetVerse - Smart Asset Management for Modern Organizations</title>
        <meta name="description" content="Transform your asset management with AssetVerse. Track, assign, and manage organizational assets with complete transparency. Trusted by 100+ organizations worldwide." />
        <meta name="keywords" content="asset management, inventory tracking, HR tools, organizational assets, asset tracking software" />
        <meta property="og:title" content="AssetVerse - Smart Asset Management Platform" />
        <meta property="og:description" content="Streamline your asset management with AssetVerse. Complete transparency, real-time tracking, and powerful analytics." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://assetverse.com" />
      </Helmet>
      
      {/* Hero Section */}
      <Banner />
      
      {/* About/Features Section */}
      <About />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Role-Based Benefits */}
      <RoleBasedBenefits />
      
      {/* Security & Trust */}
      <SecurityTrust />
      
      {/* Statistics */}
      <Stats />
      
      {/* Pricing Packages */}
      <Packages />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* FAQ Section */}
      <FAQ />
      
      {/* Newsletter Signup */}
      <Newsletter />
      
      {/* Final Call to Action */}
      <CallToAction />
    </div>
  );
};

export default Home;
