import { FaBoxes, FaUsersCog, FaShieldAlt, FaChartLine } from "react-icons/fa";

const About = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16  rounded-lg shadow-sm shadow-neutral bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content">
            Why Choose <span className="text-primary">AssetVerse</span>
          </h2>
          <p className="mt-4 text-base-content/70 text-sm sm:text-base">
            AssetVerse is a modern asset management platform built to help
            organizations track, assign, and optimize company resources with
            clarity, security, and operational efficiency.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="card bg-base-200 shadow-xs shadow-neutral h-full transition-all duration-300 hover:shadow-md">
            <div className="card-body items-center text-center">
              <FaBoxes className="text-4xl text-primary mb-4" />
              <h3 className="text-lg font-semibold">
                Centralized Asset Tracking
              </h3>
              <p className="text-sm text-base-content/70">
                Maintain a single source of truth for all company assets, from
                assignment to lifecycle status.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card bg-base-200 shadow-xs shadow-neutral h-full transition-all duration-300 hover:shadow-md">
            <div className="card-body items-center text-center">
              <FaUsersCog className="text-4xl text-primary mb-4" />
              <h3 className="text-lg font-semibold">
                Employee Asset Assignment
              </h3>
              <p className="text-sm text-base-content/70">
                Easily assign, reassign, and monitor assets allocated to
                employees across departments.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card bg-base-200 shadow-xs shadow-neutral h-full transition-all duration-300 hover:shadow-md">
            <div className="card-body items-center text-center">
              <FaShieldAlt className="text-4xl text-primary mb-4" />
              <h3 className="text-lg font-semibold">
                Secure & Role-Based Access
              </h3>
              <p className="text-sm text-base-content/70">
                Ensure data security with role-based permissions for HR, Admins,
                and Employees.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="card bg-base-200 shadow-xs shadow-neutral h-full transition-all duration-300 hover:shadow-md">
            <div className="card-body items-center text-center">
              <FaChartLine className="text-4xl text-primary mb-4" />
              <h3 className="text-lg font-semibold">Data-Driven Insights</h3>
              <p className="text-sm text-base-content/70">
                Gain actionable insights through reports and analytics to
                optimize asset utilization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
