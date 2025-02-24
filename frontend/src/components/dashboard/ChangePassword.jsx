//src/components/dashboard/ChangePassword.jsx
//import React from 'react';

const ChangePassword = () => {
    return (
        <div className='p-4 bg-white'>
            <h2 className='text-xl text-gray-600 pb-5'>Change Password </h2>
        
        <form>
            <div className='flex flex-col gap-1 mb-2'>
                <label htmlFor="old_password">Old Password</label>
            <input className='outline-none px-3 py-1 border rounded-md text-gray-600' type="password" name="old_password" id="old_password"  placeholder='Old Password'/>
            </div>

            <div className='flex flex-col gap-1 mb-2'>
                <label htmlFor="new_password">New Password</label>
            <input className='outline-none px-3 py-1 border rounded-md text-gray-600' type="password" name="new_password" id="new_password"  placeholder='New Password'/>
            </div>

            <div className='flex flex-col gap-1 mb-2'>
                <label htmlFor="confirm_password">Confirm Password</label>
            <input className='outline-none px-3 py-1 border rounded-md text-gray-600' type="password" name="confirm_password" id="confirm_password"  placeholder='Confirm Password'/>
            </div>
            <div>
                <button className='px-8 py-2 bg-orange-500 text-white rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out hover:bg-red-500'>Update Password </button>
            </div>


        </form>

        </div>
    );
};

export default ChangePassword;