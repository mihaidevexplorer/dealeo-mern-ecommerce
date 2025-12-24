//src\components\products\Products.tsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { AiFillFire } from "react-icons/ai";
import type { Product } from '../../types';
import type { Swiper as SwiperType } from 'swiper';

interface ProductsProps {
  title: string;
  products: Product[] | Product[][];
  showHotBadge?: boolean;
  isSlider?: boolean;
}

const Products: React.FC<ProductsProps> = ({ 
  title, 
  products: inputProducts, 
  showHotBadge = true,
  isSlider = true 
}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    
    // Normalize products - convert to Product[][] format for consistent rendering
    const normalizeProducts = (): Product[][] => {
        if (!inputProducts || !Array.isArray(inputProducts)) {
            return [];
        }
        
        // If it's already Product[][], return as is
        if (inputProducts.length > 0 && Array.isArray(inputProducts[0])) {
            return inputProducts as Product[][];
        }
        
        // If it's Product[], chunk it into groups of 3 for slider
        const products = inputProducts as Product[];
        if (products.length === 0) {
            return [];
        }
        
        // For non-slider display, return each product in its own array
        if (!isSlider) {
            return products.map(product => [product]);
        }
        
        // For slider, chunk into groups of 3
        const chunkSize = 3;
        const chunks: Product[][] = [];
        for (let i = 0; i < products.length; i += chunkSize) {
            chunks.push(products.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const products = normalizeProducts();
    
    // Verifică dacă products există și nu este gol
    if (!products || products.length === 0) {
        return (
            <div className='flex justify-center items-center py-12'>
                <div className='text-center'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <AiFillFire className='text-2xl text-gray-400' />
                    </div>
                    <p className='text-gray-500 font-medium'>No products available</p>
                </div>
            </div>
        );
    }

    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const handlePrevious = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const ButtonGroup: React.FC = () => {
        return (
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                        {title}
                    </h2>
                    {showHotBadge && (
                        <div className='flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full'>
                            <AiFillFire className='text-orange-500 text-sm' />
                            <span className='text-xs font-semibold text-orange-600'>Hot</span>
                        </div>
                    )}
                </div>
                {isSlider && (
                    <div className='flex items-center gap-2'>
                        <button 
                            onClick={handlePrevious}
                            className='w-10 h-10 flex justify-center items-center bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group'
                            aria-label="Previous products"
                        >
                            <IoIosArrowBack className='text-gray-600 group-hover:text-gray-900 transition-colors' />
                        </button>
                        <button 
                            onClick={handleNext}
                            className='w-10 h-10 flex justify-center items-center bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group'
                            aria-label="Next products"
                        >
                            <IoIosArrowForward className='text-gray-600 group-hover:text-gray-900 transition-colors' /> 
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderProductItem = (product: Product) => {
        if (!product || !product.slug || !product.images || !product.images[0] || !product.name || product.price === undefined) {
            return null;
        }
        
        return (
            <Link 
                key={product._id} 
                className='group flex items-center gap-4 p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]' 
                to={`/product/details/${product.slug}`}
            >
                {/* Product Image */}
                <div className='relative flex-shrink-0'>
                    <div className='w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden'>
                        <img 
                            className='w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300' 
                            src={product.images[0]} 
                            alt={product.name}
                            loading="lazy"
                        />
                    </div>
                    {product.discount && product.discount > 0 && (
                        <div className='absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md'>
                            -{product.discount}%
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className='flex-1 min-w-0'>
                    <h3 className='font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors'>
                        {product.name}
                    </h3>
                    
                    {/* Rating if available */}
                    {product.rating !== undefined && (
                        <div className='flex items-center gap-1 mt-1'>
                            <div className='flex'>
                                {[...Array(5)].map((_, idx) => (
                                    <span 
                                        key={idx} 
                                        className={`text-xs ${idx < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className='text-xs text-gray-500'>({product.rating})</span>
                        </div>
                    )}
                    
                    {/* Price */}
                    <div className='flex items-baseline gap-2 mt-1'>
                        {product.discount && product.discount > 0 ? (
                            <>
                                <span className='text-lg font-bold text-gray-900'>
                                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className='text-sm text-gray-400 line-through'>
                                    ${product.price.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className='text-lg font-bold text-gray-900'>
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    {product.stock !== undefined && (
                        <div className='mt-1'>
                            {product.stock > 0 ? (
                                product.stock < 10 ? (
                                    <span className='inline-flex items-center gap-1 text-xs text-orange-600'>
                                        <span className='w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse'></span>
                                        Only {product.stock} left
                                    </span>
                                ) : (
                                    <span className='inline-flex items-center gap-1 text-xs text-green-600'>
                                        <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                                        In Stock
                                    </span>
                                )
                            ) : (
                                <span className='inline-flex items-center gap-1 text-xs text-red-600'>
                                    <span className='w-1.5 h-1.5 bg-red-500 rounded-full'></span>
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Hover Arrow */}
                <div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <IoIosArrowForward className='text-gray-400' />
                </div>
            </Link>
        );
    };

    return (
        <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm'>
            <ButtonGroup />
            
            {isSlider ? (
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerView={1}
                    spaceBetween={0}
                    loop={false}
                    allowTouchMove={true}
                    speed={500}
                    modules={[Navigation]}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        464: {
                            slidesPerView: 1,
                        },
                        1024: {
                            slidesPerView: 1,
                        },
                        3000: {
                            slidesPerView: 1,
                        },
                    }}
                    className='products-swiper'
                >
                    {products.map((productGroup, i) => (
                        <SwiperSlide key={i}>
                            <div className='flex flex-col gap-3'>
                                {productGroup.map((product) => renderProductItem(product))}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className='flex flex-col gap-3'>
                    {products.map((productGroup, i) => (
                        <div key={i}>
                            {productGroup.map((product) => renderProductItem(product))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
