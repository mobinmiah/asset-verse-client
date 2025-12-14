import React from "react";
import { FaBuilding, FaBoxOpen, FaUserCheck } from "react-icons/fa";

const stats = [
  {
    icon: <FaBuilding className="text-4xl text-primary mb-3" />,
    value: "100+",
    label: "Organizations Using AssetVerse",
  },
  {
    icon: <FaBoxOpen className="text-4xl text-primary mb-3" />,
    value: "5,000+",
    label: "Assets Successfully Managed",
  },
  {
    icon: <FaUserCheck className="text-4xl text-primary mb-3" />,
    value: "99%",
    label: "Accurate Asset Tracking",
  },
];

const Stats = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-lg shadow-sm shadow-neutral bg-base-100">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
          Trusted by Growing Organizations
        </h2>
        <p className="text-neutral text-sm sm:text-base max-w-2xl mx-auto mb-12">
          AssetVerse helps organizations manage assets efficiently with
          accuracy, transparency, and confidence.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-base-200 rounded-xl shadow-xs shadow-neutral transition-all hover:shadow-md"
            >
              {stat.icon}
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-neutral/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
