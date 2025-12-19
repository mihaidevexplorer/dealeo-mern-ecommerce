//src/views/auth/AdminLogin.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { admin_login, messageClear } from "../../store/Reducers/authReducer";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader } = useSelector((state) => state.auth);

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const overrideStyle = {
    display: "flex",
    margin: "0 auto",
    height: "24px",
    justifyContent: "center",
    alignItems: "center",
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const data = await dispatch(admin_login(state)).unwrap();
      toast.success(data.message || "Login successful", { id: "admin-login-success" });

      // IMPORTANT: trimite admin pe ruta lui
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.error || "Login failed", { id: "admin-login-error" });
      dispatch(messageClear());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-[400px] bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" className="w-32 h-auto" alt="Logo" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Admin Login
        </h2>

        <form onSubmit={submit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 mb-1">
              Email
            </label>
            <input
              onChange={inputHandle}
              value={state.email}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300 outline-none"
              type="email"
              name="email"
              placeholder="Enter your email"
              id="email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 mb-1">
              Password
            </label>
            <input
              onChange={inputHandle}
              value={state.password}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300 outline-none"
              type="password"
              name="password"
              placeholder="Enter your password"
              id="password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loader}
            className={`w-full py-2 text-white font-bold rounded-md ${
              loader ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loader ? <PropagateLoader color="#fff" cssOverride={overrideStyle} /> : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Forgot Password?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Reset it
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

