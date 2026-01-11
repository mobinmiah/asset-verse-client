import React from 'react';
import { Helmet } from 'react-helmet';

const About = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Our Mission',
      description: 'To revolutionize asset management by providing organizations with transparent, efficient, and user-friendly tools that streamline operations and boost productivity.'
    },
    {
      icon: '👁️',
      title: 'Our Vision',
      description: 'To become the leading global platform for organizational asset management, empowering businesses of all sizes to optimize their resources and achieve operational excellence.'
    },
    {
      icon: '💎',
      title: 'Our Values',
      description: 'Transparency, Innovation, Reliability, and Customer Success drive everything we do. We believe in building lasting relationships through exceptional service.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Former operations director with 15+ years in asset management and organizational efficiency.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Tech visionary with expertise in scalable systems and enterprise software development.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Product strategist focused on user experience and innovative asset management solutions.'
    }
  ];

  const stats = [
    { number: '100+', label: 'Organizations Trust Us' },
    { number: '5,000+', label: 'Assets Managed Daily' },
    { number: '99.9%', label: 'Platform Uptime' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>About Us - AssetVerse | Learn About Our Mission</title>
        <meta name="description" content="Learn about AssetVerse's mission to revolutionize asset management for organizations worldwide. Meet our team and discover our values." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            About AssetVerse
          </h1>
          <p className="text-lg sm:text-xl text-base-content/80 leading-relaxed">
            We're on a mission to transform how organizations manage their assets. 
            Founded in 2023, AssetVerse has quickly become the trusted platform for 
            companies seeking transparency, efficiency, and control over their resources.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-all duration-300">
                <div className="card-body text-center p-6">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-primary mb-4">{feature.title}</h3>
                  <p className="text-base-content/80 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AssetVerse by the Numbers
            </h2>
            <p className="text-white/90 text-lg">
              Our impact speaks for itself
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Meet Our Team
            </h2>
            <p className="text-base-content/80 text-lg max-w-2xl mx-auto">
              The passionate individuals behind AssetVerse, dedicated to revolutionizing 
              asset management for organizations worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-all duration-300">
                <div className="card-body text-center p-6">
                  <div className="avatar mb-4">
                    <div className="w-24 h-24 rounded-full ring-4 ring-primary/20">
                      <img
                        src={member.image}
                        alt={member.name}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=2563EB&color=fff&size=96`;
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-secondary font-medium mb-3">{member.role}</p>
                  <p className="text-base-content/80 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-base-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
              Our Story
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-base-content/80">
            <p className="text-lg leading-relaxed mb-6">
              AssetVerse was born from a simple observation: organizations were struggling 
              with outdated, inefficient methods of tracking and managing their assets. 
              Spreadsheets, paper forms, and disconnected systems were creating chaos 
              instead of clarity.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our founders, having experienced these challenges firsthand in their corporate 
              careers, envisioned a better way. They imagined a platform that would bring 
              transparency, efficiency, and control to asset management while being 
              accessible to organizations of all sizes.
            </p>
            <p className="text-lg leading-relaxed">
              Today, AssetVerse serves hundreds of organizations worldwide, from startups 
              to enterprises, helping them optimize their resources and focus on what 
              matters most: growing their business and serving their customers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Ready to Transform Your Asset Management?
          </h2>
          <p className="text-lg text-base-content/80 mb-8">
            Join the hundreds of organizations already using AssetVerse to streamline 
            their operations and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary btn-lg hover:scale-105 transition-transform duration-200">
              Start Free Trial
            </button>
            <button className="btn btn-outline btn-primary btn-lg hover:scale-105 transition-transform duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;