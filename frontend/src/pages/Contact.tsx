import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

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

  const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setStatus("idle");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: leagă-l de backend (ex: POST /api/contact)
    try {
      setIsSubmitting(true);
      setStatus("idle");

      await new Promise((r) => setTimeout(r, 600)); // mock

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Contact</h1>
          <p className="text-white/90 mt-2 max-w-2xl">
            Trimite-ne un mesaj și revenim cât mai repede. Suport 24/7 pentru comenzi și întrebări.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: info cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800">Date de contact</h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">support@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="text-gray-800 font-medium">+ (123) 3243 343</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Adresă</p>
                    <p className="text-gray-800 font-medium">Chișinău, Moldova</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockIcon className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Program</p>
                    <p className="text-gray-800 font-medium">24/7 Support</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800">Social</h2>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-gray-700" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-gray-700" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="text-gray-700" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="text-gray-700" />
                </a>
              </div>
            </div>

            {/* Map embed (optional) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Locație</h2>
              </div>
              <div className="w-full h-[260px] bg-gray-100">
                <iframe
                  title="map"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Chisinau%20Moldova&output=embed"
                />
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-800">Trimite un mesaj</h2>
              <p className="text-gray-500 mt-2">
                Completează formularul și te contactăm în cel mai scurt timp.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nume</label>
                    <input
                      value={form.name}
                      onChange={onChange("name")}
                      type="text"
                      required
                      className="mt-2 w-full h-[46px] px-4 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-orange-400 transition-colors"
                      placeholder="Numele tău"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      value={form.email}
                      onChange={onChange("email")}
                      type="email"
                      required
                      className="mt-2 w-full h-[46px] px-4 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-orange-400 transition-colors"
                      placeholder="email@exemplu.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Subiect</label>
                  <input
                    value={form.subject}
                    onChange={onChange("subject")}
                    type="text"
                    required
                    className="mt-2 w-full h-[46px] px-4 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-orange-400 transition-colors"
                    placeholder="Despre ce este mesajul?"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Mesaj</label>
                  <textarea
                    value={form.message}
                    onChange={onChange("message")}
                    required
                    rows={6}
                    className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-orange-400 transition-colors resize-none"
                    placeholder="Scrie mesajul aici..."
                  />
                </div>

                {status !== "idle" && (
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      status === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {status === "success"
                      ? "Mesajul a fost trimis cu succes."
                      : "A apărut o eroare. Încearcă din nou."}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto h-[46px] px-8 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold uppercase text-sm hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

