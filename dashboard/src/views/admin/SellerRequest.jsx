//src\views\admin\SellerRequest.jsx
import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import Search from '../components/Search';
import { get_seller_request } from '../../store/Reducers/sellerReducer';

const SellerRequest = () => {
    const dispatch = useDispatch();
    const { sellers, totalSeller } = useSelector(state => state.seller);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        dispatch(get_seller_request({ parPage, searchValue, page: currentPage }));
    }, [parPage, searchValue, currentPage, dispatch]);

    return (
        <div className='p-6 min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'>
            <h1 className='text-2xl font-bold mb-5 text-center'>Seller Requests</h1>
            
            <div className='bg-white p-6 rounded-lg shadow-lg'>
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                
                <div className='overflow-x-auto mt-4'>
                    <table className='w-full text-sm text-gray-700'>
                        <thead className='text-gray-600 uppercase border-b border-gray-300 bg-gray-100'>
                            <tr>
                                <th className='py-3 px-4 text-left'>No</th>
                                <th className='py-3 px-4 text-left'>Name</th>
                                <th className='py-3 px-4 text-left'>Email</th>
                                <th className='py-3 px-4 text-left'>Payment Status</th>
                                <th className='py-3 px-4 text-left'>Status</th>
                                <th className='py-3 px-4 text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((seller, i) => (
                                <tr key={i} className='border-b border-gray-300 hover:bg-gray-100 transition'>
                                    <td className='py-3 px-4'>{i + 1}</td>
                                    <td className='py-3 px-4'>{seller.name}</td>
                                    <td className='py-3 px-4'>{seller.email}</td>
                                    <td className='py-3 px-4'>{seller.payment}</td>
                                    <td className='py-3 px-4'>{seller.status}</td>
                                    <td className='py-3 px-4'>
                                        <Link to={`/admin/dashboard/seller/details/${seller._id}`} 
                                            className='p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition'>
                                            <FaEye />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className='flex justify-end mt-6'>
                    <Pagination 
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalItem={totalSeller}
                        parPage={parPage}
                        showItem={3}
                    />
                </div>
            </div>
        </div>
    );
};

export default SellerRequest;
