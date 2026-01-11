import React, { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "How does AssetVerse help with asset tracking?",
    answer: "AssetVerse provides a centralized platform where you can track all your company assets in real-time. From assignment to return, every asset movement is logged with timestamps, user details, and status updates, giving you complete visibility into your asset lifecycle."
  },
  {
    id: 2,
    question: "Is AssetVerse suitable for small businesses?",
    answer: "Absolutely! AssetVerse is designed to scale with your business. Whether you're a startup with 10 employees or an enterprise with thousands, our flexible pricing plans and feature sets accommodate organizations of all sizes."
  },
  {
    id: 3,
    question: "What types of assets can I manage with AssetVerse?",
    answer: "You can manage both returnable and non-returnable assets including laptops, mobile devices, office equipment, software licenses, vehicles, furniture, and any other company property. The system is flexible enough to handle any asset type."
  },
  {
    id: 4,
    question: "How secure is my data on AssetVerse?",
    answer: "Security is our top priority. AssetVerse uses enterprise-grade encryption, role-based access controls, and regular security audits. Your data is stored on secure cloud servers with automatic backups and 99.9% uptime guarantee."
  },
  {
    id: 5,
    question: "Can employees request assets through the platform?",
    answer: "Yes! Employees can easily request assets through their dashboard. HR managers receive notifications for new requests and can approve or reject them with just a few clicks. The entire process is transparent and trackable."
  },
  {
    id: 6,
    question: "Do you offer customer support?",
    answer: "We provide comprehensive customer support including email support, live chat, detailed documentation, and video tutorials. Our premium plans also include priority support and dedicated account managers."
  },
  {
    id: 7,
    question: "How quickly can I get started with AssetVerse?",
    answer: "You can get started immediately! Sign up takes less than 2 minutes, and you can begin adding assets and team members right away. Our intuitive interface means no lengthy training is required."
  },
  {
    id: 8,
    question: "Can I export my data from AssetVerse?",
    answer: "Yes, you can export your asset data, reports, and analytics in various formats including CSV, Excel, and PDF. This ensures you always have access to your data and can integrate with other systems if needed."
  }
];

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 bg-base-100">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            ❓ Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-4">
            Got <span className="text-primary">Questions?</span>
          </h2>
          <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto">
            Find answers to common questions about AssetVerse and how it can help your organization
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="card bg-base-200 border border-base-300 hover:border-primary/30 transition-all duration-200"
            >
              <div className="card-body p-0">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-4 sm:p-6 flex items-center justify-between hover:bg-base-300/50 transition-colors duration-200"
                >
                  <h3 className="font-semibold text-base-content text-sm sm:text-base pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-5 h-5 text-primary transition-transform duration-200 ${
                        openFAQ === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="border-t border-base-300 pt-4">
                      <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
          <h3 className="text-lg font-semibold text-base-content mb-2">
            Still have questions?
          </h3>
          <p className="text-base-content/70 text-sm mb-4">
            Our support team is here to help you get the most out of AssetVerse
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200">
              Contact Support
            </button>
            <button className="btn btn-outline btn-primary btn-sm hover:scale-105 transition-transform duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;