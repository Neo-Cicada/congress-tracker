import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from './authMiddleware';

/**
 * Middleware that requires an active subscription to proceed.
 * Must be used AFTER the `protect` middleware.
 */
export const requireSubscription = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const user = await User.findById(req.user.id).select('subscription');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.subscription.status !== 'active') {
            res.status(403).json({
                message: 'Subscription required',
                subscriptionStatus: user.subscription.status,
                upgradeUrl: '/pricing',
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Subscription middleware error:', error);
        res.status(500).json({ message: 'Server error checking subscription' });
    }
};
