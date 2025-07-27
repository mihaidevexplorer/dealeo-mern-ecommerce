// src/types/index.ts

// User & Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  exp?: number;
  iat?: number;
  role?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface AuthState {
  userInfo: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
  description?: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  stock: number;
  description: string;
  shopName: string;
  sellerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDetails extends Product {
  reviews?: Review[];
  totalReview?: number;
  specifications?: Record<string, string | number | boolean | string[]>;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  _id: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  images: string[];
}

// Card Types (renamed from Cart)
export interface CardProduct {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardState {
  cardProducts: CardProduct[];
  cardProductCount: number;
  price: number;
  shippingFee: number;
  outOfStockProducts: CardProduct[];
  buyProductItem: number;
}

// Wishlist Types - Actualizat pentru compatibilitate cu modelul JavaScript original
export interface WishlistItem {
  _id: string;
  userId: string;
  productId: string; // String ID, nu obiect Product
  name: string; // Numele produsului stocat direct
  price: number; // Prețul produsului stocat direct
  slug: string; // Slug-ul produsului stocat direct
  discount: number; // Discountul produsului stocat direct
  image: string; // Imaginea produsului stocată direct
  rating: number; // Rating-ul produsului stocat direct
  stock?: number; // Stock-ul poate fi adăugat de backend
  createdAt?: string;
  updatedAt?: string;
}

// Wishlist cu Product populat (pentru cazurile în care se face populate)
export interface WishlistItemPopulated {
  _id: string;
  userId: string;
  productId: Product; // Obiect Product complet
  createdAt?: string;
  updatedAt?: string;
}

// Shipping Info Types
export interface ShippingInfo {
  name: string;
  address: string;
  phone: string;
  post: string;
  province: string;
  city: string;
  area: string;
}

// Order Product Types
export interface OrderProduct {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  category?: string;
  brand?: string;
  discount?: number;
}

// Order Types
export interface Order {
  _id: string;
  customerId: string;
  products: CardProduct[];
  price: number;
  delivery_status: 'pending' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'warehouse' | 'return_requested';
  payment_status: 'pending' | 'paid' | 'unpaid' | 'cancelled' | 'refunded';
  date: string;
  shippingInfo: ShippingInfo;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Place Order Data Types
export interface PlaceOrderData {
  price: number;
  products: OrderProduct[];
  shipping_fee: number;
  items: number;
  shippingInfo: ShippingInfo;
  userId: string;
}

// Review Types
export interface Review {
  _id: string;
  productId: string;
  name: string;
  rating: number;
  review: string;
  date: string;
  userId?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Banner Types
export interface Banner {
  _id: string;
  productId?: string;
  banner: string;
  link: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Chat & Message Types
export interface ChatMessage {
  _id: string;
  senderId: string;
  receverId: string; // Keeping original typo for API compatibility
  receiverId?: string; // Alternative spelling
  message: string;
  status: 'sent' | 'delivered' | 'seen';
  messageType?: 'text' | 'image' | 'file' | 'emoji';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Friend {
  fdId: string;
  name: string;
  image: string;
  isOnline?: boolean;
  lastSeen?: string;
  isBlocked?: boolean;
}

export interface ChatRoom {
  _id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OnlineUser {
  userId: string;
  sellerId?: string;
  name: string;
  image: string;
  socketId?: string;
  lastActivity?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalOrder: number;
  pendingOrder: number;
  cancelledOrder: number;
  recentOrders: Order[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  error?: string;
  success?: boolean;
}

// Auth Form Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}

// Product Query Types
export interface ProductQuery {
  category?: string;
  rating?: string;
  low?: number;
  high?: number;
  sortPrice?: string;
  pageNumber?: number;
  searchValue?: string;
}

// Home Store Types
export interface PriceRange {
  low: number;
  high: number;
}

export interface RatingReview {
  rating: number;
  sum: number;
}

// Pagination Types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Filter & Search Types
export interface ProductFilters {
  category?: string;
  rating?: string;
  lowPrice?: number;
  highPrice?: number;
  sortPrice?: 'low-to-high' | 'high-to-low';
  pageNumber?: number;
  searchValue?: string;
}

// Payment Types
export interface PaymentInfo {
  method: 'stripe' | 'paypal' | 'cash';
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  amount: number;
}

// Chat/Message Types (Extended)
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: 'sent' | 'delivered' | 'seen';
  createdAt: string;
}

export interface Chat {
  _id: string;
  myId: string;
  friendId: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

// Navigation Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}