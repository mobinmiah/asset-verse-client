import React from "react";
import lotoImg from "../../assets/logo.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="flex justify-center items-center">
      <img 
        className="w-16 sm:w-20 md:w-24 lg:w-32 xl:w-40 h-auto object-contain" 
        src={lotoImg} 
        alt="AssetVerse Logo" 
      />
    </Link>
  );
};

export default Logo;
