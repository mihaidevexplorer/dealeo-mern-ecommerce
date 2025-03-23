//src/pages/CategoryShop.jsx
import { useState,useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { Range } from 'react-range';
import {AiFillStar} from 'react-icons/ai'
import {CiStar} from 'react-icons/ci' 
import Products from '../components/products/Products';
import {BsFillGridFill} from 'react-icons/bs'
import {FaThList} from 'react-icons/fa'
import ShopProducts from '../components/products/ShopProducts';
import Pagination from '../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { price_range_product,query_products } from '../store/reducers/homeReducer';

const CategoryShop = () => {

    let [searchParams, setSearchParams] = useSearchParams()
    console.log(setSearchParams)
    const category = searchParams.get('category')
    console.log(category)
    const dispatch = useDispatch()
    const {products,categorys,priceRange,latest_product,totalProduct,parPage} = useSelector(state => state.home)
    console.log(categorys)
  

    useEffect(() => { 
        dispatch(price_range_product())
    },[dispatch])
    useEffect(() => { 
        setState({
            values: [priceRange.low, priceRange.high]
        })
    },[priceRange, dispatch])

    const [filter, setFilter] = useState(true) 

    const [state, setState] = useState({values: [priceRange.low, priceRange.high]})
    const [rating, setRating] = useState('')
    const [styles, setStyles] = useState('grid')

   
    const [pageNumber, setPageNumber] = useState(1)

    const [sortPrice, setSortPrice] = useState('') 
      
    useEffect(() => { 
        dispatch(
            query_products({
                low: state.values[0] || '',
                high: state.values[1] || '',
                category,
                rating,
                sortPrice,
                pageNumber
            })
         )
    },[state.values, category, rating, sortPrice, pageNumber, dispatch])
    console.log("state.values:", state.values);

    const resetRating = () => {
        setRating('')
        dispatch(
            query_products({
                low: state.values[0],
                high: state.values[1],
                category,
                rating: '',
                sortPrice,
                pageNumber
            })
         )
    }
    

    return (
        <div>
           <Header/>
           <section className='bg-[url("http://localhost:3001/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
            <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                    <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                <h2 className='text-3xl font-bold'>Category Page </h2>
                <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                        <Link to='/'>Home</Link>
                        <span className='pt-1'>
                        <IoIosArrowForward />
                        </span>
                        <span>Category </span>
                      </div>
                    </div> 
                </div> 
            </div> 
           </section>

           <section className='py-16'>
            <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className={` md:block hidden ${!filter ? 'mb-6' : 'mb-0'} `}>
                <button onClick={() => setFilter(!filter)} className='text-center w-full py-2 px-3 bg-orange-500 text-white'>Filter Product</button> 
            </div>

            <div className='w-full flex flex-wrap'>
                <div className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${filter ? 'md:h-0 md:overflow-hidden md:mb-6' : 'md:h-auto md:overflow-auto md:mb-0' } `}>
                    

        <div className='py-2 flex flex-col gap-5'>
            <h2 className='text-3xl font-bold mb-3 text-gray-900'>Price</h2>
             
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
            <div {...props} key={`thumb-${index}`} className="w-[15px] h-[15px] bg-[#ff7f50] rounded-full" />
        );
    }}
/>
         <div>
         <span className='text-gray-900 font-bold text-lg'>${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}</span>  
           </div>
         </div>

         <div className='py-3 flex flex-col gap-4'>
            <h2 className='text-3xl font-bold mb-3 text-gray-900'>Rating </h2>
            <div className='flex flex-col gap-3'>
                 <div onClick={() => setRating(5)} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer'>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                  </div>

                  <div onClick={() => setRating(4)} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer'>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><CiStar/> </span>
                  </div>

                  <div onClick={() => setRating(3)} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer'>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                  </div>

                  <div onClick={() => setRating(2)} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer'>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                  </div>

                  <div onClick={() => setRating(1)} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer'>
                    <span><AiFillStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                  </div>

                  <div onClick={resetRating} className='text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer'>
                  <span><CiStar/> </span>
                  <span><CiStar/> </span>
                  <span><CiStar/> </span>
                  <span><CiStar/> </span>
                  <span><CiStar/> </span>
                  </div> 
            </div> 
         </div>
        
        
        <div className='py-5 flex flex-col gap-4 md:hidden'>
            <Products title='Latest Product'  products={latest_product} />
        </div> 
          </div>

        <div className='w-9/12 md-lg:w-8/12 md:w-full'>
            <div className='pl-8 md:pl-0'>
                <div className='py-4 bg-white mb-10 px-3 rounded-md flex justify-between items-start border'>
                    <h2 className='text-lg font-medium text-gray-900'> ({totalProduct}) Products </h2>
                    
        <div className='flex justify-center items-center gap-3'>
            <select onChange={(e)=>setSortPrice(e.target.value)} className='p-1 border outline-0 text-gray-900 font-semibold' name="" id="">
                <option value="">Sort By</option>
                <option value="low-to-high">Low to High Price</option>
                <option value="high-to-low">High to Low Price </option>
            </select>
        <div className='flex justify-center items-start gap-4 md-lg:hidden'>
            <div onClick={()=> setStyles('grid')} className={`p-2 ${styles === 'grid' && 'bg-gray-300'} text-gray-600 hover:bg-gray-300 cursor-pointer rounded-sm `} >
                  <BsFillGridFill/>  
            </div>
            <div onClick={()=> setStyles('list')} className={`p-2 ${styles === 'list' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm `} >
                  <FaThList/>  
            </div> 
        </div> 
        </div> 
         </div> 

         <div className='pb-8'>
                  <ShopProducts products={products} styles={styles} />  
         </div>

         <div>
           {
             totalProduct > parPage &&  <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalItem={totalProduct} parPage={parPage} showItem={Math.floor(totalProduct / parPage )} />
           }
         </div>





            </div> 
         </div>  




            </div>
            </div> 
           </section>

           <Footer/>
        </div>
    );
};

export default CategoryShop;
