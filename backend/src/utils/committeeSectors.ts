// Define the mapping of Committees to potentially conflicting Sectors
export const committeeSectorMap: Record<string, string[]> = {
    "Armed Services": ["Industrials", "Technology"], // Defense is usually in Industrials or Tech
    "Energy and Natural Resources": ["Energy", "Utilities", "Basic Materials"],
    "Banking, Housing, and Urban Affairs": ["Financial Services", "Real Estate"],
    "Finance": ["Financial Services"],
    "Health, Education, Labor, and Pensions": ["Healthcare"],
    "Environment and Public Works": ["Energy", "Utilities", "Basic Materials"],
    "Commerce, Science, and Transportation": ["Technology", "Communication Services", "Consumer Cyclical", "Industrials"],
    "Agriculture, Nutrition, and Forestry": ["Consumer Defensive", "Basic Materials"],
    "Intelligence": ["Technology", "Industrials"],
    "Ways and Means": ["Financial Services", "Healthcare", "Energy"],
    "Financial Services": ["Financial Services", "Real Estate"],
    "Energy and Commerce": ["Energy", "Healthcare", "Technology", "Communication Services"],
    "Homeland Security": ["Industrials", "Technology"],
    "Foreign Affairs": ["Industrials", "Energy"]
};

/**
 * Returns a list of conflicting sectors for given committees.
 */
export const getConflictingSectors = (committees: string[]): string[] => {
    const sectors = new Set<string>();
    for (const committee of committees) {
        const conflicting = committeeSectorMap[committee] || [];
        conflicting.forEach(s => sectors.add(s));
    }
    return Array.from(sectors);
};

