export const validateEnv = () => {
    const required = ['MONGO_URI', 'JWT_SECRET', 'CONGRESS_API_KEY'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`CRITICAL: Missing required environment variables: ${missing.join(', ')}`);
    }

    // Lemon Squeezy vars — warn if missing (subscriptions won't work but app still runs)
    const lsVars = [
        'LEMONSQUEEZY_API_KEY',
        'LEMONSQUEEZY_STORE_ID',
        'LEMONSQUEEZY_WEBHOOK_SECRET',
        'LEMONSQUEEZY_VARIANT_WEEKLY',
        'LEMONSQUEEZY_VARIANT_MONTHLY',
        'LEMONSQUEEZY_VARIANT_YEARLY',
    ];
    const missingLs = lsVars.filter(key => !process.env[key]);
    if (missingLs.length > 0) {
        console.warn(`⚠️  Missing Lemon Squeezy env vars (subscriptions disabled): ${missingLs.join(', ')}`);
    }
};
