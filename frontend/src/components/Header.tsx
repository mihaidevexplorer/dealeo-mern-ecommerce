// src/components/Header.tsx
import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { FaFacebookF, FaList, FaLock, FaUser } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
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
  const categories: Category[] = categoriesData?.categorys || [];

  useGetCartProducts(userInfo?.id || '');
  useGetWishlistProducts(userInfo?.id || '');

  const [showShidebar, setShowShidebar] = useState<boolean>(true);
  const [categoryShow, setCategoryShow] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const search = (): void => {
    navigate(`/products/search?category=${category}&&value=${searchValue}`);
  };

  const redirect_card_page = (): void => {
    if (userInfo) navigate('/card');
    else navigate('/login');
  };

  return (
    <div className='w-full bg-white'>
      {/* Top bar */}
      <div className='header-top bg-gradient-to-r from-orange-400 to-orange-500 md-lg:hidden'>
        <div className='w-full max-w-7xl px-4 lg:px-6 mx-auto'>
          <div className='flex w-full justify-between items-center h-[45px] text-white'>
            <ul className='flex justify-start items-center gap-8 text-sm'>
              <li className='flex relative justify-center items-center gap-2 after:absolute after:h-[18px] after:w-[1px] after:bg-white/30 after:-right-[16px]'>
                <EnvelopeIcon className="w-5 h-5" />
                <span>support@gmail.com</span>
              </li>
              <li className='flex relative justify-center items-center gap-2'>
                <PhoneIcon className="w-5 h-5" />
                <span>+(123) 3243 343</span>
              </li>
            </ul>

            <div className='flex justify-center items-center gap-10'>
              <div className='flex justify-center items-center gap-4'>
                <a href="#" className="hover:scale-110 transition-transform"><FaFacebookF className="text-white w-4 h-4" /></a>
                <a href="#" className="hover:scale-110 transition-transform"><FaTwitter className="text-white w-4 h-4" /></a>
                <a href="#" className="hover:scale-110 transition-transform"><FaLinkedin className="text-white w-4 h-4" /></a>
                <a href="#" className="hover:scale-110 transition-transform"><FaGithub className="text-white w-4 h-4" /></a>
              </div>

              <div className='flex group cursor-pointer text-white text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-white/30 after:-right-[16px] after:absolute before:absolute before:h-[18px] before:bg-white/30 before:w-[1px] before:-left-[20px]'>
                <img src="/images/english-uk.png" alt="" className="w-5 h-5 rounded-sm" />
                <span><IoMdArrowDropdown /></span>
                <ul className='absolute invisible transition-all top-12 rounded-md duration-200 text-white p-2 w-[120px] flex flex-col gap-2 group-hover:visible group-hover:top-8 bg-gray-800 shadow-lg z-10'>
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
                <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-white hover:text-gray-200' to='/dashboard'>
                  <FaUser className="w-4 h-4" />
                  <span>{userInfo.name}</span>
                </Link>
              ) : (
                <Link to='/login' className='flex cursor-pointer justify-center items-center gap-2 text-sm text-white hover:text-gray-200'>
                  <FaLock className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className='bg-white shadow-sm'>
        <div className='w-full max-w-7xl px-4 lg:px-6 mx-auto'>
          <div className='h-[80px] md-lg:h-[110px] flex justify-between items-center flex-wrap md-lg:gap-4'>
            <div className='md-lg:w-full w-3/12 md-lg:pt-4'>
              <div className='flex items-center justify-between'>
                <Link to='/' className='block'>
                  <img src="/images/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
                </Link>

                <div
                  className='justify-center items-center w-[35px] h-[35px] bg-orange-500 text-white rounded cursor-pointer lg:hidden md-lg:flex xl:hidden hidden hover:bg-orange-600 transition-colors'
                  onClick={() => setShowShidebar(false)}
                >
                  <span className='flex items-center justify-center'><FaList /></span>
                </div>
              </div>
            </div>

            <div className='md-lg:w-full w-9/12'>
              <div className='flex justify-between md-lg:justify-center items-center flex-wrap pl-8 md-lg:pl-0'>
                <ul className='flex justify-start items-start gap-8 text-sm font-semibold md-lg:hidden'>
                  <li>
                    <Link to='/' className={`p-2 block transition-colors ${pathname === '/' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>HOME</Link>
                  </li>
                  <li>
                    <Link to='/shops' className={`p-2 block transition-colors ${pathname === '/shops' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>SHOP</Link>
                  </li>
                  <li>
                    <Link to='#' className={`p-2 block transition-colors ${pathname === '/blog' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>BLOG</Link>
                  </li>
                  <li>
                    <Link to='#' className={`p-2 block transition-colors ${pathname === '/about' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>ABOUT US</Link>
                  </li>
                  <li>
                    <Link to='/contact' className={`p-2 block transition-colors ${pathname === '/contact' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>CONTACT</Link>
                  </li>
                </ul>

                <div className='flex md-lg:hidden justify-center items-center gap-5'>
                  <div className='flex justify-center gap-5'>
                    <div
                      onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')}
                      className='relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full hover:bg-gray-100 transition-colors'
                    >
                      <HeartIcon className="w-6 h-6 text-gray-700 hover:text-orange-500 transition-colors" />
                      {wishlistCount !== 0 && (
                        <div className='w-[18px] h-[18px] absolute bg-orange-500 rounded-full text-white text-xs flex justify-center items-center -top-[2px] -right-[2px]'>
                          {wishlistCount}
                        </div>
                      )}
                    </div>

                    <div
                      onClick={redirect_card_page}
                      className='relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full hover:bg-gray-100 transition-colors'
                    >
                      <ShoppingCartIcon className="w-6 h-6 text-gray-700 hover:text-orange-500 transition-colors" />
                      {cartProductCount !== 0 && (
                        <div className='w-[18px] h-[18px] absolute bg-orange-500 rounded-full text-white text-xs flex justify-center items-center -top-[2px] -right-[2px]'>
                          {cartProductCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className='hidden md-lg:block'>
        <div
          onClick={() => setShowShidebar(true)}
          className={`fixed duration-200 transition-all ${showShidebar ? 'invisible' : 'visible'} w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20`}
        />
        <div className={`w-[300px] z-[9999] transition-all duration-200 fixed ${showShidebar ? '-left-[300px]' : 'left-0 top-0'} overflow-y-auto bg-white h-screen py-6 px-8 shadow-2xl`}>
          <div className='mb-6'>
            <Link to='/'>
              <img src="/images/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            </Link>
          </div>

          <div className='flex justify-start items-center gap-6 mb-8'>
            <div className='flex group cursor-pointer text-gray-800 text-sm justify-center items-center gap-1 relative'>
              <img src="/images/english-uk.png" alt="English UK" className="w-5 h-5 rounded-sm" />
              <span><IoMdArrowDropdown /></span>
              <ul className='absolute invisible transition-all top-12 rounded-md duration-200 text-white p-2 w-[120px] flex flex-col gap-2 group-hover:visible group-hover:top-8 bg-gray-800 shadow-lg z-10'>
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
              <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-gray-700' to='/dashboard'>
                <FaUser className="w-4 h-4" />
                <span>{userInfo.name}</span>
              </Link>
            ) : (
              <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-gray-700' to='/login'>
                <FaLock className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          <ul className='flex flex-col justify-start items-start text-sm font-semibold mb-8'>
            <li className='w-full'>
              <Link to='/' className={`py-3 block transition-colors ${pathname === '/' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>HOME</Link>
            </li>
            <li className='w-full'>
              <Link to='/shops' className={`py-3 block transition-colors ${pathname === '/shops' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>SHOP</Link>
            </li>
            <li className='w-full'>
              <Link to='#' className={`py-3 block transition-colors ${pathname === '/blog' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>BLOG</Link>
            </li>
            <li className='w-full'>
              <Link to='#' className={`py-3 block transition-colors ${pathname === '/about' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>ABOUT US</Link>
            </li>
            <li className='w-full'>
              <Link to='#' className={`py-3 block transition-colors ${pathname === '/contact' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}>CONTACT</Link>
            </li>
          </ul>

          <div className='flex justify-start items-center gap-4 mb-8'>
            <a href="#" className="hover:scale-110 transition-transform"><FaFacebookF className="text-gray-600 hover:text-orange-500" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><FaTwitter className="text-gray-600 hover:text-orange-500" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><FaLinkedin className="text-gray-600 hover:text-orange-500" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><FaGithub className="text-gray-600 hover:text-orange-500" /></a>
          </div>

          <div className='w-full flex justify-start gap-3 items-center mb-6'>
            <div className='w-[45px] h-[45px] rounded-full flex bg-orange-100 justify-center items-center'>
              <FaPhoneAlt className="text-orange-500" />
            </div>
            <div className='flex justify-end flex-col gap-1'>
              <h2 className='text-sm font-semibold text-gray-800'>+134343455</h2>
              <span className='text-xs text-gray-600'>Support 24/7</span>
            </div>
          </div>

          <ul className='flex flex-col justify-start items-start gap-3 text-gray-700'>
            <li className='flex justify-start items-center gap-2 text-sm'>
              <EnvelopeIcon className="w-5 h-5 text-gray-600" />
              <span>support@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Categories and Search Section */}
      <div className='w-full max-w-7xl px-4 lg:px-6 mx-auto pb-4'>
        {/* IMPORTANT: pe desktop = fara gap (altfel se rupe), pe md-lg = gap + wrap */}
        <div className='flex w-full flex-nowrap md-lg:flex-wrap gap-0 md-lg:gap-8'>
          <div className='w-3/12 md-lg:w-full'>
            <div className='bg-white relative'>
              <div
                onClick={() => setCategoryShow(!categoryShow)}
                className={`h-[50px] ${categoryShow ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-orange-400 to-orange-500'} text-white flex justify-between items-center px-5 gap-3 font-semibold cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <div className='flex justify-center items-center gap-3'>
                  <div className='w-8 h-8 bg-white/20 rounded-md flex items-center justify-center'>
                    <FaList className="text-sm" />
                  </div>
                  <span className='text-sm uppercase tracking-wide'>All Categories</span>
                </div>
                <IoIosArrowDown className={`transition-transform duration-300 ${categoryShow ? 'rotate-180' : ''}`} />
              </div>

              <div className={`${categoryShow ? 'h-0' : 'max-h-[400px]'} overflow-hidden transition-all md-lg:relative duration-500 absolute z-[99999] bg-white w-full rounded-b-lg shadow-xl`}>
                <div className='overflow-y-auto max-h-[400px] py-3'>
                  <ul className='grid grid-cols-1 gap-1 px-2'>
                    {categories.map((c, i) => (
                      <li key={i}>
                        <Link
                          to={`/products?category=${c.name}`}
                          className='flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg transition-all duration-200 group'
                        >
                          <div className='w-10 h-10 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow'>
                            <img src={c.image} className='w-full h-full object-cover' alt={c.name} />
                          </div>
                          <span className='text-gray-700 text-sm font-medium group-hover:text-orange-600 transition-colors'>{c.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* IMPORTANT: padding pe desktop mic, pe md-lg zero */}
          <div className='w-9/12 md-lg:w-full pl-6 md-lg:pl-0'>
            {/* IMPORTANT: pe desktop = nowrap (Search + Support pe aceeasi linie) */}
            <div className='flex w-full items-center justify-between flex-nowrap md-lg:flex-wrap gap-4 md-lg:gap-6'>
              <div className='w-8/12 md-lg:w-full'>
                <div className='flex bg-gray-50 rounded-lg h-[50px] items-center shadow-md overflow-hidden border border-gray-200 focus-within:border-orange-400 transition-colors'>
                  <div className='relative flex items-center shrink-0'>
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      className='h-[50px] px-4 bg-transparent text-gray-700 font-medium outline-none border-none appearance-none cursor-pointer pr-10 sm:px-3'
                      value={category}
                    >
                      <option value="">All Categories</option>
                      {categories.map((c, i) => (
                        <option key={i} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <IoMdArrowDropdown className="absolute right-3 pointer-events-none text-gray-500" />
                    <div className="absolute h-[30px] w-[1px] bg-gray-300 -right-0"></div>
                  </div>

                  <input
                    className='flex-grow min-w-0 bg-transparent text-gray-700 px-4 sm:px-3 h-full outline-none placeholder-gray-400'
                    onChange={(e) => setSearchValue(e.target.value)}
                    type="text"
                    value={searchValue}
                    placeholder='Search for products...'
                  />

                  <button
                    onClick={search}
                    className='h-full px-8 sm:px-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold uppercase text-sm transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg'
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Support (desktop only) */}
              <div className='w-4/12 md-lg:hidden pl-2'>
                <div className='w-full flex justify-end gap-3 items-center'>
                  <div className='w-[48px] h-[48px] rounded-full flex bg-orange-100 justify-center items-center'>
                    <FaPhoneAlt className="text-orange-500" />
                  </div>
                  <div className='flex justify-end flex-col gap-1'>
                    <h2 className='text-md font-semibold text-gray-800'>+1343-43233455</h2>
                    <span className='text-sm text-gray-600'>Support 24/7</span>
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
