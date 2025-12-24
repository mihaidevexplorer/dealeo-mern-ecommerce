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
    priceRange,
    latestProducts,
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
    pageNumber: pageNumber,
  });

  const resetRating = (): void => {
    setRating('');
  };

  return (
    <div>
      <Header />
      {/* Modificat: Înlocuit localhost cu cale relativă */}
      <section className='bg-[url("/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
          <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
              <h2 className='text-3xl font-bold'>Category Page</h2>
              <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/' className='hover:text-orange-300 transition-colors'>Home</Link>
                <span className='pt-1'>
                  <IoIosArrowForward />
                </span>
                <span>{category || 'All Categories'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
          <div className={`md:block hidden ${!filter ? 'mb-6' : 'mb-0'}`}>
            <button 
              onClick={() => setFilter(!filter)} 
              className='text-center w-full py-2 px-3 bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-lg shadow-md'
            >
              {filter ? 'Show Filters' : 'Hide Filters'}
            </button>
          </div>

          <div className='w-full flex flex-wrap'>
            {/* Filters Sidebar */}
            <div className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${filter ? 'md:h-0 md:overflow-hidden md:mb-6' : 'md:h-auto md:overflow-auto md:mb-0'}`}>
              
              {/* Price Filter */}
              <div className='py-2 flex flex-col gap-5'>
                <h2 className='text-2xl font-bold mb-3 text-gray-900'>Price Range</h2>
                
                <Range
                  step={5}
                  min={priceRange.low}
                  max={priceRange.high}
                  values={state.values}
                  onChange={(values) => setState({ values })}
                  renderTrack={({ props, children }) => {
                    return (
                      <div {...props} key="track" className="w-full h-[6px] bg-gray-300 rounded-full cursor-pointer">
                        {children}
                      </div>
                    );
                  }}
                  renderThumb={({ props, index }) => {
                    return (
                      <div {...props} key={`thumb-${index}`} className="w-[15px] h-[15px] bg-[#ff7f50] rounded-full shadow-md" />
                    );
                  }}
                />
                <div className='mt-2'>
                  <span className='text-gray-900 font-bold text-lg'>
                    ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                  </span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className='py-3 flex flex-col gap-4 mt-6'>
                <h2 className='text-2xl font-bold mb-3 text-gray-900'>Customer Rating</h2>
                <div className='flex flex-col gap-3'>
                  <div onClick={() => setRating('5')} className={`flex justify-start items-center gap-2 text-xl cursor-pointer p-2 rounded ${rating === '5' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                    <span className='text-orange-500 flex'>
                      <AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar />
                    </span>
                    <span className='text-gray-700 text-sm ml-2'>5 Stars</span>
                  </div>

                  <div onClick={() => setRating('4')} className={`flex justify-start items-center gap-2 text-xl cursor-pointer p-2 rounded ${rating === '4' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                    <span className='text-orange-500 flex'>
                      <AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar />
                    </span>
                    <span className='text-gray-400 ml-2'><CiStar /></span>
                    <span className='text-gray-700 text-sm ml-2'>4 Stars & up</span>
                  </div>

                  <div onClick={() => setRating('3')} className={`flex justify-start items-center gap-2 text-xl cursor-pointer p-2 rounded ${rating === '3' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                    <span className='text-orange-500 flex'>
                      <AiFillStar /><AiFillStar /><AiFillStar />
                    </span>
                    <span className='text-gray-400 ml-2'><CiStar /><CiStar /></span>
                    <span className='text-gray-700 text-sm ml-2'>3 Stars & up</span>
                  </div>

                  <div onClick={() => setRating('2')} className={`flex justify-start items-center gap-2 text-xl cursor-pointer p-2 rounded ${rating === '2' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                    <span className='text-orange-500 flex'>
                      <AiFillStar /><AiFillStar />
                    </span>
                    <span className='text-gray-400 ml-2'><CiStar /><CiStar /><CiStar /></span>
                    <span className='text-gray-700 text-sm ml-2'>2 Stars & up</span>
                  </div>

                  <div onClick={() => setRating('1')} className={`flex justify-start items-center gap-2 text-xl cursor-pointer p-2 rounded ${rating === '1' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                    <span className='text-orange-500 flex'>
                      <AiFillStar />
                    </span>
                    <span className='text-gray-400 ml-2'><CiStar /><CiStar /><CiStar /><CiStar /></span>
                    <span className='text-gray-700 text-sm ml-2'>1 Star & up</span>
                  </div>

                  <div onClick={resetRating} className={`flex justify-start items-center gap-2 text-xl cursor-pointer p-2 rounded ${!rating ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                    <span className='text-gray-400 flex'>
                      <CiStar /><CiStar /><CiStar /><CiStar /><CiStar />
                    </span>
                    <span className='text-gray-700 text-sm ml-2'>Show all ratings</span>
                  </div>
                </div>
              </div>

              {/* Latest Products Sidebar */}
              <div className='py-5 flex flex-col gap-4 md:hidden mt-8'>
                {latestProducts && latestProducts.length > 0 ? (
                  <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm'>
                    <div className='flex justify-between items-center mb-6'>
                      <div className='flex items-center gap-3'>
                        <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                          Latest Products
                        </h2>
                        <div className='flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full'>
                          <span className='text-xs font-semibold text-orange-600'>New</span>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col gap-3'>
                      {latestProducts.slice(0, 3).map((product, index) => {
                        if (!product || !product.slug || !product.images || !product.images[0] || !product.name) {
                          return null;
                        }

                        return (
                          <Link 
                            key={product._id || index} 
                            className='group flex items-center gap-4 p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]' 
                            to={`/product/details/${product.slug}`}
                          >
                            {/* Product Image */}
                            <div className='relative flex-shrink-0'>
                              <div className='w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden'>
                                <img 
                                  className='w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300' 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  loading="lazy"
                                />
                              </div>
                              {product.discount && product.discount > 0 && (
                                <div className='absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md'>
                                  -{product.discount}%
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className='flex-1 min-w-0'>
                              <h3 className='font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors text-sm'>
                                {product.name}
                              </h3>
                              
                              {/* Rating if available */}
                              {product.rating !== undefined && (
                                <div className='flex items-center gap-1 mt-1'>
                                  <div className='flex'>
                                    {[...Array(5)].map((_, idx) => (
                                      <span 
                                        key={idx} 
                                        className={`text-xs ${idx < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  <span className='text-xs text-gray-500'>({product.rating})</span>
                                </div>
                              )}
                              
                              {/* Price */}
                              <div className='flex items-baseline gap-2 mt-1'>
                                {product.discount && product.discount > 0 ? (
                                  <>
                                    <span className='text-md font-bold text-gray-900'>
                                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                    </span>
                                    <span className='text-sm text-gray-400 line-through'>
                                      ${product.price.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className='text-md font-bold text-gray-900'>
                                    ${product.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-4'>
                      <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                        Latest Products
                      </h2>
                    </div>
                    <p className='text-gray-500 text-center py-4'>No latest products available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Main Products Area */}
            <div className='w-9/12 md-lg:w-8/12 md:w-full'>
              <div className='pl-8 md:pl-0'>
                {/* Products Header */}
                <div className='py-4 bg-white mb-10 px-3 rounded-md flex justify-between items-start border shadow-sm'>
                  <h2 className='text-lg font-medium text-gray-900'>
                    <span className='font-bold text-orange-600'>{totalProduct}</span> Products Found
                    {category && (
                      <span className='text-gray-600 ml-2'>in <span className='font-semibold'>{category}</span></span>
                    )}
                  </h2>
                  
                  <div className='flex justify-center items-center gap-3'>
                    <select 
                      onChange={(e) => setSortPrice(e.target.value)} 
                      className='p-2 border border-gray-300 rounded-lg outline-0 text-gray-900 font-medium text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all' 
                      value={sortPrice}
                    >
                      <option value="">Sort By</option>
                      <option value="low-to-high">Price: Low to High</option>
                      <option value="high-to-low">Price: High to Low</option>
                    </select>
                    <div className='flex justify-center items-start gap-4 md-lg:hidden'>
                      <div 
                        onClick={() => setStyles('grid')} 
                        className={`p-2 rounded-lg ${styles === 'grid' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} cursor-pointer transition-colors`}
                        title="Grid view"
                      >
                        <BsFillGridFill />
                      </div>
                      <div 
                        onClick={() => setStyles('list')} 
                        className={`p-2 rounded-lg ${styles === 'list' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} cursor-pointer transition-colors`}
                        title="List view"
                      >
                        <FaThList />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Grid/List */}
                <div className='pb-8'>
                  <ShopProducts products={products} styles={styles} />
                </div>

                {/* Pagination */}
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
