//src\components\dashboard\Chat.tsx
import { useEffect, useRef, useState } from 'react';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai';
import { GrEmoji } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import { FaList } from 'react-icons/fa';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/api';
import type { ChatMessage } from '../../types';

interface ReceivedMessage extends ChatMessage {
    senderName?: string;
}

const socket = io('https://dealeo-backend.onrender.com', {
  withCredentials: true,
});


const Chat = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { sellerId } = useParams<{ sellerId: string }>();
    
    // Obține userInfo din store-ul de autentificare
    const { userInfo } = useAuthStore();
    
    // Zustand store pentru chat
    const { 
        my_friends, 
        fb_messages, 
        currentFd, 
        successMessage,
        addFriend,
        sendMessage,
        updateMessage,
        messageClear
    } = useChatStore();
    
    const [text, setText] = useState('');
    const [receverMessage, setReceverMessage] = useState<ReceivedMessage | ''>('');
    const [activeSeller, setActiveSeller] = useState<Array<{sellerId: string}>>([]);
    const [show, setShow] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Load friends list on component mount
    useEffect(() => {
        const loadFriends = async () => {
            if (userInfo && !sellerId) {
                try {
                    // Încearcă mai întâi endpoint-ul din Redux
                    const { data } = await api.post('/chat/customer/add-customer-friend', {
                        sellerId: '',
                        userId: userInfo.id
                    });
                    if (data.MyFriends) {
                        useChatStore.getState().setMyFriends(data.MyFriends);
                    }
                } catch (error) {
                    console.error('Error loading friends:', error);
                }
            }
        };
        loadFriends();
    }, [userInfo, sellerId]);

    useEffect(() => {
        if (userInfo) {
            socket.emit('add_user', userInfo.id, userInfo);
        }
    }, [userInfo, fb_messages]);

    useEffect(() => {
        // Apelează addFriend doar dacă avem un sellerId valid
        if (userInfo && sellerId && sellerId !== 'undefined') {
            addFriend({
                sellerId: sellerId,
                userId: userInfo.id,
            });
        }
    }, [sellerId, userInfo, addFriend]);

    const send = () => {
        if (text && userInfo && sellerId) {
            sendMessage({
                userId: userInfo.id,
                text,
                sellerId: sellerId,
                name: userInfo.name,
            });
            setText('');
        }
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setText((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    useEffect(() => {
        socket.on('seller_message', (msg: ReceivedMessage) => {
            setReceverMessage(msg);
        });
        socket.on('activeSeller', (sellers) => {
            setActiveSeller(sellers);
        });
    }, [userInfo]);

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_customer_message', fb_messages[fb_messages.length - 1]);
            messageClear();
        }
    }, [successMessage, userInfo, fb_messages, messageClear]);

    useEffect(() => {
        if (receverMessage && typeof receverMessage !== 'string' && userInfo) {
            if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
                updateMessage(receverMessage);
            } else {
                toast.success(receverMessage.senderName + ' ' + 'Send A message');
                messageClear();
            }
        }
    }, [receverMessage, userInfo, sellerId, updateMessage, messageClear]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [fb_messages]);

    // Verifică dacă utilizatorul este autentificat
    if (!userInfo) {
        return (
            <div className="bg-white p-3 rounded-md">
                <div className="flex items-center justify-center h-[500px] text-gray-600">
                    <p>Please login to access chat</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-3 rounded-md">
            <div className="w-full flex relative">
                <div
                    className={`w-[230px] bg-white md-lg:absolute md-lg:h-full md-lg:z-50 transition-all duration-300 ${
                        show ? 'md-lg:left-0' : 'md-lg:-left-[350px]'
                    }`}
                >
                    <div className="flex justify-center gap-3 items-center text-gray-600 text-xl h-[50px]">
                        <span>
                            <AiOutlineMessage />
                        </span>
                        <span>Message</span>
                    </div>
                    <div className="w-full flex flex-col text-gray-600 py-4 h-[400px] pr-3 overflow-y-auto">
                        {my_friends.length === 0 ? (
                            <div className="text-center text-gray-400 p-4">
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            my_friends.map((f, i) => (
                                <Link
                                    to={`/dashboard/chat/${f.fdId}`}
                                    key={i}
                                    className={`flex gap-2 justify-start items-center pl-2 py-[5px] hover:bg-gray-100 rounded transition-colors ${
                                        currentFd && currentFd.fdId === f.fdId ? 'bg-slate-200' : ''
                                    }`}
                                >
                                    <div className="w-[30px] h-[30px] rounded-full relative">
                                        {activeSeller.some((c) => c.sellerId === f.fdId) && (
                                            <div className="w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0"></div>
                                        )}

                                        <img src={f.image} alt="" />
                                    </div>
                                    <span>{f.name}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="w-[calc(100%-230px)] md-lg:w-full">
                    {currentFd && sellerId ? (
                        <div className="w-full h-full">
                            <div className="flex justify-between gap-3 items-center text-gray-600 text-xl h-[50px]">
                                <div className="flex gap-2">
                                    <div className="w-[30px] h-[30px] rounded-full relative">
                                        {activeSeller.some((c) => c.sellerId === currentFd.fdId) && (
                                            <div className="w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0"></div>
                                        )}
                                        <img src={currentFd.image} />
                                    </div>
                                    <span>{currentFd.name}</span>
                                </div>

                                <div
                                    onClick={() => setShow(!show)}
                                    className="w-[35px] h-[35px] hidden md-lg:flex cursor-pointer rounded-sm justify-center items-center bg-sky-500 text-white"
                                >
                                    <FaList />
                                </div>
                            </div>
                            <div className="h-[400px] w-full bg-gray-100 p-3 rounded-md">
                                <div className="w-full h-full overflow-y-auto flex flex-col gap-3">
                                    {fb_messages.map((m, i) => {
                                        if (currentFd?.fdId !== m.receverId) {
                                            return (
                                                <div
                                                    ref={scrollRef}
                                                    key={i}
                                                    className="w-full flex gap-2 justify-start items-center text-[14px]"
                                                >
                                                    <img
                                                        className="w-[30px] h-[30px]"
                                                        src="http://localhost:3001/images/user.png"
                                                        alt=""
                                                    />
                                                    <div className="p-2 bg-purple-500 text-white rounded-md">
                                                        <span>{m.message}</span>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    ref={scrollRef}
                                                    key={i}
                                                    className="w-full flex gap-2 justify-end items-center text-[14px]"
                                                >
                                                    <img
                                                        className="w-[30px] h-[30px]"
                                                        src="http://localhost:3001/images/user.png"
                                                        alt=""
                                                    />
                                                    <div className="p-2 bg-cyan-500 text-white rounded-md">
                                                        <span>{m.message}</span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="flex p-2 justify-between items-center w-full">
                                <div className="w-[40px] h-[40px] border p-2 justify-center items-center flex rounded-full">
                                    <label className="cursor-pointer" htmlFor="">
                                        <AiOutlinePlus />
                                    </label>
                                    <input className="hidden" type="file" />
                                </div>
                                <div className="border h-[40px] p-0 ml-2 w-[calc(100%-90px)] rounded-full relative">
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        type="text"
                                        placeholder="input message"
                                        className="w-full rounded-full h-full outline-none p-3"
                                    />
                                    <div
                                        className="text-2xl right-2 top-2 absolute cursor-pointer"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    >
                                        <GrEmoji />
                                    </div>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-12 right-0">
                                            <EmojiPicker onEmojiClick={onEmojiClick} />
                                        </div>
                                    )}
                                </div>
                                <div className="w-[40px] p-2 justify-center items-center rounded-full">
                                    <div onClick={send} className="text-2xl cursor-pointer">
                                        <IoSend />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col">
                            <div className="flex justify-between items-center text-gray-600 text-xl h-[50px] md-lg:block">
                                <span className="hidden md-lg:block">Select a conversation</span>
                                <div
                                    onClick={() => setShow(!show)}
                                    className="w-[35px] h-[35px] hidden md-lg:flex cursor-pointer rounded-sm justify-center items-center bg-sky-500 text-white"
                                >
                                    <FaList />
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
                                <AiOutlineMessage className="text-6xl mb-4" />
                                <p className="text-lg">Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;//Modificat
