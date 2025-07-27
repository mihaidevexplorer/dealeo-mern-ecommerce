// src/routes/dashboard/dashboardRoutes.ts

import { Router } from 'express';
import dashboardController from '../../controllers/dasboard/dashboardController';
import { authMiddleware } from '../../middleware/authMiddleware';

// Inițializarea router-ului
const router = Router();

// Rute pentru date dashboard
router.get('/admin/get-dashboard-data', authMiddleware, dashboardController.get_admin_dashboard_data);
router.get('/seller/get-dashboard-data', authMiddleware, dashboardController.get_seller_dashboard_data);

// Rute pentru gestionarea bannerelor
router.post('/banner/add', authMiddleware, dashboardController.add_banner);
router.get('/banner/get/:productId', authMiddleware, dashboardController.get_banner);
router.put('/banner/update/:bannerId', authMiddleware, dashboardController.update_banner);

// Rută publică pentru obținerea bannerelor
router.get('/banners', dashboardController.get_banners);

export default router;