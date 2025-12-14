import React from "react";
import { FaPlusCircle, FaUserCheck, FaTasks, FaChartBar } from "react-icons/fa";

const steps = [
  {
    icon: <FaPlusCircle className="text-4xl text-primary mb-3" />,
    title: "Add Your Assets",
    description:
      "Easily register and categorize company assets for complete visibility and organization.",
  },
  {
    icon: <FaUserCheck className="text-4xl text-primary mb-3" />,
    title: "Assign to Employees",
    description:
      "Allocate assets to employees with clear tracking, approvals, and assignment history.",
  },
  {
    icon: <FaTasks className="text-4xl text-primary mb-3" />,
    title: "Track & Manage",
    description:
      "Monitor asset usage, status, and lifecycle in real time with complete transparency.",
  },
  {
    icon: <FaChartBar className="text-4xl text-primary mb-3" />,
    title: "Analyze & Optimize",
    description:
      "Generate reports and gain actionable insights to optimize asset utilization.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12  rounded-lg shadow-sm shadow-neutral bg-base-100">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
          How AssetVerse Works
        </h2>
        <p className="text-neutral text-sm sm:text-base max-w-2xl mx-auto mb-12">
          AssetVerse simplifies asset management for your organization in four
          easy steps.
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-base-200 rounded-xl shadow-xs shadow-neutral transition-all hover:shadow-md"
            >
              {step.icon}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-neutral/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
