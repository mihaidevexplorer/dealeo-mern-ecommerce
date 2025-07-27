//src/components/Categorys.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useHomeState, useGetCategories } from '../hooks/useHome';

const Categorys: React.FC = () => {
    const { categories } = useHomeState();
    
    // Fetch categories if needed
    const { data } = useGetCategories();
    
    // Use the categories from the query data
    const categorys = data?.categorys || categories;

    return (
        <div className='w-full max-w-7xl mx-auto px-4 py-20 relative'>
            <div className='w-full mb-20'>
                <div className='text-center'>
                    <h2 className='text-2xl md:text-3xl font-normal text-gray-800 mb-2 tracking-wide'>
                        Shop by Category
                    </h2>
                    <p className='text-gray-400 text-sm mb-12 font-light'>
                        Discover our collection
                    </p>
                </div>
            </div>

            <div className="relative">
                <Swiper
                    modules={[Autoplay, Navigation]}
                    spaceBetween={24}
                    slidesPerView={2}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    navigation={{
                        nextEl: '.categories-swiper-button-next',
                        prevEl: '.categories-swiper-button-prev',
                    }}
                    loop={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 28,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 32,
                        },
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 36,
                        },
                        1280: {
                            slidesPerView: 6,
                            spaceBetween: 40,
                        },
                    }}
                    className="categories-swiper"
                >
                    {categorys.map((c, i) => (
                        <SwiperSlide key={i}>
                            <Link 
                                to={`/products?category=${c.name}`}
                                className='group block'
                            >
                                <div className='bg-white rounded-2xl border border-gray-100/60 p-8 pb-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 group'>
                                    {/* Image Container */}
                                    <div className='flex items-center justify-center mb-6 h-20'>
                                        <div className='w-16 h-16 flex items-center justify-center'>
                                            <img 
                                                src={c.image} 
                                                alt={c.name}
                                                className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-105'
                                            />
                                        </div>
                                    </div>

                                    {/* Category Name */}
                                    <div className='text-center'>
                                        <h3 className='text-gray-700 font-normal text-sm tracking-wide group-hover:text-gray-900 transition-colors duration-300'>
                                            {c.name}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <button className="categories-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <button className="categories-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Categorys;