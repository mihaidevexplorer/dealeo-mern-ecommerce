// src/router/routes/index.jsx
import { privateRoutes } from "./privateRoutes";
import MainLayout from "../../layout/MainLayout";
import ProtectRoute from "./ProtectRoute";

const wrapRoutes = (routes) =>
  routes.map((r) => {
    const wrapped = {
      ...r,
      element: <ProtectRoute route={r}>{r.element}</ProtectRoute>,
    };

    if (r.children) {
      wrapped.children = wrapRoutes(r.children);
    }

    return wrapped;
  });

export const getRoutes = () => {
  const wrappedPrivateRoutes = wrapRoutes(privateRoutes);

  return {
    path: "/",
    element: <MainLayout />,
    children: wrappedPrivateRoutes,
  };
};

