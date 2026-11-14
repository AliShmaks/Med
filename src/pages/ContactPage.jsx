import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { whatsappNumber } from '../lib/supabase';
import { whatsappUrl } from '../utils/whatsapp';

export function ContactPage() {
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Please enter your full name.';
    if (!form.phone.trim()) e.phone = 'Please enter your phone number.';
    else if (!/^[+\d][\d\s\-()]{6,}$/.test(form.phone.trim()))
      e.phone = 'Please enter a valid phone number.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = 'Please enter a valid email address.';
    if (!form.message.trim()) e.message = 'Please tell us how we can help.';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eObj = validate();
    if (Object.keys(eObj).length) {
      setErrors(eObj);
      return;
    }
    const text =
      `Hello UNI MED, I would like to get in touch.\n\n` +
      `Full name: ${form.fullName.trim()}\n` +
      `Phone: ${form.phone.trim()}\n` +
      `Email: ${form.email.trim()}\n\n` +
      `Message:\n${form.message.trim()}\n\n` +
      `— Sent from the UNI MED contact page`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setSubmitted(true);
  };

  return (
    <main className="inner-page section-pad contact-page">
      <div className="page-intro contact-intro">
        <span className="eyebrow">GET IN TOUCH</span>
        <h1>
          Let's talk about
          <br />
          your equipment.
        </h1>
        <p>Tell us what you need. We'll get back to you quickly through WhatsApp.</p>
      </div>

      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-field">
            <label htmlFor="cf-name">
              Full name <span>*</span>
            </label>
            <input
              id="cf-name"
              type="text"
              value={form.fullName}
              onChange={handleChange('fullName')}
              placeholder="e.g. Dr. Sarah Haddad"
              autoComplete="name"
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="cf-phone">
              Phone number <span>*</span>
            </label>
            <input
              id="cf-phone"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="+961 71 234 567"
              autoComplete="tel"
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="cf-email">
              Email address <span>*</span>
            </label>
            <input
              id="cf-email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@clinic.com"
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="cf-message">
              Your message <span>*</span>
            </label>
            <textarea
              id="cf-message"
              rows="5"
              value={form.message}
              onChange={handleChange('message')}
              placeholder="Tell us about the equipment you need, quantities, or any question..."
            />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>

          <button type="submit" className="primary-button full">
            Send via WhatsApp <ArrowUpRight size={17} />
          </button>

          {submitted && (
            <p className="contact-success">
              WhatsApp opened in a new tab. If nothing happened, allow pop-ups and
              try again.
            </p>
          )}
        </form>

        <aside className="contact-aside">
          <div className="contact-aside-block">
            <span className="eyebrow">WHAT HAPPENS NEXT</span>
            <p>
              Your message is sent straight to our team on WhatsApp — no forms lost
              in an inbox.
            </p>
          </div>
          <div className="contact-aside-block">
            <span className="eyebrow">WHY UNI MED</span>
            <p>
              Equipment selection, delivery and local technical support from people
              who know healthcare.
            </p>
          </div>
          <div className="contact-aside-block">
            <span className="eyebrow">DIRECT WHATSAPP</span>
            <a
              href={whatsappUrl('Hello UNI MED, I would like to get in touch.')}
              target="_blank"
              rel="noreferrer"
              className="footer-contact"
            >
              Chat with us directly <ArrowUpRight size={16} />
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}