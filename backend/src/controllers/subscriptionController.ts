import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// ─── Helpers ────────────────────────────────────────────────────────

const LS_API_BASE = 'https://api.lemonsqueezy.com/v1';

const lsFetch = async (path: string, options: RequestInit = {}) => {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) throw new Error('LEMONSQUEEZY_API_KEY is not configured');

    const res = await fetch(`${LS_API_BASE}${path}`, {
        ...options,
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': `Bearer ${apiKey}`,
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const body = await res.text();
        console.error(`Lemon Squeezy API error [${res.status}]:`, body);
        throw new Error(`Lemon Squeezy API error: ${res.status}`);
    }

    return res.json();
};

const VARIANT_MAP: Record<string, string | undefined> = {
    weekly: process.env.LEMONSQUEEZY_VARIANT_WEEKLY,
    monthly: process.env.LEMONSQUEEZY_VARIANT_MONTHLY,
    yearly: process.env.LEMONSQUEEZY_VARIANT_YEARLY,
};

// Map variant IDs back to plan names
const getVariantPlanMap = (): Record<string, string> => {
    const map: Record<string, string> = {};
    if (process.env.LEMONSQUEEZY_VARIANT_WEEKLY) map[process.env.LEMONSQUEEZY_VARIANT_WEEKLY] = 'weekly';
    if (process.env.LEMONSQUEEZY_VARIANT_MONTHLY) map[process.env.LEMONSQUEEZY_VARIANT_MONTHLY] = 'monthly';
    if (process.env.LEMONSQUEEZY_VARIANT_YEARLY) map[process.env.LEMONSQUEEZY_VARIANT_YEARLY] = 'yearly';
    return map;
};

// ─── Create Checkout ────────────────────────────────────────────────

export const createCheckout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { plan } = req.body;

        if (!plan || !['weekly', 'monthly', 'yearly'].includes(plan)) {
            res.status(400).json({ message: 'Invalid plan. Must be weekly, monthly, or yearly.' });
            return;
        }

        const variantId = VARIANT_MAP[plan];
        if (!variantId) {
            res.status(500).json({ message: `Variant ID not configured for plan: ${plan}` });
            return;
        }

        const storeId = process.env.LEMONSQUEEZY_STORE_ID;
        if (!storeId) {
            res.status(500).json({ message: 'LEMONSQUEEZY_STORE_ID is not configured' });
            return;
        }

        const user = await User.findById(req.user!.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        const checkoutData = {
            data: {
                type: 'checkouts',
                attributes: {
                    checkout_data: {
                        email: user.email,
                        custom: {
                            user_id: user._id.toString(),
                        },
                    },
                    product_options: {
                        redirect_url: `${frontendUrl}/subscription/success`,
                    },
                },
                relationships: {
                    store: {
                        data: { type: 'stores', id: storeId },
                    },
                    variant: {
                        data: { type: 'variants', id: variantId },
                    },
                },
            },
        };

        const result = await lsFetch('/checkouts', {
            method: 'POST',
            body: JSON.stringify(checkoutData),
        });

        const checkoutUrl = result.data?.attributes?.url;
        if (!checkoutUrl) {
            res.status(500).json({ message: 'Failed to create checkout URL' });
            return;
        }

        res.json({ checkoutUrl });
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ message: 'Failed to create checkout session' });
    }
};

// ─── Webhook Handler ────────────────────────────────────────────────

const verifyWebhookSignature = (rawBody: Buffer, signature: string): boolean => {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
        console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not configured');
        return false;
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const signature = req.headers['x-signature'] as string;
        if (!signature) {
            res.status(400).json({ message: 'Missing signature header' });
            return;
        }

        const rawBody = (req as any).rawBody as Buffer;
        if (!rawBody) {
            res.status(400).json({ message: 'Missing raw body' });
            return;
        }

        if (!verifyWebhookSignature(rawBody, signature)) {
            res.status(401).json({ message: 'Invalid webhook signature' });
            return;
        }

        const event = JSON.parse(rawBody.toString());
        const eventName = event.meta?.event_name;
        const customData = event.meta?.custom_data;
        const userId = customData?.user_id;
        const attrs = event.data?.attributes;

        console.log(`[LS Webhook] Event: ${eventName}, User ID: ${userId}`);

        if (!userId) {
            console.warn('[LS Webhook] No user_id in custom_data, skipping');
            res.json({ received: true });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            console.warn(`[LS Webhook] User not found: ${userId}`);
            res.json({ received: true });
            return;
        }

        // Determine the plan from variant_id
        const variantId = attrs?.variant_id?.toString() || attrs?.first_subscription_item?.variant_id?.toString();
        const planMap = getVariantPlanMap();
        const plan = variantId ? planMap[variantId] : null;

        switch (eventName) {
            case 'subscription_created':
            case 'subscription_resumed': {
                user.subscription.status = 'active';
                user.subscription.plan = (plan as any) || user.subscription.plan;
                user.subscription.lemonSqueezySubscriptionId = event.data?.id?.toString() || null;
                user.subscription.lemonSqueezyCustomerId = attrs?.customer_id?.toString() || null;
                user.subscription.currentPeriodEnd = attrs?.renews_at ? new Date(attrs.renews_at) : null;
                user.subscription.cancelAtPeriodEnd = false;
                break;
            }

            case 'subscription_updated': {
                const status = attrs?.status;
                if (status === 'active') {
                    user.subscription.status = 'active';
                    user.subscription.cancelAtPeriodEnd = !!attrs?.cancelled;
                } else if (status === 'past_due') {
                    user.subscription.status = 'past_due';
                } else if (status === 'cancelled' || status === 'expired') {
                    user.subscription.status = status;
                    user.subscription.cancelAtPeriodEnd = false;
                }

                if (plan) user.subscription.plan = plan as any;
                if (attrs?.renews_at) user.subscription.currentPeriodEnd = new Date(attrs.renews_at);
                if (attrs?.ends_at) user.subscription.currentPeriodEnd = new Date(attrs.ends_at);
                break;
            }

            case 'subscription_cancelled': {
                user.subscription.status = 'cancelled';
                user.subscription.cancelAtPeriodEnd = false;
                if (attrs?.ends_at) user.subscription.currentPeriodEnd = new Date(attrs.ends_at);
                break;
            }

            case 'subscription_expired': {
                user.subscription.status = 'expired';
                user.subscription.plan = null;
                user.subscription.cancelAtPeriodEnd = false;
                user.subscription.currentPeriodEnd = null;
                break;
            }

            case 'subscription_payment_success': {
                // Renew the active status on successful payment
                user.subscription.status = 'active';
                if (attrs?.renews_at) user.subscription.currentPeriodEnd = new Date(attrs.renews_at);
                break;
            }

            case 'subscription_payment_failed': {
                user.subscription.status = 'past_due';
                break;
            }

            default:
                console.log(`[LS Webhook] Unhandled event: ${eventName}`);
        }

        await user.save();
        console.log(`[LS Webhook] Updated user ${userId} subscription:`, user.subscription);

        res.json({ received: true });
    } catch (error) {
        console.error('[LS Webhook] Error processing webhook:', error);
        res.status(500).json({ message: 'Webhook processing error' });
    }
};

// ─── Get Subscription Status ────────────────────────────────────────

export const getSubscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            subscription: user.subscription,
            isPremium: user.subscription.status === 'active',
        });
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Cancel Subscription ────────────────────────────────────────────

export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const subId = user.subscription.lemonSqueezySubscriptionId;
        if (!subId) {
            res.status(400).json({ message: 'No active subscription to cancel' });
            return;
        }

        // Cancel at period end (not immediately)
        await lsFetch(`/subscriptions/${subId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                data: {
                    type: 'subscriptions',
                    id: subId,
                    attributes: {
                        cancelled: true,
                    },
                },
            }),
        });

        user.subscription.cancelAtPeriodEnd = true;
        await user.save();

        res.json({
            message: 'Subscription will be cancelled at end of billing period',
            subscription: user.subscription,
        });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ message: 'Failed to cancel subscription' });
    }
};

// ─── Resume Subscription ────────────────────────────────────────────

export const resumeSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const subId = user.subscription.lemonSqueezySubscriptionId;
        if (!subId || !user.subscription.cancelAtPeriodEnd) {
            res.status(400).json({ message: 'No pending cancellation to resume' });
            return;
        }

        await lsFetch(`/subscriptions/${subId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                data: {
                    type: 'subscriptions',
                    id: subId,
                    attributes: {
                        cancelled: false,
                    },
                },
            }),
        });

        user.subscription.cancelAtPeriodEnd = false;
        user.subscription.status = 'active';
        await user.save();

        res.json({
            message: 'Subscription resumed successfully',
            subscription: user.subscription,
        });
    } catch (error) {
        console.error('Error resuming subscription:', error);
        res.status(500).json({ message: 'Failed to resume subscription' });
    }
};

// ─── Customer Portal ────────────────────────────────────────────────

export const getCustomerPortal = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const customerId = user.subscription.lemonSqueezyCustomerId;
        if (!customerId) {
            res.status(400).json({ message: 'No subscription found, cannot generate portal' });
            return;
        }

        const result = await lsFetch(`/customers/${customerId}`);
        const portalUrl = result.data?.attributes?.urls?.customer_portal;

        if (!portalUrl) {
            res.status(500).json({ message: 'Could not retrieve customer portal URL' });
            return;
        }

        res.json({ portalUrl });
    } catch (error) {
        console.error('Error getting customer portal:', error);
        res.status(500).json({ message: 'Failed to get customer portal' });
    }
};
