import React from "react";
import lotoImg from "../../assets/logo.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="flex justify-center items-center group">
      <img 
        className="w-16 sm:w-20 md:w-24 lg:w-32 xl:w-40 h-auto object-contain transition-all duration-200 group-hover:scale-105" 
        src={lotoImg} 
        alt="AssetVerse Logo"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(20, 194, 237, 0.1))'
        }}
      />
    </Link>
  );
};

export default Logo;
