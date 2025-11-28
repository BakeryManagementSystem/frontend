import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Target,
  Award,
  Globe,
  Shield,
  Heart,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import './About.css';

const About = () => {
  const stats = [
    { icon: <Users size={32} />, value: "50K+", label: "Active Users" },
    { icon: <Globe size={32} />, value: "100+", label: "Countries" },
    { icon: <Award size={32} />, value: "4.8", label: "Rating" },
    { icon: <TrendingUp size={32} />, value: "99%", label: "Satisfaction" }
  ];

  const values = [
    {
      icon: <Shield size={24} />,
      title: "Trust & Security",
      description: "We prioritize the security of every transaction and protect both buyers and sellers with advanced encryption and fraud protection."
    },
    {
      icon: <Heart size={24} />,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do. We're committed to providing exceptional service and support."
    },
    {
      icon: <Globe size={24} />,
      title: "Global Reach",
      description: "Connecting people worldwide through commerce, breaking down barriers and creating opportunities for everyone."
    },
    {
      icon: <Award size={24} />,
      title: "Quality Excellence",
      description: "We maintain high standards for product quality and seller verification to ensure the best shopping experience."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder-team.jpg",
      description: "Visionary leader with 15+ years in e-commerce"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/placeholder-team.jpg",
      description: "Tech innovator specializing in scalable platforms"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/placeholder-team.jpg",
      description: "Operations expert ensuring smooth marketplace function"
    },
    {
      name: "David Kim",
      role: "Head of Marketing",
      image: "/placeholder-team.jpg",
      description: "Brand strategist building meaningful connections"
    }
  ];

  const milestones = [
    { year: "2020", event: "Bakerbari Founded", description: "Started as a small marketplace with big dreams" },
    { year: "2021", event: "10K Users", description: "Reached our first major milestone of 10,000 users" },
    { year: "2022", event: "Global Expansion", description: "Expanded to serve customers in 50+ countries" },
    { year: "2023", event: "Mobile App Launch", description: "Launched our mobile apps for iOS and Android" },
    { year: "2024", event: "50K+ Users", description: "Celebrating over 50,000 happy customers worldwide" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero modern-hero">
        <div className="modern-hero-bg">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg-bg">
            <defs>
              <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary-hover)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path fill="url(#heroGradient)" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
        <div className="container">
          <div className="modern-hero-content">
            <h2 className="modern-hero-title">
              Building the Future of <span className="highlight">Bakery</span>
            </h2>
            <p className="modern-hero-subtitle">
              Join a thriving community where innovation meets trust. Discover amazing products,
              connect with reliable sellers, and grow your business with Bakerbari.
            </p>
            <div className="modern-hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Today
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg btn-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                To democratize commerce by creating an inclusive, secure, and innovative
                marketplace where anyone can buy and sell with confidence. We believe that
                great products and exceptional service should be accessible to everyone, everywhere.
              </p>

              <h2>Our Vision</h2>
              <p>
                To become the world's most trusted and beloved e-commerce platform,
                fostering economic growth and opportunity while maintaining our commitment
                to sustainability and social responsibility.
              </p>
            </div>
            <div className="mission-image">
              {/* Floating animated SVG icon */}
              <div className="floating-animation">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="50" fill="#6639a6" opacity="0.15"/>
                  <circle cx="60" cy="60" r="35" fill="#6639a6" opacity="0.3"/>
                  <circle cx="60" cy="60" r="20" fill="#6639a6"/>
                  <path d="M60 40 Q70 60 60 80 Q50 60 60 40 Z" fill="#fff" opacity="0.7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Journey</h2>
            <p>Key milestones in our growth story</p>
          </div>

          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <CheckCircle size={20} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.event}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2 style={{ color: '#fff' }}>Ready to Join Our Community?</h2>
            <p style={{ color: '#fff' }}>
              Whether you're looking to discover amazing products or grow your business,
              Bakerbari provides the platform and support you need to succeed.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Today
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg btn-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
