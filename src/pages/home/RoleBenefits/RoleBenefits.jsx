import React from "react";
import { FaLock, FaUserShield, FaDatabase } from "react-icons/fa";

const securityItems = [
  {
    icon: <FaUserShield className="text-4xl text-primary mb-3" />,
    title: "Role-Based Access Control",
    description:
      "Each user role has specific permissions, ensuring sensitive asset data is accessed only by authorized users.",
  },
  {
    icon: <FaLock className="text-4xl text-primary mb-3" />,
    title: "Secure Authentication",
    description:
      "AssetVerse uses a secure authentication system to protect accounts and organizational information.",
  },
  {
    icon: <FaDatabase className="text-4xl text-primary mb-3" />,
    title: "Reliable Data Protection",
    description:
      "All asset records are safely stored, maintaining data accuracy, consistency, and reliability.",
  },
];

const SecurityTrust = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-lg shadow-sm shadow-neutral bg-base-100">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
          Security & Trust
        </h2>
        <p className="text-neutral text-sm sm:text-base max-w-2xl mx-auto mb-12">
          Built with strong security measures to keep your assets and
          organizational data protected at all times.
        </p>

        {/* Security Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-base-200 rounded-xl shadow-xs shadow-neutral transition-all hover:shadow-md"
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
