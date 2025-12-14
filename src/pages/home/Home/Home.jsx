import React from "react";
import { Helmet } from "react-helmet";
import Packages from "../Packages/Packages";
import About from "../About/About";
import Banner from "../Banner/Banner";
import HowItWorks from "../HowItWorks/HowItWorks";
import RoleBenefits from "../RoleBenefits/RoleBenefits";
import SecurityTrust from "../SecurityTrust/SecurityTrust";
import Stats from "../Stats/Stats";

const Home = () => {
  return (
    <div className="space-y-5">
      <Helmet>
        <title>Home | AssetVerse</title>
      </Helmet>
      <Banner></Banner>
      <About></About>
      <HowItWorks></HowItWorks>
      <Packages></Packages>
      <RoleBenefits></RoleBenefits>
      <SecurityTrust></SecurityTrust>
      <Stats></Stats>
    </div>
  );
};

export default Home;
