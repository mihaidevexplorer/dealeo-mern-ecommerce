//src/components/products/ShopProducts.jsx
import { useEffect } from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from "../Rating";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { add_to_card, add_to_wishlist, messageClear } from "../../store/reducers/cardReducer";
import toast from "react-hot-toast";

const ShopProducts = ({ styles, products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage } = useSelector((state) => state.card);

  // Add to cart
  const add_card = (id) => {
    if (userInfo) {
      dispatch(add_to_card({ userId: userInfo.id, quantity: 1, productId: id }));
    } else {
      navigate("/login");
    }
  };

  // Add to wishlist handler
  const handleAddToWishlist = (product) => {
    dispatch(add_to_wishlist({
      userId: userInfo.id,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      discount: product.discount,
      rating: product.rating,
      slug: product.slug
    }));
  };

  // Toast notifications
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  return (
    <div className={`w-[90%] mx-auto grid gap-6 ${
      styles === "grid"
        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        : "grid-cols-1"
    }`}>
      {products.map((p, i) => (
        <div
          key={i}
          className="group bg-white border rounded-lg shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-2"
        >
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-t-lg">
            {p.discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{p.discount}%
              </div>
            )}
            <img
              className="w-full h-56 object-contain p-2 rounded-t-lg"
              src={p.images[0]}
              alt={p.name}
            />
            {/* Action Buttons */}
            <ul className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <li
                onClick={() => handleAddToWishlist(p)}
                className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 rounded-full hover:bg-red-500 hover:text-white shadow-md transition"
              >
                <FaRegHeart />
              </li>
              <Link
                to={`/product/details/${p.slug}`}
                className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 rounded-full hover:bg-green-500 hover:text-white shadow-md transition"
              >
                <FaEye />
              </Link>
              <li
                onClick={() => add_card(p._id)}
                className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 rounded-full hover:bg-blue-500 hover:text-white shadow-md transition"
              >
                <RiShoppingCartLine />
              </li>
            </ul>
          </div>

          {/* Product Details */}
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{p.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-lg font-bold text-gray-900">${p.price}</span>
              <Rating ratings={p.rating} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopProducts;

