import React from "react";
import hero from "../../../assets/hero.png";

const Banner = () => {
  return (
    <div className="hero px-2 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 lg:py-16 xl:py-20 rounded-lg shadow-sm bg-base-100">
      <div className="hero-content flex flex-col-reverse lg:flex-row-reverse gap-6 sm:gap-8 lg:gap-12 w-full max-w-7xl">
        <div className="flex-1 flex justify-center">
          <img
            src={hero}
            alt="AssetVerse dashboard preview"
            className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg shadow-lg bg-primary p-2 sm:p-3 hover:shadow-xl transition-all duration-300 hover:scale-105"
          />
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary leading-tight mb-4 sm:mb-6">
            Smart Asset Management for Modern Organizations
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-neutral max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
            AssetVerse helps companies track, assign, and manage organizational
            assets with complete transparency. Designed for HR teams, admins,
            and employees to work efficiently from one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <button className="btn btn-primary w-full sm:w-auto hover:scale-105 transition-transform duration-200 text-sm sm:text-base">
              Get Started
            </button>
            <button className="btn btn-outline btn-primary w-full sm:w-auto hover:scale-105 transition-transform duration-200 text-sm sm:text-base">
              View Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
