import { useEffect } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6"; 
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';
import customer from '../../assets/demo.jpg';

const SellerDashboard = () => {

    const dispatch = useDispatch();
    const { totalSale, totalOrder, totalProduct, totalPendingOrder, recentOrder, recentMessage } = useSelector(state => state.dashboard);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(get_seller_dashboard_data());
    }, []);

    const state = {
        series: [
            { name: "Orders", data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45] },
            { name: "Revenue", data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78] },
            { name: "Sales", data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56] },
        ],
        options: {
            chart: {
                background: 'transparent',
                foreColor: '#d0d2d6',
            },
            dataLabels: { enabled: false },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            colors: ['#6a5fdf', '#fa0305', '#038000'],
            legend: { position: 'top' },
            responsive: [
                {
                    breakpoint: 565,
                    options: {
                        chart: { height: "550px" },
                        plotOptions: {
                            bar: { horizontal: true },
                        },
                    },
                },
            ],
        },
    };

    return (
        <div className='px-4 md:px-8 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen'>

            {/* Cards Section */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl shadow-lg'>
                    <div>
                        <h2 className='text-3xl font-bold'>${totalSale}</h2>
                        <p>Total Sales</p>
                    </div>
                    <MdCurrencyExchange size={32} />
                </div>

                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-xl shadow-lg'>
                    <div>
                        <h2 className='text-3xl font-bold'>{totalProduct}</h2>
                        <p>Products</p>
                    </div>
                    <MdProductionQuantityLimits size={32} />
                </div>

                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-xl shadow-lg'>
                    <div>
                        <h2 className='text-3xl font-bold'>{totalOrder}</h2>
                        <p>Orders</p>
                    </div>
                    <FaCartShopping size={32} />
                </div>

                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl shadow-lg'>
                    <div>
                        <h2 className='text-3xl font-bold'>{totalPendingOrder}</h2>
                        <p>Pending Orders</p>
                    </div>
                    <FaCartShopping size={32} />
                </div>
            </div>

            {/* Chart Section */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
                <div className='lg:col-span-2 bg-white rounded-xl shadow-lg p-6'>
                    <Chart options={state.options} series={state.series} type='line' height={350} />
                </div>

                <div className='bg-white rounded-xl shadow-lg p-6'>
                    <h2 className='text-lg font-semibold mb-4'>Recent Customer Messages</h2>
                    <ul className='space-y-4'>
                        {recentMessage.map((m, i) => (
                            <li key={i} className='flex gap-4 items-start'>
                                <img
                                    className='w-10 h-10 rounded-full object-cover'
                                    src={m.senderId === userInfo._id ? userInfo.image : customer}
                                    alt='User'
                                />
                                <div>
                                    <h4 className='font-medium'>{m.senderName}</h4>
                                    <p className='text-sm text-gray-600'>{m.message}</p>
                                    <span className='text-xs text-gray-500'>{moment(m.createdAt).startOf('hour').fromNow()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className='bg-white rounded-xl shadow-lg p-6 mt-6'>
                <h2 className='text-lg font-semibold mb-4'>Recent Orders</h2>
                <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm text-left'>
                        <thead className='bg-gray-100'>
                            <tr>
                                <th className='py-3 px-4'>Order ID</th>
                                <th className='py-3 px-4'>Price</th>
                                <th className='py-3 px-4'>Payment Status</th>
                                <th className='py-3 px-4'>Order Status</th>
                                <th className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrder.map((d, i) => (
                                <tr key={i} className='border-b'>
                                    <td className='py-3 px-4'>#{d._id}</td>
                                    <td className='py-3 px-4'>${d.price}</td>
                                    <td className='py-3 px-4'>{d.payment_status}</td>
                                    <td className='py-3 px-4'>{d.delivery_status}</td>
                                    <td className='py-3 px-4'>
                                        <Link
                                            to={`/seller/dashboard/order/details/${d._id}`}
                                            className='text-blue-500 hover:underline'>
                                                <FaUsers className="inline-block mr-2" />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
