import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  Target,
  Heart,
  Truck,
  Shield,
  Clock,
  MapPin
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Users,
      title: 'Local Community',
      description: 'Supporting local bakeries and artisans in your neighborhood'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Premium quality products with satisfaction guarantee'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery for fresh bakery products'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Safe and secure shopping experience for all users'
    }
  ];

  const team = [
    {
      name: 'Adel Mohammad Zahid',
      role: 'Project Lead & Dashboard Development',
      id: '20220204057',
      avatar: '👨‍💼',
      description: 'Specialized in project architecture and dashboard design'
    },
    {
      name: 'Saleh Mahmud Sami',
      role: 'Product & Inventory UI',
      id: '20220204061',
      avatar: '👨‍💻',
      description: 'Expert in product management and inventory systems'
    },
    {
      name: 'Md. Rubayet Islam',
      role: 'Orders & Analytics UI',
      id: '20220204069',
      avatar: '👨‍🔬',
      description: 'Focused on order processing and analytics interfaces'
    },
    {
      name: 'Abhishek Sarker',
      role: 'Expense & AI Interface',
      id: '20220204104',
      avatar: '👨‍🎨',
      description: 'Specialized in expense management and AI integration'
    }
  ];

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Partner Bakeries' },
    { number: '1000+', label: 'Products Available' },
    { number: '99%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-color to-primary-light text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Our
              <br />
              <span className="text-secondary-color">Bakery Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Connecting communities through fresh, artisanal bakery products and supporting local businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that fresh, quality bakery products should be accessible to everyone.
                Our platform connects local bakeries with customers, creating a thriving ecosystem
                that supports small businesses while delivering exceptional products to your doorstep.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-primary-color" />
                  <span className="text-gray-700">Support local bakeries and artisans</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-primary-color" />
                  <span className="text-gray-700">Deliver fresh, quality products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-primary-color" />
                  <span className="text-gray-700">Provide convenient shopping experience</span>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-gray-100 rounded-2xl p-8">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Focused</h3>
                <p className="text-gray-600">
                  Building stronger communities by connecting local businesses with neighbors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Special
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just a marketplace - we're a community platform dedicated to quality and convenience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 bg-primary-color rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-color text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Computer Science students at Ahsanullah University of Science and Technology,
              working together to create innovative solutions for the bakery industry.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-primary-color font-medium mb-1">{member.role}</p>
                <p className="text-xs text-gray-500 mb-3">ID: {member.id}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Context */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Academic Project
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course</h3>
                <p className="text-gray-600">CSE 3104 Database Lab</p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Institution</h3>
                <p className="text-gray-600">Ahsanullah University of Science and Technology</p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Semester</h3>
                <p className="text-gray-600">Fall 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-color text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Fresh?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join our community and discover amazing bakery products from local artisans
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/marketplace"
              className="btn btn-lg bg-white text-primary-color hover:bg-gray-100"
            >
              Explore Marketplace
            </Link>
            <Link
              to="/contact"
              className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-color"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
