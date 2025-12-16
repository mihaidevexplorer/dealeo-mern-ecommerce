//src/router/routes/ProtectRoute.js
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectRoute = ({ route, children }) => {
  const { role, userInfo } = useSelector((state) => state.auth);

  // Not authenticated
  if (!role) return <Navigate to="/login" replace />;

  // Inconsistent state (common after logout if role not cleared)
  if (!userInfo) return <Navigate to="/login" replace />;

  // Role-protected route
  if (route.role && userInfo.role !== route.role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Status enforcement
  if (route.status && route.status !== userInfo.status) {
    if (userInfo.status === "pending") {
      return <Navigate to="/seller/account-pending" replace />;
    }
    return <Navigate to="/seller/account-deactive" replace />;
  }

  // Visibility enforcement
  if (route.visibility && !route.visibility.includes(userInfo.status)) {
    return <Navigate to="/seller/account-pending" replace />;
  }

  // Ability rule (dacă ai nevoie de ea)
  if (route.ability === "seller") {
    return <Suspense fallback={null}>{children}</Suspense>;
  }

  return <Suspense fallback={null}>{children}</Suspense>;
};

ProtectRoute.propTypes = {
  route: PropTypes.shape({
    role: PropTypes.string,
    status: PropTypes.string,
    visibility: PropTypes.arrayOf(PropTypes.string),
    ability: PropTypes.string,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectRoute;
