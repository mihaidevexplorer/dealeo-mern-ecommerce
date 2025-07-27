import React from 'react';
import { RiShoppingCart2Fill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { 
  useGetDashboardData, 
  useDashboardState, 
  calculateOrderItems 
} from '../../hooks/useDashboard';
import { useCurrentUser } from '../../hooks/useAuth';
import type { Order } from '../../types';

// Loading skeleton component
const DashboardSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className='grid grid-cols-3 md:grid-cols-1 gap-5'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='flex justify-center items-center p-5 bg-white rounded-md gap-5'>
          <div className='bg-gray-200 w-[47px] h-[47px] rounded-full'></div>
          <div className='flex flex-col gap-2'>
            <div className='h-8 bg-gray-200 rounded w-16'></div>
            <div className='h-4 bg-gray-200 rounded w-20'></div>
          </div>
        </div>
      ))}
    </div>
    
    <div className='bg-white p-5 mt-5 rounded-md'>
      <div className='h-6 bg-gray-200 rounded w-32 mb-4'></div>
      <div className='space-y-3'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-12 bg-gray-200 rounded'></div>
        ))}
      </div>
    </div>
  </div>
);

// Error component
const DashboardError: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-red-600 mb-4">
      <RiShoppingCart2Fill className="mx-auto text-4xl mb-2" />
      <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
      <p className="text-sm mt-1">{error}</p>
    </div>
    <button
      onClick={onRetry}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Stats card component
const StatsCard: React.FC<{
  title: string;
  count: number;
  icon: React.ReactNode;
  color?: string;
}> = ({ title, count, icon, color = "green" }) => (
  <div className='flex justify-center items-center p-5 bg-white rounded-md gap-5 shadow-sm hover:shadow-md transition-shadow'>
    <div className={`bg-${color}-100 w-[47px] h-[47px] rounded-full flex justify-center items-center text-xl`}>
      <span className={`text-xl text-${color}-800`}>{icon}</span>
    </div>
    <div className='flex flex-col justify-start items-start text-slate-600'>
      <h2 className='text-3xl font-bold text-gray-800'>{count.toLocaleString()}</h2>
      <span className="text-sm font-medium">{title}</span>
    </div>
  </div>
);

// Order status badge component
const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Index: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  
  // Get dashboard data
  const { 
    isLoading, 
    error, 
    refetch 
  } = useGetDashboardData(currentUser?.id || '');
  
  const { 
    recentOrders, 
    totalOrder, 
    pendingOrder, 
    cancelledOrder 
  } = useDashboardState();

  // Redirect to payment for unpaid orders
  const redirectToPayment = (order: Order) => {
    const items = calculateOrderItems(order);
    
    navigate('/payment', {
      state: {
        price: order.price,
        items,
        orderId: order._id
      }
    });
  };

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <DashboardError 
        error={error.message || 'Something went wrong'} 
        onRetry={() => refetch()} 
      />
    );
  }

  // No user state
  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className='grid grid-cols-3 md:grid-cols-1 gap-5'>
        <StatsCard
          title="Total Orders"
          count={totalOrder}
          icon={<RiShoppingCart2Fill />}
          color="green"
        />
        
        <StatsCard
          title="Pending Orders"
          count={pendingOrder}
          icon={<RiShoppingCart2Fill />}
          color="yellow"
        />
        
        <StatsCard
          title="Cancelled Orders"
          count={cancelledOrder}
          icon={<RiShoppingCart2Fill />}
          color="red"
        />
      </div>

      {/* Recent Orders Table */}
      <div className='bg-white p-5 mt-5 rounded-md shadow-sm'>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link 
            to="/dashboard/my-orders" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Orders →
          </Link>
        </div>
        
        <div className='pt-4'>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <RiShoppingCart2Fill className="mx-auto text-4xl text-gray-300 mb-2" />
              <p className="text-gray-500">No orders yet</p>
              <Link 
                to="/shops" 
                className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className='relative overflow-x-auto rounded-md'>
              <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3 font-semibold'>Order ID</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Price</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Payment Status</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Order Status</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order._id || index} className='bg-white border-b hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 font-medium text-gray-900'>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className='px-6 py-4 font-medium text-gray-900'>
                        ${order.price.toFixed(2)}
                      </td>
                      <td className='px-6 py-4'>
                        <OrderStatusBadge status={order.payment_status} />
                      </td>
                      <td className='px-6 py-4'>
                        <OrderStatusBadge status={order.delivery_status} />
                      </td>
                      <td className='px-6 py-4'>
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/dashboard/order/details/${order._id}`}
                            className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            View
                          </Link>
                          
                          {order.payment_status !== 'paid' && (
                            <button
                              onClick={() => redirectToPayment(order)}
                              className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-green-200 transition-colors cursor-pointer"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </td> 
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;