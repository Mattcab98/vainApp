import { Router } from 'express';
import { generateQR, validateQR, getConsumptionHistory } from '../controllers/consumptionController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.post('/generate-qr', authenticate, generateQR);
router.post('/validate', authenticate, requireRole('shop'), validateQR);
router.get('/history', authenticate, getConsumptionHistory);

export default router;
