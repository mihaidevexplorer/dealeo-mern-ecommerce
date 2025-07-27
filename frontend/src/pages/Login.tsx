// src/pages/Login.tsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaFacebookF, FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../store/useAuthStore';
import { FadeLoader } from 'react-spinners';
import type { LoginData } from '../types';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: login, isPending } = useLogin();
    const { userInfo, clearMessages } = useAuthStore();

    const [state, setState] = useState<LoginData>({ 
        email: '',
        password: ''
    });

    const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };
 
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearMessages();
        login(state);
    };

    useEffect(() => { 
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    return (
        <div>
            {isPending && (
                <div className='w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]'>
                    <FadeLoader />
                </div>
            )}
            <Header />
            <div className='bg-slate-200 mt-4'>
                <div className='w-full justify-center items-center p-10'>
                    <div className='grid grid-cols-2 w-[60%] mx-auto bg-white rounded-md'>
                        <div className='px-8 py-8'>
                            <h2 className='text-center w-full text-xl text-slate-600 font-bold'>Login</h2> 

                            <div>
                                <form onSubmit={handleLogin} className='text-slate-600'>
                                    <div className='flex flex-col gap-1 mb-2'>
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            onChange={inputHandle} 
                                            value={state.email}  
                                            className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md' 
                                            type="email" 
                                            name="email" 
                                            id="email" 
                                            placeholder='Email' 
                                            required 
                                        />
                                    </div>

                                    <div className='flex flex-col gap-1 mb-2'>
                                        <label htmlFor="password">Password</label>
                                        <input 
                                            onChange={inputHandle} 
                                            value={state.password}  
                                            className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-green-500 rounded-md' 
                                            type="password" 
                                            name="password" 
                                            id="password" 
                                            placeholder='Password' 
                                            required 
                                        />
                                    </div>

                                    <button className='px-8 w-full py-2 bg-[#059473] shadow-lg hover:shadow-green-500/40 text-white rounded-md'>Login</button>
                                </form>

                                <div className='flex justify-center items-center py-2'>
                                    <div className='h-[1px] bg-slate-300 w-[95%]'></div>
                                    <span className='px-3 text-slate-600'>Or</span>
                                    <div className='h-[1px] bg-slate-300 w-[95%]'></div>
                                </div>

                                <button className='px-8 w-full py-2 bg-indigo-500 shadow hover:shadow-indigo-500/50 text-white rounded-md flex justify-center items-center gap-2 mb-3'>
                                    <span><FaFacebookF /></span>
                                    <span>Login With Facebook</span>
                                </button>

                                <button className='px-8 w-full py-2 bg-red-500 shadow hover:shadow-red-500/50 text-white rounded-md flex justify-center items-center gap-2 mb-3'>
                                    <span><FaGoogle /></span>
                                    <span>Login With Google</span>
                                </button> 
                            </div>    

                            <div className='text-center text-slate-600 pt-1'>
                                <p>Don&apos;t Have An Account? <Link className='text-blue-500' to='/register'>Register</Link></p>
                            </div> 

                            <a target='_blank' href="http://localhost:3001/login" rel="noreferrer">
                                <div className='px-8 w-full py-2 bg-[#02e3e0] shadow hover:shadow-red-500/50 text-white rounded-md flex justify-center items-center gap-2 mb-3'>
                                    Login As a Seller
                                </div>
                            </a>
         
                            <a target='_blank' href="http://localhost:3001/register" rel="noreferrer">
                                <div className='px-8 w-full py-2 bg-[#ad2cc4] shadow hover:shadow-red-500/50 text-white rounded-md flex justify-center items-center gap-2 mb-3'>
                                    Register As a Seller
                                </div>
                            </a>
                        </div> 

                        <div className='w-full h-full py-4 pr-4'>
                            <img src="http://localhost:3000/images/login.jpg" alt="" />
                        </div>    
                    </div>
                </div>
            </div>        
            <Footer />
        </div>
    );
};

export default Login;//Modificat