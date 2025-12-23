// src/components/products/FeatureProducts.tsx
import { FaEye, FaRegHeart,} from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { 
  useAddToCart, 
  useAddToWishlist, 
  useCartState 
} from '../../hooks/useCard';
import { useCurrentUser } from '../../hooks/useAuth';
import type { Product } from '../../types';

interface FeatureProductsProps {
  products: Product[];
}

const FeatureProducts: React.FC<FeatureProductsProps> = ({ products }) => {
  const navigate = useNavigate();
  const userInfo = useCurrentUser();
  const { loader } = useCartState();

  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();

  const handleAddToCart = (productId: string) => {
    if (userInfo) {
      addToCartMutation.mutate({
        userId: userInfo.id,
        productId,
        quantity: 1
      });
    } else {
      navigate('/login');
    }
  };

  const handleAddToWishlist = (productId: string) => {
    if (userInfo) {
      addToWishlistMutation.mutate({
        userId: userInfo.id,
        productId
      });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='w-full max-w-7xl mx-auto px-8 xl:px-6 lg:px-5 md:px-4 sm:px-3 xs:px-2 py-12 xl:py-10 md:py-8 sm:py-7 xs:py-6'>
      {/* Header */}
      <div className='text-center mb-12 xl:mb-10 sm:mb-8 px-2'>
        <h2 className='text-4xl xl:text-3xl lg:text-2xl md:text-xl sm:text-lg xs:text-base font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
          Featured Products
        </h2>
        <p className='text-gray-500 mt-2 lg:text-sm sm:text-xs'>Discover our handpicked selection</p>
        <div className='flex items-center justify-center gap-2 mt-4 sm:mt-3'>
          <div className='w-16 sm:w-12 xs:w-10 h-1 bg-gradient-to-r from-transparent to-blue-500'></div>
          <AiFillStar className='text-blue-500 text-sm' />
          <div className='w-16 sm:w-12 xs:w-10 h-1 bg-gradient-to-l from-transparent to-blue-500'></div>
        </div>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-6 lg:gap-5 md:gap-4 sm:gap-3'>
        {products.map((p, i) => (
          <div 
            key={i} 
            className='group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
          >
            {/* Product Image */}
            <div className='relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'>
              {/* Discount Badge */}
              {p.discount > 0 && (
                <div className='absolute top-2 left-2 z-10'>
                  <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-[10px] font-bold px-2 py-1 sm:px-1.5 sm:py-0.5 rounded-full shadow-md animate-pulse'>
                    -{p.discount}%
                  </div>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => handleAddToWishlist(p._id)}
                disabled={addToWishlistMutation.isPending}
                className='absolute top-2 right-2 z-10 p-2 md:p-1.5 xs:p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 group/wishlist'
                title="Add to wishlist"
              >
                <FaRegHeart className='text-gray-600 group-hover/wishlist:text-red-500 transition-colors' size={16} />
              </button>

              {/* Product Image */}
              <Link to={`/product/details/${p.slug}`}>
                <img 
                  src={p.images[0]} 
                  alt={p.name} 
                  className='w-full h-full object-contain p-4 lg:p-3 xs:p-2 group-hover:scale-105 transition-transform duration-300' 
                  loading="lazy"
                />
              </Link>

              {/* Quick Actions Overlay (hover only) */}
              <div className='absolute inset-x-0 bottom-0 p-3 sm:p-2 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
                <div className='flex justify-center gap-2 sm:gap-1.5'>
                  <Link 
                    to={`/product/details/${p.slug}`} 
                    className='flex items-center gap-1.5 px-3 py-1.5 sm:px-2 sm:py-1 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 text-xs sm:text-[11px] font-medium'
                    title="Quick view"
                  >
                    <FaEye className="text-sm sm:text-xs" />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(p._id)}
                    disabled={addToCartMutation.isPending || loader || p.stock === 0}
                    className='flex items-center gap-1.5 px-3 py-1.5 sm:px-2 sm:py-1 bg-blue-600/95 backdrop-blur-sm text-white rounded-full hover:bg-blue-700 hover:shadow-lg transition-all duration-300 text-xs sm:text-[11px] font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                    title={p.stock === 0 ? "Out of stock" : "Add to cart"}
                  >
                    <RiShoppingCartLine className="text-sm sm:text-xs" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Out of Stock Overlay */}
              {p.stock === 0 && (
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center px-2'>
                  <span className='bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm sm:text-xs font-semibold text-gray-800 text-center'>
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className='p-4 xl:p-3 sm:p-2.5'>
              {/* Product Name */}
              <Link to={`/product/details/${p.slug}`} className='block mb-2'>
                <h3 className='text-[14px] xl:text-sm lg:text-[13px] sm:text-[12px] font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem] sm:min-h-[2.25rem]'>
                  {p.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className='flex items-center gap-1 mb-2 sm:mb-1.5'>
                <Rating ratings={p.rating} />
                <span className='text-xs sm:text-[11px] text-gray-500'>({p.rating})</span>
              </div>

              {/* Price */}
              <div className='flex items-baseline gap-2 flex-wrap'>
                {p.discount > 0 ? (
                  <>
                    <span className='text-base xl:text-[15px] sm:text-[14px] font-bold text-gray-900'>
                      ${(p.price * (1 - p.discount / 100)).toFixed(2)}
                    </span>
                    <span className='text-xs sm:text-[11px] text-gray-400 line-through'>
                      ${p.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className='text-base xl:text-[15px] sm:text-[14px] font-bold text-gray-900'>
                    ${p.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock indicator */}
              {p.stock !== undefined && (
                <div className='mt-2 sm:mt-1.5'>
                  {p.stock > 0 ? (
                    p.stock < 10 ? (
                      <div className='flex items-center gap-1'>
                        <div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse'></div>
                        <span className='text-xs sm:text-[11px] text-orange-600 font-medium'>
                          Only {p.stock} left
                        </span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-1'>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                        <span className='text-xs sm:text-[11px] text-green-600'>In Stock</span>
                      </div>
                    )
                  ) : (
                    <div className='flex items-center gap-1'>
                      <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                      <span className='text-xs sm:text-[11px] text-red-600 font-medium'>Out of Stock</span>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(p._id)}
                disabled={addToCartMutation.isPending || loader || p.stock === 0}
                className='mt-4 sm:mt-3 w-full px-3 sm:px-2 py-2 sm:py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm xl:text-[13px] lg:text-[12px] sm:text-[11px] font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-1.5 whitespace-nowrap'
              >
                {addToCartMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <RiShoppingCartLine className="text-base xl:text-sm sm:text-sm" />
                    <span>{p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureProducts;
