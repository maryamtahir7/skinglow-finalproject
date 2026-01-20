import React, { useState } from "react";
import {
  Mail,
  MessageCircle,
  Building2,
  User,
  Linkedin,
  ChevronRight,
  Quote,
  Star,
  Phone,
  MapPin
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleEmailClick = () => {
    window.location.href = "mailto:support@medistore.pk";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully! Our pharmacist will contact you shortly.");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Pharmacist Helpline",
      detail: "+92 300 1234567",
      description: "24/7 Medical Support",
    },
    {
      icon: Mail,
      title: "Email Support",
      detail: "support@medistore.pk",
      description: "For orders & prescriptions",
      action: handleEmailClick,
    },
    {
      icon: MapPin,
      title: "Headquarters",
      detail: "Faisalabad, Punjab, Pakistan",
      description: "Or visit our local centers",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      detail: "+92 300 7654321",
      description: "Chat with us instantly",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact MediStore</h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Need help with your medicines or order? Our team of qualified pharmacists and support staff is here to assist you 24/7.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-teal-200 transition ${method.action ? "cursor-pointer" : ""
                  }`}
                onClick={method.action}
              >
                <div className="p-4 bg-teal-50 rounded-full w-fit mb-6">
                  <method.icon className="w-6 h-6 text-teal-700" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  {method.title}
                </h3>
                <p className="text-slate-900 font-medium">{method.detail}</p>
                <p className="text-slate-500 text-sm mb-4">
                  {method.description}
                </p>
                {method.action && (
                  <div className="flex items-center text-teal-600 text-sm font-medium">
                    <span>Connect now</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto border-t-4 border-teal-500">
            <h3 className="text-2xl font-bold mb-2 text-slate-900">
              Send Us a Message
            </h3>
            <p className="text-slate-500 mb-8">
              Have a query about a medicine or delivery? Fill out the form below.
            </p>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <textarea
                rows="5"
                name="message"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
              <button className="bg-teal-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-200">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-slate-900">What Our Patients Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((t) => (
              <div
                key={t}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-left"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">
                  “The pharmacist was very helpful in explaining the dosage. Delivery was super fast within Faisalabad!”
                </p>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs">P{t}</div>
                  Patient {t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
