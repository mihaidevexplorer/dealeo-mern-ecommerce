//src\views\admin\Orders.jsx
import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(null);

  const { myOrders, totalOrder } = useSelector((state) => state.order);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_admin_orders(obj));
  }, [searchValue, currentPage, parPage, dispatch]);

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 min-h-screen rounded-lg">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            placeholder="Search orders..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800 uppercase text-xs font-semibold">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Payment Status</th>
                <th className="py-3 px-6">Order Status</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6 text-center">
                  <ChevronDownIcon className="h-5 w-5 inline-block" />
                </th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition ease-in-out duration-150"
                >
                  <td className="py-3 px-6 font-medium text-gray-900">#{order._id}</td>
                  <td className="py-3 px-6">${order.price}</td>
                  <td className="py-3 px-6">{order.payment_status}</td>
                  <td className="py-3 px-6">{order.delivery_status}</td>
                  <td className="py-3 px-6">
                    <Link
                      to={`/admin/dashboard/order/details/${order._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                  <td
                    className="py-3 px-6 text-center cursor-pointer"
                    onClick={() => setShow(show === order._id ? null : order._id)}
                  >
                    <ChevronDownIcon
                      className={`h-5 w-5 transform transition-transform duration-200 ${
                        show === order._id ? 'rotate-180' : ''
                      }`}
                    />
                  </td>
                </tr>
              ))}

              {show && (
                <tr className="bg-indigo-50">
                  <td colSpan={6} className="p-4">
                    {myOrders
                      .find((order) => order._id === show)
                      ?.suborder.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center border-b py-2 last:border-b-0"
                        >
                          <span className="text-gray-700 font-medium">SubOrder ID: #{sub._id}</span>
                          <span className="text-gray-700">${sub.price}</span>
                          <span className="text-gray-700">{sub.payment_status}</span>
                          <span className="text-gray-700">{sub.delivery_status}</span>
                        </div>
                      ))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalOrder > parPage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrder}
              parPage={parPage}
              showItem={5}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
