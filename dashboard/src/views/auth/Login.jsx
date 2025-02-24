//src\views\auth\Login.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { seller_login, messageClear } from '../../store/Reducers/authReducer';

const Login = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);

    const [state, setState] = useState({ 
        email: "",
        password: ""
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(seller_login(state));
    };

    useEffect(() => {

        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear()); 
            navigate('/'); 
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }

    }, [successMessage, errorMessage]);


    return (
        <div className='min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center'>
            <div className='w-[400px] bg-white p-8 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>Welcome Back</h2>
                <p className='text-sm text-gray-600 mb-6'>Sign in to your account to continue.</p>

                <form onSubmit={submit}>
                    <div className='mb-4'>
                        <label htmlFor="email" className='block text-gray-700 font-medium mb-2'>Email Address</label>
                        <input 
                            onChange={inputHandle} 
                            value={state.email} 
                            className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none' 
                            type="email" 
                            name='email' 
                            placeholder='Enter your email' 
                            id='email' 
                            required 
                        />
                    </div>

                    <div className='mb-6'>
                        <label htmlFor="password" className='block text-gray-700 font-medium mb-2'>Password</label>
                        <input 
                            onChange={inputHandle} 
                            value={state.password} 
                            className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none' 
                            type="password" 
                            name='password' 
                            placeholder='Enter your password' 
                            id='password' 
                            required 
                        />
                    </div>

                    <button 
                        disabled={loader} 
                        className={`w-full py-2 rounded-md text-white font-medium ${loader ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}>
                        {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sign In'}
                    </button>

                    <p className='text-sm text-center text-gray-600 mt-4'>
                    Don&#39;t have an account? <Link to="/register" className='text-blue-500 font-medium hover:underline'>Sign Up</Link>
                    </p>

                    <div className='flex items-center justify-between mt-6'>
                        <span className='block h-[1px] bg-gray-300 w-1/5'></span>
                        <span className='text-gray-500 text-sm'>Or continue with</span>
                        <span className='block h-[1px] bg-gray-300 w-1/5'></span>
                    </div>

                    <div className='flex justify-center gap-4 mt-6'>
                        <button 
                            type='button' 
                            className='w-1/2 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-red-500'>
                            <FaGoogle /> Google
                        </button>
                        <button 
                            type='button' 
                            className='w-1/2 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-blue-600'>
                            <FaFacebook /> Facebook
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
