import { Router } from 'express';
import { createShop, getShops, getShopById } from '../controllers/shopController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, requireRole('admin'), createShop);
router.get('/', getShops);
router.get('/:id', getShopById);

export default router;
