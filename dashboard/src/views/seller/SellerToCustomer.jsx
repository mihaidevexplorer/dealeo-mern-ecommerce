//src\views\seller\SellerToCustomer.jsx
import { useEffect, useRef, useState } from 'react';
import { FaList } from 'react-icons/fa6';
import { IoMdClose } from "react-icons/io";
import Picker from '@emoji-mart/react';
import data from "@emoji-mart/data/sets/14/facebook.json";
import { useDispatch, useSelector } from 'react-redux';
import { get_customer_message, get_customers,messageClear,send_message,updateMessage } from '../../store/Reducers/chatReducer';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { socket } from '../../utils/utils';

const SellerToCustomer = () => {

    const scrollRef = useRef()

    const [show, setShow] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false); 
    const sellerId = 65
    const {userInfo } = useSelector(state => state.auth)
    const {customers,messages,currentCustomer,successMessage } = useSelector(state => state.chat)
    const [text,setText] = useState('')
    const [receverMessage,setReceverMessage] = useState('')

    const { customerId } =  useParams()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(get_customers(userInfo._id))
    },[])

    useEffect(() => {
        if (customerId) {
            dispatch(get_customer_message(customerId))
        }
    },[customerId])

    const send = (e) => {
        e.preventDefault() 
            dispatch(send_message({
                senderId: userInfo._id, 
                receverId: customerId,
                text,
                name: userInfo?.shopInfo?.shopName 
            }))
            setText('') 
    }
 
    useEffect(() => {
        if (successMessage) {
            socket.emit('send_seller_message',messages[messages.length - 1])
            dispatch(messageClear())
        }
    },[successMessage])

    useEffect(() => {
        socket.on('customer_message', msg => {
            setReceverMessage(msg)
        })
         
    },[])

    useEffect(() => {
        if (receverMessage) {
            if (customerId === receverMessage.senderId && userInfo._id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage))
            } else {
                toast.success(receverMessage.senderName + " " + "Send A message")
                dispatch(messageClear())
            }
        }

    },[receverMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth'})
    },[messages])

    const handleEmojiSelect = (emoji) => {
        setText(prev => prev + emoji.native);
    };



    return (
    <div className='px-2 lg:px-7 py-5'>
        <div className='w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 px-4 py-4 rounded-md h-[calc(100vh-140px)]'>
        <div className='flex w-full h-full relative'>
    
    <div className={`w-[280px] h-full absolute z-10 ${show ? '-left-[16px]' : '-left-[336px]'} md:left-0 md:relative transition-all `}>
        <div className='w-full h-[calc(100vh-177px)] bg-[#000] md:bg-transparent overflow-y-auto'>
        <div className='flex text-xl justify-between items-center p-4 md:p-0 md:px-3 md:pb-3 text-white'>
        <h2>Customers</h2>
        <span onClick={() => setShow(!show)} className='block cursor-pointer md:hidden'><IoMdClose /> </span>
       </div>


        {
            customers.map((c,i) => <Link key={i} to={`/seller/dashboard/chat-customer/${c.fdId}`} className={`h-[60px] flex justify-start gap-2 items-center text-white px-2 py-2 rounded-md cursor-pointer bg-red-500`}>
            <div className='relative'>
             <img className='w-[38px] h-[38px] border-white border-2 max-w-[38px] p-[2px] rounded-full' src="http://localhost:3000/images/admin.jpg" alt="" />
             <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
            </div>
    
            <div className='flex justify-center items-start flex-col w-full'>
                <div className='flex justify-between items-center w-full'>
                    <h2 className='text-base font-semibold'>{c.name}</h2>
    
                </div> 
            </div> 
           </Link>  )
        }
       


      

 
 

        </div> 
    </div>

    <div className='w-full md:w-[calc(100%-200px)] md:pl-4'>
        <div className='flex justify-between items-center'>
            {
                sellerId && <div className='flex justify-start items-center gap-3'>
           <div className='relative'>
         <img className='w-[45px] h-[45px] border-green-500 border-2 max-w-[45px] p-[2px] rounded-full' src="http://localhost:3000/images/demo.jpg" alt="" />
         <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
        </div>
        <h2 className='text-base text-white font-semibold'>{currentCustomer.name}</h2>

                </div>
            } 

            <div onClick={()=> setShow(!show)} className='w-[35px] flex md:hidden h-[35px] rounded-sm bg-red-500 shadow-lg hover:shadow-red-500/50 justify-center cursor-pointer items-center text-white'>
                <span><FaList/> </span>
            </div> 
        </div>

        <div className='py-4'>
            <div className='bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 h-[calc(100vh-290px)] rounded-lg p-4 shadow-lg overflow-y-auto border border-gray-400'>
           
    {
        customerId ? messages.map((m,i) => {
            if (m.senderId === customerId) {
                return (
                    <div key={i} ref={scrollRef} className='w-full flex justify-start items-center'>
                    <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
                        <div>
                            <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src="http://localhost:3000/images/demo.jpg" alt="" />
                        </div>
                        <div className='flex justify-center items-start flex-col w-full bg-purple-500 shadow-lg shadow-red-500/50 text-white py-1 px-2 rounded-sm'>
                        <span>{m.message} </span>
                        </div> 
                    </div> 
                </div>
                )
            } else {
                return ( 
                    <div key={i} ref={scrollRef} className='w-full flex justify-end items-center'>
                    <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
                        
                        <div className='flex justify-center items-start flex-col w-full bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-1 px-2 rounded-sm'>
                        <span>{m.message} </span>
                        </div> 
                        <div>
                            <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src="http://localhost:3000/images/admin.jpg" alt="" />
                        </div>

                    </div> 
                </div>
                )
            }
        }) : <div className='w-full h-full flex justify-center items-center text-white gap-2 flex-col'>
            <span>Select Customer </span>
        </div>
    }

 


             

            </div> 
        </div>

        <form onSubmit={send} className='flex gap-3 relative'>
            <input value={text} onChange={(e) => setText(e.target.value)} className='w-full flex justify-between px-2 border border-gray-900 items-center py-[5px] focus:border-red-500 rounded-md outline-none bg-transparent text-[#d0d2d6]' type="text" placeholder='Input Your Message' />
            <button type='button' onClick={() => setShowEmoji(!showEmoji)} className='bg-gray-200 p-2 rounded-md'>😀</button>
            <button className='shadow-lg bg-pink-700 hover:shadow-pink-500/50 text-semibold w-[75px] h-[35px] rounded-md text-white flex justify-center items-center'>Send</button>
            {showEmoji && <div className='absolute bottom-12 right-2'><Picker data={data} onEmojiSelect={handleEmojiSelect} set="facebook"/></div>}

        </form>




    </div>  

        </div> 

        </div>
        
    </div>
    );
};

export default SellerToCustomer;