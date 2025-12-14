//src/router/routes/index.js
import { privateRoutes } from './privateRoutes';
import MainLayout from './../../layout/MainLayout';
import ProtectRoute from './ProtectRoute';
import { Navigate } from 'react-router-dom';

export const getRoutes = () => {
  // IMPORTANT: NU modificăm privateRoutes în loc
  const protectedRoutes = privateRoutes.map(route => ({
    ...route,
    element: (
      <ProtectRoute route={route}>
        {route.element}
      </ProtectRoute>
    )
  }));

  return {
    path: '/',
    element: <MainLayout />,
    children: [
      ...protectedRoutes,

      // fallback → elimină "No routes matched location"
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  };
};
