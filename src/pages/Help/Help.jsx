import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account Management', icon: '👤' },
    { id: 'assets', name: 'Asset Management', icon: '📦' },
    { id: 'requests', name: 'Asset Requests', icon: '📋' },
    { id: 'billing', name: 'Billing & Plans', icon: '💳' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' }
  ];

  const helpContent = {
    'getting-started': [
      {
        question: 'How do I create an AssetVerse account?',
        answer: 'You can create an account by clicking "Register" and choosing either HR Manager or Employee. Fill in your details and verify your email to get started.'
      },
      {
        question: 'What\'s the difference between HR and Employee accounts?',
        answer: 'HR accounts can create and manage assets, approve requests, and manage team members. Employee accounts can request assets and view their assigned items.'
      },
      {
        question: 'How do I set up my organization?',
        answer: 'After creating an HR account, complete your company profile, add your company logo, and start adding assets to your inventory.'
      }
    ],
    'account': [
      {
        question: 'How do I update my profile information?',
        answer: 'Go to Dashboard > My Profile to update your personal information, profile picture, and account settings.'
      },
      {
        question: 'How do I change my password?',
        answer: 'Visit your profile settings and click "Change Password". You\'ll need to enter your current password and choose a new one.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can request account deletion by contacting our support team. Note that this action is irreversible.'
      }
    ],
    'assets': [
      {
        question: 'How do I add new assets?',
        answer: 'HR users can add assets by going to Dashboard > Add Asset. Fill in the asset details including name, type, quantity, and upload an image.'
      },
      {
        question: 'What\'s the difference between Returnable and Non-returnable assets?',
        answer: 'Returnable assets must be returned after use (like laptops, equipment). Non-returnable assets are consumed or permanently assigned (like office supplies).'
      },
      {
        question: 'How do I edit or delete assets?',
        answer: 'Go to Dashboard > Asset List, find your asset, and use the Edit or Delete buttons. Only HR users can modify assets.'
      }
    ],
    'requests': [
      {
        question: 'How do I request an asset?',
        answer: 'Employees can request assets by going to Dashboard > Request Asset, browsing available items, and clicking "Request" on desired assets.'
      },
      {
        question: 'How long does it take for requests to be approved?',
        answer: 'Request approval times depend on your HR team. You\'ll receive notifications when your request status changes.'
      },
      {
        question: 'Can I cancel a pending request?',
        answer: 'Yes, you can cancel pending requests from your dashboard. Once approved, contact your HR team for changes.'
      }
    ],
    'billing': [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, and PayPal through our secure Stripe payment system.'
      },
      {
        question: 'How do I upgrade my plan?',
        answer: 'HR users can upgrade their plan by going to Dashboard > Upgrade Package and selecting a new plan that fits their needs.'
      },
      {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.'
      }
    ],
    'troubleshooting': [
      {
        question: 'I can\'t log into my account',
        answer: 'Try resetting your password using the "Forgot Password" link. If that doesn\'t work, contact our support team.'
      },
      {
        question: 'Why can\'t I see certain features?',
        answer: 'Feature access depends on your account type (HR vs Employee) and subscription plan. Check your account settings or upgrade your plan.'
      },
      {
        question: 'The website is loading slowly',
        answer: 'Try clearing your browser cache, disabling browser extensions, or switching to a different browser. Contact support if issues persist.'
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Help & Support - AssetVerse | Get Help</title>
        <meta name="description" content="Find answers to common questions about AssetVerse. Get help with account setup, asset management, billing, and troubleshooting." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Help & Support
          </h1>
          <p className="text-lg sm:text-xl text-base-content/80 leading-relaxed mb-8">
            Find answers to common questions and get the help you need to make the most of AssetVerse.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="input input-bordered w-full pl-12 pr-4 py-3 text-lg focus:input-primary"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Help Content */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="card bg-base-200 shadow-sm border border-base-300 sticky top-4">
                <div className="card-body p-4">
                  <h3 className="font-bold text-primary mb-4">Help Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                            activeCategory === category.id
                              ? 'bg-primary text-white'
                              : 'hover:bg-base-300'
                          }`}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium">{category.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Help Articles */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">
                    {categories.find(cat => cat.id === activeCategory)?.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-primary">
                    {categories.find(cat => cat.id === activeCategory)?.name}
                  </h2>
                </div>

                {helpContent[activeCategory]?.map((item, index) => (
                  <div key={index} className="card bg-base-200 shadow-sm border border-base-300">
                    <div className="card-body p-6">
                      <h3 className="text-lg font-semibold text-primary mb-3">
                        {item.question}
                      </h3>
                      <p className="text-base-content/80 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Still Need Help?
          </h2>
          <p className="text-base-content/80 text-lg mb-8">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body text-center p-6">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold text-primary mb-2">Live Chat</h3>
                <p className="text-sm text-base-content/70 mb-4">Get instant help</p>
                <button className="btn btn-primary btn-sm">Start Chat</button>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body text-center p-6">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-bold text-primary mb-2">Email Support</h3>
                <p className="text-sm text-base-content/70 mb-4">Response within 24h</p>
                <button className="btn btn-outline btn-primary btn-sm">Send Email</button>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body text-center p-6">
                <div className="text-3xl mb-3">📞</div>
                <h3 className="font-bold text-primary mb-2">Phone Support</h3>
                <p className="text-sm text-base-content/70 mb-4">Mon-Fri 8am-6pm EST</p>
                <button className="btn btn-outline btn-primary btn-sm">Call Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Additional Resources
            </h2>
            <p className="text-base-content/80 text-lg">
              Explore more ways to get the most out of AssetVerse
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-all duration-300">
              <div className="card-body text-center p-6">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-bold text-primary mb-2">User Guide</h3>
                <p className="text-sm text-base-content/70 mb-4">Comprehensive documentation</p>
                <button className="btn btn-outline btn-primary btn-sm">View Guide</button>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-all duration-300">
              <div className="card-body text-center p-6">
                <div className="text-4xl mb-4">🎥</div>
                <h3 className="font-bold text-primary mb-2">Video Tutorials</h3>
                <p className="text-sm text-base-content/70 mb-4">Step-by-step walkthroughs</p>
                <button className="btn btn-outline btn-primary btn-sm">Watch Videos</button>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-all duration-300">
              <div className="card-body text-center p-6">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-bold text-primary mb-2">API Documentation</h3>
                <p className="text-sm text-base-content/70 mb-4">For developers</p>
                <button className="btn btn-outline btn-primary btn-sm">View API</button>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-all duration-300">
              <div className="card-body text-center p-6">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-bold text-primary mb-2">Best Practices</h3>
                <p className="text-sm text-base-content/70 mb-4">Tips for success</p>
                <button className="btn btn-outline btn-primary btn-sm">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Privacy */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-base-200 border-t border-base-300">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-base-content/70">
            <button className="link link-hover">Terms of Service</button>
            <button className="link link-hover">Privacy Policy</button>
            <button className="link link-hover">Cookie Policy</button>
            <button className="link link-hover">Security</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;