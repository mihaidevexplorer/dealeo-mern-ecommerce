//src/components/dashboard/Wishlist.jsx
import { useEffect } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_wishlist_products, add_to_card, remove_wishlist, messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const Wishlist = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const { wishlist, successMessage } = useSelector(state => state.card);

    useEffect(() => {
        dispatch(get_wishlist_products(userInfo.id));
    }, []);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage]);

    const add_card = (id) => {
            if (userInfo) {
                dispatch(add_to_card({
                    userId: userInfo.id,
                    quantity: 1,
                    productId: id
                }));
            } else {
                navigate('/login');
            }
        };

    return (
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
            {
                wishlist.map((p, i) => (
                    <div 
                        key={i} 
                        className='border group rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 bg-white'>
                        
                        {/* Product Image & Discount */}
                        <div className='relative'>
                            {p.discount !== 0 && (
                                <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-lg'>
                                    {p.discount}% OFF
                                </div>
                            )}
                            <img 
                                className='w-full h-[220px] object-contain p-4 bg-gray-100' 
                                src={p.image} 
                                alt={p.name} 
                            />
                            
                            {/* Action Buttons */}
                            <div className='absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                <button 
                                    onClick={() => dispatch(remove_wishlist(p._id))} 
                                    className='p-2 bg-red-500 text-white rounded-full hover:bg-red-600'>
                                    <FaRegHeart size={16} />
                                </button>
                                <Link 
                                    to={`/product/details/${p.slug.toLowerCase()}`} 
                                    className='p-2 bg-green-500 text-white rounded-full hover:bg-green-600'>
                                    <FaEye size={16} />
                                </Link>
                                <button onClick={() => add_card (p.productId)} className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600'>
                                    <RiShoppingCartLine size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className='p-3 sm:p-4 text-center'>
                            <h2 className='text-sm sm:text-base font-bold text-gray-800 truncate'>{p.name}</h2>
                            <div className='flex flex-col sm:flex-row items-center justify-center mt-1 sm:mt-2 gap-1 sm:gap-2'>
                                <span className='text-base sm:text-lg font-semibold text-gray-900'>${p.price}</span>
                                <div className='flex items-center'>
                                <Rating ratings={p.rating} size={12} sm:size={14} />
                            </div>
                                
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default Wishlist;
