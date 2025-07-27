
// src/hooks/useHome.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import api from '../api/api';
import { useHomeStore } from '../store/useHomeStore';
import toast from 'react-hot-toast';
import type { 
  Category, 
  Product, 
  ProductDetails, 
  Review, 
  Banner 
} from '../types';

interface ApiError {
  error: string;
  message?: string;
}

interface CategoriesResponse {
  categorys: Category[];
}

interface ProductsResponse {
  products: Product[];
  latest_product: Product[];
  topRated_product: Product[];
  discount_product: Product[];
}

interface PriceRangeResponse {
  latest_product: Product[];
  priceRange: {
    low: number;
    high: number;
  };
}

interface QueryProductsParams {
  category?: string;
  rating?: string;
  low?: number;
  high?: number;
  sortPrice?: string;
  pageNumber?: number;
  searchValue?: string;
}

interface QueryProductsResponse {
  products: Product[];
  totalProduct: number;
  parPage: number;
}

interface ProductDetailsResponse {
  product: ProductDetails;
  relatedProducts: Product[];
  moreProducts: Product[];
}

interface ReviewSubmissionData {
  productId: string;
  name: string;
  email: string;
  review: string;
  rating: number;
}

interface ReviewsResponse {
  reviews: Review[];
  totalReview: number;
  rating_review: Array<{
    rating: number;
    sum: number;
  }>;
}

interface BannersResponse {
  banners: Banner[];
}

interface GenericResponse {
  message: string;
}

// Categories
export const useGetCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<CategoriesResponse>('/home/get-categorys');
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - categories don't change often
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Products
export const useGetProducts = () => {
  const { 
    setProducts, 
    setLatestProducts, 
    setTopRatedProducts, 
    setDiscountProducts 
  } = useHomeStore();

  const query = useQuery<ProductsResponse>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get<ProductsResponse>('/home/get-products');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use useEffect to handle side effects when data changes
  useEffect(() => {
    if (query.data) {
      setProducts(query.data.products);
      setLatestProducts(query.data.latest_product);
      setTopRatedProducts(query.data.topRated_product);
      setDiscountProducts(query.data.discount_product);
    }
  }, [query.data, setProducts, setLatestProducts, setTopRatedProducts, setDiscountProducts]);

  return query;
};

// Price Range Products
export const usePriceRangeProducts = () => {
  const { setLatestProducts, setPriceRange } = useHomeStore();

  const query = useQuery<PriceRangeResponse>({
    queryKey: ['priceRangeProducts'],
    queryFn: async () => {
      const { data } = await api.get<PriceRangeResponse>('/home/price-range-latest-product');
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  useEffect(() => {
    if (query.data) {
      setLatestProducts(query.data.latest_product);
      setPriceRange(query.data.priceRange);
    }
  }, [query.data, setLatestProducts, setPriceRange]);

  return query;
};

// Query Products with filters
export const useQueryProducts = (params: QueryProductsParams) => {
  const { setProducts, setTotalProduct, setParPage } = useHomeStore();

  const queryString = new URLSearchParams({
    category: params.category || '',
    rating: params.rating || '',
    lowPrice: params.low?.toString() || '',
    highPrice: params.high?.toString() || '',
    sortPrice: params.sortPrice || '',
    pageNumber: params.pageNumber?.toString() || '1',
    searchValue: params.searchValue || '',
  }).toString();

  const query = useQuery<QueryProductsResponse>({
    queryKey: ['queryProducts', params],
    queryFn: async () => {
      const { data } = await api.get<QueryProductsResponse>(`/home/query-products?${queryString}`);
      return data;
    },
    enabled: Object.keys(params).length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes for search results
  });

  useEffect(() => {
    if (query.data) {
      setProducts(query.data.products);
      setTotalProduct(query.data.totalProduct);
      setParPage(query.data.parPage);
    }
  }, [query.data, setProducts, setTotalProduct, setParPage]);

  return query;
};

// Product Details
export const useProductDetails = (slug: string) => {
  const { setProduct, setRelatedProducts, setMoreProducts } = useHomeStore();

  const query = useQuery<ProductDetailsResponse>({
    queryKey: ['productDetails', slug],
    queryFn: async () => {
      const { data } = await api.get<ProductDetailsResponse>(`/home/product-details/${slug}`);
      return data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  useEffect(() => {
    if (query.data) {
      setProduct(query.data.product);
      setRelatedProducts(query.data.relatedProducts);
      setMoreProducts(query.data.moreProducts);
    }
  }, [query.data, setProduct, setRelatedProducts, setMoreProducts]);

  return query;
};

// Reviews
export const useGetReviews = (productId: string, pageNumber: number = 1) => {
  const { setReviews, setTotalReview, setRatingReview } = useHomeStore();

  const query = useQuery<ReviewsResponse>({
    queryKey: ['reviews', productId, pageNumber],
    queryFn: async () => {
      const { data } = await api.get<ReviewsResponse>(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`);
      return data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setReviews(query.data.reviews);
      setTotalReview(query.data.totalReview);
      setRatingReview(query.data.rating_review);
    }
  }, [query.data, setReviews, setTotalReview, setRatingReview]);

  return query;
};

// Submit Review Mutation
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const { setLoader, setError, setSuccess } = useHomeStore();

  return useMutation<GenericResponse, AxiosError<ApiError>, ReviewSubmissionData>({
    mutationFn: async (reviewData: ReviewSubmissionData) => {
      const { data } = await api.post<GenericResponse>('/home/customer/submit-review', reviewData);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data, variables) => {
      setSuccess(data.message);
      toast.success(data.message);
      
      // Invalidate reviews to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to submit review';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Banners
export const useGetBanners = () => {
  const { setBanners } = useHomeStore();

  const query = useQuery<BannersResponse>({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data } = await api.get<BannersResponse>('/banners');
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes - banners don't change often
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (query.data) {
      setBanners(query.data.banners);
    }
  }, [query.data, setBanners]);

  return query;
};

// Hook for home state
export const useHomeState = () => {
  const homeState = useHomeStore();
  
  return {
    categories: homeState.categories,
    products: homeState.products,
    totalProduct: homeState.totalProduct,
    parPage: homeState.parPage,
    latestProducts: homeState.latestProducts,
    topRatedProducts: homeState.topRatedProducts,
    discountProducts: homeState.discountProducts,
    priceRange: homeState.priceRange,
    product: homeState.product,
    relatedProducts: homeState.relatedProducts,
    moreProducts: homeState.moreProducts,
    reviews: homeState.reviews,
    totalReview: homeState.totalReview,
    ratingReview: homeState.ratingReview,
    banners: homeState.banners,
    errorMessage: homeState.errorMessage,
    successMessage: homeState.successMessage,
    loader: homeState.loader,
    clearMessages: homeState.clearMessages,
  };
};