// src\types\index.ts

// Interfața de bază pentru informațiile utilizatorului
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: 'customer' | 'seller' | 'admin';
}

// Interfața pentru Customer cu socket connection
export interface Customer {
  customerId: string;
  socketId: string;
  userInfo: UserInfo;
}

// Interfața pentru Seller cu socket connection
export interface Seller {
  sellerId: string;
  socketId: string;
  userInfo: UserInfo;
}

// Interfața pentru Admin cu socket connection
export interface Admin {
  adminId?: string;
  socketId?: string;
  userInfo?: UserInfo;
  email?: string;
  password?: string;
}

// Interfața pentru mesajele din chat
export interface Message {
  id?: string;
  senderId: string;
  receverId: string; // Păstrăm typo-ul din cod pentru consistență
  message: string;
  timestamp?: Date | string;
  senderName?: string;
  receiverName?: string;
  messageType?: 'text' | 'image' | 'file';
  status?: 'sent' | 'delivered' | 'read';
}