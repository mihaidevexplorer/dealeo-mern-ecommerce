// src/pages/Card.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { FiTrash2, FiMinus, FiPlus, FiHeart, FiStar, FiShield, FiTruck, FiGift } from "react-icons/fi";
import { 
  useGetCartProducts, 
  useDeleteCartProduct, 
  useQuantityInc, 
  useQuantityDec 
} from '../hooks/useCard';
import { useCartStore } from '../store/useCardStore';
import { useAuthState } from '../hooks/useAuth';
import { useAddToWishlist } from '../hooks/useCard';
import toast from 'react-hot-toast';
import type { CardProduct } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Local interfaces for API response structure
interface BackendProduct {
  _id: string;
  quantity: number;
  productInfo: {
    _id: string;
    name: string;
    brand: string;
    price: number;
    discount: number;
    stock: number;
    images: string[];
    shopName: string;
  };
}

interface BackendCardProduct {
  sellerId: string;
  shopName: string;
  price: number;
  products: BackendProduct[];
}

const Card: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuthState();

  // Zustand store direct access
  const { 
    price,
    buyProductItem,
    shippingFee,
    outOfStockProducts,
    loader
  } = useCartStore();

  // React Query hooks
  const { data: cardData, refetch } = useGetCartProducts(userInfo?.id || '');
  const deleteCartMutation = useDeleteCartProduct();
  const incrementMutation = useQuantityInc();
  const decrementMutation = useQuantityDec();

  const addToWishlistMutation = useAddToWishlist();

// Funcția pentru adăugarea în wishlist
const add_wishlist = async (productId: string) => {
  if (!userInfo?.id) {
    toast.error('Please login first');
    navigate('/login');
    return;
  }

  try {
    await addToWishlistMutation.mutateAsync({
      userId: userInfo.id,
      productId: productId
    });
   
  } catch (error) {
    console.error('Error adding to wishlist:', error);
  }
};

  // Extract card products from backend structure
  const cardProducts = (cardData?.card_products || []) as unknown as BackendCardProduct[];

  // Cast outOfStockProducts to match CardProduct type from store
  const typedOutOfStockProducts = outOfStockProducts as CardProduct[];

  // Delete product function
  const deleteProduct = async (cardId: string) => {
    if (!userInfo?.id) {
      toast.error('Please login first');
      return;
    }

    try {
      await deleteCartMutation.mutateAsync({ 
        cartId: cardId, 
        userId: userInfo.id 
      });
      await refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Increase quantity
  const inc = async (quantity: number, stock: number, cardId: string) => {
    if (!userInfo?.id) {
      toast.error('Please login first');
      return;
    }

    const temp = quantity + 1;
    if (temp <= stock) {
      try {
        await incrementMutation.mutateAsync({ 
          cartId: cardId, 
          userId: userInfo.id 
        });
        await refetch();
      } catch (error) {
        console.error('Error increasing quantity:', error);
      }
    }
  };

  // Decrease quantity  
  const dec = async (quantity: number, cardId: string) => {
    if (!userInfo?.id) {
      toast.error('Please login first');
      return;
    }

    const temp = quantity - 1;
    if (temp !== 0) {
      try {
        await decrementMutation.mutateAsync({ 
          cartId: cardId, 
          userId: userInfo.id 
        });
        await refetch();
      } catch (error) {
        console.error('Error decreasing quantity:', error);
      }
    }
  };

  // Navigate to shipping page
  const redirect = () => {
    navigate('/shipping', {
      state: {
        products: cardProducts,
        price: price,
        shipping_fee: shippingFee,
        items: buyProductItem
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 min-h-screen">
      <Header />
      
      {/* Original Hero Section */}
      <section className='bg-[url("/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Shopping Cart</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>Cart</span>
              </div>
            </div> 
          </div> 
        </div> 
      </section>

      {/* Ultra Premium Content Section */}
      <section className='relative py-16'>
        {/* Floating background elements */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-2xl animate-pulse'></div>
        <div className='absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/10 to-orange-500/10 rounded-full blur-2xl animate-pulse delay-1000'></div>
        
        <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto relative z-10'>
          {cardProducts.length > 0 || typedOutOfStockProducts.length > 0 ? (
            <div className='flex flex-wrap'>
              {/* Cart Items - Enhanced with ultra-premium effects */}
              <div className='w-[67%] md-lg:w-full'>
                <div className='pr-3 md-lg:pr-0'>
                  <div className='flex flex-col gap-3'>
                    
                    {/* Ultra Premium Stock Products Header */}
                    <div className='relative group overflow-hidden'>
                      <div className='absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500'></div>
                      <div className='relative bg-white/95 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/60 hover:shadow-emerald-500/25 transition-all duration-500'>
                                                  <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-purple-500 rounded-t-3xl'></div>
                        <div className='absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-white via-yellow-300 to-white rounded-t-3xl animate-pulse opacity-50 group-hover:w-full transition-all duration-1000'></div>
                        
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-4'>
                            <div className='relative'>
                              <div className='w-4 h-4 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-full animate-pulse shadow-lg'></div>
                              <div className='absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-20'></div>
                              <div className='absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-10 delay-75'></div>
                            </div>
                            <h2 className='text-lg font-black bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent'>
                              Stock Products {cardProducts.length}
                            </h2>
                            <div className='flex gap-1'>
                              {[...Array(5)].map((_, i) => (
                                <FiStar key={i} className='w-3 h-3 text-yellow-400 fill-current' />
                              ))}
                            </div>
                          </div>
                          
                          <div className='flex items-center gap-2'>
                            <div className='w-16 h-1 bg-gradient-to-r from-emerald-400 to-purple-500 rounded-full'></div>
                            <span className='text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full'>Premium</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ultra Premium In Stock Products */}
                    {cardProducts.map((p, i) => (
                      <div key={i} className='relative group'>
                        {/* Multi-layer glow effects */}
                        <div className='absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl'></div>
                        <div className='absolute -inset-1 bg-gradient-to-r from-emerald-500/15 via-blue-500/15 to-purple-500/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl'></div>
                        
                        <div className='relative bg-white/98 backdrop-blur-3xl p-6 rounded-3xl shadow-2xl border border-white/70 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col gap-4 hover:scale-[1.01] hover:-translate-y-1'>
                          {/* Animated top border with multiple layers */}
                          <div className='absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-400 to-pink-500 group-hover:w-full transition-all duration-1000 rounded-t-3xl'></div>
                          <div className='absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-white via-yellow-300 to-white group-hover:w-full transition-all duration-1500 rounded-t-3xl opacity-60'></div>
                          
                          {/* Ultra Premium Shop Header */}
                          <div className='flex justify-between items-center mb-4'>
                            <div className='relative group/shop'>
                              <div className='absolute -inset-1 bg-gradient-to-r from-gray-200/50 to-blue-200/50 rounded-2xl opacity-0 group-hover/shop:opacity-100 transition-all duration-300 blur-sm'></div>
                              <div className='relative flex items-center gap-3 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 px-5 py-3 rounded-2xl border border-white shadow-lg backdrop-blur-sm'>
                                <div className='relative'>
                                  <div className='w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-md'></div>
                                  <div className='absolute -top-1 -left-1 w-5 h-5 bg-green-400/20 rounded-full animate-ping'></div>
                                </div>
                                <h2 className='text-md text-slate-700 font-bold'>{p.shopName}</h2>
                                <div className='w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full'></div>
                              </div>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                              <span className='text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full font-semibold border border-green-200'>
                                ✓ Verified Seller
                              </span>
                              <FiShield className='w-4 h-4 text-green-500' />
                            </div>
                          </div>

                          {/* Ultra Premium Product Items */}
                          <div className='space-y-4'>
                            {p.products.map((pt: BackendProduct, i: number) => (
                              <div key={i} className='relative group/product overflow-hidden'>
                                {/* Product glow effect */}
                                <div className='absolute -inset-1 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover/product:opacity-100 transition-all duration-500 blur-sm'></div>
                                
                                <div className='relative bg-gradient-to-br from-white/90 via-gray-50/60 to-blue-50/40 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.005] group-hover/product:bg-gradient-to-br group-hover/product:from-white/95 group-hover/product:via-blue-50/70 group-hover/product:to-purple-50/50'>
                                  
                                  <div className='w-full flex flex-wrap items-center gap-6'>
                                    {/* Ultra Premium Product Image & Info */}
                                    <div className='flex sm:w-full gap-4 w-7/12'>
                                      <div className='flex gap-4 justify-start items-center'>
                                        <div className='relative group/image'>
                                          {/* Multi-layer image effects */}
                                          <div className='absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover/image:opacity-100 transition-all duration-500 blur-lg'></div>
                                          <div className='absolute -inset-1 bg-gradient-to-r from-white/60 to-blue-100/60 rounded-2xl opacity-0 group-hover/image:opacity-100 transition-all duration-300'></div>
                                          
                                          <div className='relative'>
                                            <img 
                                              className='relative w-[80px] h-[80px] object-cover rounded-2xl border-3 border-white shadow-2xl group-hover/image:shadow-3xl transition-all duration-500 group-hover/image:scale-110 group-hover/image:rotate-1' 
                                              src={pt.productInfo?.images?.[0] || ''} 
                                              alt={pt.productInfo?.name || 'Product'} 
                                            />
                                            
                                            {/* Premium status indicators */}
                                            <div className='absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full border-3 border-white shadow-xl animate-pulse flex items-center justify-center'>
                                              <div className='w-2 h-2 bg-white rounded-full'></div>
                                            </div>
                                            <div className='absolute -top-2 -right-2 w-6 h-6 bg-green-400/30 rounded-full animate-ping'></div>
                                            <div className='absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center'>
                                              <FiStar className='w-2 h-2 text-white fill-current' />
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className='pr-4 text-gray-700 space-y-2'>
                                          <h2 className='text-md font-bold text-gray-900 hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-500 cursor-pointer group-hover/product:text-blue-600'>
                                            {pt.productInfo?.name || 'Unknown Product'}
                                          </h2>
                                          <div className='flex items-center gap-2'>
                                            <span className='text-sm text-gray-500 font-medium bg-gradient-to-r from-gray-100/80 to-blue-100/80 px-3 py-1 rounded-xl backdrop-blur-sm border border-gray-200/50'>
                                              Brand: {pt.productInfo?.brand || 'Unknown Brand'}
                                            </span>
                                            <div className='flex gap-1'>
                                              {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} className='w-3 h-3 text-yellow-400 fill-current' />
                                              ))}
                                            </div>
                                          </div>
                                          <div className='flex items-center gap-2'>
                                            <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold'>In Stock</span>
                                            <span className='text-xs text-gray-500'>Free Shipping</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Ultra Premium Price & Controls */}
                                    <div className='flex justify-between items-center w-5/12 sm:w-full sm:mt-4'>
                                      <div className='pl-4 sm:pl-0 space-y-2'>
                                        <div className='relative group/price'>
                                          <div className='absolute -inset-2 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover/price:opacity-100 transition-all duration-300 blur-md'></div>
                                          <h2 className='relative text-xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition-all duration-300 cursor-pointer'>
                                            ${pt.productInfo ? (pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100)) : 0}
                                          </h2>
                                        </div>
                                        
                                        <div className='flex items-center gap-2'>
                                          <p className='line-through text-gray-400 text-sm font-medium'>${pt.productInfo?.price || 0}</p>
                                          <span className='text-sm bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white px-3 py-1 rounded-full font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 animate-pulse'>
                                            -{pt.productInfo?.discount || 0}%
                                          </span>
                                        </div>
                                        
                                        <div className='text-xs text-green-600 font-semibold'>Save ${pt.productInfo ? Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100) : 0}</div>
                                      </div>
                                      
                                      <div className='flex gap-3 flex-col items-end'>
                                        {/* Ultra Premium Quantity Controls */}
                                        <div className='relative group/controls'>
                                          <div className='absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover/controls:opacity-100 transition-all duration-500 blur-sm'></div>
                                          <div className='relative flex bg-white/95 backdrop-blur-lg border-2 border-gray-200/70 h-[35px] justify-center items-center text-lg rounded-2xl shadow-xl overflow-hidden group-hover/controls:shadow-2xl group-hover/controls:border-blue-300/50 transition-all duration-500'>
                                            <button 
                                              onClick={() => dec(pt.quantity, pt._id)} 
                                              className={`px-4 py-2 hover:bg-gradient-to-r hover:from-red-50 hover:via-pink-50 hover:to-red-50 hover:text-red-600 transition-all duration-300 cursor-pointer hover:scale-125 flex items-center justify-center font-bold ${decrementMutation.isPending || loader ? 'cursor-not-allowed opacity-50' : ''}`}
                                              disabled={decrementMutation.isPending || loader}
                                            >
                                              <FiMinus className='w-4 h-4' />
                                            </button>
                                            <div className='px-4 py-2 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 font-black text-gray-800 border-x border-gray-200/50 min-w-[50px] text-center'>
                                              {pt.quantity}
                                            </div>
                                            <button 
                                              onClick={() => pt.productInfo && inc(pt.quantity, pt.productInfo.stock, pt._id)} 
                                              className={`px-4 py-2 hover:bg-gradient-to-r hover:from-green-50 hover:via-emerald-50 hover:to-green-50 hover:text-green-600 transition-all duration-300 cursor-pointer hover:scale-125 flex items-center justify-center font-bold ${incrementMutation.isPending || loader ? 'cursor-not-allowed opacity-50' : ''}`}
                                              disabled={incrementMutation.isPending || loader}
                                            >
                                              <FiPlus className='w-4 h-4' />
                                            </button>
                                          </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className='flex gap-2'>
                                          <button 
                                       onClick={() => add_wishlist(pt.productInfo._id)}
                                       className='relative group/heart p-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-lg'
                                        disabled={addToWishlistMutation.isPending}>
                                        <FiHeart className='w-4 h-4' />
                                      </button>
                                          
                                          <button 
                                            onClick={() => deleteProduct(pt._id)} 
                                            className={`relative group/delete px-4 py-2 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white rounded-xl font-bold transition-all transform hover:scale-110 hover:-translate-y-1 hover:rotate-1 shadow-xl hover:shadow-red-500/50 overflow-hidden ${deleteCartMutation.isPending || loader ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={deleteCartMutation.isPending || loader}
                                          >
                                            <span className='absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-red-700 opacity-0 group-hover/delete:opacity-100 transition-opacity duration-300'></span>
                                            <span className='relative flex items-center gap-2'>
                                              <FiTrash2 className='w-4 h-4' />
                                              Delete
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Ultra Premium Out of Stock Section */}
                    {typedOutOfStockProducts.length > 0 && (
                      <div className='flex flex-col gap-3'>
                        <div className='relative group overflow-hidden'>
                          <div className='absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500'></div>
                          <div className='relative bg-white/95 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-red-200/50'>
                            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-pink-500 to-red-500 rounded-t-3xl'></div>
                            <h2 className='text-lg font-black bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent flex items-center gap-4'>
                              <div className='relative'>
                                <div className='w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse'></div>
                                <div className='absolute inset-0 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-20'></div>
                              </div>
                              Out of Stock {typedOutOfStockProducts.length}
                            </h2>
                          </div>
                        </div>

                        <div className='bg-white/90 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-red-200/50 opacity-75'>
                          {typedOutOfStockProducts.map((p, i) => (
                            <div key={i} className='w-full flex flex-wrap bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-2xl p-4 border border-red-100 mb-4 last:mb-0'>
                              <div className='flex sm:w-full gap-2 w-7/12'>
                                <div className='flex gap-2 justify-start items-center'>
                                  <div className='relative'>
                                    <img 
                                      className='w-[80px] h-[80px] object-cover rounded-2xl border-2 border-gray-200 shadow-lg grayscale' 
                                      src={p.productId?.images?.[0] || ''} 
                                      alt={p.productId?.name || 'Product'} 
                                    />
                                    <div className='absolute inset-0 bg-red-500/30 rounded-2xl flex items-center justify-center'>
                                      <span className='text-xs font-bold text-red-700 bg-white/90 px-3 py-1 rounded-full shadow-lg'>
                                        OUT OF STOCK
                                      </span>
                                    </div>
                                  </div>
                                  <div className='pr-4 text-slate-600'>
                                    <h2 className='text-md font-semibold'>{p.productId?.name || 'Unknown Product'}</h2>
                                    <span className='text-sm'>Brand: {p.productId?.brand || 'Unknown Brand'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                                <div className='pl-4 sm:pl-0'>
                                  <h2 className='text-lg text-gray-500 font-bold'>
                                    ${p.productId ? (p.productId.price - Math.floor((p.productId.price * p.productId.discount) / 100)) : 0}
                                  </h2>
                                  <p className='line-through text-gray-400 text-sm'>${p.productId?.price || 0}</p>
                                  <p className='text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-medium inline-block'>-{p.productId?.discount || 0}%</p>
                                </div>
                                <div className='flex gap-2 flex-col'>
                                  <div className='flex bg-gray-100 border-2 border-gray-200 h-[30px] justify-center items-center text-xl rounded-lg opacity-50'>
                                    <div 
                                      onClick={() => dec(p.quantity, p._id)} 
                                      className={`px-3 ${decrementMutation.isPending || loader ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    >
                                      -
                                    </div>
                                    <div className='px-3 font-semibold'>{p.quantity}</div>
                                    <div className='px-3 cursor-not-allowed opacity-50'>+</div>
                                  </div>
                                  <button 
                                    onClick={() => deleteProduct(p._id)} 
                                    className={`px-5 py-[3px] bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all ${deleteCartMutation.isPending || loader ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={deleteCartMutation.isPending || loader}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div> 
                </div>
              </div>

              {/* Ultra Premium Order Summary Sidebar - Same 33% width */}
              <div className='w-[33%] md-lg:w-full'>
                <div className='pl-3 md-lg:pl-0 md-lg:mt-5'>
                  {cardProducts.length > 0 && (
                    <div className='group sticky top-4'>
                      {/* Multi-layer glow effects for sidebar */}
                      <div className='absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl'></div>
                      <div className='absolute -inset-1 bg-gradient-to-r from-slate-600/20 to-gray-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl'></div>
                      
                      <div className='relative bg-white/98 backdrop-blur-3xl text-gray-700 flex flex-col rounded-3xl shadow-2xl border border-white/60 overflow-hidden group-hover:shadow-3xl transition-all duration-500'>
                        {/* Ultra Premium Header */}
                        <div className='relative bg-gradient-to-r from-slate-900 via-gray-900 to-black p-6 overflow-hidden'>
                          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-orange-500'></div>
                          <div className='absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-white via-yellow-300 to-white animate-pulse opacity-50 group-hover:w-full transition-all duration-1000'></div>
                          
                          {/* Floating elements in header */}
                          <div className='absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl'></div>
                          <div className='absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-lg'></div>
                          
                          <div className='relative flex items-center justify-between'>
                            <h2 className='text-xl font-black text-white'>Order Summary</h2>
                            <div className='flex items-center gap-2'>
                              <FiShield className='w-5 h-5 text-green-400' />
                              <span className='text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full font-semibold'>Secure</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className='p-6 space-y-6'>
                          {/* Items Summary with premium styling */}
                          <div className='space-y-4'>
                            <div className='flex justify-between items-center py-3 border-b border-gray-100/50 group/item hover:bg-gray-50/50 px-2 rounded-lg transition-all duration-300'>
                              <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse'></div>
                                <span className='font-semibold text-gray-700'>Items ({buyProductItem})</span>
                              </div>
                              <span className='font-black text-gray-900 text-lg'>${price}</span>
                            </div>
                            
                            <div className='flex justify-between items-center py-3 border-b border-gray-100/50 group/shipping hover:bg-green-50/50 px-2 rounded-lg transition-all duration-300'>
                              <div className='flex items-center gap-2'>
                                <FiTruck className='w-4 h-4 text-green-500 group-hover/shipping:animate-bounce' />
                                <span className='font-semibold text-gray-700'>Shipping Fee</span>
                              </div>
                              <span className='font-black text-gray-900 text-lg'>${shippingFee}</span>
                            </div>
                          </div>
                          
                          {/* Ultra Premium Coupon Section */}
                          <div className='relative group/coupon'>
                            <div className='absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover/coupon:opacity-100 transition-all duration-300 blur-sm'></div>
                            <div className='relative bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/50'>
                              <div className='flex gap-3'>
                                <div className='flex-1 relative'>
                                  <FiGift className='absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5' />
                                  <input 
                                    className='w-full pl-12 pr-4 py-3 border-2 border-gray-300/50 outline-0 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-white/90 backdrop-blur-sm font-medium placeholder-gray-400' 
                                    type="text" 
                                    placeholder='Enter Coupon Code' 
                                  />
                                </div>
                                <button className='relative group/apply px-6 py-3 bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-600 hover:to-gray-700 text-white rounded-xl uppercase text-sm font-bold transition-all transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl'>
                                  <span className='relative'>Apply</span>
                                </button>
                              </div>
                              
                              {/* Coupon suggestions */}
                              <div className='mt-3 flex gap-2 flex-wrap'>
                                <span className='text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold cursor-pointer hover:bg-orange-200 transition-colors'>SAVE10</span>
                                <span className='text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold cursor-pointer hover:bg-blue-200 transition-colors'>FIRST20</span>
                                <span className='text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold cursor-pointer hover:bg-green-200 transition-colors'>FREE50</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Ultra Premium Total Section */}
                          <div className='relative group/total overflow-hidden'>
                            <div className='absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover/total:opacity-100 transition-all duration-500 blur-sm'></div>
                            <div className='relative bg-gradient-to-r from-gray-50/90 to-blue-50/90 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/50 group-hover/total:border-orange-300/50 transition-all duration-300'>
                              <div className='flex justify-between items-center mb-2'>
                                <span className='text-lg font-black text-gray-900'>Total Amount</span>
                                <div className='flex items-center gap-2'>
                                  <FiStar className='w-4 h-4 text-yellow-500 fill-current' />
                                  <span className='text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold'>Best Price</span>
                                </div>
                              </div>
                              <div className='relative'>
                                <span className='text-3xl font-black text-gray-900'>
                                  ${price + shippingFee}
                                </span>
                                <div className='absolute -inset-2 bg-blue-500/5 rounded-xl opacity-0 group-hover/total:opacity-100 transition-all duration-300 -z-10'></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Ultra Premium Checkout Button */}
                          <div className='relative group/checkout'>
                            <div className='absolute -inset-1 bg-gradient-to-r from-orange-500/30 via-pink-500/30 to-purple-500/30 rounded-2xl opacity-0 group-hover/checkout:opacity-100 transition-all duration-500 blur-lg'></div>
                            <button 
                              onClick={redirect}
                              className='relative w-full bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 hover:-translate-y-1 text-lg shadow-xl hover:shadow-2xl'
                            >
                              <span className='relative flex items-center justify-center gap-3'>
                                <span>PROCESS TO CHECKOUT ({buyProductItem})</span>
                                <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                                  <svg className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                                  </svg>
                                </div>
                              </span>
                            </button>
                          </div>
                          
                          {/* Ultra Premium Security & Features */}
                          <div className='space-y-3 pt-4 border-t border-gray-200/50'>
                            <div className='grid grid-cols-2 gap-3'>
                              <div className='flex items-center gap-2 text-xs text-gray-600 bg-green-50/80 px-3 py-2 rounded-xl'>
                                <FiShield className='w-4 h-4 text-green-500' />
                                <span className='font-semibold'>Secure Payment</span>
                              </div>
                              <div className='flex items-center gap-2 text-xs text-gray-600 bg-blue-50/80 px-3 py-2 rounded-xl'>
                                <FiTruck className='w-4 h-4 text-blue-500' />
                                <span className='font-semibold'>Fast Shipping</span>
                              </div>
                            </div>
                            
                            <div className='text-center'>
                              <p className='text-xs text-gray-500 font-medium'>🔒 256-bit SSL encryption • Free shipping on orders over $50</p>
                              <p className='text-xs text-green-600 font-semibold mt-1'>✓ 30-day money-back guarantee</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center min-h-[500px] text-center relative'>
              {/* Background effects for empty state */}
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl'></div>
              
              <div className='relative z-10 mb-12'>
                <div className='relative w-32 h-32 mx-auto mb-8'>
                  {/* Multi-layer empty cart icon */}
                  <div className='absolute inset-0 bg-gradient-to-r from-orange-100 to-blue-100 rounded-full animate-pulse'></div>
                  <div className='absolute inset-2 bg-gradient-to-r from-orange-200 to-blue-200 rounded-full flex items-center justify-center shadow-2xl'>
                    <svg className='w-16 h-16 text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                  </div>
                  <div className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-4 border-white shadow-xl animate-bounce'></div>
                </div>
                
                <h3 className='text-3xl font-black bg-gradient-to-r from-gray-700 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-4'>Your cart is empty</h3>
                <p className='text-gray-500 text-lg max-w-lg mx-auto leading-relaxed'>Discover amazing products and start building your perfect collection today.</p>
              </div>
              
              <Link 
                to='/shops'
                className='group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-600 hover:to-gray-700 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-500'
              >
                <span className='relative flex items-center gap-3'>
                  Start Shopping
                  <svg className='w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </span>
              </Link>
              
              <div className='mt-12 text-sm text-gray-400'>
                Free shipping on orders over $50 • 30-day returns • Premium support
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Card;
