// src/stores/useOrderStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, PlaceOrderData } from '../types';

interface OrderState {
  myOrders: Order[];
  myOrder: Order | null;
  currentOrder: PlaceOrderData | null;
  orderStatus: string;
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  errorMessage: string;
  successMessage: string;
  loader: boolean;
}

interface OrderActions {
  setMyOrders: (orders: Order[]) => void;
  setMyOrder: (order: Order) => void;
  setCurrentOrder: (order: PlaceOrderData | null) => void;
  setOrderStatus: (status: string) => void;
  setPaginationInfo: (info: {
    totalOrders: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  }) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;
  setError: (error: string) => void;
  setSuccess: (message: string) => void;
  setLoader: (loading: boolean) => void;
  clearMessages: () => void;
  resetOrderState: () => void;
}

type OrderStore = OrderState & OrderActions;

const initialState: OrderState = {
  myOrders: [],
  myOrder: null,
  currentOrder: null,
  orderStatus: 'all',
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  errorMessage: '',
  successMessage: '',
  loader: false,
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setMyOrders: (myOrders: Order[]) => set({ myOrders }),
      
      setMyOrder: (myOrder: Order) => set({ myOrder }),
      
      setCurrentOrder: (currentOrder: PlaceOrderData | null) => set({ currentOrder }),
      
      setOrderStatus: (orderStatus: string) => set({ orderStatus }),
      
      setPaginationInfo: (info) => set({
        totalOrders: info.totalOrders,
        currentPage: info.currentPage,
        totalPages: info.totalPages,
        itemsPerPage: info.itemsPerPage,
      }),
      
      addOrder: (order: Order) => {
        const currentOrders = get().myOrders;
        set({ myOrders: [order, ...currentOrders] });
      },
      
      updateOrder: (orderId: string, updates: Partial<Order>) => {
        const currentOrders = get().myOrders;
        const updatedOrders = currentOrders.map(order =>
          order._id === orderId ? { ...order, ...updates } : order
        );
        set({ myOrders: updatedOrders });
        
        // Update current order if it's the same
        const currentOrder = get().myOrder;
        if (currentOrder && currentOrder._id === orderId) {
          set({ myOrder: { ...currentOrder, ...updates } });
        }
      },
      
      removeOrder: (orderId: string) => {
        const currentOrders = get().myOrders;
        const filteredOrders = currentOrders.filter(order => order._id !== orderId);
        set({ myOrders: filteredOrders });
        
        // Clear current order if it's the removed one
        const currentOrder = get().myOrder;
        if (currentOrder && currentOrder._id === orderId) {
          set({ myOrder: null });
        }
      },
      
      setError: (error: string) => set({ 
        errorMessage: error, 
        loader: false,
        successMessage: '' 
      }),
      
      setSuccess: (message: string) => set({ 
        successMessage: message, 
        loader: false,
        errorMessage: '' 
      }),
      
      setLoader: (loader: boolean) => set({ loader }),
      
      clearMessages: () => set({ 
        errorMessage: '', 
        successMessage: '' 
      }),
      
      resetOrderState: () => set(initialState),
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        // Persist only essential data
        orderStatus: state.orderStatus,
        currentPage: state.currentPage,
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);