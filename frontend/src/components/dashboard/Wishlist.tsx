// src/components/dashboard/Wishlist.tsx
import { FaEye, FaRegHeart, FaHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { BiSad } from "react-icons/bi";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { 
  useGetWishlistProducts, 
  useAddToCart, 
  useRemoveWishlist
} from '../../hooks/useCard';
import { useCurrentUser } from '../../hooks/useAuth';
import type { WishlistItem } from '../../types';

interface ProductData {
  _id: string;
  name: string;
  price: number;
  discount: number;
  images: string[];
  image?: string;
  rating: number;
  stock: number;
  slug?: string;
}

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const userInfo = useCurrentUser();

  // Queries and Mutations
  const { data: wishlistData, isLoading, error } = useGetWishlistProducts(userInfo?.id || '');
  const addToCartMutation = useAddToCart();
  const removeWishlistMutation = useRemoveWishlist();

  // Get wishlist from the query data
  const wishlist = wishlistData?.wishlists || [];

  const handleRemoveFromWishlist = (wishlistId: string) => {
    if (userInfo) {
      removeWishlistMutation.mutate({
        wishlistId,
        userId: userInfo.id
      });
    }
  };

  // Helper function to get product data from wishlist item
  const getProductData = (item: WishlistItem): ProductData => {
    // Handle case where productId is populated (object)
    if (typeof item.productId === 'object' && item.productId !== null && '_id' in item.productId) {
      const product = item.productId as ProductData;
      return {
        _id: product._id,
        name: product.name || '',
        price: product.price || 0,
        discount: product.discount || 0,
        images: product.images || (product.image ? [product.image] : []),
        rating: product.rating || 0,
        stock: product.stock ?? 1,
        slug: product.slug || ''
      };
    }
    
    // Handle case where product data is directly on the item
    return {
      _id: item.productId as string,
      name: item.name || '',
      price: item.price || 0,
      discount: item.discount || 0,
      images: item.image ? [item.image] : [],
      rating: item.rating || 0,
      stock: item.stock ?? 1,
      slug: item.slug || ''
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] xs:min-h-[300px] 2xs:min-h-[250px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 md:h-16 md:w-16 sm:h-14 sm:w-14 xs:h-12 xs:w-12 border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 md:h-16 md:w-16 sm:h-14 sm:w-14 xs:h-12 xs:w-12 border-t-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] xs:min-h-[300px] 2xs:min-h-[250px] px-4 sm:px-3 2xs:px-2">
        <div className="bg-red-50 border border-red-200 rounded-2xl md:rounded-xl sm:rounded-lg p-8 md:p-6 sm:p-4 xs:p-3 text-center max-w-md sm:max-w-sm xs:max-w-xs">
          <div className="w-16 h-16 md:w-14 md:h-14 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-3">
            <BiSad className="text-2xl md:text-xl sm:text-lg text-red-500" />
          </div>
          <p className="text-lg md:text-base sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-1">Oops! Something went wrong</p>
          <p className="text-sm md:text-xs text-gray-600 mb-1">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 sm:mt-3 px-6 md:px-5 sm:px-4 py-2 md:py-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-base md:text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!wishlist.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] xs:min-h-[300px] 2xs:min-h-[250px] px-4 sm:px-3 2xs:px-2">
        <div className="text-center">
          <div className="relative inline-block mb-6 md:mb-5 sm:mb-4">
            <div className="w-24 h-24 md:w-20 md:h-20 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <FaRegHeart className="text-4xl md:text-3xl sm:text-2xl text-purple-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 md:-bottom-1 md:-right-1 sm:-bottom-1 sm:-right-1 w-8 h-8 md:w-7 md:h-7 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-sm md:text-xs font-bold">0</span>
            </div>
          </div>
          <h3 className="text-2xl md:text-xl sm:text-lg xs:text-base font-bold text-gray-800 mb-2 sm:mb-1">Your wishlist is empty</h3>
          <p className="text-sm md:text-xs sm:text-xs text-gray-500 mb-6 md:mb-5 sm:mb-4 max-w-sm md:max-w-xs sm:max-w-[280px] xs:max-w-[240px] mx-auto">
            Start adding your favorite products to keep track of what you love!
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 md:gap-1.5 sm:gap-1 px-8 md:px-6 sm:px-5 xs:px-4 py-3 md:py-2.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-base md:text-sm sm:text-sm"
          >
            <RiShoppingCartLine className="text-xl md:text-lg sm:text-base" />
            <span className="font-medium">Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-5 md:p-4 sm:p-3 xs:p-2">
      {/* Header */}
      <div className="mb-8 lg:mb-6 md:mb-5 sm:mb-4">
        <h2 className="text-3xl lg:text-2xl md:text-xl sm:text-lg font-bold text-gray-800 mb-2 md:mb-1">My Wishlist</h2>
        <p className="text-sm md:text-xs sm:text-xs text-gray-500">
          You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      {/* Products Grid - Responsive pentru toate dimensiunile */}
      <div className="grid grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md-lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 2xs:grid-cols-1 gap-5 lg:gap-4 md:gap-3 sm:gap-3 xs:gap-2">
        {wishlist.map((item: WishlistItem) => {
          const product = getProductData(item);
          
          // Skip items with invalid product data
          if (!product || !product.name) {
            return null;
          }
          
          return (
            <div 
              key={item._id} 
              className='group relative bg-white rounded-xl md:rounded-lg sm:rounded-lg overflow-hidden shadow-sm hover:shadow-xl md:hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-0.5'
            >
              {/* Product Image Container */}
              <div className='relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'>
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className='absolute top-2 md:top-1.5 sm:top-1 xs:top-1 left-2 md:left-1.5 sm:left-1 xs:left-1 z-10'>
                    <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs md:text-[11px] sm:text-[10px] xs:text-[9px] font-bold px-2 md:px-1.5 sm:px-1.5 xs:px-1 py-1 md:py-0.5 sm:py-0.5 rounded-full shadow-md'>
                      -{product.discount}%
                    </div>
                  </div>
                )}

                {/* Remove from Wishlist Button */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveFromWishlist(item._id);
                  }} 
                  className='absolute top-2 md:top-1.5 sm:top-1 xs:top-1 right-2 md:right-1.5 sm:right-1 xs:right-1 z-10 p-2 md:p-1.5 sm:p-1.5 xs:p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 group/btn'
                  disabled={removeWishlistMutation.isPending}
                  title="Remove from wishlist"
                >
                  <FaHeart className="text-sm md:text-xs sm:text-xs text-red-500 group-hover/btn:scale-110 transition-transform" />
                </button>
                
                {/* Product Image */}
                <Link to={`/product/details/${product.slug ? product.slug.toLowerCase() : ''}`}>
                  <img 
                    className='w-full h-full object-contain p-4 md:p-3 sm:p-2 xs:p-2 group-hover:scale-105 transition-transform duration-300' 
                    src={product.images?.[0] || '/placeholder-image.jpg'} 
                    alt={product.name}
                    loading="lazy"
                  />
                </Link>

                {/* Quick Actions Overlay - Vizibil doar pe ecrane foarte mari */}
                <div className='xl:hidden lg:hidden md-lg:hidden md:hidden sm:hidden xs:hidden 2xs:hidden absolute inset-x-0 bottom-0 p-3 md:p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
                  <div className='flex justify-center'>
                    <Link 
                      to={`/product/details/${product.slug ? product.slug.toLowerCase() : ''}`} 
                      className='flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 text-xs font-medium'
                      title="View product details"
                    >
                      <FaEye className="text-sm" />
                      <span>View</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className='p-3 md:p-2.5 sm:p-2 xs:p-2'>
                {/* Product Name */}
                <Link 
                  to={`/product/details/${product.slug ? product.slug.toLowerCase() : ''}`}
                  className='block mb-2 md:mb-1.5 sm:mb-1'
                >
                  <h3 className='text-sm md:text-xs sm:text-xs xs:text-[11px] font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem] md:min-h-[2.25rem] sm:min-h-[2rem] xs:min-h-[1.75rem]'>
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className='flex items-center gap-1 md:gap-0.5 sm:gap-0.5 mb-2 md:mb-1.5 sm:mb-1'>
                  <div className='scale-90 md:scale-75 sm:scale-75 xs:scale-[0.7] origin-left'>
                    <Rating ratings={product.rating} />
                  </div>
                  <span className='text-xs md:text-[10px] sm:text-[10px] xs:text-[9px] text-gray-500'>({product.rating})</span>
                </div>

                {/* Price */}
                <div className='flex items-center justify-between mb-3 md:mb-2 sm:mb-2'>
                  <div className='flex items-baseline gap-1.5 md:gap-1 sm:gap-1'>
                    {product.discount > 0 ? (
                      <>
                        <span className='text-base md:text-sm sm:text-xs xs:text-xs font-bold text-gray-900'>
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className='text-xs md:text-[10px] sm:text-[10px] xs:text-[9px] text-gray-400 line-through'>
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className='text-base md:text-sm sm:text-xs xs:text-xs font-bold text-gray-900'>
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get product ID
                    let pid: string;
                    if (typeof item.productId === 'object' && item.productId !== null && '_id' in item.productId) {
                      pid = (item.productId as ProductData)._id;
                    } else {
                      pid = item.productId as string;
                    }
                    
                    if (userInfo && pid) {
                      addToCartMutation.mutate({
                        userId: userInfo.id,
                        productId: pid,
                        quantity: 1
                      });
                    } else if (!userInfo) {
                      navigate('/login');
                    }
                  }} 
                  className='w-full flex items-center justify-center gap-1.5 md:gap-1 sm:gap-1 px-3 md:px-2 sm:px-2 py-2 md:py-1.5 sm:py-1.5 xs:py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg md:rounded-md sm:rounded-md hover:from-blue-700 hover:to-blue-800 hover:shadow-md transform hover:scale-[1.02] md:hover:scale-[1.01] transition-all duration-300 text-sm md:text-xs sm:text-xs xs:text-[11px] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                  disabled={addToCartMutation.isPending}
                  title="Add to cart"
                >
                  {addToCartMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 md:h-2.5 md:w-2.5 sm:h-2 sm:w-2 border-2 border-white border-t-transparent"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <RiShoppingCartLine className="text-base md:text-sm sm:text-xs" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Items Counter - Vizibil pe mobile/tablet */}
      {wishlist.length > 0 && (
        <div className="hidden md-lg:block md:block sm:block xs:block 2xs:block mt-6 md:mt-5 sm:mt-4 text-center">
          <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span className="text-xs sm:text-[11px] text-gray-600">
              Showing {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
