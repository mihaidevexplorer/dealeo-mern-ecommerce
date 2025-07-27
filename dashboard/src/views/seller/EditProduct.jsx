import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { get_product, update_product, messageClear, product_image_update } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { categorys } = useSelector((state) => state.category);
  const { product, loader, successMessage, errorMessage } = useSelector((state) => state.product);

  const [state, setState] = useState({
    name: '',
    description: '',
    discount: '',
    price: '',
    brand: '',
    stock: '',
  });

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState('');
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [imageShow, setImageShow] = useState([]);

  useEffect(() => {
    dispatch(get_category({ searchValue: '', parPage: '', page: '' }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(get_product(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    setState({
      name: product.name || '',
      description: product.description || '',
      discount: product.discount || '',
      price: product.price || '',
      brand: product.brand || '',
      stock: product.stock || '',
    });
    setCategory(product.category || '');
    setImageShow(product.images || []);
  }, [product]);

  useEffect(() => {
    if (categorys.length > 0) {
      setAllCategory(categorys);
    }
  }, [categorys]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      const filteredCategories = categorys.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setAllCategory(filteredCategories);
    } else {
      setAllCategory(categorys);
    }
  };

  const changeImage = (img, files) => {
    if (files.length > 0) {
      dispatch(
        product_image_update({
          oldImage: img,
          newImage: files[0],
          productId,
        })
      );
    }
  };

  const update = (e) => {
    e.preventDefault();
    const updatedProduct = {
      name: state.name,
      description: state.description,
      discount: state.discount,
      price: state.price,
      brand: state.brand,
      stock: state.stock,
      productId,
    };
    dispatch(update_product(updatedProduct));
  };

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 min-h-screen'>
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-[#d0d2d6] text-xl font-semibold'>Edit Product</h1>
          <Link
            to='/seller/dashboard/products'
            className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl px-7 py-3 shadow-md hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 active:scale-95'
          >
            All Products
          </Link>
        </div>

        <form onSubmit={update}>
          <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#FFF]'>
            <div className='flex flex-col w-full gap-1'>
              <label htmlFor='name'>Product Name</label>
              <input
                className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000]'
                onChange={inputHandle}
                value={state.name}
                type='text'
                name='name'
                id='name'
                placeholder='Product Name'
              />
            </div>

            <div className='flex flex-col w-full gap-1'>
              <label htmlFor='brand'>Product Brand</label>
              <input
                className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000]'
                onChange={inputHandle}
                value={state.brand}
                type='text'
                name='brand'
                id='brand'
                placeholder='Brand Name'
              />
            </div>
          </div>

          <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#FFF]'>
            <div className='flex flex-col w-full gap-1 relative'>
              <label htmlFor='category'>Category</label>
              <input
                readOnly
                onClick={() => setCateShow(!cateShow)}
                className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000]'
                value={category}
                type='text'
                id='category'
                placeholder='--Select Category--'
              />

<div className={`absolute top-[101%] bg-gray-600 w-full transition-all rounded-md shadow-md z-10 ${cateShow ? 'scale-100' : 'scale-0' } `}>
                    <div className='w-full px-4 py-2 fixed'>
                        <input value={searchValue} onChange={categorySearch} className='px-3 py-1 w-full focus:border-blue-500 outline-none bg-transparent border border-gray-700 rounded-md text-[#000] overflow-hidden' type="text" placeholder='search' /> 
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
              <label htmlFor='stock'>Product Stock</label>
              <input
                className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000]'
                onChange={inputHandle}
                value={state.stock}
                type='text'
                name='stock'
                id='stock'
                placeholder='Stock'
              />
            </div>
          </div>

          <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#FFF]'>
            <div className='flex flex-col w-full gap-1'>
              <label htmlFor='price'>Price</label>
              <input
                className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000]'
                onChange={inputHandle}
                value={state.price}
                type='number'
                name='price'
                id='price'
                placeholder='Price'
              />
            </div>

            <div className='flex flex-col w-full gap-1'>
              <label htmlFor='discount'>Discount</label>
              <input
                className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000]'
                onChange={inputHandle}
                value={state.discount}
                type='number'
                name='discount'
                id='discount'
                placeholder='Discount (%)'
              />
            </div>
          </div>

          <div className='flex flex-col w-full gap-1 mb-5'>
            <label htmlFor='description'>Description</label>
            <textarea
              className='px-4 py-2 focus:border-blue-500 outline-none bg-[#FFF] border border-gray-600 rounded-md text-[#000]'
              onChange={inputHandle}
              value={state.description}
              name='description'
              id='description'
              placeholder='Description'
              cols='10'
              rows='4'
            ></textarea>
          </div>

          <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 w-full text-[#FFF] mb-4'>
            {imageShow.length > 0 &&
              imageShow.map((img, i) => (
                <div key={i} className='relative'>
                  <label
                    className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-[#FFF]'
                    htmlFor={`image-${i}`}
                  >
                    <IoMdImages size={32} />
                    <IoMdCloseCircle size={20} />
                    <img src={img} alt={`Product Image ${i}`} className='h-full object-contain' />
                  </label>
                  <input
                    onChange={(e) => changeImage(img, e.target.files)}
                    type='file'
                    id={`image-${i}`}
                    className='hidden'
                  />
                </div>
              ))}
          </div>

          <div className='flex'>
            <button
              disabled={loader}
              className={`relative w-[280px] px-7 py-3 mb-3 text-white font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-red-500 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 active:scale-95 ${
                loader ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'
              }`}
            >
              {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Save Changes'}
              <span className='absolute inset-0 rounded-xl blur-lg opacity-50 bg-pink-400'></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
