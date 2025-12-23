//src/components/products/ShopProducts.tsx
import React from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from "../Rating";
import { Link, useNavigate } from "react-router-dom";
import { useAddToCart, useAddToWishlist, useCartState } from "../../hooks/useCard";
import { useAuthState } from "../../hooks/useAuth";
import type { Product } from "../../types";

type DisplayStyle = "grid" | "list";

interface ShopProductsProps {
  styles: DisplayStyle;
  products: Product[];
}

const ShopProducts: React.FC<ShopProductsProps> = ({ styles, products }) => {
  const navigate = useNavigate();
  const { userInfo } = useAuthState();
  const { loader } = useCartState();

  // Mutations
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();

  // Add to cart
  const add_card = (id: string): void => {
    if (userInfo) {
      addToCartMutation.mutate({
        userId: userInfo.id,
        quantity: 1,
        productId: id,
      });
    } else {
      navigate("/login");
    }
  };

  // Add to wishlist
  const handleAddToWishlist = (product: Product): void => {
    if (userInfo) {
      addToWishlistMutation.mutate({
        userId: userInfo.id,
        productId: product._id,
      });
    } else {
      navigate("/login");
    }
  };

  // Grid View Component
  const GridView = ({ p }: { p: Product }) => (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Discount Badge */}
        {p.discount > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
              -{p.discount}%
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => handleAddToWishlist(p)}
          disabled={addToWishlistMutation.isPending}
          className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 group/wishlist"
          title="Add to wishlist"
        >
          <FaRegHeart
            className="text-gray-600 group-hover/wishlist:text-red-500 transition-colors"
            size={16}
          />
        </button>

        {/* Product Image */}
        <Link to={`/product/details/${p.slug}`}>
          <img
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            src={p.images[0]}
            alt={p.name}
            loading="lazy"
          />
        </Link>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex justify-center gap-2">
            <Link
              to={`/product/details/${p.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 text-xs font-medium"
              title="Quick view"
            >
              <FaEye className="text-sm" />
              <span>View</span>
            </Link>
            <button
              onClick={() => add_card(p._id)}
              disabled={addToCartMutation.isPending || loader || p.stock === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/95 backdrop-blur-sm text-white rounded-full hover:bg-blue-700 hover:shadow-lg transition-all duration-300 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title={p.stock === 0 ? "Out of stock" : "Add to cart"}
            >
              <RiShoppingCartLine className="text-sm" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Out of Stock Overlay */}
        {p.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3">
        <Link to={`/product/details/${p.slug}`} className="block mb-2">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem]">
            {p.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Rating ratings={p.rating} />
          <span className="text-xs text-gray-500">({p.rating})</span>
        </div>

        <div className="flex items-baseline gap-1.5">
          {p.discount > 0 ? (
            <>
              <span className="text-base font-bold text-gray-900">
                ${(p.price * (1 - p.discount / 100)).toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-base font-bold text-gray-900">${p.price.toFixed(2)}</span>
          )}
        </div>

        {/* Stock Indicator */}
        {p.stock !== undefined && (
          <div className="mt-1.5">
            {p.stock > 0 ? (
              p.stock < 10 ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-orange-600 font-medium">Only {p.stock} left</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">In Stock</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // List View Component
  const ListView = ({ p }: { p: Product }) => (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
      {/* Product Image */}
      <div className="relative sm:w-48 aspect-square sm:aspect-auto overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {p.discount > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              -{p.discount}%
            </div>
          </div>
        )}

        <Link to={`/product/details/${p.slug}`}>
          <img className="w-full h-full object-contain p-4" src={p.images[0]} alt={p.name} loading="lazy" />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <Link to={`/product/details/${p.slug}`}>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-2">
              {p.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <Rating ratings={p.rating} />
            <span className="text-sm text-gray-500">({p.rating} reviews)</span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            {p.discount > 0 ? (
              <>
                <span className="text-2xl font-bold text-gray-900">
                  ${(p.price * (1 - p.discount / 100)).toFixed(2)}
                </span>
                <span className="text-base text-gray-400 line-through">${p.price.toFixed(2)}</span>
                <span className="text-sm text-green-600 font-medium">
                  Save ${(p.price * p.discount / 100).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">${p.price.toFixed(2)}</span>
            )}
          </div>

          {p.stock !== undefined && (
            <div className="mb-4">
              {p.stock > 0 ? (
                p.stock < 10 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-orange-600 font-medium">Only {p.stock} left in stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">In Stock</span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => add_card(p._id)}
            disabled={addToCartMutation.isPending || loader || p.stock === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {addToCartMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <RiShoppingCartLine className="text-lg" />
                <span>{p.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleAddToWishlist(p)}
            disabled={addToWishlistMutation.isPending}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group/wishlist"
            title="Add to wishlist"
          >
            <FaRegHeart className="text-lg text-gray-600 group-hover/wishlist:text-red-500 transition-colors" />
          </button>

          <Link
            to={`/product/details/${p.slug}`}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="View details"
          >
            <FaEye className="text-lg text-gray-600" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`w-full ${
        styles === "grid"
          ? // max-width breakpoints: default = desktop (largest)
            "grid grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-6 lg:gap-5 md:gap-4 sm:gap-3"
          : "flex flex-col gap-4 sm:gap-3"
      }`}
    >
      {products.map((p, i) =>
        styles === "grid" ? <GridView key={p._id ?? i} p={p} /> : <ListView key={p._id ?? i} p={p} />
      )}
    </div>
  );
};

export default ShopProducts;
