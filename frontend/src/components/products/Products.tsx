// src/components/products/Products.tsx
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

    if (!products || !Array.isArray(products) || products.length === 0) {
        return (
            <div className='flex justify-center items-center py-12 sm:py-10 xs:py-8 2xs:py-7'>
                <div className='text-center'>
                    <div className='w-16 h-16 sm:w-14 sm:h-14 xs:w-12 xs:h-12 2xs:w-11 2xs:h-11 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-3 xs:mb-3'>
                        <AiFillFire className='text-2xl sm:text-xl xs:text-lg text-gray-400' />
                    </div>
                    <p className='text-gray-500 font-medium text-sm xs:text-xs'>No products available</p>
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
            <div className='flex justify-between items-center mb-6 md:mb-5 sm:flex-col sm:items-start sm:gap-3 xs:gap-2'>
                <div className='flex items-center gap-3 xs:gap-2 flex-wrap min-w-0'>
                    <h2 className='text-2xl lg:text-xl md:text-lg sm:text-base xs:text-[15px] 2xs:text-[14px] font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent break-words'>
                        {title}
                    </h2>
                    <div className='flex items-center gap-1 bg-orange-100 px-2 py-1 xs:px-1.5 xs:py-0.5 rounded-full flex-shrink-0'>
                        <AiFillFire className='text-orange-500 text-sm xs:text-[12px]' />
                        <span className='text-xs xs:text-[11px] 2xs:text-[10px] font-semibold text-orange-600'>Hot</span>
                    </div>
                </div>
                <div className='flex items-center gap-2 xs:gap-1.5 sm:self-end'>
                    <button
                        onClick={handlePrevious}
                        className='w-10 h-10 lg:w-9 lg:h-9 xs:w-8 xs:h-8 2xs:w-8 2xs:h-8 flex justify-center items-center bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group'
                        aria-label="Previous products"
                    >
                        <IoIosArrowBack className='text-gray-600 group-hover:text-gray-900 transition-colors' />
                    </button>
                    <button
                        onClick={handleNext}
                        className='w-10 h-10 lg:w-9 lg:h-9 xs:w-8 xs:h-8 2xs:w-8 2xs:h-8 flex justify-center items-center bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group'
                        aria-label="Next products"
                    >
                        <IoIosArrowForward className='text-gray-600 group-hover:text-gray-900 transition-colors' />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-xl xs:rounded-xl 2xs:rounded-lg p-6 lg:p-5 md:p-4 sm:p-3 xs:p-2 2xs:p-2 shadow-sm'>
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
                    0: { slidesPerView: 1 },
                    464: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                    3000: { slidesPerView: 1 },
                }}
                className='products-swiper'
            >
                {products.map((p, i) => {
                    if (!Array.isArray(p)) return null;

                    return (
                        <SwiperSlide key={i}>
                            <div className='flex flex-col gap-3 sm:gap-2 xs:gap-2 2xs:gap-2'>
                                {p.map((pl, j) => {
                                    if (!pl || !pl.slug || !pl.images || !pl.images[0] || !pl.name || pl.price === undefined) {
                                        return null;
                                    }

                                    return (
                                        <Link
                                            key={j}
                                            className='group flex items-center gap-4 md:gap-3 sm:gap-3 xs:gap-2 2xs:gap-2 p-3 sm:p-2.5 xs:p-2 2xs:p-1.5 bg-white rounded-xl xs:rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] xs:hover:scale-[1.01]'
                                            to={`/product/details/${pl.slug}`}
                                        >
                                            {/* Product Image */}
                                            <div className='relative flex-shrink-0'>
                                                <div className='w-24 h-24 lg:w-20 lg:h-20 md-lg:w-[72px] md-lg:h-[72px] md:w-16 md:h-16 sm:w-14 sm:h-14 xs:w-12 xs:h-12 2xs:w-11 2xs:h-11 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden'>
                                                    <img
                                                        className='w-full h-full object-contain p-2 xs:p-1.5 2xs:p-1 group-hover:scale-110 transition-transform duration-300'
                                                        src={pl.images[0]}
                                                        alt={pl.name}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                {pl.discount && pl.discount > 0 && (
                                                    <div className='absolute -top-2 -right-2 sm:-top-1.5 sm:-right-1.5 xs:-top-1 xs:-right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs xs:text-[10px] 2xs:text-[9px] font-bold px-2 py-0.5 sm:px-1.5 xs:px-1.5 rounded-full shadow-md'>
                                                        -{pl.discount}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors lg:text-sm sm:text-[13px] xs:text-[12px] 2xs:text-[11px]'>
                                                    {pl.name}
                                                </h3>

                                                {pl.rating !== undefined && (
                                                    <div className='flex items-center gap-1 mt-1'>
                                                        <div className='flex'>
                                                            {[...Array(5)].map((_, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`text-xs xs:text-[11px] 2xs:text-[10px] ${idx < Math.floor(pl.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span className='text-xs xs:text-[11px] 2xs:text-[10px] text-gray-500'>({pl.rating})</span>
                                                    </div>
                                                )}

                                                <div className='flex items-baseline gap-2 mt-1 flex-wrap'>
                                                    {pl.discount && pl.discount > 0 ? (
                                                        <>
                                                            <span className='text-lg lg:text-base md:text-[15px] sm:text-[14px] xs:text-[13px] 2xs:text-[13px] font-bold text-gray-900'>
                                                                ${(pl.price * (1 - pl.discount / 100)).toFixed(2)}
                                                            </span>
                                                            <span className='text-sm md:text-xs xs:text-[11px] 2xs:text-[11px] text-gray-400 line-through'>
                                                                ${pl.price.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className='text-lg lg:text-base md:text-[15px] sm:text-[14px] xs:text-[13px] 2xs:text-[13px] font-bold text-gray-900'>
                                                            ${pl.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {pl.stock !== undefined && (
                                                    <div className='mt-1'>
                                                        {pl.stock > 0 ? (
                                                            pl.stock < 10 ? (
                                                                <span className='inline-flex items-center gap-1 text-xs xs:text-[11px] 2xs:text-[10px] text-orange-600'>
                                                                    <span className='w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse'></span>
                                                                    Only {pl.stock} left
                                                                </span>
                                                            ) : (
                                                                <span className='inline-flex items-center gap-1 text-xs xs:text-[11px] 2xs:text-[10px] text-green-600'>
                                                                    <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                                                                    In Stock
                                                                </span>
                                                            )
                                                        ) : (
                                                            <span className='inline-flex items-center gap-1 text-xs xs:text-[11px] 2xs:text-[10px] text-red-600'>
                                                                <span className='w-1.5 h-1.5 bg-red-500 rounded-full'></span>
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hover Arrow */}
                                            <div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:hidden'>
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
