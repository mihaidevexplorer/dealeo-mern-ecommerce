//src/components/dashboard/Wishlist.tsx
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BiSad className="text-red-500 text-2xl" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</p>
          <p className="text-sm text-gray-600">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
      <div className="flex flex-col justify-center items-center min-h-[400px] px-4">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <FaRegHeart className="text-4xl text-purple-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-sm font-bold">0</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Start adding your favorite products to keep track of what you love!
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <RiShoppingCartLine className="text-xl" />
            <span className="font-medium">Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">My Wishlist</h2>
        <p className="text-gray-500">You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist</p>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
        {wishlist.map((item: WishlistItem) => {
          const product = getProductData(item);
          
          // Skip items with invalid product data
          if (!product || !product.name) {
            return null;
          }
          
          return (
            <div 
              key={item._id} 
              className='group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
            >
              {/* Product Image */}
              <div className='relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'>
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className='absolute top-2 left-2 z-10'>
                    <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md'>
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
                  className='absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 group/btn'
                  disabled={removeWishlistMutation.isPending}
                  title="Remove from wishlist"
                >
                  <FaHeart className="text-red-500 text-sm group-hover/btn:scale-110 transition-transform" />
                </button>
                
                {/* Product Image */}
                <Link to={`/product/details/${product.slug ? product.slug.toLowerCase() : ''}`}>
                  <img 
                    className='w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300' 
                    src={product.images?.[0] || '/placeholder-image.jpg'} 
                    alt={product.name}
                    loading="lazy"
                  />
                </Link>

                {/* Quick Actions Overlay */}
                <div className='absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
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
              <div className='p-3'>
                {/* Product Name */}
                <Link 
                  to={`/product/details/${product.slug ? product.slug.toLowerCase() : ''}`}
                  className='block mb-2'
                >
                  <h3 className='text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors'>
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className='flex items-center gap-1 mb-2'>
                  <Rating ratings={product.rating} />
                  <span className='text-xs text-gray-500'>({product.rating})</span>
                </div>

                {/* Price */}
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-baseline gap-1.5'>
                    {product.discount > 0 ? (
                      <>
                        <span className='text-base font-bold text-gray-900'>
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className='text-xs text-gray-400 line-through'>
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className='text-base font-bold text-gray-900'>
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
                  className='w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                  disabled={addToCartMutation.isPending}
                  title="Add to cart"
                >
                  {addToCartMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <RiShoppingCartLine className="text-base" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;