import React, { useMemo, useState } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

 
  const mapSrc = useMemo(
    () => "https://www.google.com/maps?q=Chicago%20usa&output=embed",
    []
  );

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      setStatus("idle");
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setStatus("idle");

      // If you use Vite proxy: /api/contact
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-10 md-lg:py-8 sm:py-7">
          <div className="flex flex-col gap-3 sm:gap-2">
            <span className="inline-flex w-fit items-center rounded-full bg-orange-50 text-orange-700 px-3 py-1 text-xs font-semibold">
              Contact Support
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md-lg:text-3xl sm:text-2xl">
              Get in touch
            </h1>
            <p className="text-gray-600 max-w-2xl text-base md-lg:text-sm">
              Have a question about your order or products? Send us a message and we’ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-10 md-lg:py-8 sm:py-7">
        {/* Desktop: 2 columns, Mobile (md-lg): 1 column */}
        <div className="flex gap-8 md-lg:flex-col md-lg:gap-6">
          {/* LEFT */}
          <aside className="w-5/12 md-lg:w-full space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-5">
              <h2 className="text-lg font-semibold text-gray-900">Contact details</h2>
              <p className="text-sm text-gray-600 mt-2">
                We typically respond within a few hours.
              </p>

              <div className="mt-6 space-y-4">
                <InfoRow icon={<EnvelopeIcon className="w-5 h-5" />} label="Email" value="support@gmail.com" />
                <InfoRow icon={<PhoneIcon className="w-5 h-5" />} label="Phone" value="+ (123) 3243 343" />
                <InfoRow icon={<MapPinIcon className="w-5 h-5" />} label="Location" value="Chicago, USA" />
                <InfoRow icon={<ClockIcon className="w-5 h-5" />} label="Hours" value="24/7 Support" />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Social</h3>
                <div className="mt-3 flex items-center gap-3">
                  <SocialBtn aria="Facebook"><FaFacebookF /></SocialBtn>
                  <SocialBtn aria="Twitter"><FaTwitter /></SocialBtn>
                  <SocialBtn aria="LinkedIn"><FaLinkedin /></SocialBtn>
                  <SocialBtn aria="GitHub"><FaGithub /></SocialBtn>
                </div>
              </div>
            </div>

            {/* MAP */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 sm:px-5 sm:py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-base">Find us</h2>
                <span className="text-xs text-gray-500">Google Maps</span>
              </div>

              {/* height reduces on smaller screens */}
              <div className="h-[260px] md-lg:h-[220px] sm:h-[200px] xs:h-[180px] bg-gray-100">
                <iframe
                  title="map"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                />
              </div>
            </div>
          </aside>

          {/* RIGHT */}
          <section className="w-7/12 md-lg:w-full">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md-lg:p-6 sm:p-5">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-lg">Send a message</h2>
              <p className="text-sm text-gray-600 mt-2">
                Fill in the form below and we’ll contact you shortly.
              </p>

              <form onSubmit={onSubmit} className="mt-7 space-y-5">
                {/* Desktop: 2 cols, md: 1 col (because md is max-width) */}
                <div className="grid grid-cols-2 gap-5 md:grid-cols-1">
                  <Field label="Name">
                    <input
                      value={form.name}
                      onChange={onChange("name")}
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full h-[46px] px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none
                                 focus:bg-white focus:border-orange-400 transition"
                    />
                  </Field>

                  <Field label="Email">
                    <input
                      value={form.email}
                      onChange={onChange("email")}
                      type="email"
                      required
                      placeholder="email@example.com"
                      className="w-full h-[46px] px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none
                                 focus:bg-white focus:border-orange-400 transition"
                    />
                  </Field>
                </div>

                <Field label="Subject">
                  <input
                    value={form.subject}
                    onChange={onChange("subject")}
                    type="text"
                    required
                    placeholder="What is this about?"
                    className="w-full h-[46px] px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none
                               focus:bg-white focus:border-orange-400 transition"
                  />
                </Field>

                <Field label="Message">
                  <textarea
                    value={form.message}
                    onChange={onChange("message")}
                    required
                    rows={6}
                    placeholder="Write your message..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none
                               focus:bg-white focus:border-orange-400 transition resize-none"
                  />
                </Field>

                {status !== "idle" && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm border ${
                      status === "success"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {status === "success"
                      ? "Message sent successfully. We’ll get back to you soon."
                      : "Something went wrong. Please try again."}
                  </div>
                )}

                {/* Desktop: row, small: column */}
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-stretch">
                  <p className="text-xs text-gray-500 sm:order-2">
                    By sending this message you agree to be contacted about your request.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-[46px] px-7 rounded-xl font-semibold text-sm text-white
                               bg-gradient-to-r from-orange-500 to-orange-600
                               hover:from-orange-600 hover:to-orange-700
                               shadow-sm hover:shadow-md transition
                               disabled:opacity-60 disabled:cursor-not-allowed sm:w-full"
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            </div>

            {/* Mini cards: desktop 3, md-lg -> 1 */}
            <div className="mt-6 grid grid-cols-3 gap-4 md-lg:grid-cols-1">
              <MiniCard title="Fast support" desc="Quick answers for orders & shipping." />
              <MiniCard title="Secure help" desc="We never ask for passwords." />
              <MiniCard title="Order tracking" desc="Include your order ID if possible." />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;

/* ---------- helpers ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
}

function SocialBtn({ children, aria }: { children: React.ReactNode; aria: string }) {
  return (
    <a
      href="#"
      aria-label={aria}
      className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center
                 hover:bg-orange-50 hover:text-orange-600 transition"
    >
      {children}
    </a>
  );
}

function MiniCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}
