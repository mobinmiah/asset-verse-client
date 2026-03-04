import React from "react";
import useAxios from "../../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";

const Testimonials = () => {
  const axios = useAxios();
  const {user}=useAuth()

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["revews"],
    queryFn: async () => {
      const res = await axios.get("/reviews");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-lg shadow-sm shadow-neutral bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            💬 What Our Users Say
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-4">
            Trusted by <span className="text-primary">Professionals</span>
          </h2>
          <p className="text-base-content/70 text-sm sm:text-base">
            See how AssetVerse is helping organizations streamline their asset
            management processes
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={reviews.length >= 3}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review) => (
            <SwiperSlide
              key={review._id}
              className="max-w-md bg-base-100 border border-base-300 rounded-2xl shadow-lg p-6"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-warning fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-base-content/80 mb-6 text-sm leading-relaxed">
                "{review.content}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${review.name}`;
                    }}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-sm">{review.name}</h4>
                  <p className="text-xs text-base-content/60">{review.role}</p>
                  <p className="text-xs text-primary font-medium">
                    {review.company}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to={user ? "/add-review" : "/login"}
            state={user ? undefined : "/add-review"}
            className="btn btn-primary hover:scale-105 transition-transform duration-200"
          >
            Leave Your Feedback
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
