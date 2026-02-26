// /src/lib/api.ts

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Helper to construct full API URLs
 */
export const getApiUrl = (endpoint: string) => {
    // Ensure endpoint doesn't start with a slash if API_URL has one, or add it if needed.
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
    return `${baseUrl}${cleanEndpoint}`;
};
