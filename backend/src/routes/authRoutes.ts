// src/routes/authRoutes.ts

import { Router } from 'express';
import authControllers from '../controllers/authControllers';
import { authMiddleware } from '../middleware/authMiddleware';

// Inițializarea router-ului
const router = Router();

// Rute pentru autentificare admin
router.post('/admin-login', authControllers.admin_login);

// Rute pentru utilizatori autentificați
router.get('/get-user', authMiddleware, authControllers.getUser);

// Rute pentru autentificare vânzător
router.post('/seller-register', authControllers.seller_register);
router.post('/seller-login', authControllers.seller_login);

// Rute pentru gestionarea profilului
router.post('/profile-image-upload', authMiddleware, authControllers.profile_image_upload);
router.post('/profile-info-add', authMiddleware, authControllers.profile_info_add);

// Rută pentru deconectare
router.get('/logout', authMiddleware, authControllers.logout);

export default router;