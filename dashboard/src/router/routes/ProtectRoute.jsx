import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectRoute = ({ route, children }) => {
  const { token, userInfo } = useSelector(state => state.auth);

  if (!token || !userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (route?.role && userInfo.role !== route.role) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (route?.status && route.status !== userInfo.status) {
    return userInfo.status === "pending"
      ? <Navigate to="/seller/account-pending" replace />
      : <Navigate to="/seller/account-deactive" replace />;
  }

  if (route?.visibility && !route.visibility.includes(userInfo.status)) {
    return <Navigate to="/seller/account-pending" replace />;
  }

  if (route?.ability === "seller" && userInfo.role !== "seller") {
    return <Navigate to="/unauthorized" replace />;
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
