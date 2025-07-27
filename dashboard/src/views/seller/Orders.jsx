//src\views\seller\Orders.jsx
import { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
    const dispatch = useDispatch();

    const { myOrders, totalOrder } = useSelector(state => state.order);
    const { userInfo } = useSelector(state => state.auth);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            sellerId: userInfo._id
        };
        dispatch(get_seller_orders(obj));
    }, [searchValue, currentPage, parPage]);

    return (
        <div className="px-4 lg:px-8 py-6 bg-gray-100 min-h-screen">
            <h1 className="text-gray-800 font-bold text-2xl mb-6">Orders</h1>

            <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-md">
                <Search
                    setParPage={setParPage}
                    setSearchValue={setSearchValue}
                    searchValue={searchValue}
                />

                <div className="relative overflow-x-auto mt-6">
                    <table className="w-full text-sm text-left text-gray-200">
                        <thead className="text-xs uppercase bg-indigo-700 text-gray-100">
                            <tr>
                                <th scope="col" className="py-3 px-4">Order Id</th>
                                <th scope="col" className="py-3 px-4">Price</th>
                                <th scope="col" className="py-3 px-4">Payment Status</th>
                                <th scope="col" className="py-3 px-4">Order Status</th>
                                <th scope="col" className="py-3 px-4">Date</th>
                                <th scope="col" className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {myOrders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-700">
                                    <td className="py-2 px-4 font-medium text-gray-100">#{order._id}</td>
                                    <td className="py-2 px-4 font-medium text-gray-100">${order.price}</td>
                                    <td className="py-2 px-4 font-medium text-gray-100">{order.payment_status}</td>
                                    <td className="py-2 px-4 font-medium text-gray-100">{order.delivery_status}</td>
                                    <td className="py-2 px-4 font-medium text-gray-100">{order.date}</td>
                                    <td className="py-2 px-4 font-medium text-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                to={`/seller/dashboard/order/details/${order._id}`}
                                                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
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

                {totalOrder > parPage && (
                    <div className="flex justify-end mt-6">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalOrder}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

