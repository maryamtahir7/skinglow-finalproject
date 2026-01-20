import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
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
  Star,
  Calendar,
  Package,
  Zap,
  Play,
  Quote,
  Stethoscope,
  Pill,
  Activity,
  CheckCircle
} from "lucide-react";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { icon: Users, value: "1M+", label: "Happy Patients", color: "text-teal-600" },
    { icon: Pill, value: "50K+", label: "Medicines Available", color: "text-emerald-600" },
    { icon: Award, value: "4.9", label: "Patient Rating", color: "text-yellow-600" },
    { icon: MapPin, value: "100+", label: "Cities Served", color: "text-blue-600" },
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "100% Genuine Medicines",
      description:
        "Sourced directly from manufacturers and authorized distributors to ensure authenticity.",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
    {
      icon: Truck,
      title: "Express Delivery",
      description: "Fast delivery within 24 hours in metro cities and efficient tracking nationwide.",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "Safe and secure payment gateways with cash on delivery and online options.",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      icon: Headphones,
      title: "Pharmacist Support",
      description: "Qualified pharmacists available 24/7 to answer your health-related queries.",
      color: "bg-gradient-to-br from-teal-400 to-teal-500",
    },
  ];

  const timeline = [
    {
      year: "2022",
      title: "The Beginning",
      description:
        "MediStore started with a mission to make healthcare accessible to every Pakistani.",
    },
    {
      year: "2023",
      title: "Digital Expansion",
      description: "Launched our mobile app and expanded delivery to over 50 cities.",
    },
    {
      year: "2024",
      title: "Telemedicine Integration",
      description:
        "Introduced AI Pharmacist and Online Doctor Consultations.",
    },
    {
      year: "2025",
      title: "Nation's Pharmacy",
      description:
        "Became one of Pakistan's most trusted digital pharmacies with ISO certification.",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "We adhere to strict quality standards to ensure patient safety first.",
    },
    {
      icon: Heart,
      title: "Patient Care",
      description: "Compassion is at the core of our service. We care for your health like family.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging technology to simplify healthcare access.",
    },
    {
      icon: Target,
      title: "Accessibility",
      description: "Making essential medicines affordable and available to all.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white"
        data-section
      >
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
                <Activity className="w-5 h-5 text-teal-400 fill-current" />
                <span className="text-sm font-medium">
                  Pakistan's Most Trusted Digital Pharmacy
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-teal-100 to-teal-200 bg-clip-text text-transparent">
                MediStore Pharmacy
              </h1>

              <p className="text-xl md:text-2xl text-teal-100 mb-8 leading-relaxed max-w-3xl mx-auto">
                Revolutionizing healthcare access with genuine medicines, expert advice, and trusted care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() =>
                    document.getElementById("about").scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-teal-500 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Our Mission</span>
                  <ArrowRight className="w-5 h-5" />
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
                    <stat.icon className={`w-6 h-6 text-teal-300`} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-teal-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6" data-section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-900">About MediStore</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Your Health, Our Priority
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We are committed to delivering health and wellness to your doorstep with integrity and care.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-8 h-8 text-teal-200" />
                <blockquote className="text-lg text-slate-700 italic pl-8 border-l-4 border-teal-500">
                  "At MediStore, we believe that access to genuine medicine is a basic right. We strive to make healthcare accessible, affordable, and trustworthy for every family."
                </blockquote>
                <div className="mt-4 pl-8">
                  <div className="font-semibold text-slate-900">Dr. Maryam Tahir</div>
                  <div className="text-sm text-slate-500">Founder & Chief Pharmacist</div>
                </div>
              </div>

              <div className="space-y-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl hover:bg-teal-50 transition-all duration-300 border border-transparent hover:border-teal-100"
                  >
                    <div className="p-3 bg-teal-100 rounded-full shrink-0">
                      <value.icon className="w-5 h-5 text-teal-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{value.title}</h3>
                      <p className="text-slate-600 text-sm">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100"
                  >
                    <div className={`p-3 rounded-xl ${feature.color} w-fit mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-slate-50" data-section>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm border border-slate-100">
              <Calendar className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-slate-700">Our Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Milestones in Healthcare
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-slate-300 hidden md:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-teal-500">
                      <div className="text-2xl font-bold text-teal-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="hidden md:block w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-teal-600 rounded-full border-4 border-white shadow-md"></div>
                  </div>

                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
