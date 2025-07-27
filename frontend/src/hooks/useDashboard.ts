import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import api from '../api/api';
import { useDashboardStore } from '../store/useDashboardStore';
import toast from 'react-hot-toast';
import type { 
  Order, 
  ApiResponse 
} from '../types';

interface ApiError {
  error: string;
  message?: string;
}

interface DashboardIndexResponse {
  totalOrder: number;
  pendingOrder: number;
  cancelledOrder: number;
  recentOrders: Order[];
  totalSales?: number;
  monthlyOrders?: number;
}

interface OrderDetailsResponse {
  order: Order;
}

interface OrdersResponse {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
}

// Get Dashboard Index Data
export const useGetDashboardData = (userId: string) => {
  const { setDashboardData } = useDashboardStore();

  const query = useQuery<DashboardIndexResponse>({
    queryKey: ['dashboardData', userId],
    queryFn: async () => {
      const { data } = await api.get<DashboardIndexResponse>(`/home/coustomer/get-dashboard-data/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes - dashboard data should be relatively fresh
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  // Use useEffect instead of onSuccess
  useEffect(() => {
    if (query.data) {
      setDashboardData({
        totalOrder: query.data.totalOrder,
        pendingOrder: query.data.pendingOrder,
        cancelledOrder: query.data.cancelledOrder,
        recentOrders: query.data.recentOrders,
      });
    }
  }, [query.data, setDashboardData]);

  return query;
};

// Get All Orders with Pagination
export const useGetOrders = (userId: string, page = 1, status?: string) => {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', userId, page, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(status && { status }),
      });
      const { data } = await api.get<OrdersResponse>(`/home/customer/get-orders/${userId}?${params}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Replacement for keepPreviousData
  });
};

// Get Order Details
export const useGetOrderDetails = (orderId: string) => {
  return useQuery<OrderDetailsResponse>({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      const { data } = await api.get<OrderDetailsResponse>(`/home/customer/get-order/${orderId}`);
      return data;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 10, // 10 minutes - order details don't change often
  });
};

// Cancel Order Mutation
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useDashboardStore();

  interface CancelOrderData {
    orderId: string;
    userId: string;
  }

  return useMutation<ApiResponse, AxiosError<ApiError>, CancelOrderData>({
    mutationFn: async ({ orderId }: CancelOrderData) => {
      const { data } = await api.put<ApiResponse>(`/home/customer/cancel-order/${orderId}`);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['dashboardData', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails', variables.orderId] });
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

// Reorder Mutation (Place same order again)
export const useReorder = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useDashboardStore();

  interface ReorderData {
    orderId: string;
    userId: string;
  }

  return useMutation<ApiResponse<{ newOrderId: string }>, AxiosError<ApiError>, ReorderData>({
    mutationFn: async ({ orderId }: ReorderData) => {
      const { data } = await api.post<ApiResponse<{ newOrderId: string }>>(`/home/customer/reorder/${orderId}`);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate cart and dashboard data
      queryClient.invalidateQueries({ queryKey: ['cartProducts', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
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

// Update Order Status (if customer can update status)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useDashboardStore();

  interface UpdateOrderStatusData {
    orderId: string;
    userId: string;
    status: string;
  }

  return useMutation<ApiResponse, AxiosError<ApiError>, UpdateOrderStatusData>({
    mutationFn: async ({ orderId, status }: UpdateOrderStatusData) => {
      const { data } = await api.put<ApiResponse>(`/home/customer/update-order-status/${orderId}`, { status });
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['dashboardData', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
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

// Request Order Return/Refund
export const useRequestReturn = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useDashboardStore();

  interface RequestReturnData {
    orderId: string;
    userId: string;
    reason: string;
    description?: string;
  }

  return useMutation<ApiResponse, AxiosError<ApiError>, RequestReturnData>({
    mutationFn: async ({ orderId, reason, description }: RequestReturnData) => {
      const { data } = await api.post<ApiResponse>(`/home/customer/request-return/${orderId}`, {
        reason,
        description,
      });
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (response, variables) => {
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
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

// Get Dashboard Statistics (Extended)
export const useGetDashboardStats = (userId: string, period: 'week' | 'month' | 'year' = 'month') => {
  return useQuery<{
    totalSpent: number;
    totalSaved: number;
    averageOrderValue: number;
    favoriteCategory: string;
    ordersByMonth: Array<{ month: string; count: number; amount: number }>;
  }>({
    queryKey: ['dashboardStats', userId, period],
    queryFn: async () => {
      const { data } = await api.get(`/home/customer/get-stats/${userId}?period=${period}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 15, // 15 minutes - stats don't change frequently
  });
};

// Hook for dashboard state
export const useDashboardState = () => {
  const dashboardState = useDashboardStore();
  
  return {
    recentOrders: dashboardState.recentOrders,
    totalOrder: dashboardState.totalOrder,
    pendingOrder: dashboardState.pendingOrder,
    cancelledOrder: dashboardState.cancelledOrder,
    totalSales: dashboardState.totalSales,
    monthlyOrders: dashboardState.monthlyOrders,
    errorMessage: dashboardState.errorMessage,
    successMessage: dashboardState.successMessage,
    loader: dashboardState.loader,
    clearMessages: dashboardState.clearMessages,
  };
};

// Utility hooks for quick access
export const useDashboardOrderCounts = () => {
  const { totalOrder, pendingOrder, cancelledOrder } = useDashboardStore();
  
  return {
    totalOrder,
    pendingOrder,
    cancelledOrder,
    completedOrders: totalOrder - pendingOrder - cancelledOrder,
  };
};

export const useRecentOrders = () => {
  const { recentOrders } = useDashboardStore();
  return recentOrders;
};

// Helper function to calculate items count for payment redirect
export const calculateOrderItems = (order: Order): number => {
  return order.products.reduce((total, product) => total + product.quantity, 0);
};