// src/store/useHomeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Category, 
  Product, 
  ProductDetails, 
  Review, 
  Banner 
} from '../types';

interface PriceRange {
  low: number;
  high: number;
}

interface RatingReview {
  rating: number;
  sum: number;
}

interface HomeState {
  categories: Category[];
  products: Product[];
  totalProduct: number;
  parPage: number;
  latestProducts: Product[];
  topRatedProducts: Product[];
  discountProducts: Product[];
  priceRange: PriceRange;
  product: ProductDetails | null;
  relatedProducts: Product[];
  moreProducts: Product[];
  reviews: Review[];
  totalReview: number;
  ratingReview: RatingReview[];
  banners: Banner[];
  errorMessage: string;
  successMessage: string;
  loader: boolean;
}

interface HomeActions {
  setCategories: (categories: Category[]) => void;
  setProducts: (products: Product[]) => void;
  setTotalProduct: (total: number) => void;
  setParPage: (parPage: number) => void;
  setLatestProducts: (products: Product[]) => void;
  setTopRatedProducts: (products: Product[]) => void;
  setDiscountProducts: (products: Product[]) => void;
  setPriceRange: (range: PriceRange) => void;
  setProduct: (product: ProductDetails) => void;
  setRelatedProducts: (products: Product[]) => void;
  setMoreProducts: (products: Product[]) => void;
  setReviews: (reviews: Review[]) => void;
  setTotalReview: (total: number) => void;
  setRatingReview: (ratings: RatingReview[]) => void;
  setBanners: (banners: Banner[]) => void;
  setError: (error: string) => void;
  setSuccess: (message: string) => void;
  setLoader: (loading: boolean) => void;
  clearMessages: () => void;
  resetState: () => void;
}

type HomeStore = HomeState & HomeActions;

const initialState: HomeState = {
  categories: [],
  products: [],
  totalProduct: 0,
  parPage: 12,
  latestProducts: [],
  topRatedProducts: [],
  discountProducts: [],
  priceRange: {
    low: 0,
    high: 100
  },
  product: null,
  relatedProducts: [],
  moreProducts: [],
  reviews: [],
  totalReview: 0,
  ratingReview: [],
  banners: [],
  errorMessage: '',
  successMessage: '',
  loader: false,
};

export const useHomeStore = create<HomeStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Actions
      setCategories: (categories: Category[]) => set({ categories }),
      
      setProducts: (products: Product[]) => set({ products }),
      
      setTotalProduct: (totalProduct: number) => set({ totalProduct }),
      
      setParPage: (parPage: number) => set({ parPage }),
      
      setLatestProducts: (latestProducts: Product[]) => set({ latestProducts }),
      
      setTopRatedProducts: (topRatedProducts: Product[]) => set({ topRatedProducts }),
      
      setDiscountProducts: (discountProducts: Product[]) => set({ discountProducts }),
      
      setPriceRange: (priceRange: PriceRange) => set({ priceRange }),
      
      setProduct: (product: ProductDetails) => set({ product }),
      
      setRelatedProducts: (relatedProducts: Product[]) => set({ relatedProducts }),
      
      setMoreProducts: (moreProducts: Product[]) => set({ moreProducts }),
      
      setReviews: (reviews: Review[]) => set({ reviews }),
      
      setTotalReview: (totalReview: number) => set({ totalReview }),
      
      setRatingReview: (ratingReview: RatingReview[]) => set({ ratingReview }),
      
      setBanners: (banners: Banner[]) => set({ banners }),
      
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
      
      resetState: () => set(initialState),
    }),
    {
      name: 'home-storage',
      partialize: (state) => ({
        priceRange: state.priceRange,
        categories: state.categories, // Cache categories as they don't change often
      }),
    }
  )
);