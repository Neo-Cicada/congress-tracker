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
    const now = Date.now();

    // 1. Try to read from localStorage (persistent across reloads)
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem(cacheKey);
            if (stored) {
                const cached: CacheItem = JSON.parse(stored);
                if (now - cached.timestamp < ttl) {
                    return cached.data; // Instant hit!
                } else {
                    // Stale cache, remove it
                    localStorage.removeItem(cacheKey);
                }
            }
        } catch (e) {
            console.warn("Failed to parse or read localStorage cache", e);
        }
    } else {
        // Fallback to memory map for SSR
        const cached = cache.get(cacheKey);
        if (cached && (now - cached.timestamp < ttl)) {
            return JSON.parse(JSON.stringify(cached.data));
        }
    }

    // 2. Fetch fresh data
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 3. Cache the fresh data
    const itemToCache: CacheItem = { data, timestamp: now };

    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
        } catch (e) {
            console.warn("Failed to write to localStorage cache (possibly full)", e);
        }
    } else {
        cache.set(cacheKey, itemToCache);
    }

    return data;
};

export const invalidateCache = (url?: string) => {
    if (url) {
        cache.delete(url);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(url);
        }
    } else {
        cache.clear();
        if (typeof window !== 'undefined') {
            // Only clear our API caches to avoid wiping user preferences
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes('/api/')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
        }
    }
};
