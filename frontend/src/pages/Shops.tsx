//src\pages\Shops.tsx
// src/pages/Shops.tsx
import { useState, useEffect, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { Range } from 'react-range';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/products/Products';
import ShopProducts from '../components/products/ShopProducts';
import Pagination from '../components/Pagination';
import { usePriceRangeProducts, useQueryProducts, useGetCategories, useHomeState } from '../hooks/useHome';
import type { Category } from '../types';

// Type definitions
type ViewStyle = 'grid' | 'list';
type SortOption = '' | 'low-to-high' | 'high-to-low';
type RatingFilter = '' | '1' | '2' | '3' | '4' | '5';

interface PriceRangeState {
  values: number[];
}

const Shops: React.FC = () => {
  // Zustand store state
  const {
    products,
    categories,
    priceRange,
    latestProducts,
    totalProduct,
    parPage,
    loader
  } = useHomeState();

  // Local state
  const [filter, setFilter] = useState<boolean>(true);
  const [state, setState] = useState<PriceRangeState>({
    values: [priceRange.low, priceRange.high]
  });
  const [rating, setRating] = useState<RatingFilter>('');
  const [styles, setStyles] = useState<ViewStyle>('grid');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortPrice, setSortPrice] = useState<SortOption>('');
  const [category, setCategory] = useState<string>('');

  // React Query hooks
  const { isLoading: categoriesLoading } = useGetCategories();
  usePriceRangeProducts();
  const { isLoading: productsLoading } = useQueryProducts({
    low: state.values[0] || undefined,
    high: state.values[1] || undefined,
    category: category || undefined,
    rating: rating || undefined,
    sortPrice: sortPrice || undefined,
    pageNumber
  });

  // Update price range when data loads
  useEffect(() => {
    if (priceRange.low !== undefined && priceRange.high !== undefined) {
      setState({
        values: [priceRange.low, priceRange.high]
      });
    }
  }, [priceRange]);

  // Reset page number when filters change
  useEffect(() => {
    setPageNumber(1);
  }, [state.values, category, rating, sortPrice]);

  // Handle price range change
  const handlePriceRangeChange = (values: number[]): void => {
    setState({ values });
  };

  // Handle category filter
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>, categoryName: string): void => {
    if (e.target.checked) {
      setCategory(categoryName);
    } else {
      setCategory('');
    }
  };

  // Handle sort change
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSortPrice(e.target.value as SortOption);
  };

  // Handle rating selection
  const handleRatingSelect = (ratingValue: RatingFilter): void => {
    setRating(ratingValue);
  };

  // Reset rating filter
  const resetRating = (): void => {
    setRating('');
  };

  // Handle view style change
  const handleStyleChange = (style: ViewStyle): void => {
    setStyles(style);
  };

  // Handle pagination
  const handlePageChange = (page: number): void => {
    setPageNumber(page);
  };

  // Toggle filter visibility on mobile
  const toggleFilter = (): void => {
    setFilter(!filter);
  };

  // Render star rating component
  const renderStarRating = (ratingValue: number, onClick: () => void): JSX.Element => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= ratingValue ? <AiFillStar /> : <CiStar />}
        </span>
      );
    }

    return (
      <div
        onClick={onClick}
        className='text-orange-500 flex justify-start items-start gap-2 text-xl sm:text-lg xs:text-base cursor-pointer hover:text-orange-600 transition-colors'
      >
        {stars}
      </div>
    );
  };

  // Loading state for initial data
  const isLoading = categoriesLoading || productsLoading || loader;

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="bg-[url('/images/banner/shop.png')] h-[260px] xl:h-[240px] md:h-[200px] sm:h-[180px] mt-6 bg-cover bg-no-repeat relative bg-left">
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='mx-auto w-[90%] max-w-[1200px] h-full'>
            <div className='flex flex-col justify-center gap-2 sm:gap-1 items-center h-full w-full text-white text-center px-2'>
              <h2 className='text-4xl xl:text-3xl md:text-2xl sm:text-xl font-bold'>Shop Page</h2>
              <div className='flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-2xl md:text-xl sm:text-base w-full'>
                <Link to='/' className='hover:underline'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>Shop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='py-16 md:py-10 sm:py-8'>
        <div className='mx-auto w-[90%] max-w-[1200px] h-full'>

          {/* Mobile Filter Toggle */}
          <div className={`md:block hidden ${!filter ? 'mb-6' : 'mb-0'}`}>
            <button
              onClick={toggleFilter}
              className='text-center w-full py-2.5 px-4 bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-md shadow-sm'
            >
              {filter ? 'Show Filters' : 'Hide Filters'}
            </button>
          </div>

          <div className='w-full flex flex-wrap gap-y-8'>

            {/* Sidebar Filters */}
            <div
              className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 md-lg:pr-4 md:pr-0 transition-all duration-300 ${
                filter
                  ? 'md:h-0 md:overflow-hidden md:mb-6 md:p-0 md:border-0'
                  : 'md:h-auto md:overflow-auto md:max-h-[70vh] md:mb-0 md:p-4 md:border md:rounded-lg md:bg-white md:shadow-sm'
              }`}
            >

              {/* Category Filter */}
              <div className='mb-6'>
                <h2 className='text-3xl md:text-2xl sm:text-xl font-bold mb-3 text-gray-900'>Category</h2>
                <div className='py-2'>
                  {categoriesLoading ? (
                    <div className='text-gray-500'>Loading categories...</div>
                  ) : (
                    categories.map((c: Category) => (
                      <div key={c._id} className='flex justify-start items-center gap-2 py-1'>
                        <input
                          checked={category === c.name}
                          onChange={(e) => handleCategoryChange(e, c.name)}
                          type="checkbox"
                          id={c.name}
                          className='cursor-pointer'
                        />
                        <label
                          className='text-gray-900 block cursor-pointer hover:text-gray-700 transition-colors'
                          htmlFor={c.name}
                        >
                          {c.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className='py-2 flex flex-col gap-5 mb-6'>
                <h2 className='text-3xl md:text-2xl sm:text-xl font-bold mb-3 text-gray-900'>Price</h2>

                <Range
                  step={5}
                  min={priceRange.low}
                  max={priceRange.high}
                  values={state.values}
                  onChange={handlePriceRangeChange}
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
                      className="w-[15px] h-[15px] bg-[#ff7f50] rounded-full cursor-pointer hover:bg-[#ff6347] transition-colors"
                    />
                  )}
                />

                <div>
                  <span className='text-slate-800 font-bold text-lg sm:text-base'>
                    ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                  </span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className='py-3 flex flex-col gap-4 mb-6'>
                <h2 className='text-3xl md:text-2xl sm:text-xl font-bold mb-3 text-gray-900'>Rating</h2>
                <div className='flex flex-col gap-3'>
                  {[5, 4, 3, 2, 1].map((ratingValue) => (
                    <div key={ratingValue}>
                      {renderStarRating(ratingValue, () => handleRatingSelect(ratingValue.toString() as RatingFilter))}
                    </div>
                  ))}

                  {/* Reset Rating Option */}
                  <div
                    onClick={resetRating}
                    className='text-orange-500 flex flex-wrap justify-start items-center gap-2 text-xl sm:text-lg xs:text-base cursor-pointer hover:text-orange-600 transition-colors'
                  >
                    <span><CiStar /></span>
                    <span><CiStar /></span>
                    <span><CiStar /></span>
                    <span><CiStar /></span>
                    <span><CiStar /></span>
                    <span className='ml-2 text-sm xs:text-xs text-gray-600'>Clear Rating</span>
                  </div>
                </div>
              </div>

              {/* Latest Products - Hidden on Mobile */}
              <div className='py-5 flex flex-col gap-4 md:hidden'>
                <Products title='Latest Products' products={[latestProducts]} />
              </div>
            </div>

            {/* Main Content Area */}
            <div className='w-9/12 md-lg:w-8/12 md:w-full'>
              <div className='pl-8 md:pl-0'>

                {/* Products Header */}
                <div className='py-4 bg-white mb-10 md:mb-6 px-4 sm:px-3 rounded-md flex justify-between md:flex-col md:items-stretch md:gap-3 items-start border shadow-sm'>
                  <h2 className='text-lg sm:text-base font-medium text-blue-900'>
                    ({totalProduct}) Products
                    {isLoading && <span className='ml-2 text-sm text-gray-500'>Loading...</span>}
                  </h2>

                  <div className='flex justify-center items-center gap-3 md:flex-col md:items-stretch md:gap-2'>
                    {/* Sort Dropdown */}
                    <select
                      onChange={handleSortChange}
                      value={sortPrice}
                      className='p-2 md:p-2.5 border outline-0 text-gray-900 font-semibold rounded focus:border-blue-500 transition-colors md:w-full'
                      name="sort"
                      id="sort"
                    >
                      <option value="">Sort By</option>
                      <option value="low-to-high">Low to High Price</option>
                      <option value="high-to-low">High to Low Price</option>
                    </select>

                    {/* View Style Toggle */}
                    <div className='flex justify-center items-start gap-4 md-lg:hidden md:justify-start'>
                      <div
                        onClick={() => handleStyleChange('grid')}
                        className={`p-2 ${styles === 'grid' ? 'bg-gray-300' : ''} text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm transition-colors`}
                        title="Grid view"
                      >
                        <BsFillGridFill />
                      </div>
                      <div
                        onClick={() => handleStyleChange('list')}
                        className={`p-2 ${styles === 'list' ? 'bg-gray-300' : ''} text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm transition-colors`}
                        title="List view"
                      >
                        <FaThList />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Grid/List */}
                <div className='pb-8 md:pb-6'>
                  {isLoading ? (
                    <div className='flex justify-center items-center py-20 md:py-14 sm:py-10'>
                      <div className='text-lg sm:text-base text-gray-600'>Loading products...</div>
                    </div>
                  ) : products.length > 0 ? (
                    <ShopProducts products={products} styles={styles} />
                  ) : (
                    <div className='flex flex-col items-center justify-center py-20 md:py-14 sm:py-10 text-gray-500 text-center px-2'>
                      <h3 className='text-xl sm:text-lg font-semibold mb-2'>No Products Found</h3>
                      <p className='sm:text-sm'>Try adjusting your filters to see more products.</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className='flex justify-center'>
                  {totalProduct > parPage && !isLoading && (
                    <Pagination
                      pageNumber={pageNumber}
                      setPageNumber={handlePageChange}
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

export default Shops;
