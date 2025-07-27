//src\views\admin\Category.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { Edit, Delete, Close, AddPhotoAlternate } from '@mui/icons-material';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { categoryAdd, messageClear, get_category, updateCategory, deleteCategory } from '../../store/Reducers/categoryReducer';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Search from '../components/Search';

const Category = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, categorys } = useSelector(state => state.category);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);
  const [imageShow, setImage] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [state, setState] = useState({
    name: '',
    image: ''
  });

  const imageHandle = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      setImage(URL.createObjectURL(files[0]));
      setState({
        ...state,
        image: files[0]
      });
    }
  };

  const addOrUpdateCategory = (e) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(updateCategory({ id: editId, ...state }));
    } else {
      dispatch(categoryAdd(state));
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: '',
        image: ''
      });
      setImage('');
      setIsEdit(false);
      setEditId(null);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue
    };
    dispatch(get_category(obj));
  }, [searchValue, currentPage, parPage]);

  const handleEdit = (category) => {
    setState({
      name: category.name,
      image: category.image
    });
    setImage(category.image);
    setEditId(category._id);
    setIsEdit(true);
    setShow(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className='container mx-auto p-4 relative'>
      <div className='flex lg:hidden justify-between items-center mb-5 p-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-lg shadow-lg'>
        <h1 className='text-white font-semibold text-lg'>Category</h1>
        <button
          onClick={() => setShow(true)}
          className='bg-red-500 shadow-lg hover:bg-red-600 transition-all duration-300 px-5 py-2 cursor-pointer text-white rounded-lg text-sm'>Add
        </button>
      </div>

      <div className='flex flex-wrap lg:flex-nowrap gap-4'>
        {/* Table Section */}
        <div className='w-full lg:w-8/12'>
          <div className='w-full p-5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-lg shadow-lg'>
            <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />

            <div className='relative overflow-x-auto mt-4'>
              <table className='w-full text-sm text-left text-white'>
                <thead className='text-sm uppercase border-b border-white/20'>
                  <tr>
                    <th scope='col' className='py-2 px-4'>No</th>
                    <th scope='col' className='py-2 px-4'>Image</th>
                    <th scope='col' className='py-2 px-4'>Name</th>
                    <th scope='col' className='py-2 px-4'>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {categorys.map((d, i) => (
                    <tr key={i} className='hover:bg-white/10 transition-all duration-200'>
                      <td scope='row' className='py-2 px-4 font-medium'>{i + 1}</td>
                      <td scope='row' className='py-2 px-4 font-medium'>
                        <img className='w-[45px] h-[45px] rounded-md shadow-md' src={d.image} alt='' />
                      </td>
                      <td scope='row' className='py-2 px-4 font-medium'>{d.name}</td>

                      <td scope='row' className='py-2 px-4 font-medium'>
                        <div className='flex gap-3'>
                          <Link
                            className='p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-all duration-300 shadow-md'
                            onClick={() => handleEdit(d)}
                          >
                            <Edit />
                          </Link>
                          <Link
                            className='p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md'
                            onClick={() => handleDelete(d._id)}
                          >
                            <Delete />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='w-full flex justify-end mt-4'>
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={50}
                parPage={parPage}
                showItem={3}
              />
            </div>
          </div>
        </div>
 {/* Add/Edit Category Section */}
        <div
       className={`relative top-0 right-0 w-full lg:w-5/12 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${
        show || window.innerWidth >= 1024
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 translate-x-full pointer-events-none'
      } max-w-sm lg:max-w-md z-10`}
        >
          <div className='p-3'>
            <div className='min-h-[300px] lg:min-h-[400px] text-white'>
              <div className='flex justify-between items-center mb-4'>
                <h1 className='text-xl font-semibold text-center w-full'>
                  {isEdit ? 'Edit Category' : 'Add Category'}
                </h1>

                <button onClick={() => setShow(false)} className='text-2xl hover:text-red-500 transition-all duration-300'>
                  <Close />
                </button>
              </div>

              <form onSubmit={addOrUpdateCategory}>
                <div className='flex flex-col w-full gap-3 mb-3'>
                  <label htmlFor='name'>Category Name</label>
                  <input
                    value={state.name}
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                    className='px-4 py-2 bg-white border border-gray-300 rounded-lg text-black outline-none focus:border-purple-500'
                    type='text'
                    id='name'
                    name='category_name'
                    placeholder='Category Name'
                  />
                </div>

                <div>
                  <label
                    className='flex flex-col items-center justify-center h-[150px] sm:h-[180px] border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500'
                    htmlFor='image'
                  >
                    {imageShow ? (
                      <img className='w-full h-full rounded-lg' src={imageShow} alt='Selected' />
                    ) : (
                      <>
                        <AddPhotoAlternate lassName='text-4xl' />
                     
                        <span>Select Image</span>
                      </>
                    )}
                  </label>
                  <input
                    onChange={imageHandle}
                    className='hidden'
                    type='file'
                    name='image'
                    id='image'
                  />
                  
                    <button
                      disabled={loader ? true : false}
                      className='w-full bg-red-500 hover:bg-red-600 transition-all duration-300 text-white rounded-lg px-4 py-2 mt-4 shadow-md'
                    >
                      {loader ? (<PropagateLoader color='#FFF' cssOverride={overrideStyle} />) : isEdit ? (  'Update Category') : ('Add Category')}
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
