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

  const { data: wishlistData, isLoading, error } = useGetWishlistProducts(userInfo?.id || '');
  const addToCartMutation = useAddToCart();
  const removeWishlistMutation = useRemoveWishlist();

  const wishlist = wishlistData?.wishlists || [];

  const handleRemoveFromWishlist = (wishlistId: string) => {
    if (userInfo) {
      removeWishlistMutation.mutate({
        wishlistId,
        userId: userInfo.id
      });
    }
  };

  const getProductData = (item: WishlistItem): ProductData => {
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

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BiSad className="text-red-500 text-2xl" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] px-4">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 md:w-20 md:h-20 xs:w-16 xs:h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <FaRegHeart className="text-4xl md:text-3xl xs:text-2xl text-purple-500" />
            </div>
          </div>
          <h3 className="text-2xl md:text-xl xs:text-lg font-bold text-gray-800 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto xs:text-sm">
            Start adding your favorite products to keep track of what you love!
          </p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 xs:px-6 xs:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full transition-all duration-300"
          >
            <RiShoppingCartLine />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-5 md-lg:p-4 md:p-3 sm:p-3 xs:p-2">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-2xl md-lg:text-xl md:text-lg sm:text-base xs:text-sm font-bold text-gray-800 mb-2">
          My Wishlist
        </h2>
        <p className="text-gray-500 sm:text-sm xs:text-xs">
          You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      {/* Grid */}
      <div className="
        grid
        grid-cols-6
        xl:grid-cols-5
        lg:grid-cols-4
        md-lg:grid-cols-3
        md:grid-cols-2
        xs:grid-cols-1
        gap-4 md:gap-3 xs:gap-2
      ">
        {wishlist.map((item: WishlistItem) => {
          const product = getProductData(item);
          if (!product || !product.name) return null;

          return (
            <div
              key={item._id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 lg:hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}

                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow"
                >
                  <FaHeart className="text-red-500 text-sm" />
                </button>

                <Link to={`/product/details/${product.slug?.toLowerCase() || ''}`}>
                  <img
                    src={product.images?.[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 md:p-3 sm:p-2 transition-transform duration-300 lg:group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* Details */}
              <div className="p-3">
                <Link to={`/product/details/${product.slug?.toLowerCase() || ''}`}>
                  <h3 className="text-sm md:text-xs xs:text-xs font-medium text-gray-800 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-2">
                  <Rating ratings={product.rating} />
                  <span className="text-xs text-gray-500">({product.rating})</span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-base md:text-sm xs:text-sm font-bold text-gray-900">
                    ${product.discount
                      ? (product.price * (1 - product.discount / 100)).toFixed(2)
                      : product.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!userInfo) return navigate('/login');
                    addToCartMutation.mutate({
                      userId: userInfo.id,
                      productId: product._id,
                      quantity: 1
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 md:py-1.5 xs:py-1 text-sm md:text-xs bg-blue-600 text-white rounded-lg transition-all"
                >
                  <RiShoppingCartLine />
                  Add to Cart
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
