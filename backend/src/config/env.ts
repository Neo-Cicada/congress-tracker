export const validateEnv = () => {
    const required = ['MONGO_URI', 'JWT_SECRET', 'CONGRESS_API_KEY'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`CRITICAL: Missing required environment variables: ${missing.join(', ')}`);
    }
};
