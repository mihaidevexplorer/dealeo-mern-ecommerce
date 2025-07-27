// src/routes/chatRoutes.ts

import { Router } from 'express';
import ChatController from '../controllers/chat/ChatController';
import { authMiddleware } from '../middleware/authMiddleware';

// Inițializarea router-ului
const router = Router();

// Rute pentru chat clienți
router.post('/chat/customer/add-customer-friend', ChatController.add_customer_friend);
router.post('/chat/customer/send-message-to-seller', ChatController.customer_message_add);

// Rute pentru chat vânzători
router.get('/chat/seller/get-customers/:sellerId', ChatController.get_customers);
router.get('/chat/seller/get-customer-message/:customerId', authMiddleware, ChatController.get_customers_seller_message);
router.post('/chat/seller/send-message-to-customer', authMiddleware, ChatController.seller_message_add);

// Rute pentru chat admin
router.get('/chat/admin/get-sellers', authMiddleware, ChatController.get_sellers);
router.post('/chat/message-send-seller-admin', authMiddleware, ChatController.seller_admin_message_insert);
router.get('/chat/get-admin-messages/:receverId', authMiddleware, ChatController.get_admin_messages);
router.get('/chat/get-seller-messages', authMiddleware, ChatController.get_seller_messages);

export default router;