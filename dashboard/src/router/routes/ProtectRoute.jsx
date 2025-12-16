import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectRoute = ({route,children}) => {
    const {token, role, userInfo} = useSelector(state => state.auth)
    
    // FIX: autentificarea se bazează pe token
    if (!token) {
        return <Navigate to='/login' replace />
    }

    if (role) {
        if (route.role) {
            if (userInfo) {
                if (userInfo.role === route.role) {
                    if (route.status) {
                        if (route.status === userInfo.status) {
                            return <Suspense fallback={null} >{children}</Suspense>
                        } else {
                            if (userInfo.status === 'pending') {
                                return <Navigate to='/seller/account-pending' replace />
                            } else {
                                return <Navigate to='/seller/account-deactive' replace />
                            } 
                        }
                    } else {
                        if (route.visibility) {
                            if (route.visibility.some(r => r === userInfo.status)) {
                                return <Suspense fallback={null} >{children}</Suspense>
                            } else {
                                return <Navigate to='/seller/account-pending' replace />
                            }
                        } else {
                            return <Suspense fallback={null} >{children}</Suspense>
                        }
                    }
                } else {
                    return <Navigate to='/unauthorized' replace />
                }
            } else {
                return <Navigate to='/login' replace />
            }
        } else {
            if (route.ability === 'seller') {
                return <Suspense fallback={null} >{children}</Suspense>
            } else {
                return <Navigate to='/unauthorized' replace />
            }
        } 
    } else {
        return <Navigate to='/login' replace />
    }
};

ProtectRoute.propTypes = {
    route: PropTypes.shape({
        role: PropTypes.string,
        status: PropTypes.string,
        visibility: PropTypes.arrayOf(PropTypes.string),
        ability: PropTypes.string
    }).isRequired,
    children: PropTypes.node.isRequired
};

export default ProtectRoute;
