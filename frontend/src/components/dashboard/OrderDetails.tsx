// src/components/dashboard/OrderDetails.tsx
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  RiShoppingBag3Line,
  RiTruckLine,
  RiMapPinLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiArrowLeftLine,
  RiHomeLine,
  RiMailLine,
  RiPhoneLine,
  RiErrorWarningLine,
  RiLoader4Line,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine,
  RiShoppingCartLine,
  RiRefund2Line
} from 'react-icons/ri';
import { 
  useGetOrderDetails, 
  useOrderState,
  calculateOrderItems,
  useCancelOrder,
  useRequestReturn
} from '../../hooks/useOrder';
import { useCurrentUser } from '../../hooks/useAuth';
import type { Order } from '../../types';

// Type for product that can handle both nested and flat structures
type OrderProduct = {
  _id?: string;
  quantity: number;
  productId?: {
    _id?: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    discount: number;
    images?: string[];
    image?: string;
  };
  // Flat structure properties
  name?: string;
  slug?: string;
  brand?: string;
  price?: number;
  discount?: number;
  images?: string[];
  image?: string;
};

// Loading skeleton for order details
const OrderDetailsSkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Products skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-20 w-20 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Enhanced Status badge component
const StatusBadge: React.FC<{ 
  status: string; 
  type: 'payment' | 'delivery';
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, type, size = 'md' }) => {
  const getStatusConfig = (status: string, type: 'payment' | 'delivery') => {
    const configs = {
      payment: {
        paid: { 
          color: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300', 
          icon: RiCheckboxCircleLine,
          animation: 'animate-pulse'
        },
        pending: { 
          color: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-300', 
          icon: RiTimeLine,
          animation: 'animate-bounce'
        },
        unpaid: { 
          color: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300', 
          icon: RiCloseCircleLine,
          animation: ''
        },
        cancelled: { 
          color: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-300', 
          icon: RiCloseCircleLine,
          animation: ''
        },
      },
      delivery: {
        delivered: { 
          color: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300', 
          icon: RiCheckboxCircleLine,
          animation: ''
        },
        shipped: { 
          color: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300', 
          icon: RiTruckLine,
          animation: 'animate-pulse'
        },
        processing: { 
          color: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-300', 
          icon: RiLoader4Line,
          animation: 'animate-spin'
        },
        pending: { 
          color: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-300', 
          icon: RiTimeLine,
          animation: ''
        },
        placed: { 
          color: 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-300', 
          icon: RiShoppingBag3Line,
          animation: ''
        },
        cancelled: { 
          color: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300', 
          icon: RiCloseCircleLine,
          animation: ''
        },
        warehouse: { 
          color: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-300', 
          icon: RiShoppingBag3Line,
          animation: ''
        },
        return_requested: { 
          color: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-300', 
          icon: RiRefund2Line,
          animation: 'animate-pulse'
        },
      }
    };

    return configs[type][status.toLowerCase() as keyof typeof configs[typeof type]] || 
           { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: RiErrorWarningLine, animation: '' };
  };

  const config = getStatusConfig(status, type);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3.5 py-1.5',
    lg: 'text-base px-5 py-2'
  };

  return (
    <span className={`inline-flex items-center gap-2 font-semibold rounded-full border-2 shadow-sm transition-all duration-300 hover:shadow-md ${config.color} ${sizeClasses[size]}`}>
      <Icon className={`w-4 h-4 ${config.animation}`} />
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

// Enhanced Product item component
const OrderProductItem: React.FC<{ product: OrderProduct; index: number }> = ({ product, index }) => {
  // Handle both possible data structures: product.productId or direct product properties
  const productData = product.productId || product;
  const quantity = product.quantity || 1;
  
  // Ensure we have valid product data
  if (!productData || !productData.name) {
    return (
      <div className="flex gap-4 p-5 bg-gray-100 rounded-xl border border-gray-200">
        <p className="text-gray-500">Product information unavailable</p>
      </div>
    );
  }
  
  const originalPrice = productData.price || 0;
  const discount = productData.discount || 0;
  const discountAmount = Math.floor((originalPrice * discount) / 100);
  const finalPrice = originalPrice - discountAmount;
  const totalPrice = finalPrice * quantity;

  // Function to handle image loading errors - creates canvas placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const currentSrc = target.src;
    
    console.log('Image failed to load:', currentSrc);
    
    // Prevent infinite loop if already using canvas
    if (currentSrc.startsWith('data:')) {
      console.log('Already using canvas placeholder, stopping to prevent infinite loop');
      return;
    }
    
    console.log('Creating canvas placeholder');
    
    // Create a canvas placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Gray background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 80, 80);
      
      // Border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 78, 78);
      
      // Draw a simple camera icon
      ctx.fillStyle = '#64748b';
      // Camera body
      ctx.fillRect(25, 30, 30, 20);
      // Camera lens
      ctx.beginPath();
      ctx.arc(40, 40, 8, 0, 2 * Math.PI);
      ctx.fill();
      // Camera lens inner
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(40, 40, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // "No Image" text
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('NO IMAGE', 40, 60);
      
      target.src = canvas.toDataURL();
      target.onerror = null; // Prevent further errors
    }
  };

  // Get the image source - returns original URL or triggers canvas creation if empty
  const getImageSrc = () => {
    const imageUrl = productData.images?.[0] || productData.image;
    console.log('Product data:', productData);
    console.log('Original image URL:', imageUrl);
    
    // If no image URL is provided, return a dummy URL that will trigger canvas creation
    if (!imageUrl || imageUrl === '' || imageUrl === null || imageUrl === undefined) {
      console.log('No image URL found, will trigger canvas placeholder creation');
      return 'data:image/invalid'; // This will fail and trigger handleImageError
    }
    
    // Return the original URL as-is, let error handling deal with failures
    return imageUrl;
  };

  return (
    <div 
      className="flex gap-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex-shrink-0 relative group">
        <img
          src={getImageSrc()}
          alt={productData.name || 'Product'}
          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 group-hover:border-blue-400 transition-all duration-300"
          onError={handleImageError}
          onLoad={() => console.log('Image loaded successfully')}
        />
        {discount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
            -{discount}%
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <Link 
              to={`/product/details/${productData.slug || productData._id}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-base mb-1 block"
            >
              {productData.name || 'Unknown Product'}
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-lg border shadow-sm">
                <span className="text-gray-500">Brand:</span>
                <span className="font-medium text-gray-700">{productData.brand || 'N/A'}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200 shadow-sm">
                <RiShoppingCartLine className="w-3 h-3" />
                <span className="font-medium">Qty: {quantity}</span>
              </span>
            </div>
          </div>
          
          <div className="text-right ml-4">
            <div className="font-bold text-green-700 text-xl mb-1">
              ${totalPrice.toFixed(2)}
            </div>
            {discount > 0 && (
              <div className="space-y-1">
                <div className="text-sm text-gray-500 line-through">${(originalPrice * quantity).toFixed(2)}</div>
                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded inline-block">
                  Saved ${(discountAmount * quantity).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Unit Price:</span>
            {discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                <span className="font-semibold text-gray-900">${finalPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-semibold text-gray-900">${finalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Order actions component
const OrderActions: React.FC<{ 
  order: Order;
  onCancel: () => void;
  onRequestReturn: () => void;
  isPending: boolean;
}> = ({ order, onCancel, onRequestReturn, isPending }) => {
  const navigate = useNavigate();
  
  const canCancel = ['pending', 'placed', 'processing'].includes(order.delivery_status.toLowerCase());
  const canRequestReturn = order.delivery_status.toLowerCase() === 'delivered' && 
                           order.payment_status.toLowerCase() === 'paid';
  const canPay = order.payment_status.toLowerCase() !== 'paid' && 
                 order.delivery_status.toLowerCase() !== 'cancelled';
  
  const handlePayNow = () => {
    const items = calculateOrderItems(order);
    navigate('/payment', {
      state: {
        price: order.price,
        items,
        orderId: order._id
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t-2 border-gray-200">
      {canPay && (
        <button
          onClick={handlePayNow}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <RiMoneyDollarCircleLine className="w-5 h-5" />
          Pay Now
        </button>
      )}
      
      {canCancel && (
        <button
          onClick={onCancel}
          disabled={isPending}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <RiCloseCircleLine className="w-5 h-5" />
          {isPending ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}
      
      {canRequestReturn && (
        <button
          onClick={onRequestReturn}
          disabled={isPending}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <RiRefund2Line className="w-5 h-5" />
          {isPending ? 'Requesting...' : 'Request Return'}
        </button>
      )}
      
      <Link
        to={`/dashboard/my-orders`}
        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <RiArrowLeftLine className="w-5 h-5" />
        Back to Orders
      </Link>
    </div>
  );
};

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const currentUser = useCurrentUser();
  
  // Get order details using React Query
  const { 
    data: orderData, 
    isLoading, 
    error 
  } = useGetOrderDetails(orderId || '');
  
  // Get order state from Zustand store
  const { myOrder } = useOrderState();
  
  // Mutations
  const cancelOrderMutation = useCancelOrder();
  const requestReturnMutation = useRequestReturn();

  // Use order from query response or fallback to store
  const order = orderData?.order || myOrder;

  const handleCancelOrder = () => {
    if (!order || !currentUser) return;
    
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      cancelOrderMutation.mutate({
        orderId: order._id,
        customerId: currentUser.id,
        reason: 'Customer request'
      });
    }
  };

  const handleRequestReturn = () => {
    if (!order || !currentUser) return;
    
    const reason = window.prompt('Please provide a reason for the return:');
    if (reason && reason.trim()) {
      requestReturnMutation.mutate({
        orderId: order._id,
        customerId: currentUser.id,
        reason: reason.trim(),
        description: reason.trim()
      });
    }
  };

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <div className="text-center py-16">
          <RiErrorWarningLine className="mx-auto text-6xl text-red-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Order Not Found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {error?.message || 'The order you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}
          </p>
          <Link
            to="/dashboard/my-orders"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <RiArrowLeftLine className="w-5 h-5" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Format date properly
  const orderDate = new Date(order.date || order.createdAt || '').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeIn">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RiShoppingBag3Line className="w-8 h-8 text-blue-600" />
            </div>
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-gray-600 flex items-center gap-2 text-lg">
            <RiCalendarLine className="w-5 h-5 text-gray-500" />
            {orderDate}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <StatusBadge status={order.payment_status} type="payment" size="lg" />
          <StatusBadge status={order.delivery_status} type="delivery" size="lg" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Delivery Information Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-200 rounded-lg">
              <RiTruckLine className="w-6 h-6 text-blue-700" />
            </div>
            Delivery Information
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3 mb-5">
              <RiHomeLine className="w-6 h-6 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Deliver To: {order.shippingInfo?.name}
                </h3>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  HOME ADDRESS
                </span>
              </div>
            </div>
            
            <div className="space-y-3 text-gray-700 pl-9">
              <div className="flex items-start gap-3">
                <RiMapPinLine className="w-5 h-5 text-gray-500 mt-0.5" />
                <span className="flex-1">
                  {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.province}
                </span>
              </div>
              
              {order.shippingInfo?.phone && (
                <div className="flex items-center gap-3">
                  <RiPhoneLine className="w-5 h-5 text-gray-500" />
                  <span>{order.shippingInfo.phone}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <RiMailLine className="w-5 h-5 text-gray-500" />
                <span>Email to {currentUser?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-200 rounded-lg">
              <RiMoneyDollarCircleLine className="w-6 h-6 text-green-700" />
            </div>
            Order Summary
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg border border-green-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700">Total Price:</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-green-700">${order.price.toFixed(2)}</span>
                <p className="text-sm text-gray-600 mt-1">Including shipping & taxes</p>
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t-2 border-gray-200 space-y-3">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-600 font-medium">Payment Status:</span>
                <StatusBadge status={order.payment_status} type="payment" />
              </div>
              
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-600 font-medium">Order Status:</span>
                <StatusBadge status={order.delivery_status} type="delivery" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Products Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-200 rounded-lg">
            <RiShoppingBag3Line className="w-7 h-7 text-gray-700" />
          </div>
          Order Items
          <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
            {order.products?.length || 0} items
          </span>
        </h2>
        
        <div className="space-y-4">
          {order.products?.map((product, index) => (
            <OrderProductItem 
              key={product._id || index} 
              product={product} 
              index={index}
            />
          )) || (
            <div className="text-center py-12 bg-white rounded-lg">
              <RiShoppingBag3Line className="mx-auto text-6xl text-gray-300 mb-3" />
              <p className="text-gray-500 text-lg">No products found in this order</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Actions */}
      <OrderActions
        order={order}
        onCancel={handleCancelOrder}
        onRequestReturn={handleRequestReturn}
        isPending={cancelOrderMutation.isPending || requestReturnMutation.isPending}
      />

      {/* Loading overlay for mutations */}
      {(cancelOrderMutation.isPending || requestReturnMutation.isPending) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <span className="text-lg font-medium text-gray-700">
              {cancelOrderMutation.isPending ? 'Cancelling order...' : 'Processing return request...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;//modificat