"use client";

import { useState } from "react";
import PageBanner from "@/components/PageBanner";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // TODO: Connect to API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Immersive Hero Banner */}
      <PageBanner
        slug="contact"
        fallback={{
          title: "Send us a note",
          subtitle: "We respond to every inquiry within 24 hours.",
          label: "Get in Touch",
        }}
      />

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          {submitted ? (
            <div className="py-12 text-center">
              <h3 className="font-serif text-2xl text-foreground/90 mb-4">Thank you.</h3>
              <p className="text-foreground/50 leading-relaxed">
                We've received your message and will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">
                    First Name
                  </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full border-b border-foreground/20 bg-transparent py-3 text-lg text-foreground focus:outline-none focus:border-foreground/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full border-b border-foreground/20 bg-transparent py-3 text-lg text-foreground focus:outline-none focus:border-foreground/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border-b border-foreground/20 bg-transparent py-3 text-lg text-foreground focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-b border-foreground/20 bg-transparent py-3 text-lg text-foreground focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">
                      Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full border-b border-foreground/20 bg-transparent py-3 text-lg text-foreground focus:outline-none focus:border-foreground/60 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-block border border-foreground px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Submit"}
                    </button>
                  </div>
                </form>
              )}
        </div>
      </section>
    </div>
  );
}
