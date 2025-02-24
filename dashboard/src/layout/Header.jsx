//src/layout/Header.jsx
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = ({ showSidebar, setShowSidebar }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="fixed top-0 left-0 w-full py-5 px-4 lg:px-8 z-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-lg">
      <div className="ml-0 lg:ml-[260px] h-[70px] flex justify-between items-center bg-white rounded-lg px-6 shadow-md transition-all">
        {/* Sidebar Toggle Button */}
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-[40px] h-[40px] flex lg:hidden items-center justify-center bg-indigo-600 text-white rounded-full shadow-md hover:shadow-lg hover:bg-indigo-700 cursor-pointer transition"
        >
          <FaList size={20} />
        </div>

        {/* Search Input */}
        <div className="hidden md:block flex-1 mx-6">
          <input
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            type="text"
            name="search"
            placeholder="Search..."
          />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-800">{userInfo.name}</h2>
            <span className="text-sm text-gray-500">{userInfo.role}</span>
          </div>
          <div className="w-[50px] h-[50px]">
            <img
              className="w-full h-full rounded-full object-cover border-2 border-indigo-500 shadow-md"
              src={
                userInfo.role === "admin"
                  ? "http://localhost:3000/images/admin.jpg"
                  : userInfo.image
              }
              alt="User Avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
