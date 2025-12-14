//src/router/routes/publicRoutes.js
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Login = lazy(() => import("../../views/auth/Login"));
const Register = lazy(() => import("../../views/auth/Register"));
const ForgotPassword = lazy(() => import("../../views/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../../views/auth/ResetPassword"));
const Home = lazy(() => import("../../views/Home"));

const publicRoutes = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />
  },

  }
];

export default publicRoutes;

