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
    { year: "2020", event: "BMS Founded", description: "Started as a small marketplace with big dreams" },
    { year: "2021", event: "10K Users", description: "Reached our first major milestone of 10,000 users" },
    { year: "2022", event: "Global Expansion", description: "Expanded to serve customers in 50+ countries" },
    { year: "2023", event: "Mobile App Launch", description: "Launched our mobile apps for iOS and Android" },
    { year: "2024", event: "50K+ Users", description: "Celebrating over 50,000 happy customers worldwide" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About BMS</h1>
            <p className="hero-subtitle">
              Building the future of e-commerce, one connection at a time
            </p>
            <p className="hero-description">
              BMS is more than just a marketplace – we're a community that brings together
              passionate sellers and discerning buyers from around the world. Our mission is
              to create a trusted, innovative platform where commerce thrives and relationships flourish.
            </p>
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
              <img src="/placeholder-mission.jpg" alt="Our Mission" />
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

      {/* Team */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>The passionate people behind BMS</p>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-role">{member.role}</div>
                  <p>{member.description}</p>
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
            <h2>Ready to Join Our Community?</h2>
            <p>
              Whether you're looking to discover amazing products or grow your business,
              BMS provides the platform and support you need to succeed.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Today
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
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
