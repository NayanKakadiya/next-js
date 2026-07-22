'use client';

import { useState } from 'react';

export default function FormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Website Design',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || 'Failed to submit form. Please try again.');
        setSubmitted(false);
        return;
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Website Design',
        message: '',
      });
    } catch (submitError) {
      console.error('Form submission error:', submitError);
      setError('An unexpected error occurred. Please try again later.');
      setSubmitted(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <section className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 text-white sm:p-10 lg:p-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100">
              Contact us
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Let&apos;s build something amazing together.
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-cyan-50/90">
              Share your ideas and we will help turn them into a polished experience for your audience.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">
                  Email
                </p>
                <p className="mt-1 text-lg">hello@nextstudio.com</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">
                  Phone
                </p>
                <p className="mt-1 text-lg">+880 1712-345678</p>
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10 lg:p-12">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="phone">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 17xxx"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="service">
                  Service
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                >
                  <option>Website Design</option>
                  <option>Frontend Development</option>
                  <option>UI/UX Review</option>
                  <option>Full Project Support</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="message">
                Project details
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex items-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Send Message
            </button>

            {error ? (
              <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>
            ) : submitted ? (
              <p className="mt-4 text-sm font-medium text-emerald-600">
                Thanks! Your message has been received.
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
}
