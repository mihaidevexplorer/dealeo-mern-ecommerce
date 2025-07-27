// src/routes/home/homeRoutes.ts

import { Router } from 'express';
import homeControllers from '../../controllers/home/homeControllers';

// Inițializarea router-ului
const router = Router();

// Rute pentru pagina principală și afișarea produselor
router.get('/get-categorys', homeControllers.get_categorys);
router.get('/get-products', homeControllers.get_products);
router.get('/price-range-latest-product', homeControllers.price_range_product);
router.get('/query-products', homeControllers.query_products);
router.get('/product-details/:slug', homeControllers.product_details);

// Rute pentru recenzii
router.post('/customer/submit-review', homeControllers.submit_review);
router.get('/customer/get-reviews/:productId', homeControllers.get_reviews);

export default router;