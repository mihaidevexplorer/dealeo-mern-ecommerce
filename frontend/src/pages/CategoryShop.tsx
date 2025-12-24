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
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const {
    products,
    categories: categorys,
    priceRange,
    latestProducts: latest_product,
    totalProduct,
    parPage
  } = useHomeState();

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
    pageNumber: pageNumber
  });

  const resetRating = (): void => {
    setRating('');
  };

  return (
    <div>
      <Header />
      <section className='bg-[url("/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Category Page</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>{category}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='w-[85%] md:w-[90%] sm:w-[90%] mx-auto'>
          <div className='md:block hidden'>
            <div className='w-full flex justify-between items-center'>
              <div className='flex justify-center items-center gap-2'>
                <span className='text-2xl font-semibold'>Filters</span>
                <button
                  onClick={() => setFilter(!filter)}
                  className='text-white text-sm px-4 py-1 rounded-sm bg-[#059473]'
                >
                  {filter ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className='flex justify-center items-center gap-4'>
                <select
                  onChange={(e) => setSortPrice(e.target.value)}
                  className='p-2 border outline-0 text-slate-600 font-semibold'
                >
                  <option value=''>Sort By</option>
                  <option value='low-to-high'>Low to High Price</option>
                  <option value='high-to-low'>High to Low Price</option>
                </select>

                <div className='flex justify-center items-center gap-4'>
                  <div
                    onClick={() => setStyles('grid')}
                    className={`p-2 ${styles === 'grid' && 'bg-gray-300'} text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm`}
                  >
                    <BsFillGridFill />
                  </div>
                  <div
                    onClick={() => setStyles('list')}
                    className={`p-2 ${styles === 'list' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
                  >
                    <FaThList />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full mt-8 flex flex-wrap'>
            <div
              className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${
                filter ? 'md:block' : 'md:hidden'
              }`}
            >
              <div className='w-full flex flex-col gap-2'>
                <h3 className='text-3xl font-bold mb-3 text-slate-600'>Category</h3>
                <div className='flex flex-col gap-2'>
                  {categorys.map((c: any, i: number) => (
                    <Link
                      key={i}
                      to={`/products?category=${c.name}`}
                      className='text-slate-600 font-semibold hover:text-[#059473]'
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className='w-full flex flex-col gap-2 mt-8'>
                <h3 className='text-3xl font-bold mb-3 text-slate-600'>Price Range</h3>
                <Range
                  step={5}
                  min={priceRange.low}
                  max={priceRange.high}
                  values={state.values}
                  onChange={(values) => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      key='track'
                      className='w-full h-[6px] bg-gray-300 rounded-full cursor-pointer'
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, index }) => (
                    <div
                      {...props}
                      key={`thumb-${index}`}
                      className='w-[15px] h-[15px] bg-[#ff7f50] rounded-full'
                    />
                  )}
                />
                <div className='flex justify-between items-center'>
                  <span className='text-slate-600 font-semibold'>
                    {Math.floor(state.values[0])}$
                  </span>
                  <span className='text-slate-600 font-semibold'>
                    {Math.floor(state.values[1])}$
                  </span>
                </div>
              </div>

              <div className='w-full flex flex-col gap-2 mt-8'>
                <h3 className='text-3xl font-bold mb-3 text-slate-600'>Rating</h3>
                <div className='flex flex-col gap-3'>
                  <div className='flex gap-2 items-center'>
                    <label className='flex gap-1 text-orange-500'>
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                    </label>
                    <input
                      type='radio'
                      name='rating'
                      value='5'
                      onChange={(e) => setRating(e.target.value)}
                      checked={rating === '5'}
                    />
                  </div>
                  <div className='flex gap-2 items-center'>
                    <label className='flex gap-1 text-orange-500'>
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <CiStar />
                    </label>
                    <input
                      type='radio'
                      name='rating'
                      value='4'
                      onChange={(e) => setRating(e.target.value)}
                      checked={rating === '4'}
                    />
                  </div>
                  <div className='flex gap-2 items-center'>
                    <label className='flex gap-1 text-orange-500'>
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <CiStar />
                      <CiStar />
                    </label>
                    <input
                      type='radio'
                      name='rating'
                      value='3'
                      onChange={(e) => setRating(e.target.value)}
                      checked={rating === '3'}
                    />
                  </div>
                  <div className='flex gap-2 items-center'>
                    <label className='flex gap-1 text-orange-500'>
                      <AiFillStar />
                      <AiFillStar />
                      <CiStar />
                      <CiStar />
                      <CiStar />
                    </label>
                    <input
                      type='radio'
                      name='rating'
                      value='2'
                      onChange={(e) => setRating(e.target.value)}
                      checked={rating === '2'}
                    />
                  </div>
                  <div className='flex gap-2 items-center'>
                    <label className='flex gap-1 text-orange-500'>
                      <AiFillStar />
                      <CiStar />
                      <CiStar />
                      <CiStar />
                      <CiStar />
                    </label>
                    <input
                      type='radio'
                      name='rating'
                      value='1'
                      onChange={(e) => setRating(e.target.value)}
                      checked={rating === '1'}
                    />
                  </div>
                </div>

                <button
                  onClick={resetRating}
                  className='px-4 py-2 bg-[#059473] text-white rounded-sm mt-4'
                >
                  Reset Rating
                </button>
              </div>

              <div className='w-full mt-8'>
                <Products
                  title='Latest Product'
                  products={Array.isArray(latest_product) ? [latest_product] : []}
                />
              </div>
            </div>

            <div className='w-9/12 md-lg:w-8/12 md:w-full'>
              <div className='w-full flex justify-between items-center md-lg:flex-col gap-3'>
                <div className='flex justify-center items-center gap-2'>
                  <span className='text-2xl font-semibold'>All Products</span>
                </div>

                <div className='flex justify-center items-center gap-4'>
                  <select
                    onChange={(e) => setSortPrice(e.target.value)}
                    className='p-2 border outline-0 text-slate-600 font-semibold'
                  >
                    <option value=''>Sort By</option>
                    <option value='low-to-high'>Low to High Price</option>
                    <option value='high-to-low'>High to Low Price</option>
                  </select>
                  <div className='flex justify-center items-start gap-4 md-lg:hidden'>
                    <div
                      onClick={() => setStyles('grid')}
                      className={`p-2 ${styles === 'grid' && 'bg-gray-300'} text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm`}
                    >
                      <BsFillGridFill />
                    </div>
                    <div
                      onClick={() => setStyles('list')}
                      className={`p-2 ${styles === 'list' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
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
      </section>

      <Footer />
    </div>
  );
};

export default CategoryShop;
