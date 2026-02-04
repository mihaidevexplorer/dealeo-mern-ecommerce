// src/components/products/FeatureProducts.tsx
import React from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import Rating from "../Rating";
import { Link, useNavigate } from "react-router-dom";
import { useAddToCart, useAddToWishlist, useCartState } from "../../hooks/useCard";
import { useCurrentUser } from "../../hooks/useAuth";
import type { Product } from "../../types";

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
        quantity: 1,
      });
    } else {
      navigate("/login");
    }
  };

  const handleAddToWishlist = (productId: string) => {
    if (userInfo) {
      addToWishlistMutation.mutate({
        userId: userInfo.id,
        productId,
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-full mx-auto px-8 xl:px-6 lg:px-5 md-lg:px-4 md:px-4 sm:px-3 xs:px-2 2xs:px-2 py-10 xl:py-9 lg:py-9 md:py-8 sm:py-8 xs:py-7 2xs:py-6">
      {/* IMPORTANT: cap width so on TV the 4 columns don't become huge / misaligned */}
      <div className="mx-auto w-full max-w-[1400px] xl:max-w-[1280px] md-lg:max-w-full">
        {/* Header */}
        <div className="text-center mb-10 xl:mb-9 md:mb-8 sm:mb-7 xs:mb-6 2xs:mb-6 px-2">
          <h2 className="text-4xl xl:text-3xl lg:text-3xl md-lg:text-2xl md:text-2xl sm:text-xl xs:text-lg 2xs:text-[17px] font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Featured Products
          </h2>

          <p className="text-gray-500 mt-2 text-base xl:text-sm md:text-sm sm:text-[13px] xs:text-[12px] 2xs:text-[11px]">
            Discover our handpicked selection
          </p>

          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-3 xs:mt-3">
            <div className="w-16 xl:w-14 sm:w-12 xs:w-10 2xs:w-8 h-1 bg-gradient-to-r from-transparent to-blue-500" />
            <AiFillStar className="text-blue-500 text-sm xs:text-[12px] 2xs:text-[11px]" />
            <div className="w-16 xl:w-14 sm:w-12 xs:w-10 2xs:w-8 h-1 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
        </div>

        {/* Grid: ALWAYS 4 columns on large screens.
            Still collapses on smaller screens (md and below) */}
        <div className="grid grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 2xs:grid-cols-1 gap-6 xl:gap-5 md:gap-4 sm:gap-4 xs:gap-3 2xs:gap-3">
          {products.map((p) => {
            const hasDiscount = (p.discount ?? 0) > 0;
            const outOfStock = p.stock === 0;

            const finalPrice = hasDiscount
              ? (p.price * (1 - (p.discount ?? 0) / 100)).toFixed(2)
              : p.price.toFixed(2);

            return (
              <div
                key={p._id}
                className="group w-full min-w-0 relative bg-white rounded-xl xs:rounded-lg 2xs:rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 xs:hover:-translate-y-0.5"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 xs:top-1.5 xs:left-1.5 z-10">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs xs:text-[10px] font-bold px-2 py-1 xs:px-1.5 xs:py-0.5 rounded-full shadow-md">
                        -{p.discount}%
                      </div>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => handleAddToWishlist(p._id)}
                    disabled={addToWishlistMutation.isPending}
                    className="absolute top-2 right-2 xs:top-1.5 xs:right-1.5 z-10 p-2 xs:p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-60"
                    title="Add to wishlist"
                    aria-label="Add to wishlist"
                  >
                    <FaRegHeart className="text-gray-600 hover:text-red-500 transition-colors" size={16} />
                  </button>

                  <Link to={`/product/details/${p.slug}`} className="block w-full h-full">
                    {/* TV-safe: center image with fixed max size (prevents layout weirdness) */}
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="max-w-[84%] max-h-[84%] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Quick Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-3 xs:p-2 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 2xs:opacity-100 2xs:translate-y-0">
                    <div className="flex justify-center gap-2 xs:gap-1.5 flex-wrap">
                      <Link
                        to={`/product/details/${p.slug}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 xs:px-2 xs:py-1 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 text-xs font-medium"
                        title="View details"
                      >
                        <FaEye className="text-sm" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => handleAddToCart(p._id)}
                        disabled={addToCartMutation.isPending || loader || outOfStock}
                        className="flex items-center gap-1.5 px-3 py-1.5 xs:px-2 xs:py-1 bg-blue-600/95 backdrop-blur-sm text-white rounded-full hover:bg-blue-700 hover:shadow-lg transition-all duration-300 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        title={outOfStock ? "Out of stock" : "Add to cart"}
                      >
                        <RiShoppingCartLine className="text-sm" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Out of Stock Overlay */}
                  {outOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-2">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm xs:text-[13px] font-semibold text-gray-800 text-center">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 xl:p-4 md:p-3 sm:p-3 xs:p-3 2xs:p-3">
                  <Link to={`/product/details/${p.slug}`} className="block mb-2">
                    <h3 className="text-[15px] xl:text-sm md:text-[13px] xs:text-[13px] font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem] sm:min-h-[2.3rem] xs:min-h-[2.2rem] 2xs:min-h-0">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-2">
                    <Rating ratings={p.rating} />
                    <span className="text-xs xs:text-[11px] text-gray-500">({p.rating})</span>
                  </div>

                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg xl:text-base xs:text-[15px] font-bold text-gray-900">
                      ${finalPrice}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs xs:text-[11px] text-gray-400 line-through">
                        ${p.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {p.stock !== undefined && (
                    <div className="mt-2">
                      {p.stock > 0 ? (
                        p.stock < 10 ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 xs:w-1.5 xs:h-1.5 bg-orange-500 rounded-full animate-pulse" />
                            <span className="text-xs xs:text-[11px] text-orange-600 font-medium">
                              Only {p.stock} left
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 xs:w-1.5 xs:h-1.5 bg-green-500 rounded-full" />
                            <span className="text-xs xs:text-[11px] text-green-600">In Stock</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 xs:w-1.5 xs:h-1.5 bg-red-500 rounded-full" />
                          <span className="text-xs xs:text-[11px] text-red-600 font-medium">
                           /flutter Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(p._id)}
                    disabled={addToCartMutation.isPending || loader || outOfStock}
                    className="mt-4 sm:mt-3 xs:mt-3 w-full px-3 py-2 xs:px-2.5 xs:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm xs:text-[13px] font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {addToCartMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <RiShoppingCartLine className="text-base" />
                        <span>{outOfStock ? "Out of Stock" : "Add to Cart"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureProducts;
