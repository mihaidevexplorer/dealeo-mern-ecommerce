//src/router/routes/ProtectRoute.js
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectRoute = ({ route, children }) => {
  const { token, role, userInfo } = useSelector((state) => state.auth);


  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }


  if (!userInfo) {
    return (
      <div style={{ padding: 16 }}>
        Loading...
      </div>
    );
  }

 
  const effectiveRole = userInfo?.role || role;

  if (route.role && effectiveRole !== route.role) {
    return <Navigate to="/unauthorized" replace />;
  }


  if (route.status && route.status !== userInfo.status) {
    return userInfo.status === "pending" ? (
      <Navigate to="/seller/account-pending" replace />
    ) : (
      <Navigate to="/seller/account-deactive" replace />
    );
  }

  if (route.visibility && !route.visibility.includes(userInfo.status)) {
    return <Navigate to="/seller/account-pending" replace />;
  }

  return <Suspense fallback={<div />}>{children}</Suspense>;
};

ProtectRoute.propTypes = {
  route: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectRoute;
