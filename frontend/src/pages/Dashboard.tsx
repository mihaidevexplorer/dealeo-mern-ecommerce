//src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaList } from 'react-icons/fa';
import { IoIosHome } from "react-icons/io";
import { FaBorderAll } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { useMutation } from '@tanstack/react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCardStore';
import api from '../api/api';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const Dashboard: React.FC = () => {
  const [filterShow, setFilterShow] = useState<boolean>(false);
  const navigate = useNavigate();

  // Access stores directly
  const authStore = useAuthStore();
  const cartStore = useCartStore();

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/customer/logout');
      return data;
    },
    onSuccess: () => {
      console.log('Logout successful');
    },
    onError: (error: unknown) => {
      console.log((error as ApiError)?.response?.data);
    }
  });

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
      localStorage.removeItem('customerToken');
      authStore.logout();
      cartStore.resetCount();
      navigate('/login');
    } catch (error) {
      console.log((error as ApiError)?.response?.data);
    }
  };

  return (
    <div>
      <Header />

      <div className='bg-slate-200 mt-5'>
        {/* Container */}
        <div className='w-full max-w-7xl mx-auto px-4 lg:px-6'>
          {/* Mobile toggle */}
          <div className='md-lg:block hidden pt-4'>
            <button
              onClick={() => setFilterShow(!filterShow)}
              className='inline-flex items-center justify-center w-11 h-11 rounded-lg bg-green-500 hover:bg-green-600 transition-colors text-white shadow'
              aria-label="Toggle dashboard menu"
            >
              <FaList />
            </button>
          </div>

          {/* Layout */}
          <div className='py-6 relative flex md-lg:flex-col gap-6'>
            {/* Backdrop for mobile drawer */}
            <div
              onClick={() => setFilterShow(false)}
              className={`md-lg:block hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
                filterShow ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            />

            {/* Sidebar */}
            <aside
              className={`
                z-50 bg-white rounded-2xl shadow-xl border border-white/60
                w-[270px] md-lg:w-[300px]
                md-lg:fixed md-lg:top-0 md-lg:h-screen md-lg:overflow-y-auto
                transition-all duration-300
                ${filterShow ? 'md-lg:left-0' : 'md-lg:-left-[320px]'}
              `}
            >
              {/* Sidebar header (mobile) */}
              <div className='md-lg:flex hidden items-center justify-between px-5 py-4 border-b'>
                <h2 className='font-bold text-gray-800'>Dashboard</h2>
                <button
                  onClick={() => setFilterShow(false)}
                  className='text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700'
                >
                  Close
                </button>
              </div>

              <ul className='py-4 text-slate-700 px-5 space-y-1'>
                <li>
                  <Link
                    to='/dashboard'
                    className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors'
                    onClick={() => setFilterShow(false)}
                  >
                    <span className='text-lg'><IoIosHome /></span>
                    <span className='font-medium'>Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to='/dashboard/my-orders'
                    className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors'
                    onClick={() => setFilterShow(false)}
                  >
                    <span className='text-lg'><FaBorderAll /></span>
                    <span className='font-medium'>My Orders</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to='/dashboard/my-wishlist'
                    className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors'
                    onClick={() => setFilterShow(false)}
                  >
                    <span className='text-lg'><FaHeart /></span>
                    <span className='font-medium'>Wishlist</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to='/dashboard/chat'
                    className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors'
                    onClick={() => setFilterShow(false)}
                  >
                    <span className='text-lg'><IoChatbubbleEllipsesSharp /></span>
                    <span className='font-medium'>Chat</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to='/dashboard/change-password'
                    className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors'
                    onClick={() => setFilterShow(false)}
                  >
                    <span className='text-lg'><RiLockPasswordLine /></span>
                    <span className='font-medium'>Change Password</span>
                  </Link>
                </li>

                <li className='pt-2'>
                  <button
                    onClick={logout}
                    className='w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left'
                    disabled={logoutMutation.isPending}
                  >
                    <span className='text-lg text-red-600'><IoMdLogOut /></span>
                    <span className='font-medium text-red-700'>
                      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </span>
                  </button>
                </li>
              </ul>
            </aside>

            {/* Content */}
            <main className='flex-1 md-lg:w-full'>
              <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-4 sm:p-3'>
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
