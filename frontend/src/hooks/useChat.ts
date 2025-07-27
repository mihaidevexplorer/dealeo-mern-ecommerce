// src/hooks/useChat.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';
import api from '../api/api';
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';
import type { 
  ChatMessage, 
  Friend, 
  ApiResponse,
  User 
} from '../types';

interface ApiError {
  error: string;
  message?: string;
}

interface AddFriendRequest {
  sellerId: string;
  userId: string;
}

interface AddFriendResponse {
  messages: ChatMessage[];
  currentFd: Friend;
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

interface GetMessagesResponse {
  messages: ChatMessage[];
  friend: Friend;
}

interface OnlineUser {
  userId: string;
  sellerId?: string;
  name: string;
  image: string;
  socketId?: string;
}

// Socket.IO connection hook
export const useSocket = (user: User | null) => {
  const socketRef = useRef<Socket | null>(null);
  const { 
    setConnectionStatus, 
    setActiveSellers, 
    updateMessage, 
    incrementUnreadCount,
    setTyping,
    setLastSeen,
    currentFd 
  } = useChatStore();

  const connectSocket = useCallback(() => {
    if (!user || socketRef.current?.connected) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      upgrade: true,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to socket server');
      setConnectionStatus(true);
      socket.emit('add_user', user.id, user);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setConnectionStatus(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionStatus(false);
    });

    // Chat events
    socket.on('seller_message', (message: ChatMessage) => {
      updateMessage(message);
      
      // If message is not from current friend, show notification and increment unread
      if (!currentFd || currentFd.fdId !== message.senderId) {
        toast.success(`New message from seller`);
        incrementUnreadCount(message.senderId);
      }
    });

    socket.on('activeSeller', (sellers: OnlineUser[]) => {
      setActiveSellers(sellers);
    });

    socket.on('user_typing', ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      setTyping(userId, isTyping);
    });

    socket.on('user_last_seen', ({ userId, timestamp }: { userId: string; timestamp: string }) => {
      setLastSeen(userId, timestamp);
    });

    // Cleanup function
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('seller_message');
      socket.off('activeSeller');
      socket.off('user_typing');
      socket.off('user_last_seen');
    };
  }, [user, setConnectionStatus, setActiveSellers, updateMessage, incrementUnreadCount, setTyping, setLastSeen, currentFd]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnectionStatus(false);
    }
  }, [setConnectionStatus]);

  useEffect(() => {
    if (user) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, connectSocket, disconnectSocket]);

  // Socket utility functions
  const emitMessage = useCallback((eventName: string, data: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, data);
    }
  }, []);

  const emitTyping = useCallback((sellerId: string, isTyping: boolean) => {
    emitMessage('customer_typing', { sellerId, isTyping });
  }, [emitMessage]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    emitMessage,
    emitTyping,
    connectSocket,
    disconnectSocket,
  };
};

// Add Friend Mutation
export const useAddFriend = () => {
  const queryClient = useQueryClient();
  const { 
    setLoader, 
    setError, 
    setSuccess, 
    setMyFriends, 
    setFbMessages, 
    setCurrentFriend 
  } = useChatStore();

  return useMutation<AddFriendResponse, AxiosError<ApiError>, AddFriendRequest>({
    mutationFn: async (friendData: AddFriendRequest) => {
      const { data } = await api.post<AddFriendResponse>('/chat/customer/add-customer-friend', friendData);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data) => {
      setMyFriends(data.MyFriends);
      setFbMessages(data.messages);
      setCurrentFriend(data.currentFd);
      setSuccess('Friend added successfully');
      
      // Invalidate friends query
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to add friend';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Send Message Mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { 
    setLoader, 
    setError, 
    setSuccess, 
    addMessage, 
    updateFriendOrder 
  } = useChatStore();
  const { emitMessage } = useSocket(null);

  return useMutation<SendMessageResponse, AxiosError<ApiError>, SendMessageRequest>({
    mutationFn: async (messageData: SendMessageRequest) => {
      const { data } = await api.post<SendMessageResponse>('/chat/customer/send-message-to-seller', messageData);
      return data;
    },
    onMutate: () => {
      setLoader(true);
    },
    onSuccess: (data, variables) => {
      addMessage(data.message);
      updateFriendOrder(variables.sellerId);
      setSuccess('Message sent successfully');
      
      // Emit socket event for real-time delivery
      emitMessage('send_customer_message', data.message);
      
      // Invalidate messages query
      queryClient.invalidateQueries({ queryKey: ['messages', variables.sellerId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to send message';
      setError(errorMessage);
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoader(false);
    }
  });
};

// Get Chat Messages
export const useGetMessages = (sellerId: string, userId: string) => {
  const { setFbMessages, setCurrentFriend } = useChatStore();

  const query = useQuery<GetMessagesResponse>({
    queryKey: ['messages', sellerId, userId],
    queryFn: async () => {
      const { data } = await api.get<GetMessagesResponse>(`/chat/customer/get-messages/${sellerId}/${userId}`);
      return data;
    },
    enabled: !!sellerId && !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for new messages
  });

  useEffect(() => {
    if (query.data) {
      setFbMessages(query.data.messages);
      setCurrentFriend(query.data.friend);
    }
  }, [query.data, setFbMessages, setCurrentFriend]);

  return query;
};

// Get Friends List
export const useGetFriends = (userId: string) => {
  const { setMyFriends } = useChatStore();

  const query = useQuery<{ friends: Friend[] }>({
    queryKey: ['friends', userId],
    queryFn: async () => {
      const { data } = await api.get<{ friends: Friend[] }>(`/chat/customer/get-friends/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setMyFriends(query.data.friends);
    }
  }, [query.data, setMyFriends]);

  return query;
};

// Mark Messages as Read Mutation
export const useMarkMessagesAsRead = () => {
  const { markMessagesAsRead } = useChatStore();

  return useMutation<ApiResponse, AxiosError<ApiError>, { sellerId: string; userId: string }>({
    mutationFn: async ({ sellerId, userId }) => {
      const { data } = await api.put<ApiResponse>('/chat/customer/mark-as-read', { sellerId, userId });
      return data;
    },
    onSuccess: (_, variables) => {
      markMessagesAsRead(variables.sellerId);
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error('Failed to mark messages as read:', error.response?.data?.error);
    }
  });
};

// Delete Message Mutation
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { setError, setSuccess } = useChatStore();

  return useMutation<ApiResponse, AxiosError<ApiError>, { messageId: string; userId: string }>({
    mutationFn: async ({ messageId }) => {
      const { data } = await api.delete<ApiResponse>(`/chat/customer/delete-message/${messageId}`);
      return data;
    },
    onSuccess: (response) => {
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate messages to refetch
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to delete message';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  });
};

// Block/Unblock User Mutation
export const useBlockUser = () => {
  const queryClient = useQueryClient();
  const { setError, setSuccess } = useChatStore();

  return useMutation<ApiResponse, AxiosError<ApiError>, { sellerId: string; userId: string; action: 'block' | 'unblock' }>({
    mutationFn: async ({ sellerId, userId, action }) => {
      const { data } = await api.put<ApiResponse>('/chat/customer/block-user', { sellerId, userId, action });
      return data;
    },
    onSuccess: (response) => {
      setSuccess(response.message);
      toast.success(response.message);
      
      // Invalidate friends to refetch
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.error || 'Failed to update user status';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  });
};

// Hook for chat state
export const useChatState = () => {
  const chatState = useChatStore();
  
  return {
    myFriends: chatState.my_friends,
    fbMessages: chatState.fb_messages,
    currentFriend: chatState.currentFd,
    activeSellers: chatState.activeSellers,
    onlineUsers: chatState.onlineUsers,
    unreadCounts: chatState.unreadCounts,
    isConnected: chatState.isConnected,
    typingUsers: chatState.typingUsers,
    lastSeen: chatState.lastSeen,
    errorMessage: chatState.errorMessage,
    successMessage: chatState.successMessage,
    loader: chatState.loader,
    clearMessages: chatState.clearMessages,
    markMessagesAsRead: chatState.markMessagesAsRead,
    setCurrentFriend: chatState.setCurrentFriend,
  };
};

// Utility hooks
export const useUnreadMessagesCount = (): number => {
  const { unreadCounts } = useChatStore();
  return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
};

export const useIsUserOnline = (userId: string): boolean => {
  const { activeSellers, onlineUsers } = useChatStore();
  return activeSellers.some(user => user.sellerId === userId) || 
         onlineUsers.some(user => user.userId === userId);
};

export const useIsUserTyping = (userId: string): boolean => {
  const { typingUsers } = useChatStore();
  return typingUsers[userId] || false;
};

export const useLastSeen = (userId: string): string | null => {
  const { lastSeen } = useChatStore();
  return lastSeen[userId] || null;
};

// Custom hook for typing indicator
export const useTypingIndicator = (sellerId: string, delay = 1000) => {
  const { emitTyping } = useSocket(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const startTyping = useCallback(() => {
    emitTyping(sellerId, true);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // Set timeout to stop typing
    timeoutRef.current = window.setTimeout(() => {
      emitTyping(sellerId, false);
    }, delay);
  }, [sellerId, emitTyping, delay]);

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    emitTyping(sellerId, false);
  }, [sellerId, emitTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { startTyping, stopTyping };
};