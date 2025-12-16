// src/layout/MainLayout.jsx
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { socket } from '../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, updateSellers } from '../store/Reducers/chatReducer';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);

  const [showSidebar, setShowSidebar] = useState(false);

  // ✅ SAFE socket emit
  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.role === 'seller') {
      socket.emit('add_seller', userInfo._id, userInfo);
    } else {
      socket.emit('add_admin', userInfo);
    }
  }, [userInfo]);

  // ✅ SAFE socket listeners
  useEffect(() => {
    const handleCustomers = (customers) => {
      dispatch(updateCustomer(customers));
    };

    const handleSellers = (sellers) => {
      dispatch(updateSellers(sellers));
    };

    socket.on('activeCustomer', handleCustomers);
    socket.on('activeSeller', handleSellers);

    return () => {
      socket.off('activeCustomer', handleCustomers);
      socket.off('activeSeller', handleSellers);
    };
  }, [dispatch]);

  return (
    <div className="bg-[#FFF] w-full min-h-screen">
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className="ml-0 lg:ml-[260px] pt-[95px] transition-all">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
