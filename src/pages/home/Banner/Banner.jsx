import { Link } from "react-router";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import hero from "../../../assets/hero.png";
import useAuth from "../../../hooks/useAuth";

const Banner = () => {
  const { user } = useAuth();

  // Static stats data
  const stats = {
    organizations: 100,
    assets: 5000,
    rating: 4.9,
    accuracy: 99,
  };

  return (
    <div className="relative overflow-hidden py-8 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-lg bg-linear-to-br from-primary/5 via-base-100 to-secondary/5">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Trusted by {stats.organizations}+ Organizations
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              <span className="text-base-content">Smart Asset</span>
              <br />
              <span className="text-primary">Management</span>
              <br />
              <span className="text-base-content">Made Simple</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-base-content/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Streamline your organization's asset tracking with AssetVerse.
              Empower HR teams, admins, and employees with a unified platform
              for complete transparency and efficiency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="btn btn-primary btn-sm sm:btn-md lg:btn-lg gap-2 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                Get Started Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="btn btn-outline btn-sm sm:btn-md lg:btn-lg hover:scale-105 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 relative">
            {/* Floating Card Effect */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>

              {/* Main Image */}
              <div className="relative bg-base-100 rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-2xl border border-base-300">
                <img
                  src={hero}
                  alt="AssetVerse dashboard preview"
                  className="w-full rounded-lg lg:rounded-xl transition-all duration-500 hover:scale-105"
                />
              </div>

              {/* Floating Stats Cards */}
              <div className="hidden lg:block absolute -left-4 xl:-left-6 top-1/4 bg-base-100 rounded-lg xl:rounded-xl shadow-xl p-3 xl:p-4 border border-base-300 animate-float">
                <div className="flex items-center gap-2 xl:gap-3">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl xl:text-2xl">📦</span>
                  </div>
                  <div>
                    <p className="text-xl xl:text-2xl font-bold text-primary">
                      {stats.assets.toLocaleString()}+
                    </p>
                    <p className="text-[10px] xl:text-xs text-base-content/60">
                      Assets Managed
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute -right-4 xl:-right-6 bottom-1/4 bg-base-100 rounded-lg xl:rounded-xl shadow-xl p-3 xl:p-4 border border-base-300 animate-float-delayed">
                <div className="flex items-center gap-2 xl:gap-3">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <span className="text-xl xl:text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="text-xl xl:text-2xl font-bold text-success">
                      {stats.accuracy}%
                    </p>
                    <p className="text-[10px] xl:text-xs text-base-content/60">
                      Accuracy Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
};

export default Banner;
