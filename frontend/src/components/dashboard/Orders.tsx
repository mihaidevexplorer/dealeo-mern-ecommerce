// src/components/dashboard/Orders.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiShoppingCart2Fill, RiFilterLine, RiRefreshLine } from "react-icons/ri";
import { 
  useGetOrders, 
  useOrderState,
  calculateOrderItems,
  useCancelOrder,
  useReorder 
} from '../../hooks/useOrder';
import { useCurrentUser } from '../../hooks/useAuth';
import type { Order } from '../../types';

// Order status filter options
const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'placed', label: 'Placed' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'warehouse', label: 'Warehouse' },
];

// Loading skeleton for orders table
const OrdersTableSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="overflow-x-auto rounded-md">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-6 py-3">Order ID</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Payment Status</th>
            <th className="px-6 py-3">Order Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="bg-white border-b">
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Order status badge component
const OrderStatusBadge: React.FC<{ status: string; type: 'payment' | 'delivery' }> = ({ 
  status, 
  type 
}) => {
  const getStatusColor = (status: string, type: 'payment' | 'delivery') => {
    if (type === 'payment') {
      switch (status.toLowerCase()) {
        case 'paid':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'unpaid':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      switch (status.toLowerCase()) {
        case 'delivered':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'shipped':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'processing':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'placed':
          return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'warehouse':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(status, type)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Order actions component
const OrderActions: React.FC<{ 
  order: Order; 
  onPayNow: (order: Order) => void;
  onCancel: (orderId: string) => void;
  onReorder: (orderId: string) => void;
}> = ({ order, onPayNow, onCancel, onReorder }) => {
  const canCancel = ['pending', 'placed', 'processing'].includes(order.delivery_status.toLowerCase());
  const canReorder = ['delivered', 'cancelled'].includes(order.delivery_status.toLowerCase());
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Link 
        to={`/dashboard/order/details/${order._id}`}
        className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
      >
        View
      </Link>
      
      {order.payment_status !== 'paid' && (
        <button
          onClick={() => onPayNow(order)}
          className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
        >
          Pay Now
        </button>
      )}
      
      {canCancel && (
        <button
          onClick={() => onCancel(order._id)}
          className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
        >
          Cancel
        </button>
      )}
      
      {canReorder && (
        <button
          onClick={() => onReorder(order._id)}
          className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
        >
          Reorder
        </button>
      )}
    </div>
  );
};

// Empty state component
const EmptyOrdersState: React.FC<{ status: string }> = ({ status }) => (
  <div className="text-center py-12">
    <RiShoppingCart2Fill className="mx-auto text-6xl text-gray-300 mb-4" />
    <h3 className="text-lg font-semibold text-gray-600 mb-2">
      {status === 'all' ? 'No orders yet' : `No ${status} orders`}
    </h3>
    <p className="text-gray-500 mb-6">
      {status === 'all' 
        ? 'Start shopping to see your orders here!'
        : `You don't have any ${status} orders at the moment.`
      }
    </p>
    <Link 
      to="/shops" 
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      <RiShoppingCart2Fill className="mr-2" />
      Start Shopping
    </Link>
  </div>
);

const Orders: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  
  // Get orders data
  const { 
    isLoading, 
    error, 
    refetch 
  } = useGetOrders(currentUser?.id || '', selectedStatus, currentPage);
  
  const { 
    myOrders,
    totalOrders,
    totalPages
  } = useOrderState();
  
  // Mutations
  const cancelOrderMutation = useCancelOrder();
  const reorderMutation = useReorder();

  // Redirect to payment for unpaid orders
  const handlePayNow = (order: Order) => {
    const items = calculateOrderItems(order);
    
    navigate('/payment', {
      state: {
        price: order.price,
        items,
        orderId: order._id
      }
    });
  };

  // Handle order cancellation
  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate({
        orderId,
        customerId: currentUser?.id || '',
        reason: 'Customer request'
      });
    }
  };

  // Handle reorder
  const handleReorder = (orderId: string) => {
    if (window.confirm('Do you want to add all items from this order to your cart?')) {
      reorderMutation.mutate({
        orderId,
        customerId: currentUser?.id || ''
      });
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1); // Reset to first page when changing status
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!currentUser) {
    return (
      <div className="bg-white p-4 rounded-md">
        <div className="text-center py-8">
          <p className="text-gray-500">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white p-4 rounded-md shadow-sm'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div className="flex items-center gap-3">
          <h2 className='text-xl font-semibold text-slate-700'>My Orders</h2>
          {totalOrders > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
              {totalOrders}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            title="Refresh orders"
          >
            <RiRefreshLine className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <RiFilterLine className="text-gray-500" />
            <select 
              className='outline-none px-3 py-2 border border-gray-300 rounded-md text-slate-600 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
              value={selectedStatus} 
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {ORDER_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-600">
            <RiShoppingCart2Fill />
            <span className="font-semibold">Failed to load orders</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content */}
      <div className='pt-2'>
        {isLoading ? (
          <OrdersTableSkeleton />
        ) : myOrders.length === 0 ? (
          <EmptyOrdersState status={selectedStatus} />
        ) : (
          <>
            {/* Orders Table */}
            <div className='relative overflow-x-auto rounded-md border border-gray-200'>
              <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3 font-semibold'>Order ID</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Price</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Payment Status</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Order Status</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Date</th>
                    <th scope='col' className='px-6 py-3 font-semibold'>Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((order, index) => (
                    <tr key={order._id || index} className='bg-white border-b hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 font-medium text-gray-900'>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className='px-6 py-4 font-medium text-gray-900'>
                        ${order.price.toFixed(2)}
                      </td>
                      <td className='px-6 py-4'>
                        <OrderStatusBadge status={order.payment_status} type="payment" />
                      </td>
                      <td className='px-6 py-4'>
                        <OrderStatusBadge status={order.delivery_status} type="delivery" />
                      </td>
                      <td className='px-6 py-4 text-gray-600'>
                        {new Date(order.date || order.createdAt || '').toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4'>
                        <OrderActions
                          order={order}
                          onPayNow={handlePayNow}
                          onCancel={handleCancelOrder}
                          onReorder={handleReorder}
                        />
                      </td> 
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing page {currentPage} of {totalPages} ({totalOrders} total orders)
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 text-sm border rounded-md ${
                            pageNum === currentPage
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Loading overlay for mutations */}
      {(cancelOrderMutation.isPending || reorderMutation.isPending) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">
                {cancelOrderMutation.isPending ? 'Cancelling order...' : 'Processing reorder...'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;//satisfacator