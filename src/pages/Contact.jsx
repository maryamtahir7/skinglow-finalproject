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
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleEmailClick = () => {
    window.location.href = "mailto:maryamtahir236@gmail.com";
  };

  const handleLinkedInClick = () => {
    window.open(
      "https://www.linkedin.com/in/maryam-tahir-408704353/",
      "_blank"
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactMethods = [
    {
      icon: Building2,
      title: "Corporate Office",
      detail: "Faisalabad, Pakistan",
      description: "Visit our headquarters",
    },
    {
      icon: Mail,
      title: "Email",
      detail: "maryamtahir236@gmail.com",
      description: "Get in touch via email",
      action: handleEmailClick,
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      detail: "Maryam Tahir",
      description: "Connect with me on LinkedIn",
      action: handleLinkedInClick,
    },
    {
      icon: User,
      title: "Founder",
      detail: "Maryam Tahir",
      description: "Founder & CEO",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We’d love to hear from you. Whether you have questions, feedback, or
            partnership opportunities—let’s start a conversation.
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
                className={`bg-white rounded-2xl p-8 shadow hover:shadow-xl transition ${
                  method.action ? "cursor-pointer" : ""
                }`}
                onClick={method.action}
              >
                <div className="p-4 bg-gray-100 rounded-full w-fit mb-6">
                  <method.icon className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {method.title}
                </h3>
                <p className="text-gray-900 font-medium">{method.detail}</p>
                <p className="text-gray-600 text-sm mb-4">
                  {method.description}
                </p>
                {method.action && (
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Connect now</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Send Us a Message
            </h3>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
              <textarea
                rows="5"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              ></textarea>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">What People Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((t) => (
              <div
                key={t}
                className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition"
              >
                <Quote className="w-6 h-6 text-blue-600 mb-4" />
                <p className="text-gray-600 mb-4">
                  “Professional and reliable! I had an amazing experience
                  communicating with this team.”
                </p>
                <div className="font-bold">Client {t}</div>
                <div className="flex justify-center mt-2 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
