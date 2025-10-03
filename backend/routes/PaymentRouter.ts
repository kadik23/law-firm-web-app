import { Router } from 'express';
import { createPayment, handleWebhook, getPaymentById, getClientPayments, getPaymentsCount, getTransactionsCount, getPartialPayments, getAllPartialPayments, addTransactionToPayment } from '@/controllers/PaymentController';
import authMiddleware from '@/middlewares/AuthMiddleware';

const router = Router();

// Public routes (no authentication required)
router.post('/webhook', handleWebhook);

router.use(authMiddleware(["client", "admin"]));

router.post('/create', createPayment);

router.get('/client', getClientPayments);  

router.get('/count', getPaymentsCount);

router.get('/partial/:paymentId', getPartialPayments);

router.get('/partial', getAllPartialPayments);

router.post('/:paymentId/add-transaction', addTransactionToPayment);

router.get('/:id/transactions/count', getTransactionsCount);

router.get('/:id', getPaymentById);



export default router;

