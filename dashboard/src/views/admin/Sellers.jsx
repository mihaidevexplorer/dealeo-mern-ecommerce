//src\views\admin\Sellers.jsx
import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_active_sellers } from '../../store/Reducers/sellerReducer';

const Sellers = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    const { sellers, totalSeller } = useSelector(state => state.seller);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_active_sellers(obj));
    }, [searchValue, currentPage, parPage]);

    return (
        <div className="px-4 md:px-8 py-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-6">Sellers</h1>

            <div className="w-full p-6 bg-white shadow-lg rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <select 
                        onChange={(e) => setParPage(parseInt(e.target.value))} 
                        className="px-4 py-2 focus:ring-2 focus:ring-indigo-500 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                    <input 
                        onChange={e => setSearchValue(e.target.value)} 
                        value={searchValue} 
                        className="px-4 py-2 focus:ring-2 focus:ring-indigo-500 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                        type="text" 
                        placeholder="Search sellers..." 
                    />
                </div>

                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th scope="col" className="py-3 px-4">No</th>
                                <th scope="col" className="py-3 px-4">Image</th>
                                <th scope="col" className="py-3 px-4">Name</th>
                                <th scope="col" className="py-3 px-4">Shop Name</th>
                                <th scope="col" className="py-3 px-4">Payment Status</th>
                                <th scope="col" className="py-3 px-4">Email</th>
                                <th scope="col" className="py-3 px-4">Status</th>
                                <th scope="col" className="py-3 px-4">District</th>
                                <th scope="col" className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((d, i) => (
                                <tr key={i} className="bg-white border-b hover:bg-gray-50 transition duration-150">
                                    <td className="py-3 px-4 font-medium text-gray-800">{i + 1}</td>
                                    <td className="py-3 px-4">
                                        <img className="w-12 h-12 rounded-full object-cover" src={d.image} alt={d.name} />
                                    </td>
                                    <td className="py-3 px-4 text-gray-800">{d.name}</td>
                                    <td className="py-3 px-4">{d.shopInfo?.shopName}</td>
                                    <td className="py-3 px-4">{d.payment}</td>
                                    <td className="py-3 px-4">{d.email}</td>
                                    <td className="py-3 px-4">
                                        <span 
                                            className={`px-3 py-1 text-sm rounded-full ${
                                                d.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{d.shopInfo?.district}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <Link 
                                                to={`/admin/dashboard/seller/details/${d._id}`} 
                                                className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
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

                {totalSeller > parPage && (
                    <div className="mt-6 flex justify-end">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalSeller}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sellers;
