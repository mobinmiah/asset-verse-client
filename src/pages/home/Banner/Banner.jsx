import React from "react";
import hero from "../../../assets/hero.png";

const Banner = () => {
  return (
    <section className="hero px-4 sm:px-8 lg:px-12 py-14 lg:py-20 rounded-lg shadow-sm shadow-neutral bg-base-100">
      <div className="hero-content flex flex-col-reverse lg:flex-row-reverse gap-12 w-full">
        {/* Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={hero}
            alt="AssetVerse dashboard preview"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-sm bg-primary p-3"
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className={`text-start! text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-tight`}>
            Smart Asset Management for Modern Organizations
          </h1>

          <p className="py-4 sm:py-6 text-neutral max-w-xl mx-auto lg:mx-0">
            AssetVerse helps companies track, assign, and manage organizational
            assets with complete transparency. Designed for HR teams, admins,
            and employees to work efficiently from one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="btn btn-primary w-full sm:w-auto">
              Get Started
            </button>
            <button className="btn btn-outline btn-primary w-full sm:w-auto">
              View Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
