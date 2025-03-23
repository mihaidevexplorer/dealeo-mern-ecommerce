//src\views\Pagination.jsx
import PropTypes from 'prop-types';
import { MdOutlineKeyboardDoubleArrowLeft,MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
const Pagination = ({pageNumber,setPageNumber,totalItem,parPage,showItem}) => {

    let totalPage = Math.ceil(totalItem / parPage)
    let startPage = pageNumber

    let dif = totalPage - pageNumber
    if (dif <= showItem) {
        startPage = totalPage - showItem
    }
    let endPage = startPage < 0 ? showItem : showItem + startPage
     
    if (startPage <= 0) {
        startPage = 1
    }

    const createBtn = () => {

        const btns = []
        for (let i = startPage; i < endPage; i++) {
            btns.push(
                <li key={i} onClick={()=>setPageNumber(i)} className={` ${pageNumber === i ? 'bg-indigo-300 shadow-lg shadow-indigo-300/50 text-white' : 'bg-gray-600 hover:bg-blue-400 shadow-lg hover:shadow-blue-500/50 hover:text-white text-[#d0d2d6]'} w-[33px] h-[33px] rounded-full flex justify-center items-center cursor-pointer `}>
                    {i}                    
                </li>
            ) 
        }
        return btns
    }

    return (
        <ul className='flex gap-3'>
            {
                pageNumber > 1 && <li onClick={() => setPageNumber(pageNumber - 1)} className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-gray-300 text-[#000000] cursor-pointer'>
                    <MdOutlineKeyboardDoubleArrowLeft />
                </li>
            }
            {
                createBtn()
            }
            {
                pageNumber < totalPage && <li onClick={() => setPageNumber(pageNumber + 1)} className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-gray-300 text-[#000000] cursor-pointer'>
                    <MdOutlineKeyboardDoubleArrowRight  />
                </li>
            }

        </ul>
    )


};

Pagination.propTypes = {
    pageNumber: PropTypes.number.isRequired,
    setPageNumber: PropTypes.func.isRequired,
    totalItem: PropTypes.number.isRequired,
    parPage: PropTypes.number.isRequired,
    showItem: PropTypes.number.isRequired,
};

export default Pagination;
