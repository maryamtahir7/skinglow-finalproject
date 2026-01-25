import React, { useState } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Send,
  Calendar,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    try {
      btn.innerText = "Sending...";
      btn.disabled = true;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Thank you for reaching out! A SkinGlow concierge will contact you shortly.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      btn.innerText = originalText;
      btn.disabled = false;
    }
  };

  const CONTACT_EMAIL = "maryamtahir236@gmail.com";
  const LOCATION_LINE_1 = "Faisalabad";
  const LOCATION_LINE_2 = "Punjab, Pakistan";

  const handleMethodClick = (method) => {
    if (method.action?.type === "mailto") {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
      return;
    }
    if (method.action?.type === "route") {
      navigate(method.action.path);
      return;
    }
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Concierge Chat",
      description: "Instant advice from experts.",
      highlight: "Start Chat",
      action: { type: "route", path: "/ai-chat" },
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "For detailed inquiries.",
      highlight: CONTACT_EMAIL,
      action: { type: "mailto" },
      color: "text-stone-600",
      bg: "bg-stone-50"
    },
    {
      icon: Calendar,
      title: "Consultations",
      description: "Book a virtual skin session.",
      highlight: "Contact Support",
      action: { type: "route", path: "/support" },
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans text-stone-900 pb-20 selection:bg-rose-100">

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden px-4 sm:px-6">
        {/* Background Visuals */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-rose-200/20 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-stone-200/30 rounded-full blur-[60px] md:blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/60 border border-white/40 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-rose-500" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-rose-900">Here to Help</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-stone-900 mb-4 md:mb-6 tracking-tight px-2">
              Connect with our <br className="hidden sm:block" /> <i className="font-serif italic text-rose-400">Concierge</i>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed px-4">
              Have questions about your ritual? Our team of skin experts is ready to guide you towards your personal glow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTACT METHODS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-16 relative z-20 mb-12 md:mb-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {contactMethods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              onClick={() => handleMethodClick(method)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleMethodClick(method);
              }}
              className="group bg-white/80 backdrop-blur-md p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[32px] border border-white shadow-xl shadow-stone-200/50 hover:-translate-y-2 active:scale-95 transition-transform duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300 touch-manipulation"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${method.bg} ${method.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <method.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif mb-2">{method.title}</h3>
              <p className="text-stone-500 text-xs sm:text-sm mb-4 sm:mb-6">{method.description}</p>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider group-hover:gap-4 transition-all break-all">
                <span className="break-words">{method.highlight}</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. SPLIT FORM SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-6 md:gap-12 items-start">

          {/* Form (Span 8) - Show first on mobile */}
          <motion.div
            className="lg:col-span-8 bg-white p-5 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl lg:rounded-[40px] shadow-sm border border-stone-100 order-2 lg:order-1"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 md:mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif mb-2">Send a Message</h2>
              <p className="text-sm sm:text-base text-stone-500">Typical response time: Within 2 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Your Name</label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full bg-stone-50 border-0 border-b-2 border-stone-200 focus:border-stone-900 rounded-none px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-stone-50 border-0 border-b-2 border-stone-200 focus:border-stone-900 rounded-none px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Topic</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border-0 border-b-2 border-stone-200 focus:border-stone-900 rounded-none px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base outline-none transition-colors text-stone-600 appearance-none"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Advice</option>
                  <option value="routine">Routine Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you glow?"
                  className="w-full bg-stone-50 border-0 border-b-2 border-stone-200 focus:border-stone-900 rounded-none px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="pt-2 sm:pt-4">
                <button type="submit" className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-rose-900 active:scale-95 transition-all shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2 sm:gap-3 group touch-manipulation">
                  Send Message <Send className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>
          </motion.div>

          {/* Info Sidebar (Span 4) - Show second on mobile */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 order-1 lg:order-2">
            <div className="bg-stone-900 text-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <h3 className="text-xl sm:text-2xl font-serif mb-6 sm:mb-8 relative z-10">Visit Our Lounge</h3>

              <div className="space-y-6 sm:space-y-8 relative z-10">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm uppercase tracking-wider text-white/40 mb-1">Headquarters</p>
                    <p className="text-sm sm:text-base leading-relaxed">{LOCATION_LINE_1}<br />{LOCATION_LINE_2}</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm uppercase tracking-wider text-white/40 mb-1">Hours</p>
                    <p className="text-sm sm:text-base leading-relaxed">Mon - Sat: 10am - 8pm<br />Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm uppercase tracking-wider text-white/40 mb-1">Email</p>
                    <a className="text-sm sm:text-base leading-relaxed underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors break-all" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-white/10">
                  <p className="font-serif italic text-base sm:text-lg opacity-80">"Beauty begins the moment you decide to be yourself."</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
