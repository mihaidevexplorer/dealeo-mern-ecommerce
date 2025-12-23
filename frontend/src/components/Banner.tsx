import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useGetBanners, useHomeState } from "../hooks/useHome";

const Banner: React.FC = () => {
  const { banners } = useHomeState();

  // Fetch banners data
  useGetBanners();

  return (
    <div className="w-full md-lg:mt-6 md:mt-5 sm:mt-4 xs:mt-3 2xs:mt-2">
      <div className="w-[85%] lg:w-[90%] md:w-[92%] sm:w-[94%] xs:w-[96%] 2xs:w-[96%] mx-auto">
        <div className="w-full flex flex-wrap md-lg:gap-8 md:gap-6 sm:gap-5 xs:gap-4 2xs:gap-3">
          <div className="w-full">
            <div className="my-8 lg:my-7 md:my-6 sm:my-5 xs:my-4 2xs:my-3">
              <div className="rounded-2xl sm:rounded-xl xs:rounded-xl 2xs:rounded-lg overflow-hidden shadow-2xl sm:shadow-xl xs:shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Swiper
                  modules={[Autoplay, Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  navigation={true}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  loop={true}
                  className="banner-swiper"
                >
                  {banners.length > 0 &&
                    banners.map((b, i) => (
                      <SwiperSlide key={i}>
                        <Link to={`product/details/${b.link}`}>
                          <div className="relative w-full h-[400px] lg:h-[380px] md:h-[320px] sm:h-[240px] xs:h-[200px] 2xs:h-[170px] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group">
                            <img
                              src={b.banner}
                              alt={`Banner ${i + 1}`}
                              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
