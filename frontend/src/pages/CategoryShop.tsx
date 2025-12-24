// src/pages/CategoryShop.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { BsFillGridFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { Range } from "react-range";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Products from "../components/products/Products";
import ShopProducts from "../components/products/ShopProducts";
import Pagination from "../components/Pagination";
import {
  useHomeState,
  useGetCategories,
  usePriceRangeProducts,
  useQueryProducts,
} from "../hooks/useHome";
import type { Product } from "../types";

type ViewStyle = "grid" | "list";

const CategoryShop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const {
    products,
    categories: categorys,
    priceRange,
    latestProducts: latest_product,
    totalProduct,
    parPage,
  } = useHomeState();

  // Fetch initial data
  useGetCategories();
  usePriceRangeProducts();

  const [filter, setFilter] = useState<boolean>(true);

  // IMPORTANT: priceRange poate veni inițial ne-populat -> folosim fallback numeric sigur
  const low = useMemo(() => (Number(priceRange?.low) > 0 ? Number(priceRange.low) : 0), [priceRange]);
  const high = useMemo(() => {
    const h = Number(priceRange?.high);
    return h > 0 ? h : 1000; // fallback safe
  }, [priceRange]);

  // Asigurăm min/max valide
  const minPrice = useMemo(() => Math.min(low, high), [low, high]);
  const maxPrice = useMemo(() => Math.max(low, high), [low, high]);

  const [state, setState] = useState<{ values: number[] }>({
    values: [minPrice, maxPrice],
  });

  const [rating, setRating] = useState<string>("");
  const [styles, setStyles] = useState<ViewStyle>("grid");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortPrice, setSortPrice] = useState<string>("");

  // Când se schimbă range-ul din store, sincronizăm slider-ul
  useEffect(() => {
    setState({ values: [minPrice, maxPrice] });
  }, [minPrice, maxPrice]);

  // Clamp ca să nu trimiți valori “în afara” min/max (react-range e sensibil)
  const clampedLow = Math.max(minPrice, Math.min(state.values[0] ?? minPrice, maxPrice));
  const clampedHigh = Math.max(minPrice, Math.min(state.values[1] ?? maxPrice, maxPrice));

  // Query products based on filters
  useQueryProducts({
    low: clampedLow,
    high: clampedHigh,
    category: category || undefined,
    rating: rating || undefined,
    sortPrice: sortPrice || undefined,
    pageNumber,
  });

  const resetRating = (): void => setRating("");

  // “Latest product” pentru sidebar: Products așteaptă Product[][], iar noi îi dăm un grup
  const latestGroup: Product[][] = useMemo(() => {
    const arr = Array.isArray(latest_product) ? latest_product : [];
    return [arr];
  }, [latest_product]);

  return (
    <div>
      <Header />

      <section className='bg-[url("/images/banner/shop.png")] h-[220px] lg:h-[210px] md-lg:h-[200px] md:h-[190px] sm:h-[180px] xs:h-[170px] 2xs:h-[160px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
          <div className="w-[85%] lg:w-[90%] md:w-[92%] sm:w-[94%] xs:w-[96%] 2xs:w-[96%] h-full mx-auto">
            <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
              <h2 className="text-3xl lg:text-[28px] md-lg:text-[26px] md:text-2xl sm:text-xl xs:text-lg 2xs:text-[17px] font-bold">
                Category Page
              </h2>
              <div className="flex justify-center items-center gap-2 text-2xl lg:text-xl md:text-lg sm:text-base xs:text-sm 2xs:text-sm w-full">
                <Link to="/">Home</Link>
                <span className="pt-1">
                  <IoIosArrowForward />
                </span>
                <span>Category</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-14 md:py-12 sm:py-10 xs:py-9 2xs:py-8">
        <div className="w-[85%] lg:w-[90%] md:w-[92%] sm:w-[94%] xs:w-[96%] 2xs:w-[96%] h-full mx-auto">
          <div className={`md:block hidden ${!filter ? "mb-6" : "mb-0"}`}>
            <button
              onClick={() => setFilter(!filter)}
              className="text-center w-full py-2 px-3 bg-orange-500 text-white"
              type="button"
            >
              Filter Product
            </button>
          </div>

          <div className="w-full flex flex-wrap">
            {/* Sidebar */}
            <div
              className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 md:pr-0 ${
                filter ? "md:h-0 md:overflow-hidden md:mb-6" : "md:h-auto md:overflow-auto md:mb-0"
              }`}
            >
              {/* Price */}
              <div className="py-2 flex flex-col gap-5">
                <h2 className="text-3xl lg:text-[28px] md:text-2xl sm:text-xl xs:text-lg 2xs:text-[17px] font-bold mb-3 text-gray-900">
                  Price
                </h2>

                <Range
                  step={5}
                  min={minPrice}
                  max={maxPrice}
                  values={[clampedLow, clampedHigh]}
                  onChange={(values) => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <div {...props} className="w-full h-[6px] bg-gray-300 rounded-full cursor-pointer">
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div {...props} className="w-[15px] h-[15px] bg-[#ff7f50] rounded-full" />
                  )}
                />

                <div>
                  <span className="text-gray-900 font-bold text-lg lg:text-base sm:text-sm xs:text-sm">
                    ${Math.floor(clampedLow)} - ${Math.floor(clampedHigh)}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="py-3 flex flex-col gap-4">
                <h2 className="text-3xl lg:text-[28px] md:text-2xl sm:text-xl xs:text-lg 2xs:text-[17px] font-bold mb-3 text-gray-900">
                  Rating
                </h2>

                <div className="flex flex-col gap-3">
                  <div
                    onClick={() => setRating("5")}
                    className="text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer"
                  >
                    <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span>
                  </div>

                  <div
                    onClick={() => setRating("4")}
                    className="text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer"
                  >
                    <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span>
                  </div>

                  <div
                    onClick={() => setRating("3")}
                    className="text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer"
                  >
                    <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span>
                  </div>

                  <div
                    onClick={() => setRating("2")}
                    className="text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer"
                  >
                    <span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                  </div>

                  <div
                    onClick={() => setRating("1")}
                    className="text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer"
                  >
                    <span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                  </div>

                  <div
                    onClick={resetRating}
                    className="text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer"
                  >
                    <span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                  </div>
                </div>
              </div>

              {/* Latest product (sidebar, doar pe desktop) */}
              <div className="py-5 flex flex-col gap-4 md:hidden">
                <Products title="Latest Product" products={latestGroup} />
              </div>
            </div>

            {/* Content */}
            <div className="w-9/12 md-lg:w-8/12 md:w-full">
              <div className="pl-8 md:pl-0">
                <div className="py-4 bg-white mb-10 md:mb-8 sm:mb-7 xs:mb-6 px-3 rounded-md flex justify-between items-start border sm:flex-col sm:gap-3">
                  <h2 className="text-lg sm:text-base xs:text-sm font-medium text-gray-900">
                    ({Number(totalProduct) || 0}) Products
                  </h2>

                  <div className="flex justify-center items-center gap-3 sm:w-full sm:justify-between sm:gap-2">
                    <select
                      onChange={(e) => setSortPrice(e.target.value)}
                      className="p-1 border outline-0 text-gray-900 font-semibold sm:flex-1"
                    >
                      <option value="">Sort By</option>
                      <option value="low-to-high">Low to High Price</option>
                      <option value="high-to-low">High to Low Price</option>
                    </select>

                    <div className="flex justify-center items-start gap-4 md-lg:hidden">
                      <div
                        onClick={() => setStyles("grid")}
                        className={`p-2 ${styles === "grid" ? "bg-gray-300" : ""} text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm`}
                      >
                        <BsFillGridFill />
                      </div>
                      <div
                        onClick={() => setStyles("list")}
                        className={`p-2 ${styles === "list" ? "bg-slate-300" : ""} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
                      >
                        <FaThList />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pb-8">
                  <ShopProducts products={Array.isArray(products) ? products : []} styles={styles} />
                </div>

                <div>
                  {Number(totalProduct) > Number(parPage) && (
                    <Pagination
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      totalItem={Number(totalProduct) || 0}
                      parPage={Number(parPage) || 1}
                      showItem={Math.floor((Number(totalProduct) || 0) / (Number(parPage) || 1))}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryShop;
