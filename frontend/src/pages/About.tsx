import React from "react";
import { CheckCircleIcon, TruckIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-12 md-lg:py-10 sm:py-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-700 px-3 py-1 text-xs font-semibold">
              About us
            </span>
            <h1 className="mt-3 text-4xl font-bold text-gray-900 md-lg:text-3xl sm:text-2xl">
              We build simple and reliable shopping experiences
            </h1>
            <p className="mt-4 text-gray-600 text-lg md-lg:text-base sm:text-sm">
              Our mission is to offer quality products, fast delivery, and excellent customer support — all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-12 md-lg:py-10 sm:py-8">
        {/* SECTION 1 */}
        <div className="flex gap-10 md-lg:flex-col md-lg:gap-6">
          <div className="w-1/2 md-lg:w-full">
            <h2 className="text-2xl font-semibold text-gray-900 sm:text-xl">
              Who we are
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed text-base sm:text-sm">
              We are an e-commerce platform focused on delivering a smooth and secure online shopping experience.
              From product selection to checkout and delivery, every step is optimized for speed, clarity, and trust.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed text-base sm:text-sm">
              Our team works continuously to improve the platform, add new features, and ensure customer satisfaction.
            </p>
          </div>

          <div className="w-1/2 md-lg:w-full grid grid-cols-2 gap-4 sm:grid-cols-1">
            <StatBox title="10k+" desc="Happy customers" />
            <StatBox title="5+" desc="Years experience" />
            <StatBox title="24/7" desc="Customer support" />
            <StatBox title="Fast" desc="Worldwide delivery" />
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="mt-16 md-lg:mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-xl">
            Why choose us
          </h2>

          <div className="mt-8 grid grid-cols-4 gap-6 md-lg:grid-cols-2 sm:grid-cols-1">
            <Feature
              icon={<CheckCircleIcon className="w-6 h-6" />}
              title="Quality products"
              desc="We carefully select products from trusted suppliers."
            />
            <Feature
              icon={<TruckIcon className="w-6 h-6" />}
              title="Fast delivery"
              desc="Quick and reliable shipping, right to your door."
            />
            <Feature
              icon={<ShieldCheckIcon className="w-6 h-6" />}
              title="Secure payments"
              desc="Your data and payments are fully protected."
            />
            <Feature
              icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
              title="Great support"
              desc="Friendly support team available whenever you need help."
            />
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="mt-16 md-lg:mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md-lg:p-6 sm:p-5">
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-xl">
            Our vision
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-sm leading-relaxed max-w-3xl">
            We aim to become a trusted online destination where customers feel confident, informed,
            and supported. By combining modern technology with customer-first values, we continue
            to grow alongside our community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

/* ---------- components ---------- */

function StatBox({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-2xl font-bold text-orange-600">{title}</p>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
      <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
