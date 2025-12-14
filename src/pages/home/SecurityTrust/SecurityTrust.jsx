import React from "react";
import { FaLock, FaUserShield, FaDatabase } from "react-icons/fa";

const securityItems = [
  {
    icon: <FaUserShield className="text-4xl text-primary mb-3" />,
    title: "Role-Based Access Control",
    description:
      "Ensure that HR, Admins, and Employees only access what they are authorized to view or manage.",
  },
  {
    icon: <FaLock className="text-4xl text-primary mb-3" />,
    title: "Secure Authentication",
    description:
      "Protected login system with secure authentication to keep organizational data safe.",
  },
  {
    icon: <FaDatabase className="text-4xl text-primary mb-3" />,
    title: "Data Integrity & Protection",
    description:
      "All asset records are securely stored and maintained with accuracy and consistency.",
  },
];

const SecurityTrust = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-lg shadow-sm shadow-neutral bg-base-100">
      <div className="max-w-7xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
          Security & Trust
        </h2>
        <p className="text-neutral text-sm sm:text-base max-w-2xl mx-auto mb-12">
          AssetVerse is built with enterprise-grade security practices to
          protect your organization’s assets and data.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityItems.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-base-100 rounded-xl shadow-xs shadow-neutral transition-all hover:shadow-md text-center"
            >
              {item.icon}
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-neutral/80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;