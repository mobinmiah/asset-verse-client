import React, { useState } from "react";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-secondary/10 to-primary/10">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6 sm:p-8 lg:p-12 text-center">
            {/* Icon */}
            <div className="text-5xl sm:text-6xl mb-6">📧</div>
            
            {/* Header */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-4">
              Stay Updated with <span className="text-primary">AssetVerse</span>
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Get the latest updates on new features, best practices for asset management, 
              and exclusive insights delivered straight to your inbox.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full focus:input-primary"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary hover:scale-105 transition-transform duration-200"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Subscribe
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-base-300">
              <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Weekly Updates
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No Spam
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unsubscribe Anytime
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-6 pt-6 border-t border-base-300">
              <p className="text-xs text-base-content/60">
                Join 2,500+ professionals already subscribed
              </p>
              <div className="flex justify-center items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-warning fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-xs text-base-content/60 ml-2">Trusted by our community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;