//src\views\admin\AdminDashboard.jsx
import { useEffect } from 'react';
import { MdCurrencyExchange,MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6"; 
import Chart from 'react-apexcharts'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import seller from '../../assets/seller.png'
import { get_admin_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';

const AdminDashboard = () => {

    const dispatch = useDispatch()
    const {totalSale,totalOrder,totalProduct,totalSeller,recentOrder,recentMessage} = useSelector(state=> state.dashboard)
    const {userInfo} = useSelector(state=> state.auth)



    useEffect(() => {
        dispatch(get_admin_dashboard_data())
    }, [])

    const state = {
        series : [
            {
                name : "Orders",
                data : [23,34,45,56,76,34,23,76,87,78,34,45]
            },
            {
                name : "Revenue",
                data : [67,39,45,56,90,56,23,56,87,78,67,78]
            },
            {
                name : "Sellers",
                data : [34,39,56,56,80,67,23,56,98,78,45,56]
            },
        ],
        options : {
            color : ['#181ee8','#181ee8'],
            plotOptions: {
                radius : 30
            },
            chart : {
                background : 'transparent',
                foreColor : '#d0d2d6'
            },
            dataLabels : {
                enabled : false
            },
            strock : {
                show : true,
                curve : ['smooth','straight','stepline'],
                lineCap : 'butt',
                colors : '#f0f0f0',
                width  : .5,
                dashArray : 0
            },
            xaxis : {
                categories : ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            },
            legend : {
                position : 'top'
            },
            responsive : [
                {
                    breakpoint : 565,
                    yaxis : {
                        categories : ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                    },
                    options : {
                        plotOptions: {
                            bar : {
                                horizontal : true
                            }
                        },
                        chart : {
                            height : "550px"
                        }
                    }
                }
            ]
        }
    }




    return (
        <div className='px-4 md:px-8 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen'>


            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                
                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl shadow-lg'>
                    <div className='flex flex-col justify-start items-start'>
                        <h2 className='text-3xl font-bold'>${totalSale}</h2>
                        <span className='text-md font-medium'>Total Salse</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#fa0305] flex justify-center items-center text-xl'>
                    <MdCurrencyExchange className='text-[#FFF] shadow-lg' /> 
                    </div> 
                </div>


                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-xl shadow-lg'>
                    <div className='flex flex-col justify-start items-start text-[#FFF]'>
                        <h2 className='text-3xl font-bold'>{totalProduct}</h2>
                        <span className='text-md font-medium'>Products</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#ff80bf] flex justify-center items-center text-xl'>
                    <MdProductionQuantityLimits  className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>


                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-xl shadow-lg'>
                    <div className='flex flex-col justify-start items-start text-[#FFF]'>
                        <h2 className='text-3xl font-bold'>{totalSeller}</h2>
                        <span className='text-md font-medium'>Sellers</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#00FF7F] flex justify-center items-center text-xl'>
                    <FaUsers  className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>


                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl shadow-lg'>
                    <div className='flex flex-col justify-start items-start text-[#FFF]'>
                        <h2 className='text-3xl font-bold'>{totalOrder}</h2>
                        <span className='text-md font-medium'>Orders</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#00BFFF] flex justify-center items-center text-xl'>
                    <FaCartShopping  className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>
 
            </div>

        
        
        <div className='w-full flex flex-wrap mt-7'>
            <div className='w-full lg:w-7/12 lg:pr-3'>
                <div className='w-full bg-[#FFF] p-4 rounded-md'>
            <Chart options={state.options} series={state.series} type='bar' height={350} />
                </div>
            </div>

        
        <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
            <div className='w-full bg-[#FFF] p-4 rounded-md text-[#000]'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-lg text-[#000] pb-3'>Recent Seller Message</h2>
                    <Link className='text-blue-500 hover:text-blue-700 font-semibold'>View All</Link>
                </div>

        <div className='flex flex-col gap-2 pt-6 text-[#FFF]'>
            <ol className='relative border-1 border-gray-600 ml-4'>
               
               {
                recentMessage.map((m, i) => <li key={m._id || i} className='mb-3 ml-6'>
                <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#00BFFF] rounded-full z-10'>
                {
                    m.senderId === userInfo._id ? <img className='w-full rounded-full h-full shadow-lg' src={userInfo.image} alt="" /> : <img className='w-full rounded-full h-full shadow-lg' src={seller} alt="" />
                } 
                </div>
                <div className='p-3 bg-gray-800 rounded-lg border border-gray-600 shadow-sm'>
                <div className='flex justify-between items-center mb-2'>
            <Link className='text-md font-normal'>{m.senderName}</Link>
            <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0'> {moment(m.createdAt).startOf('hour').fromNow()}</time>
                </div>
                <div className='p-2 text-xs font-normal bg-gray-700 rounded-lg border border-gray-800'>
                    {m.message}
                </div>
                </div>
            </li>)
               }
               
                
 

            </ol>

        </div>


            </div>
        </div>
        </div>


        <div className='w-full p-6 bg-white shadow-lg rounded-xl mt-6'>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-xl text-gray-800 pb-3'>Recent Orders</h2>
                <Link className='text-sm font-semibold text-blue-600 hover:underline'>View All</Link>
               </div>

    <div className='relative overflow-x-auto mt-4'>
    <table className='w-full text-sm text-left text-gray-600'>
        <thead className='text-sm text-gray-600 uppercase bg-gray-100'>
        <tr>
            <th scope='col' className='py-3 px-4'>Order Id</th>
            <th scope='col' className='py-3 px-4'>Price</th>
            <th scope='col' className='py-3 px-4'>Payment Status</th>
            <th scope='col' className='py-3 px-4'>Order Status</th>
            <th scope='col' className='py-3 px-4'>Active</th>
        </tr>
        </thead>

        <tbody>
            {
                recentOrder.map((d, i) => <tr key={i}>
                <td scope='row' className='bg-white border-b hover:bg-gray-50 transition duration-200'>#{d._id}</td>
                <td scope='row' className='py-3 px-4 font-medium text-gray-800 whitespace-nowrap'>${d.price}</td>
                <td scope='row' className='py-3 px-4 font-medium text-gray-800 whitespace-nowrap'>{d.payment_status}</td>
                <td scope='row' className='py-3 px-4 font-medium text-gray-600 whitespace-nowrap'>{d.delivery_status}</td>
                <td scope='row' className='py-3 px-4 font-medium text-gray-600 whitespace-nowrap'>
                    <Link to={`/admin/dashboard/order/details/${d._id}`} className="text-blue-500 hover:text-blue-700 font-semibold">View</Link> </td>
                    
            </tr> )
            }

            
        </tbody>

    </table>

    </div>

        </div>




             
        </div>
    );
};

export default AdminDashboard;