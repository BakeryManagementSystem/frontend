import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { ArrowRight, Star, ShoppingBag, Users, Award, Truck } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: ShoppingBag,
      title: 'Fresh Products',
      description: 'Daily fresh bakery items from local artisans'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery to your doorstep'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Premium quality guaranteed on every order'
    },
    {
      icon: Users,
      title: 'Trusted Sellers',
      description: 'Verified bakeries and trusted vendors'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing fresh bread and pastries! The delivery is always on time.',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      rating: 5,
      comment: 'Best bakery marketplace in town. Great variety and excellent service.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Davis',
      rating: 5,
      comment: 'Love the quality and freshness of products. Highly recommended!',
      avatar: '👩‍🎨'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-color to-primary-light text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fresh Bakery Products
              <br />
              <span className="text-secondary-color">Delivered Daily</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Discover the finest selection of fresh bread, pastries, and artisanal treats
              from local bakeries in your neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/marketplace"
                className="btn btn-lg bg-white text-primary-color hover:bg-gray-100"
              >
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/auth/register"
                  className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-color"
                >
                  Join Our Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Marketplace?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We connect you with the best local bakeries and ensure you get the freshest products delivered right to your door.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
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

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600">
              Explore our wide range of bakery products
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Bread', emoji: '🍞', count: '120+' },
              { name: 'Cakes', emoji: '🎂', count: '85+' },
              { name: 'Pastries', emoji: '🥐', count: '95+' },
              { name: 'Cookies', emoji: '🍪', count: '150+' },
              { name: 'Donuts', emoji: '🍩', count: '45+' },
              { name: 'Pies', emoji: '🥧', count: '30+' }
            ].map((category, index) => (
              <Link
                key={index}
                to="/marketplace"
                className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Read reviews from our satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-color text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of satisfied customers and discover amazing bakery products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/marketplace"
              className="btn btn-lg bg-white text-primary-color hover:bg-gray-100"
            >
              Start Shopping Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/auth/register"
                className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-color"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
