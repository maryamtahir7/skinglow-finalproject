import React, { useState } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  Send,
  Calendar,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! A SkinGlow concierge will contact you shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Concierge Chat",
      description: "Instant advice from experts.",
      highlight: "Start Chat",
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "For detailed inquiries.",
      highlight: "glow@skinglow.com",
      color: "text-stone-600",
      bg: "bg-stone-50"
    },
    {
      icon: Calendar,
      title: "Consultations",
      description: "Book a virtual skin session.",
      highlight: "Book Now",
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans text-stone-900 pb-20 selection:bg-rose-100">

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-40 overflow-hidden px-6">
        {/* Background Visuals */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-200/20 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-stone-200/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/60 border border-white/40 backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-rose-900">Here to Help</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-6 tracking-tight">
              Connect with our <br /> <i className="font-serif italic text-rose-400">Concierge</i>
            </h1>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
              Have questions about your ritual? Our team of skin experts is ready to guide you towards your personal glow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTACT METHODS GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {contactMethods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="group bg-white/80 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-xl shadow-stone-200/50 hover:-translate-y-2 transition-transform duration-500 cursor-pointer"
            >
              <div className={`w-14 h-14 ${method.bg} ${method.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <method.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-2">{method.title}</h3>
              <p className="text-stone-500 text-sm mb-6">{method.description}</p>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:gap-4 transition-all">
                <span>{method.highlight}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. SPLIT FORM SECTION */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Info Sidebar (Span 4) */}
          <div className="lg:col-span-4 space-y-8 sticky top-24">
            <div className="bg-stone-900 text-white p-10 rounded-[32px] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <h3 className="text-2xl font-serif mb-8 relative z-10">Visit Our Lounge</h3>

              <div className="space-y-8 relative z-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-white/40 mb-1">Headquarters</p>
                    <p className="leading-relaxed">123 Radiance Blvd, Suite 100<br />Lahore, Punjab</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-white/40 mb-1">Hours</p>
                    <p className="leading-relaxed">Mon - Sat: 10am - 8pm<br />Sunday: Closed</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="font-serif italic text-lg opacity-80">"Beauty begins the moment you decide to be yourself."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form (Span 8) */}
          <motion.div
            className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-stone-100"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-10">
              <h2 className="text-3xl font-serif mb-2">Send a Message</h2>
              <p className="text-stone-500">Typical response time: Within 2 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Your Name</label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full bg-stone-50 border-0 border-b-2 border-stone-200 focus:border-stone-900 rounded-none px-4 py-4 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-stone-50 border-0 border-b-2 border-stone-200 focus:border-stone-900 rounded-none px-4 py-4 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Topic</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border-0 border-b-2 border-stone-200 focus:border-stone-900 rounded-none px-4 py-4 outline-none transition-colors text-stone-600 appearance-none"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Advice</option>
                  <option value="routine">Routine Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you glow?"
                  className="w-full bg-stone-50 border-0 border-b-2 border-stone-200 focus:border-stone-900 rounded-none px-4 py-4 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="pt-4">
                <button className="w-full md:w-auto px-10 py-5 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-rose-900 transition-colors shadow-xl shadow-stone-900/10 flex items-center justify-center gap-3 group">
                  Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>
          </motion.div>

        </div>
      </div>

    </div>
  );
}
