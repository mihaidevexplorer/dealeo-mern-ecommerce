// src/stores/useDashboardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, DashboardStats } from '../types';

interface DashboardState {
  recentOrders: Order[];
  totalOrder: number;
  pendingOrder: number;
  cancelledOrder: number;
  totalSales: number;
  monthlyOrders: number;
  errorMessage: string;
  successMessage: string;
  loader: boolean;
}

interface DashboardActions {
  setRecentOrders: (orders: Order[]) => void;
  setTotalOrder: (count: number) => void;
  setPendingOrder: (count: number) => void;
  setCancelledOrder: (count: number) => void;
  setTotalSales: (amount: number) => void;
  setMonthlyOrders: (count: number) => void;
  setDashboardData: (data: DashboardStats) => void;
  setError: (error: string) => void;
  setSuccess: (message: string) => void;
  setLoader: (loading: boolean) => void;
  clearMessages: () => void;
  resetDashboard: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  recentOrders: [],
  totalOrder: 0,
  pendingOrder: 0,
  cancelledOrder: 0,
  totalSales: 0,
  monthlyOrders: 0,
  errorMessage: '',
  successMessage: '',
  loader: false,
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Actions
      setRecentOrders: (recentOrders: Order[]) => set({ recentOrders }),
      
      setTotalOrder: (totalOrder: number) => set({ totalOrder }),
      
      setPendingOrder: (pendingOrder: number) => set({ pendingOrder }),
      
      setCancelledOrder: (cancelledOrder: number) => set({ cancelledOrder }),
      
      setTotalSales: (totalSales: number) => set({ totalSales }),
      
      setMonthlyOrders: (monthlyOrders: number) => set({ monthlyOrders }),
      
      setDashboardData: (data: DashboardStats) => set({
        recentOrders: data.recentOrders,
        totalOrder: data.totalOrder,
        pendingOrder: data.pendingOrder,
        cancelledOrder: data.cancelledOrder,
      }),
      
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
      
      resetDashboard: () => set(initialState),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        // Only persist stats, not the full orders array
        totalOrder: state.totalOrder,
        pendingOrder: state.pendingOrder,
        cancelledOrder: state.cancelledOrder,
        totalSales: state.totalSales,
        monthlyOrders: state.monthlyOrders,
      }),
    }
  )
);