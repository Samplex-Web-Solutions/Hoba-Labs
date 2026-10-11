import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: 'EmailJS configuration keys are missing in environment variables.' 
      });
      return;
    }

    try {
      await emailjs.send(
        serviceID,
        templateID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        publicKey
      );

      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus({ 
        loading: false, 
        success: false, 
        error: 'Failed to send message. Please try again later or contact us directly via WhatsApp.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-slate-950">
      
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-slate-900">
        <Link to="/" className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-center text-orange-400 font-bold">
            H
          </div>
          <span className="font-bold text-white text-sm font-mono">HOBA LABS</span>
        </div>
      </header>

      {/* Contact Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Info */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Have questions about our institutional SMC/ICT signal engine, subscription tiers, or Telegram bot setup? Reach out to our team.
          </p>

          <div className="space-y-4 pt-4 text-xs text-slate-300">
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <Phone className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-slate-500 text-[10px] uppercase">WhatsApp Support</p>
                <p className="font-semibold text-white">+234 815 885 7187</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <Mail className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Email Support</p>
                <p className="font-semibold text-white">support@hobalabs.internal</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <MapPin className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Headquarters</p>
                <p className="font-semibold text-white">Umuahia, Abia State, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-left">
          <h2 className="text-lg font-bold text-white mb-6">Send Us a Message</h2>

          {status.success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-xs">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Your message has been sent successfully! We will get back to you shortly.</span>
            </div>
          )}

          {status.error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Samuel Ojiemen"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="samuel@hobalabs.internal"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Subscription & Signal Inquiry"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
              <textarea 
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="How can we assist your trading setup today?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status.loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-lg text-xs transition-colors shadow-lg shadow-orange-500/20"
            >
              <span>{status.loading ? 'Sending Message...' : 'Send Message'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full">
        © {new Date().getFullYear()} Hoba Labs. All rights reserved.
      </footer>

    </div>
  );
}