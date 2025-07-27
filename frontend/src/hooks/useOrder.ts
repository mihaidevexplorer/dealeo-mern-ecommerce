import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import api from '../api/api';
import { useOrderStore } from '../store/useOrderStore';
import toast from 'react-hot-toast';
import type { 
  Order, 
  ApiResponse 
} from '../types';

interface ApiError {
  error: string;
  message?: string;
}

interface OrdersResponse {
  orders: Order[];
  totalOrders?: number;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
}

interface OrderDetailsResponse {
  order: Order;
}

interface PlaceOrderResponse {
  message: string;
  orderId: string;
  order?: Order;
}

// Structura conform backend-ului (orderController.ts)
interface ProductInfo {
  _id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  discount: number;
  sellerId: string;
  shopName: string;
  images: string[];
}

interface CartProduct {
  _id: string;
  quantity: number;
  productInfo: ProductInfo;
}

interface SellerProduct {
  sellerId: string;
  shopName: string;
  price: number;
  products: CartProduct[];
}

interface ShippingInfo {
  name: string;
  address: string;
  phone: string;
  post?: string;
  province?: string;
  city: string;
  area?: string;
}

// Extended PlaceOrderData pentru a include navigate optional
interface PlaceOrderParams {
  navigate?: (path: string, options?: { state?: Record<string, unknown> }) => void;
  price: number;
  products: SellerProduct[];
  shipping_fee: number;
  shippingInfo: ShippingInfo;
  userId: {
    id: string;
  };
  items?: number; // Pentru navigare
}

// Place Order Mutation
export const usePlaceOrder = () => {
  const navigate = useNavigate(); // Hook-ul pentru navigate
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess, addOrder } = useOrderStore();

  return useMutation<PlaceOrderResponse, AxiosError<ApiError>, PlaceOrderParams>({
    mutationFn: async (orderData: PlaceOrderParams) => {
      // Exclude navigate din datele trimise la API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { navigate: _navigate, ...apiData } = orderData;
      const { data } = await api.post<PlaceOrderResponse>('/home/order/place-order', apiData);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      setSuccess(response.message);
      toast.success(response.message);
      
      // Add new order to local state if provided
      if (response.order) {
        addOrder(response.order);
      }
      
      // Navigate to payment page using passed navigate or default hook navigate
      const navigateFunction = variables.navigate || navigate;
      if (navigateFunction) {
        navigateFunction('/payment', {
          state: {
            price: variables.price + variables.shipping_fee,
            items: variables.items || 0,
            orderId: response.orderId
          }
        });
      }
      
      // Invalidate relevant queries (folosind userId din structura noua)
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData', variables.userId.id] });
      queryClient.invalidateQueries({ queryKey: ['cartProducts', variables.userId.id] });
    },
    onError: (error: AxiosError<ApiError>, variables) => {
      console.error('=== API ERROR DETAILS ===');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Error Data:', error.response?.data);
      console.error('Request Data:', error.config?.data);
      console.error('Full Error Object:', error);
      
      // Log și headers pentru debugging
      console.error('Request Headers:', error.config?.headers);
      console.error('Response Headers:', error.response?.headers);
      
      let errorMessage = 'Failed to place order';
      let shouldRedirectToLogin = false;
      
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.message?.includes('Invalid customer ID')) {
          errorMessage = 'User session expired. Please log out and log in again.';
          shouldRedirectToLogin = true;
        } else {
          errorMessage = errorData?.error || errorData?.message || 'Invalid order data';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
        shouldRedirectToLogin = true;
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please log in again.';
        shouldRedirectToLogin = true;
      } else if (error.response?.status === 422) {
        errorMessage = 'Invalid order information. Please check your data.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Redirect la login dacă e problemă de autentificare
      if (shouldRedirectToLogin && variables.navigate) {
        setTimeout(() => {
          // Șterge datele de autentificare
          localStorage.removeItem('customerToken');
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          
          // Redirect la login
          if (variables.navigate) {
            variables.navigate('/login');
          }
        }, 2000); // Așteaptă 2 secunde ca utilizatorul să vadă mesajul
      }
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Get Orders with Status Filter
export const useGetOrders = (customerId: string, status = 'all', page = 1) => {
  const { setMyOrders, setPaginationInfo } = useOrderStore();

  const query = useQuery<OrdersResponse>({
    queryKey: ['orders', customerId, status, page],
    queryFn: async () => {
      const { data } = await api.get<OrdersResponse>(`/home/coustomer/get-orders/${customerId}/${status}?page=${page}`);
      return data;
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData, // Replacement for keepPreviousData
  });

  // Use useEffect instead of onSuccess
  useEffect(() => {
    if (query.data) {
      setMyOrders(query.data.orders);
      
      if (query.data.totalOrders !== undefined) {
        setPaginationInfo({
          totalOrders: query.data.totalOrders,
          currentPage: query.data.currentPage || page,
          totalPages: query.data.totalPages || 1,
          itemsPerPage: query.data.itemsPerPage || 10,
        });
      }
    }
  }, [query.data, setMyOrders, setPaginationInfo, page]);

  return query;
};

// Get Order Details
export const useGetOrderDetails = (orderId: string) => {
  const { setMyOrder } = useOrderStore();

  const query = useQuery<OrderDetailsResponse>({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      const { data } = await api.get<OrderDetailsResponse>(`/home/coustomer/get-order-details/${orderId}`);
      return data;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 10, // 10 minutes - order details don't change often
  });

  // Use useEffect instead of onSuccess
  useEffect(() => {
    if (query.data) {
      setMyOrder(query.data.order);
    }
  }, [query.data, setMyOrder]);

  return query;
};

// Cancel Order Mutation
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess, updateOrder } = useOrderStore();

  interface CancelOrderData {
    orderId: string;
    customerId: string;
    reason?: string;
  }

  return useMutation<ApiResponse, AxiosError<ApiError>, CancelOrderData>({
    mutationFn: async ({ orderId, reason }: CancelOrderData) => {
      const { data } = await api.put<ApiResponse>(`/home/order/cancel-order/${orderId}`, { reason });
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      // Update order status locally
      updateOrder(variables.orderId, { 
        delivery_status: 'cancelled',
        payment_status: 'cancelled' 
      });
      
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['orders', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData', variables.customerId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to cancel order';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Update Order Status (if customer can update)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess, updateOrder } = useOrderStore();

  interface UpdateOrderStatusData {
    orderId: string;
    customerId: string;
    status: 'pending' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'warehouse' | 'return_requested';
  }

  return useMutation<ApiResponse, AxiosError<ApiError>, UpdateOrderStatusData>({
    mutationFn: async ({ orderId, status }: UpdateOrderStatusData) => {
      const { data } = await api.put<ApiResponse>(`/home/order/update-status/${orderId}`, { status });
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      // Update order status locally with proper type casting
      updateOrder(variables.orderId, { 
        delivery_status: variables.status as 'pending' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'warehouse' | 'return_requested'
      });
      
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['orders', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails', variables.orderId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to update order status';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Reorder Mutation
export const useReorder = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useOrderStore();

  interface ReorderData {
    orderId: string;
    customerId: string;
  }

  return useMutation<ApiResponse<{ newOrderId: string }>, AxiosError<ApiError>, ReorderData>({
    mutationFn: async ({ orderId }: ReorderData) => {
      const { data } = await api.post<ApiResponse<{ newOrderId: string }>>(`/home/order/reorder/${orderId}`);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate cart and orders
      queryClient.invalidateQueries({ queryKey: ['cartProducts', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.customerId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to reorder';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Request Return/Refund
export const useRequestReturn = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess, updateOrder } = useOrderStore();

  interface RequestReturnData {
    orderId: string;
    customerId: string;
    reason: string;
    description?: string;
  }

  return useMutation<ApiResponse, AxiosError<ApiError>, RequestReturnData>({
    mutationFn: async ({ orderId, reason, description }: RequestReturnData) => {
      const { data } = await api.post<ApiResponse>(`/home/order/request-return/${orderId}`, {
        reason,
        description,
      });
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      // Update order status locally
      updateOrder(variables.orderId, { delivery_status: 'return_requested' });
      
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['orders', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails', variables.orderId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to request return';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Track Order (if tracking endpoint exists)
export const useTrackOrder = (orderId: string) => {
  return useQuery<{
    trackingNumber: string;
    status: string;
    estimatedDelivery: string;
    trackingHistory: Array<{
      status: string;
      location: string;
      timestamp: string;
      description: string;
    }>;
  }>({
    queryKey: ['orderTracking', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/home/order/track/${orderId}`);
      return data;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
};

// Hook for order state
export const useOrderState = () => {
  const orderState = useOrderStore();
  
  return {
    myOrders: orderState.myOrders,
    myOrder: orderState.myOrder,
    currentOrder: orderState.currentOrder,
    orderStatus: orderState.orderStatus,
    totalOrders: orderState.totalOrders,
    currentPage: orderState.currentPage,
    totalPages: orderState.totalPages,
    itemsPerPage: orderState.itemsPerPage,
    errorMessage: orderState.errorMessage,
    successMessage: orderState.successMessage,
    loader: orderState.loader,
    clearMessages: orderState.clearMessages,
    setOrderStatus: orderState.setOrderStatus,
  };
};

// Utility hooks
export const useOrdersByStatus = (status: string) => {
  const { myOrders } = useOrderStore();
  return myOrders.filter(order => 
    status === 'all' || order.delivery_status.toLowerCase() === status.toLowerCase()
  );
};

export const useOrdersStats = () => {
  const { myOrders } = useOrderStore();
  
  const totalOrders = myOrders.length;
  const pendingOrders = myOrders.filter(order => order.delivery_status === 'pending').length;
  const deliveredOrders = myOrders.filter(order => order.delivery_status === 'delivered').length;
  const cancelledOrders = myOrders.filter(order => order.delivery_status === 'cancelled').length;
  const totalSpent = myOrders.reduce((total, order) => total + order.price, 0);
  
  return {
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalSpent,
  };
};

// Helper function to calculate items count (for payment redirect)
export const calculateOrderItems = (order: Order): number => {
  return order.products.reduce((total, product) => total + product.quantity, 0);
};