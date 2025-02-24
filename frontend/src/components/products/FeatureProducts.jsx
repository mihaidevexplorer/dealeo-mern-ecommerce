//src/components/products/FeatureProducts.jsx
import { useEffect } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const FeatureProducts = ({ products }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { errorMessage, successMessage } = useSelector(state => state.card);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

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

    const add_wishlist = (pro) => {
        dispatch(add_to_wishlist({
            userId: userInfo.id,
            productId: pro._id,
            name: pro.name,
            price: pro.price,
            image: pro.images[0],
            discount: pro.discount,
            rating: pro.rating,
            slug: pro.slug
        }));
    };

    return (
        <div className='w-[90%] mx-auto py-10'>
            {/* Header */}
            <div className='text-center mb-8'>
                <h2 className='text-3xl font-extrabold text-gray-900'>Feature Products</h2>
                <div className='w-24 h-1 bg-[#CCCCCC] mx-auto mt-2'></div>
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {products.map((p, i) => (
                    <div key={i} className='border rounded-lg group bg-white shadow-sm hover:shadow-md transition-all duration-300'>
                        {/* Product Image */}
                        <div className='relative overflow-hidden rounded-t-lg'>
                            {p.discount > 0 && (
                                <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                                    -{p.discount}%
                                </div>
                            )}
                            <img src={p.images[0]} alt={p.name} className='w-full h-56 object-contain p-4 bg-gray-50' />

                            {/* Action Icons */}
                            <ul className='flex gap-3 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                <li onClick={() => add_wishlist(p)} className='bg-white text-gray-600 p-2 rounded-full shadow hover:bg-red-500 hover:text-white cursor-pointer transition'>
                                    <FaRegHeart size={18} />
                                </li>
                                <Link to={`/product/details/${p.slug}`} className='bg-white text-gray-600 p-2 rounded-full shadow hover:bg-green-500 hover:text-white transition'>
                                    <FaEye size={18} />
                                </Link>
                                <li onClick={() => add_card(p._id)} className='bg-white text-gray-600 p-2 rounded-full shadow hover:bg-blue-500 hover:text-white cursor-pointer transition'>
                                    <RiShoppingCartLine size={18} />
                                </li>
                            </ul>
                        </div>

                        {/* Product Details */}
                        <div className='p-4 text-center'>
                            <h3 className='text-lg font-semibold text-gray-800 truncate'>{p.name}</h3>
                            <div className='flex items-center justify-center gap-3 mt-2'>
                                <span className='text-lg font-bold text-gray-900'>${p.price}</span>
                                <Rating ratings={p.rating} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureProducts;
