//src\views\auth\Register.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { seller_register, messageClear } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loader, successMessage, errorMessage } = useSelector(state => state.auth);

    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(seller_register(state));
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            <div className="bg-white shadow-lg rounded-lg p-6 w-[400px]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Create an Account</h2>
                <p className="text-sm text-gray-600 mb-6">Sign up to start your journey!</p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={state.name}
                            onChange={inputHandle}
                            placeholder="Your full name"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={state.email}
                            onChange={inputHandle}
                            placeholder="Your email address"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={state.password}
                            onChange={inputHandle}
                            placeholder="Choose a secure password"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="checkbox"
                            name="checkbox"
                            required
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="checkbox" className="ml-2 text-sm text-gray-700">
                            I agree to the <a href="#" className="text-purple-500 underline">privacy policy</a> and <a href="#" className="text-purple-500 underline">terms</a>.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loader}
                        className={`w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition ${
                            loader ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loader ? <PropagateLoader color="#fff" cssOverride={overrideStyle} /> : "Sign Up"}
                    </button>
                </form>

                <div className="flex items-center mt-6 text-gray-700 justify-center">
                    Already have an account? <Link to="/login" className="ml-2 text-purple-500 font-semibold">Sign In</Link>
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <span className="w-1/3 border-b"></span>
                    <span className="mx-2 text-gray-500 text-sm">Or</span>
                    <span className="w-1/3 border-b"></span>
                </div>

                <div className="mt-6 flex gap-4 justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        <FaGoogle /> Google
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        <FaFacebook /> Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
