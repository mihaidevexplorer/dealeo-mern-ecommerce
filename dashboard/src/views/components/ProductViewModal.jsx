//src\views\components\ProductViewModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaShoppingCart, FaHeart, FaShare, FaStar, FaCheck } from 'react-icons/fa';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const ProductViewModal = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('details');

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const calculateDiscountedPrice = () => {
    if (product.discount > 0) {
      return (product.price - (product.price * product.discount / 100)).toFixed(2);
    }
    return product.price;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden transform transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Image Gallery Section */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-inner">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <HiChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`
                        w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                        ${index === currentImageIndex 
                          ? 'border-blue-500 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="p-8 overflow-y-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span>{product.brand}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>
                
                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">(4.5)</span>
                  </div>
                  <span className="text-sm text-gray-500">128 reviews</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${calculateDiscountedPrice()}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <FaCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Availability:</span>
                  <span className={`font-semibold ${
                    product.stock > 10 ? 'text-green-600' : 
                    product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {product.stock > 10 ? 'In Stock' : 
                     product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                  </span>
                </div>
                {product.stock > 0 && product.stock <= 10 && (
                  <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-800">
                      ⚡ Hurry! Only {product.stock} items left in stock.
                    </p>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                  {['details', 'specifications', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`
                        pb-3 capitalize font-medium transition-all
                        ${selectedTab === tab 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                        }
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {selectedTab === 'details' && (
                  <div className="space-y-4 text-gray-600">
                    <p>{product.description || 'High-quality product designed to meet your needs with exceptional performance and reliability.'}</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <FaCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Premium quality materials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>30-day money-back guarantee</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>1-year warranty included</span>
                      </li>
                    </ul>
                  </div>
                )}
                {selectedTab === 'specifications' && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">SKU</span>
                      <span className="font-medium">{product._id?.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                  </div>
                )}
                {selectedTab === 'shipping' && (
                  <div className="space-y-4 text-gray-600">
                    <p>Free standard shipping on orders over $50. Express shipping available.</p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">Estimated Delivery</p>
                      <p className="text-sm text-blue-700">3-5 business days for standard shipping</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                  <FaShoppingCart className="inline mr-2" />
                  Add to Cart
                </button>
                <button className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <FaHeart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <FaShare className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
ProductViewModal.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    discount: PropTypes.number,
    stock: PropTypes.number,
    category: PropTypes.string,
    brand: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string)
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ProductViewModal;
