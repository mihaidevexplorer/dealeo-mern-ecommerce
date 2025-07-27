import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../api/api';
import type { ChatMessage, Friend } from '../types';

interface AddFriendRequest {
  sellerId: string;
  userId: string;
}

interface AddFriendResponse {
  messages: ChatMessage[];
  currentFd: Friend | "";
  MyFriends: Friend[];
}

interface SendMessageRequest {
  userId: string;
  text: string;
  sellerId: string;
  name: string;
}

interface SendMessageResponse {
  message: ChatMessage;
}

interface OnlineUser {
  userId: string;
  sellerId?: string;
  name: string;
  image: string;
  socketId?: string;
}

interface ChatState {
  // Core chat state (matching Redux state exactly)
  my_friends: Friend[];
  fb_messages: ChatMessage[];
  currentFd: Friend | ""; // Matching Redux - can be Friend or empty string
  errorMessage: string;
  successMessage: string;
  
  // Additional state for real-time features
  activeSellers: OnlineUser[];
  onlineUsers: OnlineUser[];
  isConnected: boolean;
  typingUsers: Record<string, boolean>;
  lastSeen: Record<string, string>;
  unreadCounts: Record<string, number>;
  loader: boolean;
  
  // Core actions (matching Redux actions)
  messageClear: () => void;
  updateMessage: (message: ChatMessage) => void;
  
  // Async actions (converted from Redux thunks)
  addFriend: (info: AddFriendRequest) => Promise<void>;
  sendMessage: (info: SendMessageRequest) => Promise<void>;
  
  // Additional actions for real-time features
  setMyFriends: (friends: Friend[]) => void;
  setFbMessages: (messages: ChatMessage[]) => void;
  setCurrentFriend: (friend: Friend | "") => void;
  addMessage: (message: ChatMessage) => void;
  updateFriendOrder: (sellerId: string) => void;
  setActiveSellers: (sellers: OnlineUser[]) => void;
  setOnlineUsers: (users: OnlineUser[]) => void;
  setConnectionStatus: (status: boolean) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  setLastSeen: (userId: string, timestamp: string) => void;
  incrementUnreadCount: (senderId: string) => void;
  markMessagesAsRead: (senderId: string) => void;
  setLoader: (loading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (message: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Initial state (matching Redux initialState exactly)
      my_friends: [],
      fb_messages: [],
      currentFd: "", // Empty string like in Redux
      errorMessage: '',
      successMessage: '',
      
      // Additional state
      activeSellers: [],
      onlineUsers: [],
      isConnected: false,
      typingUsers: {},
      lastSeen: {},
      unreadCounts: {},
      loader: false,

      // Core actions (matching Redux reducers)
      messageClear: () =>
        set(
          { errorMessage: '', successMessage: '' },
          false,
          'messageClear'
        ),

      updateMessage: (message) =>
        set(
          (state) => ({
            fb_messages: [...state.fb_messages, message],
          }),
          false,
          'updateMessage'
        ),

      // Async actions (converted from Redux thunks)
      addFriend: async (info) => {
        // Validate sellerId before making API call
        if (!info.sellerId || info.sellerId === 'undefined') {
          console.warn('Invalid sellerId, skipping addFriend call');
          return;
        }

        try {
          set({ loader: true }, false, 'addFriend:loading');
          
          const { data } = await api.post<AddFriendResponse>('/chat/customer/add-customer-friend', info);
          
          // Matching the Redux fulfilled case exactly
          set(
            {
              fb_messages: data.messages || [],
              currentFd: data.currentFd,
              my_friends: data.MyFriends || [],
              loader: false,
              errorMessage: '',
              successMessage: '', // Redux doesn't set success message here
            },
            false,
            'addFriend:fulfilled'
          );
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to add friend';
          
          console.error('addFriend error:', errorMessage);
          
          set(
            {
              loader: false,
              errorMessage,
              successMessage: '',
            },
            false,
            'addFriend:rejected'
          );
        }
      },

      sendMessage: async (info) => {
        try {
          set({ loader: true }, false, 'sendMessage:loading');
          
          const { data } = await api.post<SendMessageResponse>('/chat/customer/send-message-to-seller', info);
          
          // Matching the Redux fulfilled case exactly - reorder friends logic
          const state = get();
          const tempFriends = [...state.my_friends];
          let index = tempFriends.findIndex(f => f.fdId === data.message.receverId);
          
          while (index > 0) {
            const temp = tempFriends[index];
            tempFriends[index] = tempFriends[index - 1];
            tempFriends[index - 1] = temp;
            index--;
          }
          
          set(
            {
              my_friends: tempFriends,
              fb_messages: [...state.fb_messages, data.message],
              successMessage: 'Message Send Success', // Exact message from Redux
              loader: false,
              errorMessage: '',
            },
            false,
            'sendMessage:fulfilled'
          );
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to send message';
          
          set(
            {
              loader: false,
              errorMessage,
              successMessage: '',
            },
            false,
            'sendMessage:rejected'
          );
        }
      },

      // Additional actions for real-time features
      setMyFriends: (friends) =>
        set({ my_friends: friends }, false, 'setMyFriends'),

      setFbMessages: (messages) =>
        set({ fb_messages: messages }, false, 'setFbMessages'),

      setCurrentFriend: (friend) =>
        set({ currentFd: friend }, false, 'setCurrentFriend'),

      addMessage: (message) =>
        set(
          (state) => ({
            fb_messages: [...state.fb_messages, message],
          }),
          false,
          'addMessage'
        ),

      updateFriendOrder: (sellerId) =>
        set(
          (state) => {
            const tempFriends = [...state.my_friends];
            let index = tempFriends.findIndex(f => f.fdId === sellerId);
            
            while (index > 0) {
              const temp = tempFriends[index];
              tempFriends[index] = tempFriends[index - 1];
              tempFriends[index - 1] = temp;
              index--;
            }
            
            return { my_friends: tempFriends };
          },
          false,
          'updateFriendOrder'
        ),

      setActiveSellers: (sellers) =>
        set({ activeSellers: sellers }, false, 'setActiveSellers'),

      setOnlineUsers: (users) =>
        set({ onlineUsers: users }, false, 'setOnlineUsers'),

      setConnectionStatus: (status) =>
        set({ isConnected: status }, false, 'setConnectionStatus'),

      setTyping: (userId, isTyping) =>
        set(
          (state) => ({
            typingUsers: {
              ...state.typingUsers,
              [userId]: isTyping,
            },
          }),
          false,
          'setTyping'
        ),

      setLastSeen: (userId, timestamp) =>
        set(
          (state) => ({
            lastSeen: {
              ...state.lastSeen,
              [userId]: timestamp,
            },
          }),
          false,
          'setLastSeen'
        ),

      incrementUnreadCount: (senderId) =>
        set(
          (state) => ({
            unreadCounts: {
              ...state.unreadCounts,
              [senderId]: (state.unreadCounts[senderId] || 0) + 1,
            },
          }),
          false,
          'incrementUnreadCount'
        ),

      markMessagesAsRead: (senderId) =>
        set(
          (state) => {
            const newUnreadCounts = { ...state.unreadCounts };
            delete newUnreadCounts[senderId];
            return { unreadCounts: newUnreadCounts };
          },
          false,
          'markMessagesAsRead'
        ),

      setLoader: (loading) =>
        set({ loader: loading }, false, 'setLoader'),

      setError: (error) =>
        set(
          { errorMessage: error, successMessage: '' },
          false,
          'setError'
        ),

      setSuccess: (message) =>
        set(
          { successMessage: message, errorMessage: '' },
          false,
          'setSuccess'
        ),

      clearMessages: () =>
        set(
          { errorMessage: '', successMessage: '' },
          false,
          'clearMessages'
        ),
    }),
    {
      name: 'chat-store',
    }
  )
);