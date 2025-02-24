import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product,messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';
 
const AddProduct = () => {
    const dispatch = useDispatch()
    const { categorys } = useSelector(state => state.category)
    const { loader,successMessage,errorMessage } = useSelector(state => state.product)

    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }))
    }, [])
     

    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
    
    })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name] : e.target.value
        })

    }

    const [cateShow, setCateShow] = useState(false)
    const [category, setCategory] = useState('')
    const [allCategory, setAllCategory] = useState([])
    const [searchValue, setSearchValue] = useState('') 
  
    const categorySearch = (e) => {
        const value = e.target.value
        setSearchValue(value)
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
            setAllCategory(srcValue)
        } else {
            setAllCategory(categorys)
        }

    }

    const [images, setImages] = useState([])
    const [imageShow, setImageShow] = useState([])

    const imageHandle = (e) => {
        const files = e.target.files 
        const length = files.length;
        if (length > 0) {
            setImages([...images, ...files])
            let imageUrl = []
            for (let i = 0; i < length; i++) {
                imageUrl.push({url: URL.createObjectURL(files[i])}) 
            }
            setImageShow([...imageShow, ...imageUrl])
        }
    }
    // console.log(images)
    // console.log(imageShow)

    useEffect(() => {

        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear()) 
            setState({
                name: "",
                description: '',
                discount: '',
                price: "",
                brand: "",
                stock: ""
            }) 
            setImageShow([])
            setImages([])
            setCategory('')

        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        

    },[successMessage,errorMessage])

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow
            let tempImages = images

            tempImages[index] = img
            tempUrl[index] = {url : URL.createObjectURL(img)}
            setImageShow([...tempUrl])
            setImages([...tempImages])

        }
    }

    const removeImage = (i) => {
        const filterImage = images.filter((img,index) => index !== i)
        const filterImageUrl = imageShow.filter((img, index) => index !== i )

        setImages(filterImage)
        setImageShow(filterImageUrl)
    }

    const add = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name',state.name)
        formData.append('description',state.description)
        formData.append('price',state.price)
        formData.append('stock',state.stock)
        formData.append('discount',state.discount)
        formData.append('brand',state.brand)
        formData.append('shopName','EasyShop') 
        formData.append('category',category)

        for (let i = 0; i < images.length; i++) {
            formData.append('images',images[i]) 
        }
        // console.log(state)
        dispatch(add_product(formData))


    }

    useEffect(() => {
        setAllCategory(categorys)
    },[categorys])

 
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 min-h-screen'>
                <div className='flex justify-between items-center pb-4'>
                    <h1 className='text-[#d0d2d6] text-xl font-semibold'>Add Product</h1>
                    <Link to='/seller/dashboard/products' className='bg-gradient-to-r from-blue-500 to-purple-600 
             hover:from-blue-600 hover:to-purple-700 
             text-white font-semibold rounded-xl 
             px-7 py-3 shadow-md 
             hover:shadow-lg hover:shadow-purple-500/50 
             transition-all duration-300 active:scale-95'>All Product</Link> 
                </div>
<div>
    <form onSubmit={add}>
        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#FFF]'>
            <div className='flex flex-col w-full gap-1'>
                <label htmlFor="name">Product Name</label>
                <input className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#FFF]' onChange={inputHandle} value={state.name} type="text" name='name' id='name' placeholder='Product Name' />
            </div>  

            <div className='flex flex-col w-full gap-1'>
                <label htmlFor="brand">Product Brand</label>
                <input className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#FFF]' onChange={inputHandle} value={state.brand} type="text" name='brand' id='brand' placeholder='Brand Name' />
            </div>   

        </div>


        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#FFF]'>
            <div className='flex flex-col w-full gap-1 relative'>
                <label htmlFor="category">Category</label>
                <input readOnly onClick={()=> setCateShow(!cateShow)} className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000] cursor-pointer' onChange={inputHandle} value={category} type="text" id='category' placeholder='--select category--' />

                <div className={`absolute top-[101%] bg-gray-600 w-full transition-all rounded-md shadow-md z-10 ${cateShow ? 'scale-100' : 'scale-0' } `}>
                    <div className='w-full px-4 py-2 fixed'>
                        <input value={searchValue} onChange={categorySearch} className='px-3 py-1 w-full focus:border-blue-500 outline-none bg-transparent border border-gray-600 rounded-md text-[#000] overflow-hidden' type="text" placeholder='search' /> 
                    </div>
                    <div className='pt-14'></div>
                    <div className='flex justify-start items-start flex-col h-[200px] overflow-x-auto'>
                        {
                            allCategory.map((c,i) => <span key={i} className={`px-4 py-2 hover:bg-blue-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${category === c.name && 'bg-red-500'}`} onClick={()=> {
                                setCateShow(false)
                                setCategory(c.name)
                                setSearchValue('')
                                setAllCategory(categorys)
                            }}>{c.name} </span> )
                        } 
                    </div>

                </div>
            </div>  

            <div className='flex flex-col w-full gap-1'>
                <label htmlFor="stock">Product Stock</label>
                <input className='px-4 py-2 focus:-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#FFF]' onChange={inputHandle} value={state.stock} type="text" name='stock' id='stock' placeholder='Stock' />
            </div>   

        </div>


        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#FFF]'>
            <div className='flex flex-col w-full gap-1'>
                <label htmlFor="price">Price</label>
                <input className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#FFF]' onChange={inputHandle} value={state.price} type="number" name='price' id='price' placeholder='price' />
            </div>  

            <div className='flex flex-col w-full gap-1'>
                <label htmlFor="discount">Discount</label>
                <input className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#FFF]' onChange={inputHandle} value={state.discount} type="number" name='discount' id='discount' placeholder='discount by %' />
            </div>   

        </div>

        <div className='flex flex-col w-full gap-1 mb-5'>
                <label htmlFor="description" className='text-[#000]'>Description</label>
                <textarea className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000]' onChange={inputHandle} value={state.description} name='description' id='description' placeholder='Description' cols="10" rows="4"></textarea> 
                
            </div> 

            <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 gap-3 w-full text-[#FFF] mb-4'>
               {
                imageShow.map((img,i) => <div key={i} className='h-[180px] relative'>
                    <label htmlFor={i}>
                        <img className='w-full h-full rounded-sm' src={img.url} alt="" />
                    </label>
                    <input onChange={(e)=> changeImage(e.target.files[0],i) } type="file" id={i} className='hidden'/>
                    <span onClick={()=>removeImage(i)} className='p-2 z-10 cursor-pointer bg-gray-600 hover:shadow-lg hover:shadow-gray-400/50 text-white absolute top-1 right-1 rounded-full'><IoMdCloseCircle /></span>
                </div> )
               }
               
                <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-[#FFF]' htmlFor="image">
                    <span><IoMdImages /></span>
                    <span>Select Image </span>
                </label>
                <input className='hidden' onChange={imageHandle} multiple type="file" id='image' />

            </div>

            <div className='flex'>
            <button  disabled={loader}  
    className={`relative w-[280px] px-7 py-3 mb-3 
                text-white font-semibold rounded-xl 
                bg-gradient-to-r from-pink-500 to-red-500 
                shadow-md transition-all duration-300 
                hover:shadow-lg hover:shadow-pink-500/50 
                active:scale-95
                ${loader ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}>
            {
               loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Add Product'
               
            } 
            {/* Glow Effect */}
    <span className="absolute inset-0 rounded-xl blur-lg opacity-50 bg-pink-400"></span>
            </button>

            </div>



    </form>
</div>

            </div>
            
        </div>
    );
};

export default AddProduct;