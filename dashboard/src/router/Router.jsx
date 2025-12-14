//src/router/Router.jsx

import { useMemo } from "react";
import { useRoutes } from "react-router-dom";

const Router = ({ allRoutes }) => {
  const routesWithFallback = useMemo(() => {
    const hasWildcard = allRoutes?.some(r => r?.path === "*");
    if (hasWildcard) return allRoutes;

 
    return [
      ...allRoutes,
      { path: "*", element: null } // sau un <div />
  }, [allRoutes]);

  return useRoutes(routesWithFallback);
};

export default Router;
