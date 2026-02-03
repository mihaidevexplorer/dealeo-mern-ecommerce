//App.tsx
import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGetCategories } from './hooks/useHome';
import { Toaster } from 'react-hot-toast';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import("./pages/About"));
const Shops = React.lazy(() => import('./pages/Shops'));
const Card = React.lazy(() => import('./pages/Card'));
const Shipping = React.lazy(() => import('./pages/Shipping'));
const Details = React.lazy(() => import('./pages/Details'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const CategoryShop = React.lazy(() => import('./pages/CategoryShop'));
const SearchProducts = React.lazy(() => import('./pages/SearchProducts'));
const Payment = React.lazy(() => import('./pages/Payment'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ConfirmOrder = React.lazy(() => import('./pages/ConfirmOrder'));

// Dashboard components
const DashboardIndex = React.lazy(() => import('./components/dashboard/Index'));
const Orders = React.lazy(() => import('./components/dashboard/Orders'));
const ChangePassword = React.lazy(() => import('./components/dashboard/ChangePassword'));
const Wishlist = React.lazy(() => import('./components/dashboard/Wishlist'));
const OrderDetails = React.lazy(() => import('./components/dashboard/OrderDetails'));
const Chat = React.lazy(() => import('./components/dashboard/Chat'));

// Utils
const ProtectUser = React.lazy(() => import('./utils/ProtectUser'));

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff7f50]"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#ff7f50] text-white rounded-md hover:bg-[#ff6347] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  // Load categories on app startup
  useGetCategories();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/contact' element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path='/register' element={<Register />} />
        <Route path='/shops' element={<Shops />} />
        <Route path='/card' element={<Card />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/products' element={<CategoryShop />} />
        <Route path='/products/search' element={<SearchProducts />} />
        <Route path='/product/details/:slug' element={<Details />} />
        <Route path='/order/confirm' element={<ConfirmOrder />} />

        {/* Protected Dashboard Routes */}
        <Route path='/dashboard' element={<ProtectUser />}>
          <Route path='' element={<Dashboard />}>
            <Route index element={<DashboardIndex />} />
            <Route path='my-orders' element={<Orders />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path='my-wishlist' element={<Wishlist />} />
            <Route path='order/details/:orderId' element={<OrderDetails />} />
            <Route path='chat' element={<Chat />} />
            <Route path='chat/:sellerId' element={<Chat />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path='*' element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page not found</p>
              <a
                href="/"
                className="px-6 py-2 bg-[#ff7f50] text-white rounded-md hover:bg-[#ff6347] transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#283046',
            color: 'white',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <AppContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
