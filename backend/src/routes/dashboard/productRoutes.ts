// src/routes/dashboard/productRoutes.ts

import { Router } from 'express';
import productController from '../../controllers/dasboard/productController';

import { authMiddleware } from '../../middleware/authMiddleware';

// Inițializarea router-ului
const router = Router();

// Rute pentru gestionarea produselor în dashboard
router.post('/product-add', authMiddleware, productController.add_product);
router.get('/products-get', authMiddleware, productController.products_get);
router.get('/product-get/:productId', authMiddleware, productController.product_get);
router.post('/product-update', authMiddleware, productController.product_update);
router.post('/product-image-update', authMiddleware, productController.product_image_update);
router.delete('/product/:id', productController.deleteProduct);

export default router;