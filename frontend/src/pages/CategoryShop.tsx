// src/pages/CategoryShop.tsx
import React, { useEffect, useMemo, useState } from 'react';
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
  const category = searchParams.get('category') || '';

  const {
    products,
    categories: categorys,
    priceRange,
    latestProducts: latest_product,
    totalProduct,
    parPage
  } = useHomeState();


  const getCategories = useGetCategories();
  const getPriceRange = usePriceRangeProducts();
  const queryProducts = useQueryProducts();

  const [filterOpen, setFilterOpen] = useState<boolean>(true);
  const [rating, setRating] = useState<string>('');
  const [styles, setStyles] = useState<ViewStyle>('grid');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortPrice, setSortPrice] = useState<string>('');

  const [rangeState, setRangeState] = useState<{ values: number[] }>({
    values: [priceRange.low, priceRange.high]
  });

  // 1) Fetch initial (o singură dată)
  useEffect(() => {
    // dacă hook-urile tale sunt "fire-and-forget"
    // și returnează void, e OK să le apelezi aici
    getCategories?.();
    getPriceRange?.();
 
  }, []);

  // 2) Când se schimbă priceRange (după fetch), sincronizăm slider-ul
  useEffect(() => {
    setRangeState({ values: [priceRange.low, priceRange.high] });
  }, [priceRange.low, priceRange.high]);

  // 3) Query products când se schimbă filtrele/pagina/categoria
  useEffect(() => {
    queryProducts?.({
      low: rangeState.values[0] ?? undefined,
      high: rangeState.values[1] ?? undefined,
      category: category || undefined,
      rating: rating || undefined,
      sortPrice: sortPrice || undefined,
      pageNumber
    });
  }, [category, pageNumber, queryProducts, rangeState.values, rating, sortPrice]);

  const resetRating = (): void => setRating('');

  // Dacă latest_product este Product[] în store (cum e folosit în Home),
  // atunci îl împachetăm la Product[][].
  const latestProducts2D = useMemo(() => {
    return Array.isArray(latest_product) ? [latest_product] : [];
  }, [latest_product]);

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
                <span>{category || 'All'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='w-[85%] md:w-[90%] sm:w-[90%] mx-auto'>
          {/* Top bar (desktop) */}
          <div className='md:block hidden'>
            <div className='w-full flex justify-between items-center'>
              <div className='flex justify-center items-center gap-2'>
                <span className='text-2xl font-semibold'>Filters</span>
                <button
                  onClick={() => setFilterOpen((v) => !v)}
                  className='text-white text-sm px-4 py-1 rounded-sm bg-[#059473]'
                >
                  {filterOpen ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className='flex justify-center items-center gap-4'>
                <select
                  value={sortPrice}
                  onChange={(e) => setSortPrice(e.target.value)}
                  className='p-2 border outline-0 text-slate-600 font-semibold'
                >
                  <option value=''>Sort By</option>
                  <option value='low-to-high'>Low to High Price</option>
                  <option value='high-to-low'>High to Low Price</option>
                </select>

                <div className='flex justify-center items-center gap-4'>
                  <button
                    type='button'
                    onClick={() => setStyles('grid')}
                    className={`p-2 text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm ${
                      styles === 'grid' ? 'bg-gray-300' : ''
                    }`}
                    aria-label='Grid view'
                  >
                    <BsFillGridFill />
                  </button>

                  <button
                    type='button'
                    onClick={() => setStyles('list')}
                    className={`p-2 text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm ${
                      styles === 'list' ? 'bg-slate-300' : ''
                    }`}
                    aria-label='List view'
                  >
                    <FaThList />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full mt-8 flex flex-wrap'>
            {/* Left filters */}
            <aside
              className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${
                filterOpen ? 'md:block' : 'md:hidden'
              }`}
            >
              {/* Category */}
              <div className='w-full flex flex-col gap-2'>
                <h3 className='text-3xl font-bold mb-3 text-slate-600'>Category</h3>
                <div className='flex flex-col gap-2'>
                  {categorys?.map((c: any, i: number) => (
                    <Link
                      key={i}
                      to={`/products?category=${encodeURIComponent(c?.name ?? '')}`}
                      className='text-slate-600 font-semibold hover:text-[#059473]'
                    >
                      {c?.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className='w-full flex flex-col gap-2 mt-8'>
                <h3 className='text-3xl font-bold mb-3 text-slate-600'>Price Range</h3>

                <Range
                  step={5}
                  min={priceRange.low}
                  max={priceRange.high}
                  values={rangeState.values}
                  onChange={(values) => setRangeState({ values })}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className='w-full h-[6px] bg-gray-300 rounded-full cursor-pointer'
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      className='w-[15px] h-[15px] bg-[#ff7f50] rounded-full'
                    />
                  )}
                />

                <div className='flex justify-between items-center'>
                  <span className='text-slate-600 font-semibold'>
                    {Math.floor(rangeState.values[0] ?? 0)}$
                  </span>
                  <span className='text-slate-600 font-semibold'>
                    {Math.floor(rangeState.values[1] ?? 0)}$
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className='w-full flex flex-col gap-2 mt-8'>
                <h3 className='text-3xl font-bold mb-3 text-slate-600'>Rating</h3>

                <div className='flex flex-col gap-3'>
                  {[
                    { val: '5', stars: 5 },
                    { val: '4', stars: 4 },
                    { val: '3', stars: 3 },
                    { val: '2', stars: 2 },
                    { val: '1', stars: 1 }
                  ].map((r) => (
                    <label key={r.val} className='flex gap-2 items-center cursor-pointer select-none'>
                      <span className='flex gap-1 text-orange-500'>
                        {Array.from({ length: 5 }).map((_, idx) =>
                          idx < r.stars ? <AiFillStar key={idx} /> : <CiStar key={idx} />
                        )}
                      </span>
                      <input
                        type='radio'
                        name='rating'
                        value={r.val}
                        onChange={(e) => setRating(e.target.value)}
                        checked={rating === r.val}
                      />
                    </label>
                  ))}
                </div>

                <button
                  onClick={resetRating}
                  className='px-4 py-2 bg-[#059473] text-white rounded-sm mt-4'
                  type='button'
                >
                  Reset Rating
                </button>
              </div>

              {/* Latest */}
              <div className='w-full mt-8'>
                <Products title='Latest Product' products={latestProducts2D} />
              </div>
            </aside>

            {/* Right products */}
            <main className='w-9/12 md-lg:w-8/12 md:w-full'>
              <div className='w-full flex justify-between items-center md-lg:flex-col gap-3'>
                <div className='flex justify-center items-center gap-2'>
                  <span className='text-2xl font-semibold'>All Products</span>
                </div>

                <div className='flex justify-center items-center gap-4'>
                  <select
                    value={sortPrice}
                    onChange={(e) => setSortPrice(e.target.value)}
                    className='p-2 border outline-0 text-slate-600 font-semibold'
                  >
                    <option value=''>Sort By</option>
                    <option value='low-to-high'>Low to High Price</option>
                    <option value='high-to-low'>High to Low Price</option>
                  </select>

                  <div className='flex justify-center items-start gap-4 md-lg:hidden'>
                    <button
                      type='button'
                      onClick={() => setStyles('grid')}
                      className={`p-2 text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm ${
                        styles === 'grid' ? 'bg-gray-300' : ''
                      }`}
                      aria-label='Grid view'
                    >
                      <BsFillGridFill />
                    </button>

                    <button
                      type='button'
                      onClick={() => setStyles('list')}
                      className={`p-2 text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm ${
                        styles === 'list' ? 'bg-slate-300' : ''
                      }`}
                      aria-label='List view'
                    >
                      <FaThList />
                    </button>
                  </div>
                </div>
              </div>

              <div className='pb-8'>
                <ShopProducts products={products} styles={styles} />
              </div>

              {totalProduct > parPage && (
                <Pagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalItem={totalProduct}
                  parPage={parPage}
                  showItem={Math.floor(totalProduct / parPage)}
                />
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryShop;
