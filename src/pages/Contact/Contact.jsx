import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'support@assetverse.com',
      description: 'Send us an email and we\'ll respond within 24 hours'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm EST'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Business Ave, Suite 100\nNew York, NY 10001',
      description: 'Our headquarters in the heart of NYC'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Get instant help from our support team'
    }
  ];

  const handleContactSubmit = async (data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Contact Us - AssetVerse | Get in Touch</title>
        <meta name="description" content="Get in touch with AssetVerse. Contact our support team for help, sales inquiries, or general questions about our asset management platform." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-base-content/80 leading-relaxed">
            Have questions about AssetVerse? Need help getting started? 
            Our team is here to help you succeed.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-all duration-300">
                <div className="card-body text-center p-6">
                  <div className="text-4xl mb-4">{info.icon}</div>
                  <h3 className="text-lg font-bold text-primary mb-2">{info.title}</h3>
                  <p className="text-base-content font-medium mb-2 whitespace-pre-line">{info.details}</p>
                  <p className="text-sm text-base-content/70">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit(handleContactSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Full Name *</span>
                    </label>
                    <input
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      className={`input input-bordered w-full focus:input-primary ${errors.name ? 'input-error' : ''}`}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="text-error text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Email Address *</span>
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      type="email"
                      className={`input input-bordered w-full focus:input-primary ${errors.email ? 'input-error' : ''}`}
                      placeholder="Enter your email address"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-error text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Company</span>
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                      className="input input-bordered w-full focus:input-primary"
                      placeholder="Enter your company name (optional)"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Subject *</span>
                    </label>
                    <select
                      {...register('subject', { required: 'Please select a subject' })}
                      className={`select select-bordered w-full focus:select-primary ${errors.subject ? 'select-error' : ''}`}
                      disabled={isLoading}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="demo">Request Demo</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-error text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Message *</span>
                    </label>
                    <textarea
                      {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' }
                      })}
                      className={`textarea textarea-bordered w-full h-32 focus:textarea-primary ${errors.message ? 'textarea-error' : ''}`}
                      placeholder="Tell us how we can help you..."
                      disabled={isLoading}
                    ></textarea>
                    {errors.message && (
                      <p className="text-error text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full hover:scale-105 transition-transform duration-200"
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Office Info & Map */}
            <div className="space-y-6">
              {/* Office Hours */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Office Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-medium">8:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-medium">9:00 AM - 2:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Response Times</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Email: Within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Live Chat: Immediate</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Phone: Same day callback</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Our Location</h3>
                  <div className="bg-base-200 rounded-lg h-48 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗺️</div>
                      <p className="text-base-content/70">Interactive Map</p>
                      <p className="text-sm text-base-content/60">123 Business Ave, Suite 100</p>
                      <p className="text-sm text-base-content/60">New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-base-content/80 mb-8">
            Can't find what you're looking for? Check out our comprehensive FAQ section.
          </p>
          <button className="btn btn-outline btn-primary hover:scale-105 transition-transform duration-200">
            View FAQ
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;