//src/pages/CategoryShop.tsx
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

  // Fetch initial data
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

  // Query products based on filters
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

      <section className='bg-[url("/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-full max-w-7xl px-4 lg:px-6 h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl md:text-2xl font-bold text-center'>Category Page</h2>
              <div className='flex flex-wrap justify-center items-center gap-2 text-2xl md:text-lg w-full'>
                <Link to='/' className='hover:underline'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>Category</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='w-full max-w-7xl px-4 lg:px-6 h-full mx-auto'>
          {/* Mobile Filter Toggle */}
          <div className={`md:block hidden ${!filter ? 'mb-6' : 'mb-0'}`}>
            <button
              onClick={() => setFilter(!filter)}
              className='text-center w-full py-2 px-3 bg-orange-500 hover:bg-orange-600 transition-colors text-white rounded'
            >
              {filter ? 'Show Filters' : 'Hide Filters'}
            </button>
          </div>

          {/* Layout */}
          <div className='w-full flex flex-wrap gap-8 md-lg:gap-6'>
            {/* Sidebar */}
            <div
              className={`w-3/12 md-lg:w-4/12 md:w-full ${
                filter ? 'md:h-0 md:overflow-hidden md:mb-2' : 'md:h-auto md:overflow-auto md:mb-0'
              }`}
            >
              <div className='md:bg-white md:rounded-lg md:border md:shadow-sm md:p-4'>
                {/* Price */}
                <div className='py-2 flex flex-col gap-5'>
                  <h2 className='text-3xl md:text-2xl font-bold mb-3 text-gray-900'>Price</h2>

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
                    <span className='text-gray-900 font-bold text-lg'>
                      ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className='py-3 flex flex-col gap-4'>
                  <h2 className='text-3xl md:text-2xl font-bold mb-3 text-gray-900'>Rating</h2>
                  <div className='flex flex-col gap-3'>
                    <div onClick={() => setRating('5')} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span>
                    </div>

                    <div onClick={() => setRating('4')} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span>
                    </div>

                    <div onClick={() => setRating('3')} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span>
                    </div>

                    <div onClick={() => setRating('2')} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                    </div>

                    <div onClick={() => setRating('1')} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><AiFillStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                    </div>

                    <div onClick={resetRating} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-orange-600 transition-colors'>
                      <span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span><span><CiStar /></span>
                      <span className='ml-2 text-sm text-gray-600'>Clear</span>
                    </div>
                  </div>
                </div>

                {/* Latest products */}
                <div className='py-5 flex flex-col gap-4 md:hidden'>
                  <Products title='Latest Product' products={[latest_product]} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className='w-9/12 md-lg:w-8/12 md:w-full'>
              <div className='pl-8 md-lg:pl-0'>
                <div className='py-4 bg-white mb-10 px-3 rounded-md flex flex-wrap justify-between items-center gap-3 border shadow-sm'>
                  <h2 className='text-lg font-medium text-gray-900'>({totalProduct}) Products</h2>

                  <div className='flex flex-wrap justify-center items-center gap-3'>
                    <select
                      onChange={(e) => setSortPrice(e.target.value)}
                      className='p-2 border outline-0 text-gray-700 font-semibold rounded focus:border-green-500'
                      name="sort"
                      id="sort"
                      value={sortPrice}
                    >
                      <option value="">Sort By</option>
                      <option value="low-to-high">Low to High Price</option>
                      <option value="high-to-low">High to Low Price</option>
                    </select>

                    <div className='flex justify-center items-start gap-4 md-lg:hidden'>
                      <div
                        onClick={() => setStyles('grid')}
                        className={`p-2 ${styles === 'grid' ? 'bg-gray-300' : ''} text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm`}
                      >
                        <BsFillGridFill />
                      </div>
                      <div
                        onClick={() => setStyles('list')}
                        className={`p-2 ${styles === 'list' ? 'bg-slate-300' : ''} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
                      >
                        <FaThList />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='pb-8'>
                  <ShopProducts products={products} styles={styles} />
                </div>

                <div>
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
