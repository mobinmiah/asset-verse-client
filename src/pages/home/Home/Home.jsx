import React from "react";
import { Helmet } from "react-helmet";
import Packages from "../Packages/Packages";
import About from "../About/About";
import Banner from "../Banner/Banner";
import HowItWorks from "../HowItWorks/HowItWorks";
import SecurityTrust from "../SecurityTrust/SecurityTrust";
import Stats from "../Stats/Stats";
import RoleBasedBenefits from "../RoleBasedBenefits/RoleBasedBenefits";

const Home = () => {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
      <Helmet>
        <title>Home | AssetVerse</title>
      </Helmet>
      <Banner />
      <About />
      <HowItWorks />
      <SecurityTrust />
      <Packages />
      <RoleBasedBenefits />
      <Stats />
    </div>
  );
};

export default Home;
