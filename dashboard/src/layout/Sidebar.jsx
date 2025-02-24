//src/layout/Sidebar.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getNav } from "../navigation/index";
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Reducers/authReducer";
import logo from "../assets/logo.svg";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [allNav, setAllNav] = useState([]);
  
  useEffect(() => {
    const navs = getNav(role);
    setAllNav(navs);
  }, [role]);

  return (
    <div>
      {/* Overlay */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-300 ${
          !showSidebar ? "invisible opacity-0" : "visible opacity-100"
        } w-screen h-screen bg-black/30 top-0 left-0 z-10`}
      ></div>

      {/* Sidebar */}
      <div
        className={`w-[260px] fixed bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-700 z-50 top-0 h-screen shadow-lg text-white transition-all ${
          showSidebar ? "left-0" : "-left-[260px] lg:left-0"
        }`}
      >
        {/* Logo */}
        <div className="h-[100px] flex justify-center items-center border-b border-gray/20 bg-gradient-to-r from-purple-500 to-blue-500">
          <Link to="/" className="flex justify-center items-center p-2">
            <img className="logo h-[60px] w-auto object-contain" src={logo} alt="Logo" />
            <span className="text-3xl font-extrabold text-white ml-4 tracking-wide drop-shadow-md">DEALEO</span>
            
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-4 mt-6">
          <ul>
            {allNav.map((n, i) => (
              <li key={i}>
                <Link
                  to={n.path}
                  className={`${
                    pathname === n.path
                      ? "bg-white text-indigo-700 font-bold shadow-md"
                      : "text-white hover:bg-white/10"
                  } px-4 py-3 rounded-lg flex items-center gap-4 transition-all duration-300`}
                >
                  <span className="text-lg">{n.icon}</span>
                  <span>{n.title}</span>
                </Link>
              </li>
            ))}

            {/* Logout */}
            <li>
              <button
                onClick={() => dispatch(logout({ navigate, role }))}
                className="text-white hover:bg-white/10 px-4 py-3 rounded-lg flex items-center gap-4 transition-all duration-300 w-full"
              >
                <span className="text-lg">
                  <BiLogOutCircle />
                </span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
