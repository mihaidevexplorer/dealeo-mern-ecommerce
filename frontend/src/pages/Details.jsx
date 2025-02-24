//src/pages/Details.jsx
import  { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io"; 
import Carousel from 'react-multi-carousel'; 
import 'react-multi-carousel/lib/styles.css'
import Rating from '../components/Rating';
import { FaHeart } from "react-icons/fa6";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { FaFacebookF} from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Reviews from '../components/Reviews';
import {Pagination } from 'swiper/modules';
import 'swiper/css'; 
import 'swiper/css/pagination';
import {Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { product_details } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';
import { add_to_card,messageClear,add_to_wishlist } from '../store/reducers/cardReducer';


 

const Details = () => {

    const navigate = useNavigate()
    const {slug} = useParams()
    const dispatch = useDispatch()
    const [showFullDescription, setShowFullDescription] = useState(false);
    const {product,relatedProducts,moreProducts} = useSelector(state => state.home)
    const {userInfo } = useSelector(state => state.auth)
    const {errorMessage,successMessage } = useSelector(state => state.card)

    useEffect(() => {
        dispatch(product_details(slug))
    },[slug])

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())  
        } 
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())  
        } 
        
    },[successMessage,errorMessage])

    const images = [1,2,3,4,5,6]
    const [image, setImage] = useState('')
    const discount = 10
    const stock = 3
    const [state, setState] = useState('reviews')

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4
        },
        mdtablet: {
            breakpoint: { max: 991, min: 464 },
            items: 4
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3
        },
        smmobile: {
            breakpoint: { max: 640, min: 0 },
            items: 2
        },
        xsmobile: {
            breakpoint: { max: 440, min: 0 },
            items: 1
        },
    }

    const [quantity, setQuantity] = useState(1)

    const inc = () => {
        if (quantity >= product.stock) {
            toast.error('Out of Stock')
        } else {
            setQuantity(quantity + 1)
        }
    }

    const dec = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const add_card = () => {
        if (userInfo) {
           dispatch(add_to_card({
            userId: userInfo.id,
            quantity,
            productId : product._id
           }))
        } else {
            navigate('/login')
        }
    }

    const add_wishlist = () => {
        if (userInfo) {
            dispatch(add_to_wishlist({
                userId: userInfo.id,
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                discount: product.discount,
                rating: product.rating,
                slug: product.slug
            }))
        } else {
            navigate('/login')
        }
       
    }

   const buynow = () => {
        let price = 0;
        if (product.discount !== 0) {
            price = product.price - Math.floor((product.price * product.discount) / 100)
        } else {
            price = product.price
        }

        const obj = [
            {
                sellerId: product.sellerId,
                shopName: product.shopName,
                price :  quantity * (price - Math.floor((price * 5) / 100)),
                products : [
                    {
                        quantity,
                        productInfo: product
                    }
                ]
            }
        ]
        
        navigate('/shipping',{
            state: {
                products : obj,
                price: price * quantity,
                shipping_fee : 50,
                items: 1
            }
        }) 
   }


    return (
        <div>
            <Header/>
    <section className='bg-[url("http://localhost:3001/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
    <div className='absolute left-0 top-0 w-full h-full bg-[#242222d0]'>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
        <h2 className='text-3xl font-bold'>Product Details </h2>
        <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                <Link to='/'>Home</Link>
                <span className='pt-1'>
                <IoIosArrowForward />
                </span>
                <span>Product Details </span>
                </div>
            </div> 
        </div> 
    </div> 
    </section>

    <section>
        <div className='bg-slate-100 py-5 mb-5'>
            <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                <div className='flex justify-start items-center text-md text-slate-600 w-full'>
                    <Link to='/'>Home</Link>
                    <span className='pt-1'><IoIosArrowForward /></span>
                    <Link to='/'>{ product.category }</Link>
                    <span className='pt-1'><IoIosArrowForward /></span>
                    <span>{ product.name } </span>
                </div>

            </div>
        </div>
    </section>

        <section>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16'>
            <div className='grid grid-cols-2 md-lg:grid-cols-1 gap-8'>
                <div>
                <div className='p-2 border'>
                    <img className='w-full h-auto object-contain' src={image ? image : product.images?.[0] } alt="" />
                </div>
            <div className='py-3'>
                {
                    product.images && <Carousel
                    autoPlay={true}
                    infinite={true} 
                    responsive={responsive}
                    transitionDuration={500}
                >
                    { 
                       product.images.map((img, i) => {
                        return (
                            <div key={i}  onClick={() => setImage(img)}>
                   <img className='h-[120px] cursor-pointer' src={img} alt="" /> 
                            </div>
                        )
                       })
                    } 

                </Carousel>
                }
           </div>    
           </div>

        <div className='flex flex-col gap-4 p-6 container mx-auto bg-white rounded-lg shadow-lg'>
                <div className='text-3xl text-gray-800 font-extrabold border-b pb-2'>
                    <h3>{product.name} </h3>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex text-yellow-500'>
                        <Rating ratings={4.5} />
                    </div>
                    <span className='text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full'>(24 reviews)</span> 
                </div>

         <div className='text-2xl font-bold flex items-center gap-3'>
            {
                product.discount !== 0 ? <>
                <span className="line-through text-gray-400">${product.price}</span>
                <span className="text-green-600"> ${product.price - Math.floor((product.price * product.discount) / 100)} </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"> -{product.discount}% </span>
                
                </> : <span className="text-gray-800">Price: ${product.price}</span>
            }
          </div> 

          <div className='text-gray-900 text-base leading-relaxed space-y-4 font-roboto'>
            <p className='text-justify'>{product.description ? (showFullDescription ? product.description : `${product.description.substring(0, 100)}...`): "Description not available"}  </p>
            <button onClick={() => setShowFullDescription(!showFullDescription)} className="text-blue-500 underline mt-2"> {showFullDescription ? 'Show less' : 'Show more'} </button>
            <p className="text-gray-800 py-1 font-semibold">
            Shop Name: <span className="text-blue-500">{product.shopName}</span>
            </p>
            
           </div> 

            <div className='flex gap-3 pb-10 border-b'>
                {
                    product.stock ? <>
        <div className='flex items-center gap-4'>
            <div className='flex bg-gray-200 h-[50px] justify-center items-center text-xl rounded-lg'>
            <div onClick={dec} className='px-4 cursor-pointer'>-</div>
            <div className='px-4'>{quantity}</div>
            <div onClick={inc} className='px-4 cursor-pointer'>+</div>
        </div>
                     
                        <button onClick={add_card} className='w-[200px] h-[50px] px-6 text-sm md:text-base bg-gradient-to-r from-orange-400 to-orange-500  hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105'>Add To Card</button>
                    </div>
                    
                    </> : ''
                }

                <div>
                    <div onClick={add_wishlist} className='h-10 w-10 md:h-12 md:w-12 flex justify-center items-center cursor-pointer  bg-red-500 text-white rounded-full hover:shadow-lg transition duration-300 ease-in-out'>
                    <FaHeart />
                    </div> 
                </div> 
            </div>  


        <div className='flex py-5 gap-5'>
            <div className='w-[150px] text-black font-bold text-xl flex flex-col gap-5'>
                 
                <span>Availability</span>
                <span>Share On</span> 
            </div> 
            <div className='flex flex-col gap-5'>
                <span className={`text-${product.stock ? 'black' : 'red'}-500`}>
                    {product.stock ? `In Stock(${product.stock})` : 'Out Of Stock'}
                </span> 

    <ul className='flex justify-start items-center gap-3'>
        <li>
            <a className='w-[38px] h-[38px] hover:bg-[#ff7f50] hover:text-white flex justify-center items-center bg-indigo-500 rounded-full text-white' href="#"> <FaFacebookF /> </a>
        </li>
        <li>
            <a className='w-[38px] h-[38px] hover:bg-[#ff7f50] hover:text-white flex justify-center items-center bg-cyan-500 rounded-full text-white' href="#"> <FaTwitter /> </a>
        </li>
        <li>
            <a className='w-[38px] h-[38px] hover:bg-[#ff7f50] hover:text-white flex justify-center items-center bg-purple-500 rounded-full text-white' href="#"> <FaLinkedin /> </a>
        </li>
        <li>
            <a className='w-[38px] h-[38px] hover:bg-[#ff7f50] hover:text-white flex justify-center items-center bg-blue-500 rounded-full text-white' href="#"> <FaGithub /> </a>
        </li>
    </ul> 

            </div>
          </div>

          <div className='flex gap-3'>
                {
                    product.stock ? <button onClick={buynow} className='px-8 py-4 h-[60px] cursor-pointer bg-gradient-to-r from-teal-400 to-teal-500  hover:from-teal-500 hover:to-teal-600  text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105'>Buy Now</button> : ''
                }
                <Link to={`/dashboard/chat/${product.sellerId}`} className='px-8 py-4 h-[60px] cursor-pointer bg-gradient-to-r from-red-400 to-red-500  hover:from-red-500 hover:to-red-600  text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
                    Chat Seller
                </Link>
            </div>


             </div>   
            </div> 
       </div> 
        </section>


        <section>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16'>
           <div className='flex flex-wrap'>
            <div className='w-[72%] md-lg:w-full'>
                <div className='pr-4 md-lg:pr-0'>
                    <div className='flex gap-2'>
                    <button onClick={() => setState('reviews')} className={`py-2 px-6 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out ${
      state === 'reviews'
        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
        : 'bg-slate-200 text-slate-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md'}`}>Reviews </button>
                    
                    <button onClick={() => setState('description')} className={`py-2 px-6 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out ${
      state === 'description'
        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg'
        : 'bg-slate-200 text-slate-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md' }`}>Description </button>
                    </div>

    <div className='text-gray-900 text-base leading-relaxed space-y-4 font-roboto'>
        {
            state === 'reviews' ? <Reviews product={product} /> : <p className='text-justify'>
    {product.description}
            </p>
        }
    </div> 
         </div> 
         </div>

<div className='w-[28%] md-lg:w-full'>
<div className='pl-4 md-lg:pl-0'>
    <div className='px-3 py-2 text-gray-600 bg-gray-100 border-b-2 border-gray-300'>
        <h2 className='font-bold text-lg uppercase tracking-wider'>From {product.shopName}</h2>
    </div>
    <div className='flex flex-col gap-5 mt-3 border p-3'>
        {
            moreProducts.map((p,i) => {
                return (
        <Link className='block group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative'>
            <div className='relative h-[270px]'>
            <img className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' src={ p.images[0]} alt="" /> 
            {
            p.discount !== 0 && <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>{p.discount}%
            </div>
            }
            <ul className="flex gap-3 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500 ease-in-out">
      <li
        onClick={() => add_wishlist(p)}
        className="bg-white text-gray-600 p-2 rounded-full shadow hover:bg-red-500 hover:text-white cursor-pointer transition-all duration-300"
      >
        <FaRegHeart size={18} />
      </li>
      <Link
        to={`/product/details/${p.slug}`}
        className="bg-white text-gray-600 p-2 rounded-full shadow hover:bg-green-500 hover:text-white transition-all duration-300"
      >
        <FaEye size={18} />
      </Link>
      <li
        onClick={() => add_card(p._id)}
        className="bg-white text-gray-600 p-2 rounded-full shadow hover:bg-blue-500 hover:text-white cursor-pointer transition-all duration-300"
      >
        <RiShoppingCartLine size={18} />
      </li>
    </ul>
            </div>
            
            <h2 className='text-slate-600 py-1 font-bold text-lg group-hover:text-orange-500 transition-colors duration-300'>{p.name} </h2>
            <div className='flex justify-between items-center'>
                <h2 className='text-lg font-bold text-slate-600'>${p.price}</h2>
                <div className='flex items-center gap-2'>
                    <Rating ratings={p.rating}  />
                </div>
            </div>
            
        </Link>
                )
            })
        }

    </div>
</div>
</div> 

    </div>  
        </div>
        </section>


<section>
<div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
<h2 className='text-2xl py-8 text-slate-600'>Related Products </h2>
<div>
    <Swiper
    slidesPerView='auto'
    breakpoints={{
        1280 : {
            slidesPerView: 3
        },
        565 : {
            slidesPerView: 2
        }
    }}
    spaceBetween={25}
    loop={true}
    pagination={{
        clickable: true,
        el: '.custom_bullet'
    }}
    modules={[Pagination]}
    className='mySwiper' 
    > 

    {
        relatedProducts.map((p, i) => {
            return (

                <SwiperSlide key={i}>
                    <Link to={`/product/details/${p.slug}`} className='block'>
                        <div className='relative h-[270px]'>
                            <div className='w-full h-full'>
                    <img className='w-full h-full' src={p.images[0] } alt="" />
                    <div className='absolute h-full w-full top-0 left-0 bg-[#000] opacity-25 hover:opacity-50 transition-all duration-500'> 
                    </div>
                           </div>
            {
            p.discount !== 0 && <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>{p.discount}%
            </div>
            } 
                </div>

            <div className='p-4 flex flex-col gap-1'>
            <h2 className='text-slate-600 text-lg font-bold'>{p.name} </h2>
            <div className='flex justify-start items-center gap-3'>
                <h2 className='text-lg font-bold text-slate-600'>${p.price}</h2>
                <div className='flex'>
                    <Rating ratings={p.rating}  />
                </div>
            </div>
            </div>

                    </Link>

                </SwiperSlide>

            )
        })
    }
    
    </Swiper>
</div>

      <div className='w-full flex justify-center items-center py-8'>
        <div className='custom_bullet justify-center gap-3 !w-auto'> 
        </div>

      </div>

</div>
</section>




            <Footer/> 
        </div>
    );
};

export default Details;