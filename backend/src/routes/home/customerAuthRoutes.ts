// src/routes/home/customerAuthRoutes.ts

import { Router } from 'express';
import customerAuthController from '../../controllers/home/customerAuthController';

// Inițializarea router-ului
const router = Router();

// Rute pentru autentificarea clienților
router.post('/customer/customer-register', customerAuthController.customer_register);
router.post('/customer/customer-login', customerAuthController.customer_login);

// Rută pentru deconectarea clienților
router.get('/customer/logout', customerAuthController.customer_logout);

export default router;