import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Users,
  Headphones
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Bakery Street', 'Dhaka, Bangladesh 1208'],
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+880 1234-567890', '+880 9876-543210'],
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@bakerymarketplace.com', 'support@bakerymarketplace.com'],
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 8:00 AM - 8:00 PM', 'Sat - Sun: 9:00 AM - 6:00 PM'],
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const supportTypes = [
    {
      icon: MessageCircle,
      title: 'General Inquiry',
      description: 'Questions about our platform or services'
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'Interested in becoming a partner bakery'
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      description: 'Need help with your account or orders'
    }
  ];

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn btn-primary"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-color to-primary-light text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-purple-100">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="card text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${info.color}`}>
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

              {/* Support Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {supportTypes.map((type, index) => (
                  <label
                    key={index}
                    className={`
                      flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
                      ${formData.type === type.title.toLowerCase().replace(' ', '_') 
                        ? 'border-primary-color bg-purple-50' 
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.title.toLowerCase().replace(' ', '_')}
                      checked={formData.type === type.title.toLowerCase().replace(' ', '_')}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <type.icon className="w-8 h-8 text-primary-color mb-2" />
                    <span className="font-medium text-sm text-center">{type.title}</span>
                  </label>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary btn-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Interactive Map</p>
                  <p className="text-sm text-gray-400">123 Bakery Street, Dhaka</p>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">How do I become a partner bakery?</h4>
                    <p className="text-sm text-gray-600">Contact us through the partnership inquiry form and we'll guide you through the process.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">What are your delivery areas?</h4>
                    <p className="text-sm text-gray-600">We currently deliver within Dhaka city and surrounding areas. Check our coverage map for details.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">How can I track my order?</h4>
                    <p className="text-sm text-gray-600">You can track your order in real-time through your buyer dashboard or the tracking link sent to your email.</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card bg-red-50 border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Support</h3>
                <p className="text-sm text-red-600 mb-3">
                  For urgent issues with orders or deliveries, call our emergency hotline:
                </p>
                <p className="font-bold text-red-800">+880 1999-888777</p>
                <p className="text-xs text-red-500 mt-1">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Visit Our Office
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Support</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone Support</span>
                    <span className="font-medium">24/7 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email Response</span>
                    <span className="font-medium">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Live Chat</span>
                    <span className="font-medium">9:00 AM - 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
