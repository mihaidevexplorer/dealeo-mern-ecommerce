// src/routes/dashboard/categoryRoutes.ts

import { Router } from 'express';
import categoryController from '../../controllers/dasboard/categoryController';
import { authMiddleware } from '../../middleware/authMiddleware';


// Inițializarea router-ului
const router = Router();

// Rutele pentru gestionarea categoriilor
router.post('/category-add', authMiddleware, categoryController.add_category);
router.get('/category-get', authMiddleware, categoryController.get_category);
router.put('/category-update/:id', authMiddleware, categoryController.update_category);
router.delete('/category/:id', authMiddleware, categoryController.deleteCategory);

export default router;
