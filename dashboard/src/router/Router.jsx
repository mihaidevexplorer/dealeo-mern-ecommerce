//src/router/Router.jsx
import { useRoutes, Navigate } from "react-router-dom";

const Router = ({ allRoutes }) => {
  const routes = useRoutes([
    ...allRoutes,
    { path: "*", element: <Navigate to="/" replace /> }
  ]);

  return routes;
};

export default Router;


