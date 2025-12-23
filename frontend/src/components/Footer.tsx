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
      <div className="max-w-7xl mx-auto px-6 xl:px-5 lg:px-4 md:px-4 sm:px-3 xs:px-2 py-14 xl:py-12 lg:py-10 md:py-9 sm:py-8 xs:py-7 2xs:py-6">
        <div className="grid grid-cols-12 gap-10 xl:gap-9 lg:gap-8 md:gap-7 sm:gap-6 xs:gap-5 2xs:gap-4">
          {/* Brand */}
          <div className="col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-12">
            <div className="flex flex-col gap-4 lg:items-start md:items-center md:text-center">
              <img
                className="w-[180px] sm:w-[160px] xs:w-[150px] 2xs:w-[140px] h-auto md:mx-auto"
                src="/images/logo.png"
                alt="DealEO logo"
                loading="lazy"
              />

              <ul className="text-sm xs:text-xs text-gray-600 space-y-2 leading-relaxed md:text-center">
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
              <ul className="flex items-center gap-3 xs:gap-2 pt-2 flex-wrap md:justify-center">
                <li>
                  <a
                    className="w-10 h-10 xs:w-9 xs:h-9 2xs:w-8 2xs:h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-[#ff7f50] hover:text-white hover:border-[#ff7f50] transition-colors"
                    href="#"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-4 h-4 xs:w-[14px] xs:h-[14px] 2xs:w-3 2xs:h-3" />
                  </a>
                </li>
                <li>
                  <a
                    className="w-10 h-10 xs:w-9 xs:h-9 2xs:w-8 2xs:h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-[#ff7f50] hover:text-white hover:border-[#ff7f50] transition-colors"
                    href="#"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="w-4 h-4 xs:w-[14px] xs:h-[14px] 2xs:w-3 2xs:h-3" />
                  </a>
                </li>
                <li>
                  <a
                    className="w-10 h-10 xs:w-9 xs:h-9 2xs:w-8 2xs:h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-[#ff7f50] hover:text-white hover:border-[#ff7f50] transition-colors"
                    href="#"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="w-4 h-4 xs:w-[14px] xs:h-[14px] 2xs:w-3 2xs:h-3" />
                  </a>
                </li>
                <li>
                  <a
                    className="w-10 h-10 xs:w-9 xs:h-9 2xs:w-8 2xs:h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-[#ff7f50] hover:text-white hover:border-[#ff7f50] transition-colors"
                    href="#"
                    aria-label="GitHub"
                  >
                    <FaGithub className="w-4 h-4 xs:w-[14px] xs:h-[14px] 2xs:w-3 2xs:h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-12">
            <h3 className="text-base font-bold text-gray-900 mb-4 xs:mb-3 md:text-center">
              Useful Links
            </h3>

            <div className="grid grid-cols-2 gap-8 lg:gap-7 sm:grid-cols-1 sm:gap-5 xs:gap-4 md:justify-items-center">
              <ul className="space-y-2 text-sm xs:text-xs md:text-center">
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

              <ul className="space-y-2 text-sm xs:text-xs md:text-center">
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
          <div className="col-span-4 xl:col-span-4 lg:col-span-12 md:col-span-12">
            <h3 className="text-base font-bold text-gray-900 mb-4 xs:mb-3 md:text-center">
              Join Our Shop
            </h3>
            <p className="text-sm xs:text-xs text-gray-600 mb-4 xs:mb-3 md:text-center">
              Get email updates about our latest products and special offers.
            </p>

            <div className="flex items-center w-full h-12 rounded-lg border border-gray-200 bg-white overflow-hidden lg:max-w-[520px] lg:mx-auto xs:flex-col xs:h-auto xs:items-stretch xs:rounded-xl">
              <input
                className="h-full w-full px-4 xs:px-3 text-sm outline-none xs:h-11"
                type="email"
                placeholder="Enter your email"
              />
              <button
                type="button"
                className="h-full px-5 bg-[#ff7f50] text-white text-sm font-bold uppercase hover:bg-[#ff6347] transition-colors xs:h-11 xs:w-full xs:px-4"
              >
                Subscribe
              </button>
            </div>

            <p className="text-xs 2xs:text-[11px] text-gray-500 mt-3 md:text-center">
              By subscribing, you agree to receive marketing emails.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 xl:px-5 lg:px-4 sm:px-3 xs:px-2 py-5 sm:py-4 xs:py-3 text-center text-sm xs:text-xs text-gray-500">
          <span>Copiright @ 2024 All Rights Reserved </span>
        </div>
      </div>

      {/* Mobile floating actions */}
      <div className="hidden md-lg:block fixed bottom-3 right-3 xs:bottom-2 xs:right-2 z-50">
        <div className="bg-white border border-gray-200 shadow-lg rounded-full p-2 xs:p-1.5 2xs:p-1 w-[56px] xs:w-[52px] 2xs:w-[48px]">
          <div className="flex flex-col gap-3 xs:gap-2 items-center">
            <button
              type="button"
              onClick={() => navigate(userInfo ? "/card" : "/login")}
              className="relative w-10 h-10 xs:w-9 xs:h-9 2xs:w-8 2xs:h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              aria-label="Cart"
            >
              <FaCartShopping className="w-5 h-5 xs:w-4 xs:h-4 2xs:w-[14px] 2xs:h-[14px] text-gray-800" />
              {cartProductCount !== 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] xs:min-w-[16px] xs:h-[16px] 2xs:min-w-[14px] 2xs:h-[14px] px-1 rounded-full bg-red-500 text-white text-xs xs:text-[10px] 2xs:text-[9px] flex items-center justify-center">
                  {cartProductCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(userInfo ? "/dashboard/my-wishlist" : "/login")}
              className="relative w-10 h-10 xs:w-9 xs:h-9 2xs:w-8 2xs:h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              aria-label="Wishlist"
            >
              <FaHeart className="w-5 h-5 xs:w-4 xs:h-4 2xs:w-[14px] 2xs:h-[14px] text-gray-800" />
              {wishlistCount !== 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] xs:min-w-[16px] xs:h-[16px] 2xs:min-w-[14px] 2xs:h-[14px] px-1 rounded-full bg-red-500 text-white text-xs xs:text-[10px] 2xs:text-[9px] flex items-center justify-center">
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
