//src\views\admin\DeactiveSellers.jsx
import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_deactive_sellers } from '../../store/Reducers/sellerReducer';

const DeactiveSellers = () => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState(false); // ✅ Folosit pentru afișarea unui mesaj
    const { sellers, totalSeller } = useSelector(state => state.seller); // ✅ Folosim `totalSeller`

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_deactive_sellers(obj));
    }, [searchValue, currentPage, parPage, dispatch]); 

    return (
        <div className='px-4 md:px-8 py-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen'>
            <h1 className='text-xl font-bold mb-4 text-white dark:text-white'>Deactive Seller</h1>

            <p className="text-white text-lg font-semibold mb-4">
                Total Deactivated Sellers: {totalSeller || 0}
            </p>

            <div className='w-full p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <div className='flex justify-between items-center mb-4'>
                    <select 
                        onChange={(e) => setParPage(parseInt(e.target.value))} 
                        className='px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring focus:ring-indigo-300'
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option> 
                    </select>
                    <input 
                        onChange={e => setSearchValue(e.target.value)} 
                        value={searchValue} 
                        className='px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring focus:ring-indigo-300' 
                        type="text" 
                        placeholder='search' 
                    /> 
                </div>

               
                <button 
                    onClick={() => setShow(!show)}
                    className='mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                >
                    {show ? 'Hide Message' : 'Show Message'}
                </button>

                {show && (
                    <div className='mb-4 p-4 bg-yellow-300 text-black rounded-lg'>
                        ⚠️ This is a test message for showing/hiding functionality!
                    </div>
                )}

                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-gray-800 dark:text-gray-200'>
                        <thead className='text-sm uppercase bg-gray-200 dark:bg-gray-700'>
                            <tr>
                                <th className='py-3 px-4'>No</th>
                                <th className='py-3 px-4'>Image</th>
                                <th className='py-3 px-4'>Name</th>
                                <th className='py-3 px-4'>Shop Name</th> 
                                <th className='py-3 px-4'>Payment Status</th> 
                                <th className='py-3 px-4'>Email</th> 
                                <th className='py-3 px-4'>Status</th> 
                                <th className='py-3 px-4'>District</th> 
                                <th className='py-3 px-4'>Action</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((d, i) => (
                                <tr key={d._id || i} className='border-b dark:border-gray-600'>
                                    <td className='py-2 px-4'>{i + 1}</td>
                                    <td className='py-2 px-4'>
                                        <img className='w-12 h-12 rounded-full' src={d.image} alt="" />
                                    </td>
                                    <td className='py-2 px-4'>{d.name}</td>
                                    <td className='py-2 px-4'>{d.shopInfo?.shopName}</td>
                                    <td className='py-2 px-4'><span>{d.payment}</span></td>
                                    <td className='py-2 px-4'>{d.email}</td>
                                    <td className='py-2 px-4'>{d.status}</td>
                                    <td className='py-2 px-4'>{d.shopInfo?.district}</td>
                                    <td className='py-2 px-4'>
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link 
                                                to={`/admin/dashboard/seller/details/${d._id}`} 
                                                className='p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center'
                                            > 
                                                <FaEye /> 
                                            </Link> 
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody> 
                    </table> 
                </div>  

                <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    <Pagination 
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalItem={totalSeller || 50}
                        parPage={parPage}
                        showItem={3}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeactiveSellers;
