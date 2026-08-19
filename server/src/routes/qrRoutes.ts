import { Router } from 'express';
import { QrController } from '../controllers/qrController';

const router = Router();

router.get('/qr/all-codes', QrController.getAllQrCodes);
router.get('/qr/validate/:token', QrController.validateToken);
router.post('/orders', QrController.createOrder);
router.post('/orders/verify-payment', QrController.verifyPayment);
router.get('/orders/track/:token', QrController.trackOrder);

export default router;
