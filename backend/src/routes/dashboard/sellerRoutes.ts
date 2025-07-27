
// src/routes/dashboard/sellerRoutes.ts

import { Router } from 'express';
import sellerController from '../../controllers/dasboard/sellerController';
import { authMiddleware } from '../../middleware/authMiddleware';

// Inițializarea router-ului
const router = Router();

// Rute pentru gestionarea vânzătorilor
router.get('/request-seller-get', authMiddleware, sellerController.request_seller_get);
router.get('/get-seller/:sellerId', authMiddleware, sellerController.get_seller);
router.post('/seller-status-update', authMiddleware, sellerController.seller_status_update);

// Rută pentru obținerea vânzătorilor activi
router.get('/get-sellers', authMiddleware, sellerController.get_active_sellers);

export default router;