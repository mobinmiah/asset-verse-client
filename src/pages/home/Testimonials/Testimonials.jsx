import React from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "HR Director",
    company: "TechCorp Solutions",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content: "AssetVerse has revolutionized how we manage our company assets. The transparency and ease of use have made our HR processes so much more efficient.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Operations Manager",
    company: "InnovateLab Inc",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "The real-time tracking and reporting features have given us complete visibility into our asset utilization. Highly recommend for any growing organization.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "IT Administrator",
    company: "Digital Dynamics",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "Setting up AssetVerse was incredibly smooth. The role-based access control ensures our data stays secure while keeping everything accessible to the right people.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-primary/5 to-secondary/5">
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
            See how AssetVerse is helping organizations streamline their asset management processes
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="card-body p-6">
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-warning fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-base-content/80 text-sm sm:text-base mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=14C2ED&color=fff&size=48`;
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-base-content/60">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-base-content/70 mb-4">
            Join hundreds of satisfied customers
          </p>
          <button className="btn btn-primary hover:scale-105 transition-transform duration-200">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;