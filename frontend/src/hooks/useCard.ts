// src/hooks/useCart.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import api from '../api/api';
import { useCartStore } from '../store/useCardStore';
import type { CardProduct, WishlistItem } from '../types';
import toast from 'react-hot-toast';

interface ApiError {
  error: string;
  message?: string;
}

interface AddToCartData {
  userId: string;
  productId: string;
  quantity: number;
}

interface AddToWishlistData {
  userId: string;
  productId: string;
}

interface CartResponse {
  message: string;
  card_products: CardProduct[];
  card_product_count: number;
  price: number;
  shipping_fee: number;
  outOfStockProduct: CardProduct[];
  buy_product_item: number;
}

interface WishlistResponse {
  message: string;
  wishlists: WishlistItem[];
  wishlistCount: number;
}

interface GenericResponse {
  message: string;
  wishlistId?: string;
}

// Cart Queries
export const useGetCartProducts = (userId: string) => {
  const { 
    setCartProducts, 
    setCartProductCount, 
    setPrice, 
    setShippingFee, 
    setOutOfStockProducts, 
    setBuyProductItem 
  } = useCartStore();

  const query = useQuery<CartResponse>({
    queryKey: ['cartProducts', userId],
    queryFn: async () => {
      const { data } = await api.get<CartResponse>(`/home/product/get-card-product/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setCartProducts(query.data.card_products);
      setCartProductCount(query.data.card_product_count);
      setPrice(query.data.price);
      setShippingFee(query.data.shipping_fee);
      setOutOfStockProducts(query.data.outOfStockProduct);
      setBuyProductItem(query.data.buy_product_item);
    }
  }, [
    query.data, 
    setCartProducts, 
    setCartProductCount, 
    setPrice, 
    setShippingFee, 
    setOutOfStockProducts, 
    setBuyProductItem
  ]);

  return query;
};

export const useGetWishlistProducts = (userId: string) => {
  const { setWishlist, setWishlistCount } = useCartStore();

  const query = useQuery<WishlistResponse>({
    queryKey: ['wishlistProducts', userId],
    queryFn: async () => {
      const { data } = await api.get<WishlistResponse>(`/home/product/get-wishlist-products/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setWishlist(query.data.wishlists);
      setWishlistCount(query.data.wishlistCount);
    }
  }, [query.data, setWishlist, setWishlistCount]);

  return query;
};

// Cart Mutations
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess, incrementCartCount } = useCartStore();

  return useMutation<GenericResponse, AxiosError<ApiError>, AddToCartData>({
    mutationFn: async (cartData: AddToCartData) => {
      const { data } = await api.post<GenericResponse>('/home/product/add-to-card', cartData);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data, variables) => {
      setSuccess(data.message);
      incrementCartCount();
      toast.success(data.message);
      
      // Invalidate cart products query to refetch
      queryClient.invalidateQueries({ queryKey: ['cartProducts', variables.userId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to add to cart';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

export const useDeleteCartProduct = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useCartStore();

  return useMutation<GenericResponse, AxiosError<ApiError>, { cartId: string; userId: string }>({
    mutationFn: async ({ cartId }) => {
      const { data } = await api.delete<GenericResponse>(`/home/product/delete-card-product/${cartId}`);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data, variables) => {
      setSuccess(data.message);
      toast.success(data.message);
      
      // Invalidate cart products query to refetch
      queryClient.invalidateQueries({ queryKey: ['cartProducts', variables.userId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to delete product';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

export const useQuantityInc = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useCartStore();

  return useMutation<GenericResponse, AxiosError<ApiError>, { cartId: string; userId: string }>({
    mutationFn: async ({ cartId }) => {
      const { data } = await api.put<GenericResponse>(`/home/product/quantity-inc/${cartId}`);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data, variables) => {
      setSuccess(data.message);
      toast.success(data.message);
      
      // Invalidate cart products query to refetch
      queryClient.invalidateQueries({ queryKey: ['cartProducts', variables.userId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to increase quantity';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

export const useQuantityDec = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useCartStore();

  return useMutation<GenericResponse, AxiosError<ApiError>, { cartId: string; userId: string }>({
    mutationFn: async ({ cartId }) => {
      const { data } = await api.put<GenericResponse>(`/home/product/quantity-dec/${cartId}`);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data, variables) => {
      setSuccess(data.message);
      toast.success(data.message);
      
      // Invalidate cart products query to refetch
      queryClient.invalidateQueries({ queryKey: ['cartProducts', variables.userId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to decrease quantity';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Wishlist Mutations
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess, incrementWishlistCount } = useCartStore();

  return useMutation<GenericResponse, AxiosError<ApiError>, AddToWishlistData>({
    mutationFn: async (wishlistData: AddToWishlistData) => {
      const { data } = await api.post<GenericResponse>('/home/product/add-to-wishlist', wishlistData);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data, variables) => {
      setSuccess(data.message);
      incrementWishlistCount();
      toast.success(data.message);
      
      // Invalidate wishlist products query to refetch
      queryClient.invalidateQueries({ queryKey: ['wishlistProducts', variables.userId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to add to wishlist';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

export const useRemoveWishlist = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess, removeWishlistItem } = useCartStore();

  return useMutation<GenericResponse, AxiosError<ApiError>, { wishlistId: string; userId: string }>({
    mutationFn: async ({ wishlistId }) => {
      const { data } = await api.delete<GenericResponse>(`/home/product/remove-wishlist-product/${wishlistId}`);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data, variables) => {
      setSuccess(data.message);
      removeWishlistItem(variables.wishlistId);
      toast.success(data.message);
      
      // Invalidate wishlist products query to refetch
      queryClient.invalidateQueries({ queryKey: ['wishlistProducts', variables.userId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to remove from wishlist';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Hook for cart state
export const useCartState = () => {
  const cartState = useCartStore();
  
  return {
    cartProducts: cartState.cartProducts,
    cartProductCount: cartState.cartProductCount,
    wishlistCount: cartState.wishlistCount,
    wishlist: cartState.wishlist,
    price: cartState.price,
    errorMessage: cartState.errorMessage,
    successMessage: cartState.successMessage,
    shippingFee: cartState.shippingFee,
    outOfStockProducts: cartState.outOfStockProducts,
    buyProductItem: cartState.buyProductItem,
    loader: cartState.loader,
    clearMessages: cartState.clearMessages,
    resetCount: cartState.resetCount,
  };
};