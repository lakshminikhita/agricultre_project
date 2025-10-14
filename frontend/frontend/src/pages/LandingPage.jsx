import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, BarChart3, Cloud, TrendingUp, Users, Award, CheckCircle, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  // Get user-specific dashboard link
  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.userType) {
      case 'FARMER':
        return '/dashboard';
      case 'BUYER':
        return '/buyer-dashboard';
      case 'ADVISOR':
        return '/admin-dashboard';
      default:
        return '/dashboard';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Get Started';
    
    switch (user.userType) {
      case 'FARMER':
        return 'Go to Farmer Dashboard';
      case 'BUYER':
        return 'Go to Buyer Dashboard';
      case 'ADVISOR':
        return 'Go to Admin Dashboard';
      default:
        return 'Go to Dashboard';
    }
  };

  const getFeatures = () => {
    if (user?.userType === 'BUYER') {
      return [
        {
          icon: <ShoppingCart className="h-8 w-8 text-primary-600" />,
          title: "Product Marketplace",
          description: "Browse and purchase fresh produce directly from local farmers."
        },
        {
          icon: <Package className="h-8 w-8 text-primary-600" />,
          title: "Order Management",
          description: "Track your orders and manage deliveries with ease."
        },
        {
          icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
          title: "Price Comparison",
          description: "Compare prices across different farmers to get the best deals."
        },
        {
          icon: <Users className="h-8 w-8 text-primary-600" />,
          title: "Connect with Farmers",
          description: "Build direct relationships with local agricultural producers."
        }
      ];
    } else if (user?.userType === 'ADVISOR') {
      return [
        {
          icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
          title: "Platform Analytics",
          description: "Monitor platform usage, user engagement, and market trends."
        },
        {
          icon: <Users className="h-8 w-8 text-primary-600" />,
          title: "User Management",
          description: "Manage farmer and buyer accounts, verify users, and handle disputes."
        },
        {
          icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
          title: "Market Insights",
          description: "Access comprehensive market data and generate reports."
        },
        {
          icon: <Award className="h-8 w-8 text-primary-600" />,
          title: "Quality Control",
          description: "Ensure product quality and maintain platform standards."
        }
      ];
    } else {
      // Default farmer features or general features for non-logged in users
      return [
        {
          icon: <Cloud className="h-8 w-8 text-primary-600" />,
          title: "Weather Analytics",
          description: "Real-time weather data and forecasting to help you plan your farming activities."
        },
        {
          icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
          title: "Crop Prediction",
          description: "AI-powered crop yield predictions based on soil conditions and historical data."
        },
        {
          icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
          title: "Market Intelligence",
          description: "Stay updated with current market prices and trends for better selling decisions."
        },
        {
          icon: <Leaf className="h-8 w-8 text-primary-600" />,
          title: "Farm Management",
          description: "Comprehensive tools to manage your crops, livestock, and farm operations."
        }
      ];
    }
  };

  const features = getFeatures();

  const stats = [
    { number: "10,000+", label: "Active Farmers" },
    { number: "500K+", label: "Acres Monitored" },
    { number: "95%", label: "Prediction Accuracy" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Smart Farming for a 
                <span className="text-primary-600"> Better Future</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Harness the power of technology to optimize your crop yields, 
                monitor weather conditions, and make data-driven farming decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={getDashboardLink()} 
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 group"
                >
                  {getDashboardLabel()}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <img 
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Smart Farming" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need to optimize your farming operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                About AgriTech
              </h2>
              <p className="text-lg text-gray-600">
                We're passionate about revolutionizing agriculture through technology. Our platform combines 
                cutting-edge AI, IoT sensors, and data analytics to help farmers make smarter decisions.
              </p>
              <div className="space-y-4">
                {[
                  "Advanced weather monitoring and forecasting",
                  "AI-powered crop yield predictions",
                  "Real-time market price tracking",
                  "Comprehensive farm management tools"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary-100 p-6 rounded-lg text-center">
                  <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Happy Farmers</div>
                </div>
                <div className="bg-green-100 p-6 rounded-lg text-center">
                  <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Awards Won</div>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="bg-blue-100 p-6 rounded-lg text-center">
                  <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">1M+</div>
                  <div className="text-sm text-gray-600">Crops Monitored</div>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg text-center">
                  <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">30%</div>
                  <div className="text-sm text-gray-600">Yield Increase</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of farmers who are already using our platform to increase their yields and profits.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;