import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Shield, MessageCircle, Star, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary-600" />,
      title: 'Smart Property Search',
      description: 'Find your perfect property with advanced filters and location-based search'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Verified Listings',
      description: 'All properties and brokers are verified for your safety and peace of mind'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary-600" />,
      title: 'Direct Communication',
      description: 'Chat, call, or video call brokers directly through our platform'
    },
    {
      icon: <Star className="w-8 h-8 text-primary-600" />,
      title: 'Trusted Reviews',
      description: 'Read genuine reviews from previous clients to make informed decisions'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Properties Listed' },
    { number: '500+', label: 'Verified Brokers' },
    { number: '25K+', label: 'Happy Clients' },
    { number: '14', label: 'Districts Covered' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Perfect Property in Uganda
            </h1>
            <p className="text-base md:text-lg mb-6 text-primary-100">
              Connect with verified brokers and discover your dream home, land, or commercial space
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Browse Properties
              </Link>
              <Link to="/register?role=broker" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Join as Broker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-center mb-4">Quick Property Search</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="input-field">
                <option>Property Type</option>
                <option>Land</option>
                <option>Rental</option>
                <option>House for Sale</option>
                <option>Commercial</option>
              </select>
              <select className="input-field">
                <option>District</option>
                <option>Kampala</option>
                <option>Wakiso</option>
                <option>Mukono</option>
                <option>Entebbe</option>
              </select>
              <select className="input-field">
                <option>Price Range</option>
                <option>Under 100M UGX</option>
                <option>100M - 500M UGX</option>
                <option>500M - 1B UGX</option>
                <option>Above 1B UGX</option>
              </select>
              <Link to="/properties" className="btn-primary text-center">
                Search Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Choose BrokerConnect?</h2>
            <p className="text-sm text-gray-600">The most trusted real estate platform in Uganda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied clients who found their perfect property through BrokerConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=client" className="btn-primary">
              Find Properties
            </Link>
            <Link to="/register?role=broker" className="btn-secondary">
              List Your Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;