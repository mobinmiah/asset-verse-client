import React from "react";
import useAxios from "../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";

const Packages = () => {
  const axios = useAxios();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axios.get("/packages");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12  rounded-lg shadow-sm shadow-neutral bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Plans Built for Every Office
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral">
            Choose a plan that fits your team size and scale your asset
            management as your organization grows.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((plan) => (
            <div
              key={plan._id}
              className="card bg-base-100 shadow-xs shadow-neutral h-full transition-all duration-300 hover:shadow-md"
            >
              <div className="card-body flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        plan.employeeLimit <= 5
                          ? "text-error"
                          : plan.employeeLimit <= 10
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      Employee Limit: {plan.employeeLimit}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    ${plan.price}
                  </span>
                </div>

                {/* Features */}
                <ul className="mt-6 flex-1 flex flex-col gap-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 me-2 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-6">
                  <button className="btn btn-primary btn-block">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
