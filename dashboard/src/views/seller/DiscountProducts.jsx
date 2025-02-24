//src\views\seller\DiscountProducts.jsx
import { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { LuImageMinus } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productReducer';

const DiscountProducts = () => {
    const dispatch = useDispatch();
    const { products, totalProduct } = useSelector(state => state.product);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_products(obj));
    }, [searchValue, currentPage, parPage]);

    // Filtrarea produselor cu discount > 10%
    const filteredProducts = products.filter(product => product.discount > 10);

    return (
        <div className="px-2 lg:px-7 pt-5">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-xl mb-5">Discounted Products</h1>

            <div className="w-full p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />

                <div className="relative overflow-x-auto mt-6">
                    <table className="w-full text-sm text-left text-gray-200 bg-opacity-80">
                        <thead className="uppercase bg-gray-800 text-gray-400">
                            <tr>
                                <th className="py-3 px-4">No</th>
                                <th className="py-3 px-4">Image</th>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Brand</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">Discount</th>
                                <th className="py-3 px-4">Stock</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((d, i) => (
                                <tr key={i} className="border-b bg-gray-700 border-gray-600 hover:bg-gray-600">
                                    <td className="py-2 px-4 font-medium text-gray-100">{i + 1}</td>
                                    <td className="py-2 px-4">
                                        <img
                                            className="w-12 h-12 rounded-md object-cover"
                                            src={d.images[0]}
                                            alt=""
                                        />
                                    </td>
                                    <td className="py-2 px-4 text-gray-100">{d?.name?.slice(0, 15)}...</td>
                                    <td className="py-2 px-4 text-gray-100">{d.category}</td>
                                    <td className="py-2 px-4 text-gray-100">{d.brand}</td>
                                    <td className="py-2 px-4 text-gray-100">${d.price}</td>
                                    <td className="py-2 px-4 text-green-400 font-semibold">%{d.discount}</td>
                                    <td className="py-2 px-4 text-gray-100">{d.stock}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/seller/dashboard/edit-product/${d._id}`}
                                                className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition duration-200"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <Link
                                                to={`/seller/dashboard/add-banner/${d._id}`}
                                                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition duration-200"
                                            >
                                                <LuImageMinus />
                                            </Link>
                                            <Link
                                                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition duration-200"
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition duration-200"
                                            >
                                                <FaTrash />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalProduct > parPage && (
                    <div className="w-full flex justify-end mt-6">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={filteredProducts.length}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountProducts;
