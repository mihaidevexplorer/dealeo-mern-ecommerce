// src/hooks/useChatNotifications.ts
import { useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';
import { useSocket } from './useChat';
import type { ChatMessage, User } from '../types';

interface NotificationOptions {
  enableSound?: boolean;
  enableDesktop?: boolean;
  enableToast?: boolean;
  soundUrl?: string;
}

interface ChatNotificationHook {
  requestPermission: () => Promise<boolean>;
  playNotificationSound: () => void;
  showDesktopNotification: (message: ChatMessage, senderName: string) => void;
  showToastNotification: (message: ChatMessage, senderName: string) => void;
}

export const useChatNotifications = (
  user: User | null,
  options: NotificationOptions = {}
): ChatNotificationHook => {
  const {
    enableSound = true,
    enableDesktop = true,
    enableToast = true,
    soundUrl = '/sounds/notification.mp3'
  } = options;

  // Fix: Use currentFd instead of currentFriend
  const { currentFd, incrementUnreadCount, my_friends } = useChatStore();
  const { socket } = useSocket(user);

  // Request desktop notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!enableSound) return;

    try {
      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    } catch (error) {
      console.warn('Error creating notification sound:', error);
    }
  }, [enableSound, soundUrl]);

  // Show desktop notification
  const showDesktopNotification = useCallback(
    (message: ChatMessage, senderName: string) => {
      if (!enableDesktop || Notification.permission !== 'granted') return;

      try {
        const notification = new Notification(`New message from ${senderName}`, {
          body: message.message.length > 50 
            ? `${message.message.substring(0, 50)}...` 
            : message.message,
          icon: '/images/chat-icon.png',
          badge: '/images/chat-badge.png',
          tag: `chat-${message.senderId}`, // Prevents duplicate notifications
          requireInteraction: false,
          silent: false,
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          // You can add navigation logic here
          notification.close();
        };

      } catch (error) {
        console.warn('Failed to show desktop notification:', error);
      }
    },
    [enableDesktop]
  );

  // Show toast notification
  const showToastNotification = useCallback(
    (message: ChatMessage, senderName: string) => {
      if (!enableToast) return;

      const messagePreview = message.message.length > 30 
        ? `${message.message.substring(0, 30)}...` 
        : message.message;

      toast.success(
        `${senderName}: ${messagePreview}`,
        {
          duration: 4000,
          position: 'top-right',
          icon: '💬',
          style: {
            maxWidth: '350px',
          },
        }
      );
    },
    [enableToast]
  );

  // Get sender name from friends list
  const getSenderName = useCallback((senderId: string): string => {
    const friend = my_friends.find(f => f.fdId === senderId);
    return friend ? friend.name : 'Unknown Seller';
  }, [my_friends]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !user) return;

    const handleIncomingMessage = (message: ChatMessage) => {
      // Only show notifications if the message is not from current conversation
      const isFromCurrentFriend = currentFd && currentFd.fdId === message.senderId;
      
      if (!isFromCurrentFriend) {
        // Increment unread count
        incrementUnreadCount(message.senderId);

        // Get sender name from friends list
        const senderName = getSenderName(message.senderId);

        // Show notifications
        if (enableSound) {
          playNotificationSound();
        }

        if (enableDesktop) {
          showDesktopNotification(message, senderName);
        }

        if (enableToast) {
          showToastNotification(message, senderName);
        }

        // Update document title to show unread count
        const currentTitle = document.title;
        if (!currentTitle.includes('(')) {
          document.title = `(1) ${currentTitle}`;
        } else {
          const match = currentTitle.match(/\((\d+)\)/);
          if (match) {
            const count = parseInt(match[1]) + 1;
            document.title = currentTitle.replace(/\(\d+\)/, `(${count})`);
          }
        }
      }
    };

    // Listen for incoming messages
    socket.on('seller_message', handleIncomingMessage);
    socket.on('new_message', handleIncomingMessage);

    return () => {
      socket.off('seller_message', handleIncomingMessage);
      socket.off('new_message', handleIncomingMessage);
    };
  }, [
    socket,
    user,
    currentFd,
    incrementUnreadCount,
    enableSound,
    enableDesktop,
    enableToast,
    playNotificationSound,
    showDesktopNotification,
    showToastNotification,
    getSenderName
  ]);

  // Clear document title notifications when chat is focused
  useEffect(() => {
    const handleFocus = () => {
      document.title = document.title.replace(/\(\d+\)\s*/, '');
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Request permission on mount
  useEffect(() => {
    if (enableDesktop && user) {
      requestPermission();
    }
  }, [enableDesktop, user, requestPermission]);

  return {
    requestPermission,
    playNotificationSound,
    showDesktopNotification,
    showToastNotification,
  };
};

// Hook for managing chat notification preferences
export const useChatNotificationPreferences = () => {
  const getPreferences = useCallback((): NotificationOptions => {
    try {
      const saved = localStorage.getItem('chatNotificationPreferences');
      return saved ? JSON.parse(saved) : {
        enableSound: true,
        enableDesktop: true,
        enableToast: true,
      };
    } catch {
      return {
        enableSound: true,
        enableDesktop: true,
        enableToast: true,
      };
    }
  }, []);

  const setPreferences = useCallback((preferences: NotificationOptions) => {
    try {
      localStorage.setItem('chatNotificationPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save notification preferences:', error);
    }
  }, []);

  return {
    getPreferences,
    setPreferences,
  };
};

// Hook for chat activity tracking
export const useChatActivity = (user: User | null) => {
  const { socket } = useSocket(user);

  const updateLastSeen = useCallback(() => {
    if (socket && user) {
      socket.emit('update_last_seen', {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
    }
  }, [socket, user]);

  const setUserOnline = useCallback(() => {
    if (socket && user) {
      socket.emit('user_online', {
        userId: user.id,
        name: user.name,
        image: user.avatar || '/images/default-avatar.png',
      });
    }
  }, [socket, user]);

  const setUserOffline = useCallback(() => {
    if (socket && user) {
      socket.emit('user_offline', {
        userId: user.id,
      });
      updateLastSeen();
    }
  }, [socket, user, updateLastSeen]);

  // Track user activity
  useEffect(() => {
    if (!user) return;

    // Set user online when component mounts
    setUserOnline();

    // Update last seen periodically
    const interval = setInterval(updateLastSeen, 30000); // Every 30 seconds

    // Set user offline when page is hidden or user leaves
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUserOffline();
      } else {
        setUserOnline();
      }
    };

    const handleBeforeUnload = () => {
      setUserOffline();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setUserOffline();
    };
  }, [user, setUserOnline, setUserOffline, updateLastSeen]);

  return {
    updateLastSeen,
    setUserOnline,
    setUserOffline,
  };
};