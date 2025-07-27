//src\views\seller\Profile.jsx
import { useEffect, useState } from 'react';
import { FaImages } from "react-icons/fa6";
import { FadeLoader } from 'react-spinners';
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { profile_image_upload, messageClear, profile_info_add } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils'; 
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';

const Profile = () => {

    const [state, setState] = useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: '' 
    });

    const dispatch = useDispatch();
    const { userInfo, loader, successMessage } = useSelector(state => state.auth);
  

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            messageClear(); 
        } 
    }, [successMessage]);

    const add_image = (e) => {
        if (e.target.files.length > 0) { 
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            dispatch(profile_image_upload(formData));
        }
    };

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const add = (e) => {
        e.preventDefault();
        dispatch(profile_info_add(state));
    };

    return (
        <div className='px-4 lg:px-10 py-6'>
            <div className='w-full flex flex-wrap gap-8'>
                <div className='w-full md:w-6/12'>
                    <div className='w-full p-6 bg-white shadow-md rounded-lg text-black'>
                        <div className='flex justify-center items-center py-4'>
                            {
                                userInfo?.image ? <label htmlFor="img" className='h-40 w-52 relative p-4 cursor-pointer overflow-hidden'>
                                    <img src={userInfo.image} alt="Profile" className='rounded-md' />
                                    {
                                        loader && <div className='bg-black absolute left-0 top-0 w-full h-full opacity-60 flex justify-center items-center z-20'>
                                            <FadeLoader />
                                        </div>
                                    }
                                </label> : <label className='flex flex-col justify-center items-center h-40 w-52 cursor-pointer border-2 border-dashed hover:border-indigo-500 text-gray-500 relative' htmlFor="img">
                                    <FaImages className='text-3xl' />
                                    <span>Select Image</span>
                                    {
                                        loader && <div className='bg-black absolute left-0 top-0 w-full h-full opacity-60 flex justify-center items-center z-20'>
                                            <FadeLoader />
                                        </div>
                                    }
                                </label>
                            }
                            <input onChange={add_image} type="file" className='hidden' id='img' /> 
                        </div>

                        <div className='px-4 py-3'>
                            <div className='bg-gray-100 p-5 rounded-lg relative'>
                                <span className='p-2 bg-yellow-500 rounded-full text-white hover:shadow-lg hover:shadow-yellow-500/50 absolute right-4 top-4 cursor-pointer'><FaRegEdit /></span>
                                <div className='mb-2'>
                                    <span className='font-medium'>Name: </span>
                                    <span>{userInfo.name}</span> 
                                </div>
                                <div className='mb-2'>
                                    <span className='font-medium'>Email: </span>
                                    <span>{userInfo.email}</span> 
                                </div>
                                <div className='mb-2'>
                                    <span className='font-medium'>Role: </span>
                                    <span>{userInfo.role}</span> 
                                </div>
                                <div className='mb-2'>
                                    <span className='font-medium'>Status: </span>
                                    <span>{userInfo.status}</span> 
                                </div>
                                <div className='mb-2'>
                                    <span className='font-medium'>Payment Account: </span>
                                    {
                                        userInfo.payment === 'active' ? <span className='bg-green-500 text-white text-xs px-2 py-1 rounded ml-2'>{userInfo.payment}</span> : <span onClick={() => dispatch(create_stripe_connect_account())} className='bg-blue-500 text-white text-xs px-2 py-1 rounded ml-2 cursor-pointer'>Activate</span>
                                    }
                                </div> 
                            </div> 
                        </div>

                        <div className='px-4 py-3'>
                            {
                                !userInfo?.shopInfo ? <form onSubmit={add} className='space-y-4'>
                                    <div>
                                        <label htmlFor="Shop" className='block mb-1 font-medium'>Shop Name</label>
                                        <input value={state.shopName} onChange={inputHandle} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200' type="text" name='shopName' id='Shop' placeholder='Shop Name' />
                                    </div>  

                                    <div>
                                        <label htmlFor="division" className='block mb-1 font-medium'>Division Name</label>
                                        <input value={state.division} onChange={inputHandle} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200' type="text" name='division' id='division' placeholder='Division Name' />
                                    </div>  

                                    <div>
                                        <label htmlFor="district" className='block mb-1 font-medium'>District Name</label>
                                        <input value={state.district} onChange={inputHandle} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200' type="text" name='district' id='district' placeholder='District Name' />
                                    </div>  

                                    <div>
                                        <label htmlFor="sub" className='block mb-1 font-medium'>Sub District Name</label>
                                        <input value={state.sub_district} onChange={inputHandle} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200' type="text" name='sub_district' id='sub' placeholder='Sub District Name' />
                                    </div>  

                                    <button disabled={loader} className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none'>
                                        { loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Save Changes' }
                                    </button>
                                </form> : <div className='bg-gray-100 p-5 rounded-lg'>
                                    <div className='mb-2'>
                                        <span className='font-medium'>Shop Name: </span>
                                        <span>{userInfo.shopInfo?.shopName}</span> 
                                    </div>
                                    <div className='mb-2'>
                                        <span className='font-medium'>Division: </span>
                                        <span>{userInfo.shopInfo?.division}</span> 
                                    </div>
                                    <div className='mb-2'>
                                        <span className='font-medium'>District: </span>
                                        <span>{userInfo.shopInfo?.district}</span> 
                                    </div>
                                    <div className='mb-2'>
                                        <span className='font-medium'>Sub District: </span>
                                        <span>{userInfo.shopInfo?.sub_district}</span> 
                                    </div>
                                </div>
                            }
                        </div>
                    </div> 
                </div>

                <div className='w-full md:w-6/12'>
                    <div className='p-6 bg-indigo-50 shadow-md rounded-lg'>
                        <h1 className='text-indigo-800 text-lg mb-4 font-semibold'>Change Password</h1>
                        <form className='space-y-4'>
                            <div>
                                <label htmlFor="email" className='block mb-1 font-medium text-gray-700'>Email</label>
                                <input className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200' type="email" name='email' id='email' placeholder='Email' />
                            </div>  

                            <div>
                                <label htmlFor="o_password" className='block mb-1 font-medium text-gray-700'>Old Password</label>
                                <input className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200' type="password" name='old_password' id='o_password' placeholder='Old Password' />
                            </div>  

                            <div>
                                <label htmlFor="n_password" className='block mb-1 font-medium text-gray-700'>New Password</label>
                                <input className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200' type="password" name='new_password' id='n_password' placeholder='New Password' />
                            </div>   

                            <button className='w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none'>Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
