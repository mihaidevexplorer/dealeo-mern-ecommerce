//src/components/Pagination.tsx
import React from 'react';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

interface PaginationProps {
  pageNumber: number;
  setPageNumber: (page: number) => void;
  totalItem: number;
  parPage: number;
  showItem: number;
}

const Pagination: React.FC<PaginationProps> = ({
  pageNumber,
  setPageNumber,
  totalItem,
  parPage,
  showItem
}) => {
  const totalPage = Math.ceil(totalItem / parPage);
  let startPage = pageNumber;

  const dif = totalPage - pageNumber;
  if (dif <= showItem) {
    startPage = totalPage - showItem;
  }
  const endPage = startPage < 0 ? showItem : showItem + startPage;
  
  if (startPage <= 0) {
    startPage = 1;
  }

  const createBtn = () => {
    const btns = [];
    for (let i = startPage; i < endPage; i++) {
      btns.push(
        <li 
          key={i} 
          onClick={() => setPageNumber(i)} 
          className={` ${pageNumber === i ? 'bg-green-700 shadow-lg shadow-indigo-300/50 text-white' : 'bg-slate-600 hover:bg-green-400 shadow-lg hover:shadow-indigo-500/50 hover:text-white text-[#d0d2d6]'} w-[33px] h-[33px] rounded-full flex justify-center items-center cursor-pointer `}
        >
          {i}
        </li>
      );
    }
    return btns;
  };

  return (
    <ul className='flex gap-3'>
      {
        pageNumber > 1 && <li onClick={() => setPageNumber(pageNumber - 1)} className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-slate-300 text-[#000000] cursor-pointer'>
          <MdOutlineKeyboardDoubleArrowLeft />
        </li>
      }
      {
        createBtn()
      }
      {
        pageNumber < totalPage && <li onClick={() => setPageNumber(pageNumber + 1)} className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-slate-300 text-[#000000] cursor-pointer'>
          <MdOutlineKeyboardDoubleArrowRight />
        </li>
      }
    </ul>
  );
};

export default Pagination;//modificat