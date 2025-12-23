//src/pages/Register.tsx
import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle } from "react-icons/fa6";
import { FadeLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRegister, useAuthState } from '../hooks/useAuth';
import type { RegisterData } from '../types';

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, loader, clearMessages } = useAuthState();
  const registerMutation = useRegister();

  const [state, setState] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: ''
  });

  const inputHandle = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegister = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!state.name.trim() || !state.email.trim() || !state.password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (state.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const registerData: RegisterData = {
      name: state.name.trim(),
      email: state.email.trim(),
      password: state.password
    };

    registerMutation.mutate(registerData);
  };

  const handleFacebookLogin = (): void => {
    toast('Facebook login coming soon!', { icon: 'ℹ️' });
  };

  const handleGoogleLogin = (): void => {
    toast('Google login coming soon!', { icon: 'ℹ️' });
  };

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, [clearMessages]);

  return (
    <div>
      {loader && (
        <div className='w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]'>
          <FadeLoader color="#059473" />
        </div>
      )}

      <Header />

      <div className='bg-slate-200 mt-4'>
        <div className='w-full flex justify-center items-center px-4 py-10 sm:py-8'>
          <div className='grid grid-cols-2 md-lg:grid-cols-1 w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden'>
            {/* Form */}
            <div className='px-8 py-8 sm:px-5 sm:py-6'>
              <h2 className='text-center w-full text-xl text-slate-600 font-bold mb-6'>
                Register
              </h2>

              <form onSubmit={handleRegister} className='text-slate-600'>
                <div className='flex flex-col gap-1 mb-4'>
                  <label htmlFor="name" className='font-medium'>Name</label>
                  <input
                    onChange={inputHandle}
                    value={state.name}
                    className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md transition-colors'
                    type="text"
                    name="name"
                    id="name"
                    placeholder='Enter your name'
                    required
                    disabled={loader}
                  />
                </div>

                <div className='flex flex-col gap-1 mb-4'>
                  <label htmlFor="email" className='font-medium'>Email</label>
                  <input
                    onChange={inputHandle}
                    value={state.email}
                    className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md transition-colors'
                    type="email"
                    name="email"
                    id="email"
                    placeholder='Enter your email'
                    required
                    disabled={loader}
                  />
                </div>

                <div className='flex flex-col gap-1 mb-6'>
                  <label htmlFor="password" className='font-medium'>Password</label>
                  <input
                    onChange={inputHandle}
                    value={state.password}
                    className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md transition-colors'
                    type="password"
                    name="password"
                    id="password"
                    placeholder='Enter your password'
                    required
                    minLength={6}
                    disabled={loader}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loader}
                  className='px-8 w-full py-2 bg-[#059473] shadow-lg hover:shadow-green-500/40 text-white rounded-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loader ? 'Registering...' : 'Register'}
                </button>
              </form>

              {/* Divider */}
              <div className='flex justify-center items-center py-4'>
                <div className='h-[1px] bg-slate-300 w-full'></div>
                <span className='px-3 text-slate-600'>Or</span>
                <div className='h-[1px] bg-slate-300 w-full'></div>
              </div>

              <button
                onClick={handleFacebookLogin}
                type="button"
                disabled={loader}
                className='px-8 w-full py-2 bg-indigo-500 shadow hover:shadow-indigo-500/50 text-white rounded-md flex justify-center items-center gap-2 mb-3 transition-shadow disabled:opacity-50'
              >
                <FaFacebookF />
                <span>Register With Facebook</span>
              </button>

              <button
                onClick={handleGoogleLogin}
                type="button"
                disabled={loader}
                className='px-8 w-full py-2 bg-red-500 shadow hover:shadow-red-500/50 text-white rounded-md flex justify-center items-center gap-2 mb-6 transition-shadow disabled:opacity-50'
              >
                <FaGoogle />
                <span>Register With Google</span>
              </button>

              <div className='text-center text-slate-600 pt-1 mb-4'>
                <p>
                  Already have an account?
                  <Link className='text-blue-500 hover:underline ml-1' to='/login'>
                    Login
                  </Link>
                </p>
              </div>

              <a target='_blank' href="/login" rel="noopener noreferrer">
                <div className='px-8 w-full py-2 bg-[#02e3e0] shadow hover:shadow-cyan-500/50 text-white rounded-md flex justify-center items-center gap-2 mb-3 transition-shadow'>
                  Login As a Seller
                </div>
              </a>

              <a target='_blank' href="/register" rel="noopener noreferrer">
                <div className='px-8 w-full py-2 bg-[#ad2cc4] shadow hover:shadow-purple-500/50 text-white rounded-md flex justify-center items-center gap-2 mb-3 transition-shadow'>
                  Register As a Seller
                </div>
              </a>
            </div>

            {/* Image */}
            <div className='w-full h-full md-lg:hidden'>
              <img
                src="/images/login.jpg"
                alt="Registration illustration"
                className='w-full h-full object-cover'
              />
            </div>

            {/* Mobile image (optional, smaller) */}
            <div className='hidden md-lg:block'>
              <div className='px-5 pb-6'>
                <img
                  src="/images/login.jpg"
                  alt="Registration illustration"
                  className='w-full max-h-[260px] object-cover rounded-xl'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
