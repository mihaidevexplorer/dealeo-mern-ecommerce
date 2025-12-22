// src/pages/Details.tsx
// src/pages/Details.tsx
import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import Rating from '../components/Rating';
import { FaHeart } from "react-icons/fa6";
import { FaEye, FaRegHeart, FaExpand } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Reviews from '../components/Reviews';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCardStore';
import { useHomeStore } from '../store/useHomeStore';
import { useProductDetails } from '../hooks/useHome';
import { useAddToCart, useAddToWishlist } from '../hooks/useCard';
import type { Product } from '../types';

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Refs for Swiper instances
  const thumbnailSwiperRef = useRef<SwiperType | null>(null);
  const relatedProductsSwiperRef = useRef<SwiperType | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);

  // Zustand stores
  const { userInfo } = useAuthStore();
  const { loader } = useCartStore();
  const { product, relatedProducts, moreProducts } = useHomeStore();

  // React Query hooks
  const { mutate: addToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  useProductDetails(slug || '');

  // All state variables
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [state, setState] = useState('reviews');
  const [quantity, setQuantity] = useState(1);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [visibleThumbnails, setVisibleThumbnails] = useState(5);

  // Calculate visible thumbnails based on screen size
  useEffect(() => {
    const updateVisibleThumbnails = () => {
      const width = window.innerWidth;
      if (width >= 1280) setVisibleThumbnails(5);
      else if (width >= 1024) setVisibleThumbnails(4);
      else if (width >= 768) setVisibleThumbnails(3);
      else if (width >= 640) setVisibleThumbnails(2);
      else if (width >= 440) setVisibleThumbnails(2);
      else setVisibleThumbnails(1);
    };

    updateVisibleThumbnails();
    window.addEventListener('resize', updateVisibleThumbnails);
    return () => window.removeEventListener('resize', updateVisibleThumbnails);
  }, []);

  // Reset thumbnail start index when product changes
  useEffect(() => {
    setThumbnailStartIndex(0);
    setSelectedImageIndex(0);
  }, [product?._id]);

  // Quantity functions
  const inc = () => {
    if (product && quantity >= product.stock) {
      toast.error('Out of Stock');
    } else {
      setQuantity(quantity + 1);
    }
  };

  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Cart and wishlist functions
  const add_card = () => {
    if (userInfo && product) {
      addToCart({
        userId: userInfo.id,
        quantity,
        productId: product._id
      });
    } else {
      navigate('/login');
    }
  };

  const add_wishlist = () => {
    if (userInfo && product) {
      addToWishlist({
        userId: userInfo.id,
        productId: product._id
      });
    } else {
      navigate('/login');
    }
  };

  const add_wishlist_for_product = (productParam: Product) => {
    if (userInfo) {
      addToWishlist({
        userId: userInfo.id,
        productId: productParam._id
      });
    } else {
      navigate('/login');
    }
  };

  // Buy now function
  const buynow = () => {
    if (!product) return;

    let price = 0;
    if (product.discount !== 0) {
      price = product.price - Math.floor((product.price * product.discount) / 100);
    } else {
      price = product.price;
    }

    const obj = [
      {
        sellerId: product.sellerId,
        shopName: product.shopName,
        price: quantity * (price - Math.floor((price * 5) / 100)),
        products: [
          {
            quantity,
            productInfo: product
          }
        ]
      }
    ];

    navigate('/shipping', {
      state: {
        products: obj,
        price: price * quantity,
        shipping_fee: 50,
        items: 1
      }
    });
  };

  // Image navigation functions
  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      const newIndex = selectedImageIndex === product.images.length - 1 ? 0 : selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      const newIndex = selectedImageIndex === 0 ? product.images.length - 1 : selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
    }
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Enhanced thumbnail navigation with fallback
  const handleThumbnailNavigation = (direction: 'prev' | 'next') => {
    console.log(`Thumbnail navigation: ${direction}`, {
      swiperRef: !!thumbnailSwiperRef.current,
      currentStartIndex: thumbnailStartIndex,
      totalImages: product?.images?.length,
      visibleThumbnails
    });

    // First try Swiper navigation
    if (thumbnailSwiperRef.current) {
      try {
        if (direction === 'next') {
          thumbnailSwiperRef.current.slideNext();
        } else {
          thumbnailSwiperRef.current.slidePrev();
        }
        console.log('Swiper navigation successful');
        return;
      } catch (error) {
        console.log('Swiper navigation failed:', error);
      }
    }

    // Fallback to manual state management
    if (!product?.images) return;

    if (direction === 'next') {
      const maxStartIndex = Math.max(0, product.images.length - visibleThumbnails);
      const newIndex = Math.min(thumbnailStartIndex + 1, maxStartIndex);
      console.log('Manual next navigation:', thumbnailStartIndex, '->', newIndex);
      setThumbnailStartIndex(newIndex);
    } else {
      const newIndex = Math.max(thumbnailStartIndex - 1, 0);
      console.log('Manual prev navigation:', thumbnailStartIndex, '->', newIndex);
      setThumbnailStartIndex(newIndex);
    }
  };

  // Check if navigation buttons should be visible
  const canNavigatePrev = thumbnailSwiperRef.current ? !thumbnailSwiperRef.current.isBeginning : thumbnailStartIndex > 0;
  const canNavigateNext = thumbnailSwiperRef.current
    ? !thumbnailSwiperRef.current.isEnd
    : (product?.images ? thumbnailStartIndex + visibleThumbnails < product.images.length : false);

  // Related products navigation functions
  const handleRelatedPrev = () => {
    if (relatedProductsSwiperRef.current) {
      relatedProductsSwiperRef.current.slidePrev();
    }
  };

  const handleRelatedNext = () => {
    if (relatedProductsSwiperRef.current) {
      relatedProductsSwiperRef.current.slideNext();
    }
  };

  // Handle keyboard navigation for modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isImageModalOpen) return;

    if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'Escape') {
      closeImageModal();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      <Header />

      {/* Banner */}
      <section className='bg-[url("http://localhost:3001/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#242222d0]'>
          <div className='w-full max-w-7xl px-4 lg:px-6 mx-auto h-full'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white text-center'>
              <h2 className='text-3xl sm:text-2xl 2xs:text-xl font-bold'>Product Details</h2>
              <div className='flex justify-center items-center gap-2 text-2xl sm:text-lg 2xs:text-base w-full flex-wrap'>
                <Link to='/'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>Product Details</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section>
        <div className='bg-slate-100 py-5 mb-5'>
          <div className='w-full max-w-7xl px-4 lg:px-6 mx-auto'>
            <div className='flex justify-start items-center text-md sm:text-sm text-slate-600 w-full flex-wrap gap-1'>
              <Link to='/'>Home</Link>
              <span className='pt-1'><IoIosArrowForward /></span>
              <Link to='/' className='break-words'>{product?.category}</Link>
              <span className='pt-1'><IoIosArrowForward /></span>
              <span className='break-words'>{product?.name}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section>
        <div className='w-full max-w-7xl px-4 lg:px-6 mx-auto pb-16'>
          <div className='grid grid-cols-2 md-lg:grid-cols-1 gap-8 md:gap-6 sm:gap-5'>
            <div className='space-y-4'>

              {/* Main Image */}
              <div className='relative group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300'>
                <div className='aspect-square relative overflow-hidden'>
                  <img
                    className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 cursor-zoom-in'
                    src={product?.images?.[selectedImageIndex] || product?.images?.[0]}
                    alt={product?.name || "Product image"}
                    onClick={openImageModal}
                  />

                  <button
                    onClick={openImageModal}
                    className='absolute top-4 right-4 sm:top-2 sm:right-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-orange-500 p-3 sm:p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0'
                  >
                    <FaExpand size={18} />
                  </button>

                  {product?.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className='absolute left-4 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-orange-500 p-3 sm:p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10'
                      >
                        <HiChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className='absolute right-4 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-orange-500 p-3 sm:p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10'
                      >
                        <HiChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {product?.images && product.images.length > 1 && (
                    <div className='absolute bottom-4 sm:bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 sm:px-3 sm:py-1.5 rounded-full text-sm sm:text-xs font-medium shadow-lg'>
                      {selectedImageIndex + 1} / {product.images.length}
                    </div>
                  )}

                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
              </div>

              {/* Thumbnails */}
              {product?.images && product.images.length > 1 && (
                <div ref={thumbnailContainerRef} className='relative bg-white rounded-lg p-2 shadow-sm border border-gray-100'>
                  <Swiper
                    onSwiper={(swiper) => {
                      thumbnailSwiperRef.current = swiper;
                      console.log('Swiper initialized:', swiper);
                    }}
                    onSlideChange={(swiper) => {
                      console.log('Slide changed:', swiper.activeIndex);
                    }}
                    slidesPerView={1}
                    spaceBetween={12}
                    breakpoints={{
                      440: { slidesPerView: 2 },
                      640: { slidesPerView: 2 },
                      768: { slidesPerView: 3 },
                      1024: { slidesPerView: 4 },
                      1280: { slidesPerView: 5 }
                    }}
                    loop={false}
                    allowTouchMove={true}
                    grabCursor={true}
                    watchSlidesProgress={true}
                    modules={[Navigation]}
                    className="thumbnail-swiper"
                  >
                    {product.images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div
                          onClick={() => {
                            setSelectedImageIndex(i);
                            console.log('Thumbnail selected:', i);
                          }}
                          className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 group relative ${
                            selectedImageIndex === i
                              ? 'border-orange-500 shadow-lg scale-105 ring-2 ring-orange-200'
                              : 'border-gray-200 hover:border-orange-300 hover:shadow-md hover:scale-102'
                          }`}
                        >
                          <img
                            className='aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110'
                            src={img}
                            alt={`${product.name} view ${i + 1}`}
                            loading="lazy"
                          />
                          {selectedImageIndex === i && (
                            <div className='absolute inset-0 bg-orange-500/10 flex items-center justify-center'>
                              <div className='w-3 h-3 bg-orange-500 rounded-full shadow-lg'></div>
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {product.images.length > 4 && (
                    <>
                      <button
                        onClick={() => handleThumbnailNavigation('prev')}
                        disabled={!canNavigatePrev}
                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 sm:-translate-x-1 bg-white shadow-xl rounded-full p-2 z-30 transition-all duration-300 border border-gray-200 ${
                          canNavigatePrev
                            ? 'hover:bg-orange-50 hover:text-orange-500 hover:scale-110 cursor-pointer'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        aria-label="Previous thumbnails"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <HiChevronLeft size={18} className='text-gray-700' />
                      </button>
                      <button
                        onClick={() => handleThumbnailNavigation('next')}
                        disabled={!canNavigateNext}
                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 sm:translate-x-1 bg-white shadow-xl rounded-full p-2 z-30 transition-all duration-300 border border-gray-200 ${
                          canNavigateNext
                            ? 'hover:bg-orange-50 hover:text-orange-500 hover:scale-110 cursor-pointer'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        aria-label="Next thumbnails"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <HiChevronRight size={18} className='text-gray-700' />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Modal */}
            {isImageModalOpen && (
              <div className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-2 backdrop-blur-sm'>
                <div className='relative w-full max-w-6xl max-h-full'>
                  <button
                    onClick={closeImageModal}
                    className='absolute top-4 right-4 sm:top-2 sm:right-2 text-white hover:text-orange-400 z-20 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all duration-300'
                  >
                    <IoClose size={32} />
                  </button>

                  <div className='relative bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10'>
                    <img
                      className='w-full max-h-[90vh] object-contain rounded-2xl'
                      src={product?.images?.[selectedImageIndex]}
                      alt={product?.name || "Product image"}
                    />
                  </div>

                  {product?.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className='absolute left-4 sm:left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 bg-black/50 rounded-full p-4 sm:p-2 hover:bg-black/70 transition-all duration-300 hover:scale-110'
                      >
                        <HiChevronLeft size={40} />
                      </button>
                      <button
                        onClick={nextImage}
                        className='absolute right-4 sm:right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 bg-black/50 rounded-full p-4 sm:p-2 hover:bg-black/70 transition-all duration-300 hover:scale-110'
                      >
                        <HiChevronRight size={40} />
                      </button>
                    </>
                  )}

                  {product?.images && product.images.length > 1 && (
                    <div className='absolute bottom-6 sm:bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-6 py-3 sm:px-4 sm:py-2 rounded-full text-lg sm:text-sm font-medium border border-white/20'>
                      {selectedImageIndex + 1} of {product.images.length}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Details Card */}
            <div className='flex flex-col gap-4 p-6 sm:p-4 2xs:p-3 w-full bg-white rounded-lg shadow-lg'>
              <div className='text-3xl sm:text-2xl 2xs:text-xl text-gray-800 font-extrabold border-b pb-2 break-words'>
                <h3>{product?.name}</h3>
              </div>

              <div className='flex items-center gap-2 flex-wrap'>
                <div className='flex text-yellow-500'>
                  <Rating ratings={4.5} />
                </div>
                <span className='text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full'>(24 reviews)</span>
              </div>

              <div className='text-2xl sm:text-xl 2xs:text-lg font-bold flex items-center gap-3 flex-wrap'>
                {product && product.discount !== 0 ? (
                  <>
                    <span className="line-through text-gray-400">${product.price}</span>
                    <span className="text-green-600">
                      ${product.price - Math.floor((product.price * product.discount) / 100)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">-{product.discount}%</span>
                  </>
                ) : (
                  <span className="text-gray-800">Price: ${product?.price}</span>
                )}
              </div>

              <div className='text-gray-900 text-base sm:text-sm leading-relaxed space-y-4 font-roboto'>
                <p className='text-justify break-words'>
                  {product?.description
                    ? (showFullDescription ? product.description : `${product.description.substring(0, 100)}...`)
                    : "Description not available"}
                </p>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-500 underline mt-2"
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>

                <p className="text-gray-800 py-1 font-semibold break-words">
                  Shop Name: <span className="text-blue-500">{product?.shopName}</span>
                </p>
              </div>

              <div className='flex flex-wrap items-center gap-3 pb-10 border-b'>
                {product?.stock ? (
                  <div className='flex flex-wrap items-center gap-4 w-full'>
                    <div className='flex bg-gray-200 h-[50px] justify-center items-center text-xl rounded-lg shrink-0'>
                      <div onClick={dec} className='px-4 cursor-pointer select-none'>-</div>
                      <div className='px-4'>{quantity}</div>
                      <div onClick={inc} className='px-4 cursor-pointer select-none'>+</div>
                    </div>

                    <button
                      onClick={add_card}
                      className={`w-[200px] sm:w-full h-[50px] px-6 text-sm md:text-base bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${loader ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Add To Card
                    </button>

                    <div className='sm:w-full flex sm:justify-start'>
                      <div
                        onClick={add_wishlist}
                        className='h-10 w-10 md:h-12 md:w-12 flex justify-center items-center cursor-pointer bg-red-500 text-white rounded-full hover:shadow-lg transition duration-300 ease-in-out'
                      >
                        <FaHeart />
                      </div>
                    </div>
                  </div>
                ) : ''}
              </div>

              <div className='flex py-5 gap-5 md-lg:flex-col'>
                <div className='w-[150px] md-lg:w-full text-black font-bold text-xl sm:text-lg flex flex-col gap-5'>
                  <span>Availability</span>
                  <span>Share On</span>
                </div>

                <div className='flex flex-col gap-5'>
                  <span className={product?.stock ? 'text-black' : 'text-red-500'}>
                    {product?.stock ? `In Stock(${product.stock})` : 'Out Of Stock'}
                  </span>

                  <ul className='flex justify-start items-center gap-3 flex-wrap'>
                    <li>
                      <a className='w-[38px] h-[38px] hover:bg-[#ff7f50] hover:text-white flex justify-center items-center bg-indigo-500 rounded-full text-white' href="#">
                        <FaFacebookF />
                      </a>
                    </li>
                    <li>
                      <a className='w-[38px] h-[38px] hover:bg-[#ff7f50] hover:text-white flex justify-center items-center bg-cyan-500 rounded-full text-white' href="#">
                        <FaTwitter />
                      </a>
                    </li>
                    <li>
                      <a className='w-[38px] h-[38px] hover:bg-[#ff7f50] hover:text-white flex justify-center items-center bg-purple-500 rounded-full text-white' href="#">
                        <FaLinkedin />
                      </a>
                    </li>
                    <li>
                      <a className='w-[38px] h-[38px] hover:bg-[#ff7f50] hover:text-white flex justify-center items-center bg-blue-500 rounded-full text-white' href="#">
                        <FaGithub />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='flex gap-3 flex-wrap'>
                {product?.stock ? (
                  <button
                    onClick={buynow}
                    className='px-8 py-4 h-[60px] sm:w-full cursor-pointer bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105'
                  >
                    Buy Now
                  </button>
                ) : ''}

                <Link
                  to={`/dashboard/chat/${product?.sellerId}`}
                  className='px-8 py-4 h-[60px] sm:w-full cursor-pointer bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center'
                >
                  Chat Seller
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews + Sidebar */}
      <section>
        <div className='w-full max-w-7xl px-4 lg:px-6 mx-auto pb-16'>
          <div className='flex flex-wrap gap-6 md-lg:flex-col'>
            <div className='w-[72%] md-lg:w-full'>
              <div className='pr-4 md-lg:pr-0'>
                <div className='flex gap-2 flex-wrap'>
                  <button
                    onClick={() => setState('reviews')}
                    className={`py-2 px-6 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out ${
                      state === 'reviews'
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
                        : 'bg-slate-200 text-slate-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    Reviews
                  </button>

                  <button
                    onClick={() => setState('description')}
                    className={`py-2 px-6 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out ${
                      state === 'description'
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
                        : 'bg-slate-200 text-slate-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    Description
                  </button>
                </div>

                <div className='text-gray-900 text-base sm:text-sm leading-relaxed space-y-4 font-roboto'>
                  {state === 'reviews' && product?._id ? (
                    <Reviews product={product} />
                  ) : (
                    <p className='text-justify break-words'>{product?.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className='w-[28%] md-lg:w-full'>
              <div className='pl-4 md-lg:pl-0'>
                <div className='px-3 py-2 text-gray-600 bg-gray-100 border-b-2 border-gray-300'>
                  <h2 className='font-bold text-lg uppercase tracking-wider break-words'>From {product?.shopName}</h2>
                </div>

                <div className='flex flex-col gap-5 mt-3 border p-3'>
                  {moreProducts.map((p, i) => {
                    return (
                      <div key={i} className='block group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative'>
                        <div className='relative h-[270px]'>
                          <img className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' src={p.images[0]} alt="" />
                          {p.discount !== 0 && (
                            <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>
                              {p.discount}%
                            </div>
                          )}

                          <ul className="flex gap-3 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500 ease-in-out">
                            <li
                              onClick={() => add_wishlist_for_product(p)}
                              className="bg-white text-gray-600 p-2 rounded-full shadow hover:bg-red-500 hover:text-white cursor-pointer transition-all duration-300"
                            >
                              <FaRegHeart size={18} />
                            </li>
                            <Link
                              to={`/product/details/${p.slug}`}
                              className="bg-white text-gray-600 p-2 rounded-full shadow hover:bg-green-500 hover:text-white transition-all duration-300"
                            >
                              <FaEye size={18} />
                            </Link>
                            <li
                              onClick={() => add_card()}
                              className={`bg-white text-gray-600 p-2 rounded-full shadow hover:bg-blue-500 hover:text-white cursor-pointer transition-all duration-300 ${loader ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <RiShoppingCartLine size={18} />
                            </li>
                          </ul>
                        </div>

                        <h2 className='text-slate-600 py-1 font-bold text-lg group-hover:text-orange-500 transition-colors duration-300 break-words'>
                          {p.name}
                        </h2>

                        <div className='flex justify-between items-center gap-3 flex-wrap'>
                          <h2 className='text-lg font-bold text-slate-600 break-words'>${p.price}</h2>
                          <div className='flex items-center gap-2'>
                            <Rating ratings={p.rating} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Products */}
      <section>
        <div className='w-full max-w-7xl px-4 lg:px-6 mx-auto'>
          <h2 className='text-2xl sm:text-xl py-8 text-slate-600'>Related Products</h2>

          <div className='relative'>
            <Swiper
              onSwiper={(swiper) => {
                relatedProductsSwiperRef.current = swiper;
              }}
              slidesPerView='auto'
              breakpoints={{
                1280: {
                  slidesPerView: 3
                },
                565: {
                  slidesPerView: 2
                }
              }}
              spaceBetween={25}
              loop={relatedProducts.length > 3}
              pagination={{
                clickable: true,
                el: '.custom_bullet'
              }}
              modules={[Pagination, Navigation]}
              className='mySwiper'
            >
              {relatedProducts.map((p, i) => {
                return (
                  <SwiperSlide key={i}>
                    <Link to={`/product/details/${p.slug}`} className='block'>
                      <div className='relative h-[270px] group overflow-hidden rounded-lg'>
                        <div className='w-full h-full'>
                          <img className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' src={p.images[0]} alt="" />
                          <div className='absolute h-full w-full top-0 left-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300'></div>
                        </div>

                        {p.discount !== 0 && (
                          <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>
                            {p.discount}%
                          </div>
                        )}
                      </div>

                      <div className='p-4 flex flex-col gap-1'>
                        <h2 className='text-slate-600 text-lg font-bold group-hover:text-orange-500 transition-colors duration-300 break-words'>
                          {p.name}
                        </h2>

                        <div className='flex justify-start items-center gap-3 flex-wrap'>
                          <h2 className='text-lg font-bold text-slate-600 break-words'>${p.price}</h2>
                          <div className='flex'>
                            <Rating ratings={p.rating} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {relatedProducts.length > 3 && (
              <>
                <button
                  onClick={handleRelatedPrev}
                  className='absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 sm:-translate-x-2 bg-white shadow-lg rounded-full p-3 sm:p-2 z-10 hover:bg-gray-50 transition-colors duration-200'
                >
                  <HiChevronLeft size={24} className='text-gray-700' />
                </button>
                <button
                  onClick={handleRelatedNext}
                  className='absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 sm:translate-x-2 bg-white shadow-lg rounded-full p-3 sm:p-2 z-10 hover:bg-gray-50 transition-colors duration-200'
                >
                  <HiChevronRight size={24} className='text-gray-700' />
                </button>
              </>
            )}
          </div>

          <div className='w-full flex justify-center items-center py-8'>
            <div className='custom_bullet justify-center gap-3 !w-auto'></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Details;
