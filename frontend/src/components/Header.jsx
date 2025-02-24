//src/components/Header.jsx
import { useEffect, useState } from 'react';
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { FaFacebookF, FaList, FaLock, FaUser } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io"; 
import { useDispatch, useSelector } from 'react-redux';
import { get_card_products, get_wishlist_products } from '../store/reducers/cardReducer';

const Header = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {categorys} = useSelector(state => state.home) 
    const {userInfo} = useSelector(state => state.auth) 
    const {card_product_count,wishlist_count} = useSelector(state => state.card) 

    const {pathname} = useLocation()
     
    const [showShidebar, setShowShidebar] = useState(true);
    const [categoryShow, setCategoryShow] = useState(true);
     

    const [searchValue, setSearchValue] = useState('')
    const [category, setCategory] = useState('')

    const search = () => {
        navigate(`/products/search?category=${category}&&value=${searchValue}`)
    }

    const redirect_card_page = () => {
        if (userInfo) {
            navigate('/card')
        } else {
            navigate('/login')
        }
    } 

    useEffect(() => {
        if (userInfo) {
            dispatch(get_card_products(userInfo.id))
            dispatch(get_wishlist_products(userInfo.id))
        }  
    },[userInfo])

    return (
        <div className='w-full bg-white'>
            <div className='header-top bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 md-lg:hidden'>
                <div className='w-[85%] lg:w-[90%] mx-auto'>
                    <div className='flex w-full justify-between items-center h-[50px] text-gray-500'>
                        <ul className='flex justify-start items-center gap-8 font-semibold text-black'>
                            <li className='flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]'>
                                <span><EnvelopeIcon className="w-6 h-6 text-gray-600"/></span>
                                <span>support@gmail.com</span>
                            </li>

                            <li className='flex relative justify-center items-center gap-2 text-sm '>
                                <span><PhoneIcon className="w-6 h-6 text-gray-600"/></span>
                                <span>+(123) 3243 343</span>
                            </li> 
                        </ul>

                        <div>
                            <div className='flex justify-center items-center gap-10'>
                                <div className='flex justify-center items-center gap-4 text-black'>
                                    <a href="#"><FaFacebookF className="text-blue-500 w-6 h-6" /></a>
                                    <a href="#"><FaTwitter className="text-blue-500 w-6 h-6" /> </a>
                                    <a href="#"><FaLinkedin className="text-blue-500 w-6 h-6" /></a>
                                    <a href="#"><FaGithub className="text-blue-500 w-6 h-6" /> </a> 
                                </div>
        <div className='flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute before:absolute before:h-[18px] before:bg-[#afafaf] before:w-[1px] before:-left-[20px]'>
            <img src="http://localhost:3001/images/english-uk.png" alt="" />
            <span><IoMdArrowDropdown /></span>
            <ul className='absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10'>
            <li className="flex items-center gap-2">
            <img src="http://localhost:3001/images/roman-md.png" alt="Română" className="flag-icon" />
            Română
        </li>
        <li className="flex items-center gap-2">
            <img src="http://localhost:3001/images/english-uk.png" alt="English" className="flag-icon" />
            English
        </li>
            
            </ul>
        </div>

        {
            userInfo ? <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-black' to='/dashboard'>
                <span> <FaUser className="text-gray-600 w-6 h-6"/> </span>
                <span> {userInfo.name} </span>
                 </Link> : <Link to='/login' className='flex cursor-pointer justify-center items-center gap-2 text-sm text-black'>
                <span> <FaLock /> </span>
                <span>Login </span>
                 </Link>
        }
 
                            </div>
                        </div> 
                    </div> 
                </div> 
            </div>


        <div className='w-white'>
         <div className='w-[85%] lg:w-[90%] mx-auto'>
            <div className='h-[80px] md-lg:h-[100px] flex justify-between items-center flex-wrap'>
              
                <div className='md-lg:w-full w-3/12 md-lg:pt-4'>
                    <div className='logo-container w-32 md:w-40 lg:w-48 xl:w-56'>
 
                <Link to='/'>
                    <img src="http://localhost:3001/images/logo.png" alt="Logo" className="w-full h-auto object-contain max-w-[130px]" />
                </Link>
                <div className='justify-center items-center w-[30px] h-[30px] bg-white text-gray-600 border border-gray-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden' onClick={() => setShowShidebar(false)}>
                    <span> <FaList/> </span>
                </div>
                </div> 
                </div>
 
            <div className='md:lg:w-full w-9/12'>
                <div className='flex justify-between md-lg:justify-center items-center flex-wrap pl-8'>
                    <ul className='flex justify-start items-start gap-8 text-sm font-bold uppercase md-lg:hidden'>
                        <li>
                            <Link className={`p-2 block ${pathname === '/' ?  'text-[#e5673c]' : 'text-gray-600' } `} >Home</Link>
                        </li>

                        <li>
                            <Link to='/shops' className={`p-2 block ${pathname === '/shops' ?  'text-[#e5673c]' : 'text-gray-600' } `} >Shop</Link>
                        </li>
                        <li>
                            <Link className={`p-2 block ${pathname === '/blog' ?  'text-[#e5673c]' : 'text-gray-600' } `} >Blog</Link>
                        </li>
                        <li>
                            <Link className={`p-2 block ${pathname === '/about' ?  'text-[#e5673c]' : 'text-gray-600' } `} >About Us</Link>
                        </li>
                        <li>
                            <Link className={`p-2 block ${pathname === '/contact' ?  'text-[#e5673c]' : 'text-gray-600' } `} >Contact Us</Link>
                        </li>

                    </ul>

                <div className='flex md-lg:hidden justify-center items-center gap-5'>
                    <div className='flex justify-center gap-5'>
       
  <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login') } className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#FFF]'>
                            <span className='flex items-center gap-4'><HeartIcon className="w-10 h-10 text-gray-600" /></span>

            {
                wishlist_count !== 0 && <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] '>
                {wishlist_count}
                </div>
            }                  
                     
                 </div>

                        <div onClick={redirect_card_page} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#FFF]'>
                            <span className='flex items-center gap-4'><ShoppingCartIcon className="w-10 h-10 text-gray-600"  /></span>
            
                {
                    card_product_count !== 0 && <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] '>
                        {
                            card_product_count
                        }
                     </div> 
                } 
                               
                        </div> 
                    </div> 
                </div> 


                </div> 
            </div>




            </div> 
            </div>
        </div>


    <div className='hidden md-lg:block'>
        <div onClick={()=> setShowShidebar(true)} className={`fixed duration-200 transition-all ${showShidebar ? 'invisible' : 'visible'} hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20 `}>  
        </div> 

        <div className={`w-[300px] z-[9999] transition-all duration-200 fixed ${showShidebar ? '-left-[300px]' : 'left-0 top-0'} overflow-y-auto bg-white h-screen py-6 px-8 `}>
                <div className='logo-container w-24 md:w-32 lg:w-40 xl:w-48'>
                <Link to='/'>
                    <img src="http://localhost:3001/images/logo.png" alt="Logo" className="w-full h-auto object-contain" />
                </Link>
    <div className='flex justify-start items-center gap-10'>
    <div className='flex group cursor-pointer text-gray-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute '>
    <img src="http://localhost:3001/images/english-uk.png" alt="English UK" />
            <span><IoMdArrowDropdown /></span>
            <ul className='absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10'>
            <li className="flex items-center gap-2">
            <img src="http://localhost:3001/images/roman-md.png" alt="Română" className="w-4 h-4" />
            Română
        </li>
       
        <li className="flex items-center gap-2">
            <img src="http://localhost:3001/images/english-uk.png" alt="English UK" className="w-4 h-4" />
            English
        </li>


            </ul>
        </div>
        {
            userInfo ? <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-black' to='/dashboard'>
                <span> <FaUser className="text-gray-500 w-6 h-6"/> </span>
                <span>{ userInfo.name }</span>
                 </Link> : <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-black' to='/login'>
                <span> <FaLock /> </span>
                <span>Login </span>
                 </Link>
        } 

    </div>

    <ul className='flex flex-col justify-start items-start text-sm font-bold uppercase'>
                        <li>
                            <Link className={`py-2 block ${pathname === '/' ?  'text-[#e5673c]' : 'text-gray-600' } `} >Home</Link>
                        </li>

                        <li>
                            <Link to='/shops' className={`py-2 block ${pathname === '/shops' ?  'text-[#e5673c]' : 'text-gray-600' } `} >Shop</Link>
                        </li>
                        <li>
                            <Link className={`py-2 block ${pathname === '/blog' ?  'text-[#e5673c]' : 'text-gray-600' } `} >Blog</Link>
                        </li>
                        <li>
                            <Link className={`py-2 block ${pathname === '/about' ?  'text-[#e5673c]' : 'text-gray-600' } `} >About Us</Link>
                        </li>
                        <li>
                            <Link className={`py-2 block ${pathname === '/contact' ?  'text-[#e5673c]' : 'text-gray-600' } `} >Contact Us</Link>
                        </li>

                    </ul>
    <div className='flex justify-start items-center gap-4 text-blue-800'>
                    <a href="#"><FaFacebookF /></a>
                    <a href="#"><FaTwitter /> </a>
                    <a href="#"><FaLinkedin /></a>
                    <a href="#"><FaGithub /> </a> 
        </div>

        <div className='w-full flex justify-end md-lg:justify-start gap-3 items-center'>
        <div className='w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center '>
        <span><FaPhoneAlt /></span>
        </div>
        <div className='flex justify-end flex-col gap-1'>
            <h2 className='text-sm font-medium text-gray-700'>+134343455</h2>
            <span className='text-xs'>Support 24/7</span> 
        </div>
        </div>

        <ul className='flex flex-col justify-start items-start gap-3 text-[#1c1c1c]'>
            <li className='flex justify-start items-center gap-2 text-sm'>
             <span><EnvelopeIcon className="w-6 h-6 text-gray-600"/></span>
             <span>support@gmail.com</span>
            </li>

        </ul> 

                </div> 
            </div>  
    </div>


    <div className='w-[85%] lg:w-[90%] mx-auto'>
        <div className='flex w-full flex-wrap md-lg:gap-8'>
            <div className='w-3/12 md-lg:w-full'>
                <div className='bg-white relative'>
                   <div onClick={() => setCategoryShow(!categoryShow) } className='h-[50px] bg-[#ff7f50] text-white flex justify-between items-center px-6 gap-3 font-bold text-md cursor-pointer rounded-t-md shadow-md hover:bg-[#e5673c] transition-colors'>
            <div className='flex justify-center items-center gap-3'>
                <span><FaList/></span>
                <span>All Category </span>
            </div>
            <span className='pt-1'><IoIosArrowDown /></span>
                    </div>

        <div className={`${categoryShow ? 'h-0' :'h-[400px]'} overflow-y-auto transition-all md-lg:relative duration-500 absolute z-[99999] bg-[#FFF] w-full border-x`}>
            <ul className='py-2 text-black-600 font-medium grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] grid-rows-[repeat(5,minmax(0,1fr))] gap-x-4 gap-y-4 w-full'>
                {
                    categorys.map((c,i) => {
                        return (
                         <li key={i} className='flex justify-start items-center gap-4 px-4 py-3 bg-white hover:bg-gray-100 rounded-lg transition-all shadow-sm'>
                            <img src={c.image} className='w-[25px] h-[25px] rounded-full object-cover border border-gray-200' alt="" />
                            <Link to={`/products?category=${c.name}`} className='text-gray-800 text-sm font-medium hover:text-[#ff7f50] transition-colors duration-200'>{c.name}</Link>
                         </li>
                        )
                    })
                }
            </ul>

        </div>


                </div>
            </div>

        <div className='w-9/12 pl-8 md-lg:pl-0 md-lg:w-full'>
            <div className='flex flex-wrap w-full justify-between items-center md-lg:gap-6'>
                <div className='w-8/12 md-lg:w-full'>
                    <div className='flex border border-gray-300 rounded-md h-[50px] items-center gap-3 shadow-sm bg-white'>
                         {/* Select Dropdown */}
                        <div className='relative flex items-center pl-3'>
                        <select onChange={(e) => setCategory(e.target.value)} className='w-[150px] bg-transparent text-gray-600 font-medium px-2 h-full outline-none border-none appearance-none cursor-pointer' name="" id="">
                            <option value="">Select Category</option>
                            {
                                categorys.map((c, i) => <option key={i} value={c.name}> {c.name} </option> )
                            }
                        </select>
                        <div className="absolute h-[25px] w-[1px] bg-gray-400 -right-2 md:hidden"></div>
                        </div >
                        {/* Input Field */}
                        <input className='flex-grow bg-transparent text-gray-500 px-3 h-full outline-none placeholder-gray-400 text-sm' onChange={(e)=> setSearchValue(e.target.value)} type="text" name='' id='' placeholder='What do you need' />
                        <button onClick={search} className='h-full px-6 bg-[#ff7f50] text-white font-semibold uppercase text-sm rounded-r-md transition-all duration-300 hover:bg-[#ff6347] hover:shadow-lg'>Search</button>
                    </div> 
                </div>

                <div className='w-4/12 block md-lg:hidden pl-2 md-lg:w-full md-lg:pl-0'>

                <div className='w-full flex justify-end md-lg:justify-start gap-3 items-center'>
        <div className='w-[48px] h-[48px] rounded-full flex bg-[#FFF] justify-center items-center '>
        <span><FaPhoneAlt /></span>
        </div>
        <div className='flex justify-end flex-col gap-1'>
            <h2 className='text-md font-medium text-gray-700'>+1343-43233455</h2>
            <span className='text-sm'>Support 24/7</span> 
        </div>
        </div>

                </div>


            </div>
            </div>    




        </div> 
    </div>





           
        </div>
    );
};

export default Header;