import { useEffect, useState, useRef } from "react";
import { FaBuilding, FaBoxOpen, FaUserCheck } from "react-icons/fa";

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      icon: <FaBuilding className="text-5xl text-primary mb-3" />,
      value: 100,
      suffix: "+",
      label: "Organizations Using AssetVerse",
    },
    {
      icon: <FaBoxOpen className="text-5xl text-secondary mb-3" />,
      value: 5000,
      suffix: "+",
      label: "Assets Successfully Managed",
    },
    {
      icon: <FaUserCheck className="text-5xl text-accent mb-3" />,
      value: 99,
      suffix: "%",
      label: "Accurate Asset Tracking",
    },
  ];

  // Intersection Observer to trigger animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // CountUp component
  const CountUp = ({ target, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [target, isVisible]);

    return (
      <span className="font-bold text-primary">
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-lg shadow-sm shadow-neutral bg-base-100"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
          Trusted by Growing Organizations
        </h2>
        <p className="text-neutral text-sm sm:text-base max-w-2xl mx-auto mb-12">
          AssetVerse helps organizations manage assets efficiently with
          accuracy, transparency, and confidence.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-base-200 rounded-xl shadow-xs shadow-base-300 transition-all hover:shadow-md"
            >
              {stat.icon}
              <h3 className="text-3xl mb-1">
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                />
              </h3>
              <p className="text-sm text-neutral/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
