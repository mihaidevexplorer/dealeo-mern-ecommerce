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
  products: Product[][];
}

const Products: React.FC<ProductsProps> = ({ title, products }) => {
    const swiperRef = useRef<SwiperType | null>(null);
    
    // Verifică dacă products există și nu este gol
    if (!products || !Array.isArray(products) || products.length === 0) {
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
                    <div className='flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full'>
                        <AiFillFire className='text-orange-500 text-sm' />
                        <span className='text-xs font-semibold text-orange-600'>Hot</span>
                    </div>
                </div>
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
            </div>
        );
    };

    return (
        <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm'>
            <ButtonGroup />
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
                {products.map((p, i) => {
                    // Verifică dacă p este un array valid
                    if (!Array.isArray(p)) {
                        return null;
                    }
                    
                    return (
                        <SwiperSlide key={i}>
                            <div className='flex flex-col gap-3'>
                                {p.map((pl, j) => {
                                    // Verifică dacă produsul are toate proprietățile necesare
                                    if (!pl || !pl.slug || !pl.images || !pl.images[0] || !pl.name || pl.price === undefined) {
                                        return null;
                                    }
                                    
                                    return (
                                        <Link 
                                            key={j} 
                                            className='group flex items-center gap-4 p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]' 
                                            to={`/product/details/${pl.slug}`}
                                        >
                                            {/* Product Image */}
                                            <div className='relative flex-shrink-0'>
                                                <div className='w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden'>
                                                    <img 
                                                        className='w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300' 
                                                        src={pl.images[0]} 
                                                        alt={pl.name}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                {pl.discount && pl.discount > 0 && (
                                                    <div className='absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md'>
                                                        -{pl.discount}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors'>
                                                    {pl.name}
                                                </h3>
                                                
                                                {/* Rating if available */}
                                                {pl.rating !== undefined && (
                                                    <div className='flex items-center gap-1 mt-1'>
                                                        <div className='flex'>
                                                            {[...Array(5)].map((_, idx) => (
                                                                <span 
                                                                    key={idx} 
                                                                    className={`text-xs ${idx < Math.floor(pl.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span className='text-xs text-gray-500'>({pl.rating})</span>
                                                    </div>
                                                )}
                                                
                                                {/* Price */}
                                                <div className='flex items-baseline gap-2 mt-1'>
                                                    {pl.discount && pl.discount > 0 ? (
                                                        <>
                                                            <span className='text-lg font-bold text-gray-900'>
                                                                ${(pl.price * (1 - pl.discount / 100)).toFixed(2)}
                                                            </span>
                                                            <span className='text-sm text-gray-400 line-through'>
                                                                ${pl.price.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className='text-lg font-bold text-gray-900'>
                                                            ${pl.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock Status */}
                                                {pl.stock !== undefined && (
                                                    <div className='mt-1'>
                                                        {pl.stock > 0 ? (
                                                            pl.stock < 10 ? (
                                                                <span className='inline-flex items-center gap-1 text-xs text-orange-600'>
                                                                    <span className='w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse'></span>
                                                                    Only {pl.stock} left
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
                                })}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>   
        </div>
    );
};

export default Products;