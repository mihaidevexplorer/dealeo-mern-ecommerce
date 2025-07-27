//src\views\seller\SellerToAdmin.jsx
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picker from '@emoji-mart/react';
import data from "@emoji-mart/data/sets/14/facebook.json";


import { get_admin_message, get_seller_message, get_sellers, send_message_seller_admin, updateAdminMessage,messageClear } from '../../store/Reducers/chatReducer'


import {socket} from '../../utils/utils'


const SellerToAdmin = () => {
    const scrollRef = useRef()
    const dispatch = useDispatch()
    const [showEmoji, setShowEmoji] = useState(false); 
    const [text,setText] = useState('')
    const {seller_admin_message,successMessage} = useSelector(state => state.chat)
    //const {sellers,activeSeller,seller_admin_message,currentSeller,successMessage} = useSelector(state => state.chat)
    

    const {userInfo} = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(get_seller_message())
        dispatch(get_sellers());
        dispatch(get_admin_message());
    },[dispatch])

    const send = (e) => {
        e.preventDefault() 
            dispatch(send_message_seller_admin({
                senderId: userInfo._id, 
                receverId: '',
                message: text,
                senderName: userInfo.name
            }))
            setText('') 
    }

    useEffect(() => {
        socket.on('receved_admin_message', msg => {
             dispatch(updateAdminMessage(msg))
        })
         
    },[])

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_message_seller_to_admin',seller_admin_message[seller_admin_message.length - 1])
            dispatch(messageClear())
        }
    },[successMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth'})
    },[seller_admin_message])

    const handleEmojiSelect = (emoji) => {
        setText(prev => prev + emoji.native);
    };
 
    return (
    <div className='px-2 lg:px-7 py-5'>
        <div className='w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 px-4 py-4 rounded-md h-[calc(100vh-140px)]'>
        <div className='flex w-full h-full relative'>
    
    

    <div className='w-full md:pl-4'>
        <div className='flex justify-between items-center'>
            <div className='flex justify-start items-center gap-3'>
           <div className='relative'>
         <img className='w-[45px] h-[45px] border-green-600 border-2 max-w-[45px] p-[2px] rounded-full' src="http://localhost:3000/images/demo.jpg" alt="" />
         <div className='w-[10px] h-[10px] bg-green-600 rounded-full absolute right-0 bottom-0'></div>
        </div>
        <h2 className='text-base text-white font-semibold'>Support</h2>

                </div> 
             
        </div>

        <div className='py-4'>
            <div className='bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 h-[calc(100vh-290px)] rounded-lg p-4 shadow-lg overflow-y-auto border border-gray-400'>

                {
                    seller_admin_message.map((m, i) => {
                        if (userInfo._id === m.senderId) {
                            return (
<div ref={scrollRef} key={i} className='w-full flex justify-start items-center'>
        <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
            <div>
                <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src="http://localhost:3000/images/demo.jpg" alt="" />
            </div>
            <div className='flex justify-center items-start flex-col w-full bg-purple-500 shadow-lg shadow-purple-500/50 text-white py-1 px-2 rounded-sm'>
            <span>{m.message} </span>
            </div> 
        </div> 
    </div>
                )
                
            } else {
                return (
                    <div  ref={scrollRef} key={i} className='w-full flex justify-end items-center'>
                    <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
                        
                        <div className='flex justify-center items-start flex-col w-full bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-1 px-2 rounded-sm'>
                        <span>{m.message}  </span>
                        </div> 
                        <div>
                            <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src="http://localhost:3000/images/admin.jpg" alt="" />
                        </div>

                    </div> 
                </div>
                )
            }
        })
    }
        
 

            </div> 
        </div>

        <form onSubmit={send}  className='flex gap-3'>
            <input value={text} onChange={(e) => setText(e.target.value)}  className='w-full flex justify-between px-2 border border-gray-700 items-center py-[5px] focus:border-red-500 rounded-md outline-none bg-transparent text-[#d0d2d6]' type="text" placeholder='Input Your Message' />
            <button type='button' onClick={() => setShowEmoji(!showEmoji)} className='bg-gray-200 p-2 rounded-md'>😀</button>
            <button className='shadow-lg bg-pink-600 hover:shadow-pink-500/50 text-semibold w-[75px] h-[35px] rounded-md text-white flex justify-center items-center'>Send</button>
              {showEmoji && <div className='absolute bottom-12 right-2'><Picker data={data} onEmojiSelect={handleEmojiSelect} set="facebook" /></div>}

        </form>




    </div>  

        </div> 

        </div>
        
    </div>
    );
};

export default SellerToAdmin;