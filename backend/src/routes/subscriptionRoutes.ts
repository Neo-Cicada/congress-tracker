import express from 'express';
import {
    createCheckout,
    handleWebhook,
    getSubscriptionStatus,
    cancelSubscription,
    resumeSubscription,
    getCustomerPortal,
} from '../controllers/subscriptionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Webhook — no auth (verified via signature), raw body handled by server.ts
router.post('/webhook', handleWebhook);

// All routes below require authentication
router.post('/checkout', protect, createCheckout);
router.get('/status', protect, getSubscriptionStatus);
router.post('/cancel', protect, cancelSubscription);
router.post('/resume', protect, resumeSubscription);
router.post('/portal', protect, getCustomerPortal);

export default router;
