// src\store\useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CardProduct, WishlistItem } from '../types';

interface CartState {
  cartProducts: CardProduct[];
  cartProductCount: number;
  wishlistCount: number;
  wishlist: WishlistItem[];
  price: number;
  errorMessage: string;
  successMessage: string;
  shippingFee: number;
  outOfStockProducts: CardProduct[];
  buyProductItem: number;
  loader: boolean;
}

interface CartActions {
  setCartProducts: (products: CardProduct[]) => void;
  setCartProductCount: (count: number) => void;
  setWishlistCount: (count: number) => void;
  setWishlist: (wishlist: WishlistItem[]) => void;
  setPrice: (price: number) => void;
  setError: (error: string) => void;
  setSuccess: (message: string) => void;
  setShippingFee: (fee: number) => void;
  setOutOfStockProducts: (products: CardProduct[]) => void;
  setBuyProductItem: (count: number) => void;
  setLoader: (loading: boolean) => void;
  clearMessages: () => void;
  resetCount: () => void;
  incrementCartCount: () => void;
  incrementWishlistCount: () => void;
  decrementWishlistCount: () => void;
  removeWishlistItem: (wishlistId: string) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      cartProducts: [],
      cartProductCount: 0,
      wishlistCount: 0,
      wishlist: [],
      price: 0,
      errorMessage: '',
      successMessage: '',
      shippingFee: 0,
      outOfStockProducts: [],
      buyProductItem: 0,
      loader: false,

      // Actions
      setCartProducts: (products: CardProduct[]) => set({ cartProducts: products }),
      
      setCartProductCount: (count: number) => set({ cartProductCount: count }),
      
      setWishlistCount: (count: number) => set({ wishlistCount: count }),
      
      setWishlist: (wishlist: WishlistItem[]) => set({ wishlist }),
      
      setPrice: (price: number) => set({ price }),
      
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
      
      setShippingFee: (fee: number) => set({ shippingFee: fee }),
      
      setOutOfStockProducts: (products: CardProduct[]) => set({ outOfStockProducts: products }),
      
      setBuyProductItem: (count: number) => set({ buyProductItem: count }),
      
      setLoader: (loading: boolean) => set({ loader: loading }),
      
      clearMessages: () => set({ 
        errorMessage: '', 
        successMessage: '' 
      }),
      
      resetCount: () => set({ 
        cartProductCount: 0, 
        wishlistCount: 0 
      }),
      
      incrementCartCount: () => set((state) => ({ 
        cartProductCount: state.cartProductCount + 1 
      })),
      
      incrementWishlistCount: () => set((state) => ({ 
        wishlistCount: state.wishlistCount > 0 ? state.wishlistCount + 1 : 1 
      })),
      
      decrementWishlistCount: () => set((state) => ({ 
        wishlistCount: Math.max(0, state.wishlistCount - 1) 
      })),
      
      removeWishlistItem: (wishlistId: string) => {
        const { wishlist } = get();
        const updatedWishlist = wishlist.filter(item => item._id !== wishlistId);
        set({ 
          wishlist: updatedWishlist,
          wishlistCount: Math.max(0, wishlist.length - 1)
        });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cartProductCount: state.cartProductCount,
        wishlistCount: state.wishlistCount,
      }),
    }
  )
);