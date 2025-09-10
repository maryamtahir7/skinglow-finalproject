import React, { useState, useEffect } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  Building2,
  User,
  Clock,
  Award,
  Shield,
  Truck,
  Heart,
  ShoppingBag,
  CreditCard,
  Headphones,
  Target,
  Globe,
  ArrowRight,
  Users,
  TrendingUp,
  Star,
  Check,
  Calendar,
  Package,
  Zap,
  ChevronRight,
  Play,
  Quote
} from "lucide-react";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailClick = () => {
    window.location.href = "mailto:maryamtahir236@gmail.com";
  };

  const handleWhatsAppClick = () => {
    window.location.href = "https://wa.me/923218788313?text=Hello%20MT%20Store";
  };

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers", color: "text-blue-600" },
    { icon: Package, value: "10K+", label: "Products Delivered", color: "text-green-600" },
    { icon: Award, value: "4.9", label: "Customer Rating", color: "text-yellow-600" },
    { icon: Globe, value: "100+", label: "Cities Served", color: "text-purple-600" }
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: "Curated Product Selection",
      description: "Handpicked items across fashion, electronics, and home essentials with quality guaranteed.",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: Truck,
      title: "Lightning-Fast Delivery",
      description: "Same-day and next-day delivery options with real-time tracking nationwide.",
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: CreditCard,
      title: "Seamless Payments",
      description: "Multiple secure payment gateways including mobile wallets and installment plans.",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: Headphones,
      title: "Premium Support",
      description: "Dedicated customer success team available 24/7 via chat, email, and phone.",
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ];

  const timeline = [
    {
      year: "2022",
      title: "The Beginning",
      description: "MT Store was founded with a vision to revolutionize online shopping in Pakistan."
    },
    {
      year: "2023",
      title: "Rapid Growth",
      description: "Expanded to serve 50+ cities with over 10,000 satisfied customers."
    },
    {
      year: "2024",
      title: "Digital Innovation",
      description: "Launched mobile app and introduced AI-powered personalized shopping experience."
    },
    {
      year: "2025",
      title: "Market Leader",
      description: "Became one of Pakistan's most trusted e-commerce platforms with 4.9 star rating."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and payments are protected with enterprise-grade security."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make puts our customers' needs and satisfaction first."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly evolving our platform with cutting-edge technology and features."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Committed to delivering exceptional quality in products and service."
    }
  ];

  const contactMethods = [
    {
      icon: Building2,
      title: "Corporate Office",
      detail: "Faisalabad, Pakistan",
      description: "Visit our headquarters",
      action: null
    },
    {
      icon: Mail,
      title: "Email Support",
      detail: "maryamtahir236@gmail.com",
      description: "Get in touch via email",
      action: handleEmailClick
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Chat",
      detail: "+92 321 8788313",
      description: "Quick support on WhatsApp",
      action: handleWhatsAppClick
    },
    {
      icon: User,
      title: "Meet the Founder",
      detail: "Maryam Tahir",
      description: "Founder & CEO",
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white" data-section>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">Pakistan's Most Trusted E-commerce Platform</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                MT STORE
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                Revolutionizing e-commerce in Pakistan with innovation, trust, and exceptional customer experience
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6" data-section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700">About MT Store</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built on Trust, Driven by Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're more than just an e-commerce platform. We're your trusted partner in discovering quality products with an unmatched shopping experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-8 h-8 text-gray-300" />
                <blockquote className="text-lg text-gray-700 italic pl-8">
                  "Our mission is to make online shopping not just convenient, but delightful. Every interaction should leave our customers feeling valued and satisfied."
                </blockquote>
                <div className="mt-4 pl-8">
                  <div className="font-semibold text-gray-900">Maryam Tahir</div>
                  <div className="text-sm text-gray-500">Founder & CEO</div>
                </div>
              </div>
              
              <div className="space-y-6">
                {values.map((value, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                    <div className="p-3 bg-gray-100 rounded-full shrink-0">
                      <value.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className={`p-3 rounded-xl ${feature.color} w-fit mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gray-50" data-section>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Our Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Milestones That Matter
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300 hidden md:block"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                  
                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24" data-section>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-4">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Get In Touch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Let's Start a Conversation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you have questions, feedback, or just want to say hello, we're always here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${method.action ? 'cursor-pointer' : ''}`}
                onClick={method.action}
              >
                <div className="p-4 bg-gray-100 rounded-full w-fit mb-6">
                  <method.icon className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{method.title}</h3>
                <div className="text-gray-900 font-medium mb-1">{method.detail}</div>
                <div className="text-gray-600 text-sm mb-4">{method.description}</div>
                {method.action && (
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Connect now</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleEmailClick}
              className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              <span>Send Email</span>
            </button>
            
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Chat</span>
            </button>
          </div>
        </div>
      </section>

      
    </div>
  );
}