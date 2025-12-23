// src/pages/CategoryShop.tsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';
import { Range } from 'react-range';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/products/Products';
import ShopProducts from '../components/products/ShopProducts';
import Pagination from '../components/Pagination';
import {
  useHomeState,
  useGetCategories,
  usePriceRangeProducts,
  useQueryProducts
} from '../hooks/useHome';

type ViewStyle = 'grid' | 'list';

const CategoryShop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(setSearchParams);

  const category = searchParams.get('category');
  console.log(category);

  const {
    products,
    categories: categorys,
    priceRange,
    latestProducts: latest_product,
    totalProduct,
    parPage
  } = useHomeState();
  console.log(categorys);

  useGetCategories();
  usePriceRangeProducts();

  const [filter, setFilter] = useState<boolean>(true);
  const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });
  const [rating, setRating] = useState<string>('');
  const [styles, setStyles] = useState<ViewStyle>('grid');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortPrice, setSortPrice] = useState<string>('');

  useEffect(() => {
    setState({
      values: [priceRange.low, priceRange.high]
    });
  }, [priceRange]);

  useQueryProducts({
    low: state.values[0] || undefined,
    high: state.values[1] || undefined,
    category: category || undefined,
    rating: rating || undefined,
    sortPrice: sortPrice || undefined,
    pageNumber: pageNumber,
  });

  console.log("state.values:", state.values);

  const resetRating = (): void => {
    setRating('');
  };

  return (
    <div>
      <Header />

      {/* Hero */}
      <section className='bg-[url("/images/banner/shop.png")] h-[240px] xl:h-[220px] md-lg:h-[210px] md:h-[200px] sm:h-[180px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-full max-w-7xl px-10 xl:px-8 lg:px-6 md-lg:px-5 md:px-4 sm:px-3 xs:px-2 h-full mx-auto'>
            <div className='flex flex-col justify-center gap-2 sm:gap-1 items-center h-full w-full text-white text-center'>
              <h2 className='text-4xl xl:text-3xl md:text-2xl sm:text-xl font-bold'>Category Page</h2>
              <div className='flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-2xl md:text-xl sm:text-base w-full'>
                <Link to='/' className='hover:underline'>Home</Link>
                <span className='pt-1'><IoIosArrowForward /></span>
                <span>Category</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className='py-16 md-lg:py-12 md:py-10 sm:py-8'>
        <div className='w-full max-w-7xl px-10 xl:px-8 lg:px-6 md-lg:px-5 md:px-4 sm:px-3 xs:px-2 mx-auto'>

          {/* Mobile/Tablet Filter Toggle (<=991px) */}
          <div className={`md-lg:block hidden ${!filter ? 'mb-6' : 'mb-0'}`}>
            <button
              onClick={() => setFilter(!filter)}
              className='text-center w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 transition-colors text-white rounded-md shadow-sm'
            >
              {filter ? 'Show Filters' : 'Hide Filters'}
            </button>
          </div>

          {/* FIX: GRID layout (nu mai cade content sub sidebar) */}
          <div className='grid grid-cols-[320px_minmax(0,1fr)] gap-8 xl:gap-6 lg:gap-6 md-lg:grid-cols-1'>

            {/* Sidebar */}
            <aside
              className={`w-full transition-all duration-300 ${
                filter
                  ? 'md-lg:h-0 md-lg:overflow-hidden md-lg:mb-6 md-lg:p-0 md-lg:border-0'
                  : 'md-lg:h-auto md-lg:overflow-auto md-lg:max-h-[70vh] md-lg:mb-0 md-lg:p-4 md-lg:border md-lg:rounded-lg md-lg:bg-white md-lg:shadow-sm'
              }`}
            >
              {/* Card wrapper only for desktop */}
              <div className='bg-white rounded-lg border shadow-sm p-4 md-lg:p-0 md-lg:bg-transparent md-lg:border-0 md-lg:shadow-none'>

                {/* Price */}
                <div className='py-2 flex flex-col gap-5'>
                  <h2 className='text-3xl md:text-2xl sm:text-xl font-bold mb-1 text-gray-900'>Price</h2>

                  <Range
                    step={5}
                    min={priceRange.low}
                    max={priceRange.high}
                    values={state.values}
                    onChange={(values) => setState({ values })}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        key="track"
                        className="w-full h-[6px] bg-gray-300 rounded-full cursor-pointer"
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, index }) => (
                      <div
                        {...props}
                        key={`thumb-${index}`}
                        className="w-[15px] h-[15px] bg-[#ff7f50] rounded-full"
                      />
                    )}
                  />

                  <div>
                    <span className='text-gray-900 font-bold text-lg sm:text-base'>
                      ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className='py-6 flex flex-col gap-4'>
                  <h2 className='text-3xl md:text-2xl sm:text-xl font-bold mb-1 text-gray-900'>Rating</h2>

                  <div className='flex flex-col gap-3'>
                    <div onClick={() => setRating('5')} className='text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span>
                    </div>

                    <div onClick={() => setRating('4')} className='text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span>
                    </div>

                    <div onClick={() => setRating('3')} className='text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span>
                    </div>

                    <div onClick={() => setRating('2')} className='text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                    </div>

                    <div onClick={() => setRating('1')} className='text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                    </div>

                    <div onClick={resetRating} className='text-orange-500 flex flex-wrap justify-start items-center gap-2 text-xl sm:text-lg xs:text-base cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                      <span className='ml-2 text-sm xs:text-xs text-gray-600'>Clear</span>
                    </div>
                  </div>
                </div>

                {/* Latest products (hidden on <=768) */}
                <div className='pt-2 md:hidden'>
                  <Products title='Latest Product' products={[latest_product]} />
                </div>

              </div>
            </aside>

            {/* Main */}
            <main className='min-w-0 w-full'>
              {/* Header */}
              <div className='py-4 bg-white mb-10 md:mb-6 px-4 sm:px-3 rounded-md flex justify-between md-lg:flex-col md-lg:items-stretch md-lg:gap-3 items-start border shadow-sm'>
                <h2 className='text-lg sm:text-base font-medium text-gray-900'>({totalProduct}) Products</h2>

                <div className='flex justify-center items-center gap-3 md-lg:flex-col md-lg:items-stretch md-lg:gap-2'>
                  <select
                    onChange={(e) => setSortPrice(e.target.value)}
                    className='p-2 border outline-0 text-gray-700 font-semibold rounded focus:border-green-500 md-lg:w-full'
                    name="sort"
                    id="sort"
                    value={sortPrice}
                  >
                    <option value="">Sort By</option>
                    <option value="low-to-high">Low to High Price</option>
                    <option value="high-to-low">High to Low Price</option>
                  </select>

                  <div className='flex justify-center items-start gap-4 md-lg:hidden md:justify-start'>
                    <div
                      onClick={() => setStyles('grid')}
                      className={`p-2 ${styles === 'grid' ? 'bg-gray-300' : ''} text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm`}
                      title="Grid view"
                    >
                      <BsFillGridFill />
                    </div>
                    <div
                      onClick={() => setStyles('list')}
                      className={`p-2 ${styles === 'list' ? 'bg-slate-300' : ''} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
                      title="List view"
                    >
                      <FaThList />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className='pb-8 md:pb-6'>
                <ShopProducts products={products} styles={styles} />
              </div>

              {/* Pagination */}
              <div className='flex justify-center'>
                {totalProduct > parPage && (
                  <Pagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalItem={totalProduct}
                    parPage={parPage}
                    showItem={Math.floor(totalProduct / parPage)}
                  />
                )}
              </div>
            </main>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryShop;
