// /src/lib/apiCache.ts

interface CacheItem {
    data: any;
    timestamp: number;
}

const cache = new Map<string, CacheItem>();

// Default TTL is 5 minutes (300,000 ms)
const DEFAULT_TTL = 5 * 60 * 1000;

export const fetchWithCache = async (
    url: string | URL,
    options?: RequestInit,
    ttl: number = DEFAULT_TTL
) => {
    const cacheKey = typeof url === 'string' ? url : url.toString();

    // Check if we have a valid cached response
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp < ttl)) {
        // Return a clone of the cached data so mutations don't affect the cache
        return JSON.parse(JSON.stringify(cached.data));
    }

    // Fetch fresh data
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the data
    cache.set(cacheKey, {
        data,
        timestamp: now
    });

    // Return the fresh data
    return data;
};

export const invalidateCache = (url?: string) => {
    if (url) {
        cache.delete(url);
    } else {
        cache.clear();
    }
};
