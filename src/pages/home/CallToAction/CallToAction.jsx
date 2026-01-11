import React from "react";
import { Link } from "react-router";

const CallToAction = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main CTA Content */}
        <div className="text-white">
          <div className="text-5xl sm:text-6xl mb-6">🚀</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Asset Management?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            Join thousands of organizations already using AssetVerse to streamline their asset tracking, 
            improve transparency, and boost operational efficiency.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/register-hr"
              className="btn btn-accent btn-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Schedule Demo
            </Link>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white/90">
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-sm sm:text-base">Quick Setup</h3>
              <p className="text-xs sm:text-sm text-white/70">Get started in minutes</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-sm sm:text-base">Secure & Reliable</h3>
              <p className="text-xs sm:text-sm text-white/70">Enterprise-grade security</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-sm sm:text-base">Real-time Analytics</h3>
              <p className="text-xs sm:text-sm text-white/70">Data-driven insights</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-sm sm:text-base">24/7 Support</h3>
              <p className="text-xs sm:text-sm text-white/70">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-white/80 text-sm mb-4">Trusted by leading organizations worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm">GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm">30-Day Free Trial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;