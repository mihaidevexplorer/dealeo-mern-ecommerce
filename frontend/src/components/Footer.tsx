// src/components/Footer.tsx
// src/components/Footer.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { useAuthState } from "../hooks/useAuth";
import { useCartState } from "../hooks/useCard";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuthState();
  const { cartProductCount, wishlistCount } = useCartState();

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-14">
        <div className="grid grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-12 lg:col-span-4">
            <div className="flex flex-col gap-4">
              <img
                className="w-[180px] h-auto"
                src="/images/logo.png"
                alt="DealEO logo"
                loading="lazy"
              />

              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <span className="font-semibold text-gray-800">Address:</span>{" "}
                  2504 Ivins Avenue, Egg Harbor Township, NJ 08234
                </li>
                <li>
                  <span className="font-semibold text-gray-800">Phone:</span>{" "}
                  4343434344
                </li>
                <li>
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  support@dealeo.com
                </li>
              </ul>

              {/* Socials */}
              <ul className="flex items-center gap-3 pt-2">
                <li>
                  <a
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-[#ff7f50] hover:text-white hover:border-[#ff7f50] transition-colors"
                    href="#"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-[#ff7f50] hover:text-white hover:border-[#ff7f50] transition-colors"
                    href="#"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-[#ff7f50] hover:text-white hover:border-[#ff7f50] transition-colors"
                    href="#"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-[#ff7f50] hover:text-white hover:border-[#ff7f50] transition-colors"
                    href="#"
                    aria-label="GitHub"
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-12 lg:col-span-4">
            <h3 className="text-base font-bold text-gray-900 mb-4">Useful Links</h3>

            <div className="grid grid-cols-2 gap-8">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="/shops">
                    About Our Shop
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="/delivery">
                    Delivery Information
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="/privacy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="/blog">
                    Blogs
                  </Link>
                </li>
              </ul>

              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="#">
                    Our Service
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="#">
                    Company Profile
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="#">
                    Delivery Information
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="#">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-gray-900 transition-colors" to="#">
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-12 lg:col-span-4">
            <h3 className="text-base font-bold text-gray-900 mb-4">Join Our Shop</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get email updates about our latest products and special offers.
            </p>

            <div className="flex items-center w-full h-12 rounded-lg border border-gray-200 bg-white overflow-hidden">
              <input
                className="h-full w-full px-4 text-sm outline-none"
                type="email"
                placeholder="Enter your email"
              />
              <button
                type="button"
                className="h-full px-5 bg-[#ff7f50] text-white text-sm font-bold uppercase hover:bg-[#ff6347] transition-colors"
              >
                Subscribe
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to receive marketing emails.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5 text-center text-sm text-gray-500">
          Copyright © {new Date().getFullYear()} DealEO. All rights reserved.
        </div>
      </div>

      {/* Mobile floating actions */}
      <div className="hidden md-lg:block fixed bottom-3 right-3 z-50">
        <div className="bg-white border border-gray-200 shadow-lg rounded-full p-2 w-[56px]">
          <div className="flex flex-col gap-3 items-center">
            <button
              type="button"
              onClick={() => navigate(userInfo ? "/card" : "/login")}
              className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              aria-label="Cart"
            >
              <FaCartShopping className="w-5 h-5 text-gray-800" />
              {cartProductCount !== 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {cartProductCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(userInfo ? "/dashboard/my-wishlist" : "/login")}
              className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              aria-label="Wishlist"
            >
              <FaHeart className="w-5 h-5 text-gray-800" />
              {wishlistCount !== 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
