// src/components/Header.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { EnvelopeIcon, PhoneIcon, HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { FaFacebookF, FaList, FaLock, FaUser, FaPhoneAlt, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useGetCartProducts, useGetWishlistProducts, useCartState } from '../hooks/useCard';
import { useAuthState } from '../hooks/useAuth';
import { useGetCategories } from '../hooks/useHome';

interface Category {
  _id: string;
  name: string;
  image: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { userInfo } = useAuthState();
  const { cartProductCount, wishlistCount } = useCartState();

  const { data: categoriesData } = useGetCategories();
  const categories: Category[] = useMemo(() => categoriesData?.categorys || [], [categoriesData]);

  // IMPORTANT: nu declanșa fetch pe fiecare render (mai ales pe mobile)
  // Presupunere: hooks-urile tale nu trebuie chemate condițional. Dacă ele fac fetch imediat,
  // ar trebui să ignore id-ul gol intern. Aici mă asigur că le dau id doar când există.
  const userId = userInfo?.id ?? '';

  useEffect(() => {
    if (!userId) return;
    // Dacă aceste hooks sunt implementate ca "funcții" care fac fetch, e ok.
    // Dacă sunt hooks reale care pornesc fetch la mount, ele ar trebui să fie idempotente.
    useGetCartProducts(userId);
    useGetWishlistProducts(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const [showShidebar, setShowShidebar] = useState<boolean>(true); // true = ascuns
  const [categoryShow, setCategoryShow] = useState<boolean>(true); // true = închis
  const [searchValue, setSearchValue] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const search = (): void => {
    navigate(`/products/search?category=${encodeURIComponent(category)}&&value=${encodeURIComponent(searchValue)}`);
  };

  const redirect_card_page = (): void => {
    navigate(userInfo ? '/card' : '/login');
  };

  const openSidebar = () => setShowShidebar(false);
  const closeSidebar = () => setShowShidebar(true);

  return (
    <div className="w-full bg-white">
      {/* TOP BAR (hidden pe md-lg conform design-ului tău) */}
      <div className="header-top bg-gradient-to-r from-orange-400 to-orange-500 md-lg:hidden">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="flex w-full justify-between items-center h-[45px] text-white">
            <ul className="flex justify-start items-center gap-8 text-sm">
              <li className="flex relative justify-center items-center gap-2 after:absolute after:h-[18px] after:w-[1px] after:bg-white/30 after:-right-[16px]">
                <EnvelopeIcon className="w-5 h-5" />
                <span>support@gmail.com</span>
              </li>
              <li className="flex relative justify-center items-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                <span>+(123) 3243 343</span>
              </li>
            </ul>

            <div className="flex justify-center items-center gap-10">
              <div className="flex justify-center items-center gap-4">
                <a href="#" className="hover:scale-110 transition-transform"><FaFacebookF className="text-white w-4 h-4" /></a>
                <a href="#" className="hover:scale-110 transition-transform"><FaTwitter className="text-white w-4 h-4" /></a>
                <a href="#" className="hover:scale-110 transition-transform"><FaLinkedin className="text-white w-4 h-4" /></a>
                <a href="#" className="hover:scale-110 transition-transform"><FaGithub className="text-white w-4 h-4" /></a>
              </div>

              <div className="flex group cursor-pointer text-white text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-white/30 after:-right-[16px] after:absolute before:absolute before:h-[18px] before:bg-white/30 before:w-[1px] before:-left-[20px]">
                <img src="/images/english-uk.png" alt="" className="w-5 h-5 rounded-sm" />
                <span><IoMdArrowDropdown /></span>
                <ul className="absolute invisible top-12 rounded-md duration-200 text-white p-2 w-[120px] flex flex-col gap-2 group-hover:visible group-hover:top-8 bg-gray-800 shadow-lg z-10 transition-opacity">
                  <li className="flex items-center gap-2 hover:bg-gray-700 p-1 rounded">
                    <img src="/images/roman-md.png" alt="Română" className="w-5 h-5 rounded-sm" />
                    Română
                  </li>
                  <li className="flex items-center gap-2 hover:bg-gray-700 p-1 rounded">
                    <img src="/images/english-uk.png" alt="English" className="w-5 h-5 rounded-sm" />
                    English
                  </li>
                </ul>
              </div>

              {userInfo ? (
                <Link className="flex cursor-pointer justify-center items-center gap-2 text-sm text-white hover:text-gray-200" to="/dashboard">
                  <FaUser className="w-4 h-4" />
                  <span>{userInfo.name}</span>
                </Link>
              ) : (
                <Link to="/login" className="flex cursor-pointer justify-center items-center gap-2 text-sm text-white hover:text-gray-200">
                  <FaLock className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BAR */}
      <div className="bg-white shadow-sm">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="h-[80px] md-lg:h-[100px] flex justify-between items-center flex-wrap">
            <div className="md-lg:w-full w-3/12 md-lg:pt-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="block">
                  <img src="/images/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
                </Link>

                {/* mobile menu button (doar pe md-lg conform design-ului) */}
                <button
                  type="button"
                  aria-label="Open menu"
                  className="justify-center items-center w-[35px] h-[35px] bg-orange-500 text-white rounded cursor-pointer lg:hidden md-lg:flex xl:hidden hidden hover:bg-orange-600 transition-colors"
                  onClick={openSidebar}
                >
                  <span className="flex items-center justify-center"><FaList /></span>
                </button>
              </div>
            </div>

            <div className="md:lg:w-full w-9/12">
              <div className="flex justify-between md-lg:justify-center items-center flex-wrap pl-8">
                <ul className="flex justify-start items-start gap-8 text-sm font-semibold md-lg:hidden">
                  <li><Link to="/" className={`p-2 block transition-colors ${pathname === '/' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>HOME</Link></li>
                  <li><Link to="/shops" className={`p-2 block transition-colors ${pathname === '/shops' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>SHOP</Link></li>
                  <li><Link to="#" className={`p-2 block transition-colors ${pathname === '/blog' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>BLOG</Link></li>
                  <li><Link to="#" className={`p-2 block transition-colors ${pathname === '/about' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>ABOUT US</Link></li>
                  <li><Link to="#" className={`p-2 block transition-colors ${pathname === '/contact' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>CONTACT</Link></li>
                </ul>

                <div className="flex md-lg:hidden justify-center items-center gap-5">
                  <div className="flex justify-center gap-5">
                    <button
                      type="button"
                      aria-label="Wishlist"
                      onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')}
                      className="relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <HeartIcon className="w-6 h-6 text-gray-700 hover:text-orange-500 transition-colors" />
                      {wishlistCount !== 0 && (
                        <div className="w-[18px] h-[18px] absolute bg-orange-500 rounded-full text-white text-xs flex justify-center items-center -top-[2px] -right-[2px]">
                          {wishlistCount}
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      aria-label="Cart"
                      onClick={redirect_card_page}
                      className="relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ShoppingCartIcon className="w-6 h-6 text-gray-700 hover:text-orange-500 transition-colors" />
                      {cartProductCount !== 0 && (
                        <div className="w-[18px] h-[18px] absolute bg-orange-500 rounded-full text-white text-xs flex justify-center items-center -top-[2px] -right-[2px]">
                          {cartProductCount}
                        </div>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR (corect: fixed overlay + fixed panel + transform) */}
      <div className="hidden md-lg:block">
        <div
          onClick={closeSidebar}
          className={`fixed inset-0 bg-black/50 z-40 md-lg:block hidden transition-opacity duration-200
          ${showShidebar ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />

        <aside
          className={`fixed top-0 left-0 w-[300px] h-screen bg-white z-50 shadow-2xl md-lg:block hidden
          transform transition-transform duration-200 will-change-transform
          ${showShidebar ? '-translate-x-full' : 'translate-x-0'}`}
          aria-hidden={showShidebar}
        >
          <div className="py-6 px-8 overflow-y-auto h-full">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" onClick={closeSidebar}>
                <img src="/images/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={closeSidebar}
              >
                ✕
              </button>
            </div>

            <div className="flex justify-start items-center gap-6 mb-8">
              <div className="flex group cursor-pointer text-gray-800 text-sm justify-center items-center gap-1 relative">
                <img src="/images/english-uk.png" alt="English UK" className="w-5 h-5 rounded-sm" />
                <span><IoMdArrowDropdown /></span>
                <ul className="absolute invisible top-12 rounded-md duration-200 text-white p-2 w-[120px] flex flex-col gap-2 group-hover:visible group-hover:top-8 bg-gray-800 shadow-lg z-10 transition-opacity">
                  <li className="flex items-center gap-2 hover:bg-gray-700 p-1 rounded">
                    <img src="/images/roman-md.png" alt="Română" className="w-5 h-5 rounded-sm" />
                    Română
                  </li>
                  <li className="flex items-center gap-2 hover:bg-gray-700 p-1 rounded">
                    <img src="/images/english-uk.png" alt="English UK" className="w-5 h-5 rounded-sm" />
                    English
                  </li>
                </ul>
              </div>

              {userInfo ? (
                <Link className="flex cursor-pointer justify-center items-center gap-2 text-sm text-gray-700" to="/dashboard" onClick={closeSidebar}>
                  <FaUser className="w-4 h-4" />
                  <span>{userInfo.name}</span>
                </Link>
              ) : (
                <Link className="flex cursor-pointer justify-center items-center gap-2 text-sm text-gray-700" to="/login" onClick={closeSidebar}>
                  <FaLock className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            <ul className="flex flex-col justify-start items-start text-sm font-semibold mb-8">
              <li className="w-full"><Link to="/" onClick={closeSidebar} className={`py-3 block transition-colors ${pathname === '/' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>HOME</Link></li>
              <li className="w-full"><Link to="/shops" onClick={closeSidebar} className={`py-3 block transition-colors ${pathname === '/shops' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>SHOP</Link></li>
              <li className="w-full"><Link to="#" onClick={closeSidebar} className={`py-3 block transition-colors ${pathname === '/blog' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>BLOG</Link></li>
              <li className="w-full"><Link to="#" onClick={closeSidebar} className={`py-3 block transition-colors ${pathname === '/about' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>ABOUT US</Link></li>
              <li className="w-full"><Link to="#" onClick={closeSidebar} className={`py-3 block transition-colors ${pathname === '/contact' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>CONTACT</Link></li>
            </ul>

            <div className="flex justify-start items-center gap-4 mb-8">
              <a href="#" className="hover:scale-110 transition-transform"><FaFacebookF className="text-gray-600 hover:text-orange-500" /></a>
              <a href="#" className="hover:scale-110 transition-transform"><FaTwitter className="text-gray-600 hover:text-orange-500" /></a>
              <a href="#" className="hover:scale-110 transition-transform"><FaLinkedin className="text-gray-600 hover:text-orange-500" /></a>
              <a href="#" className="hover:scale-110 transition-transform"><FaGithub className="text-gray-600 hover:text-orange-500" /></a>
            </div>

            <div className="w-full flex justify-start gap-3 items-center mb-6">
              <div className="w-[45px] h-[45px] rounded-full flex bg-orange-100 justify-center items-center">
                <FaPhoneAlt className="text-orange-500" />
              </div>
              <div className="flex justify-end flex-col gap-1">
                <h2 className="text-sm font-semibold text-gray-800">+134343455</h2>
                <span className="text-xs text-gray-600">Support 24/7</span>
              </div>
            </div>

            <ul className="flex flex-col justify-start items-start gap-3 text-gray-700">
              <li className="flex justify-start items-center gap-2 text-sm">
                <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                <span>support@gmail.com</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CATEGORIES + SEARCH */}
      <div className="w-[85%] lg:w-[90%] mx-auto pb-4">
        <div className="flex w-full flex-wrap md-lg:gap-8">
          <div className="w-3/12 md-lg:w-full">
            <div className="bg-white relative">
              <button
                type="button"
                onClick={() => setCategoryShow(!categoryShow)}
                className={`h-[50px] ${categoryShow ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-orange-400 to-orange-500'}
                text-white flex w-full justify-between items-center px-5 gap-3 font-semibold cursor-pointer rounded-lg shadow-md hover:shadow-lg
                transition-shadow transition-colors duration-300`}
                aria-expanded={!categoryShow}
                aria-label="Toggle categories"
              >
                <div className="flex justify-center items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
                    <FaList className="text-sm" />
                  </div>
                  <span className="text-sm uppercase tracking-wide">All Categories</span>
                </div>
                <IoIosArrowDown className={`transition-transform duration-300 ${categoryShow ? '' : 'rotate-180'}`} />
              </button>

              {/* Dropdown: opacity + transform (nu height) */}
              <div
                className={`absolute left-0 top-full w-full bg-white rounded-b-lg shadow-xl z-50
                transition-opacity transition-transform duration-200
                ${categoryShow ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}
              >
                <div className="overflow-y-auto max-h-[400px] py-3">
                  <ul className="grid grid-cols-1 gap-1 px-2">
                    {categories.map((c) => (
                      <li key={c._id}>
                        <Link
                          to={`/products?category=${encodeURIComponent(c.name)}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg transition-colors duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                            <img
                              src={c.image}
                              className="w-full h-full object-cover"
                              alt={c.name}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <span className="text-gray-700 text-sm font-medium group-hover:text-orange-600 transition-colors">
                            {c.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <div className="w-9/12 pl-8 md-lg:pl-0 md-lg:w-full">
            <div className="flex flex-wrap w-full justify-between items-center md-lg:gap-6">
              <div className="w-8/12 md-lg:w-full">
                <div className="flex bg-gray-50 rounded-lg h-[50px] items-center shadow-md overflow-hidden border border-gray-200 focus-within:border-orange-400 transition-colors">
                  <div className="relative flex items-center">
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-[50px] px-4 bg-transparent text-gray-700 font-medium outline-none border-none appearance-none cursor-pointer pr-10"
                      value={category}
                    >
                      <option value="">All Categories</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <IoMdArrowDropdown className="absolute right-3 pointer-events-none text-gray-500" />
                    <div className="absolute h-[30px] w-[1px] bg-gray-300 -right-0" />
                  </div>

                  <input
                    className="flex-grow bg-transparent text-gray-700 px-4 h-full outline-none placeholder-gray-400"
                    onChange={(e) => setSearchValue(e.target.value)}
                    type="text"
                    value={searchValue}
                    placeholder="Search for products..."
                  />

                  <button
                    type="button"
                    onClick={search}
                    className="h-full px-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold uppercase text-sm
                    transition-colors duration-300 hover:from-orange-600 hover:to-orange-700"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="w-4/12 block md-lg:hidden pl-2 md-lg:w-full md-lg:pl-0">
                <div className="w-full flex justify-end md-lg:justify-start gap-3 items-center">
                  <div className="w-[48px] h-[48px] rounded-full flex bg-orange-100 justify-center items-center">
                    <FaPhoneAlt className="text-orange-500" />
                  </div>
                  <div className="flex justify-end flex-col gap-1">
                    <h2 className="text-md font-semibold text-gray-800">+1343-43233455</h2>
                    <span className="text-sm text-gray-600">Support 24/7</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Header;
