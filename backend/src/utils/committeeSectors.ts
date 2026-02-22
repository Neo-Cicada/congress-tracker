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

// Mock assignment list to give some random people committees to work with since we don't have this API
export const mockPoliticianCommittees: Record<string, string[]> = {
    "Nancy Pelosi": ["Ways and Means", "Intelligence"],
    "Ro Khanna": ["Armed Services", "Agriculture, Nutrition, and Forestry"],
    "Tommy Tuberville": ["Armed Services", "Health, Education, Labor, and Pensions", "Agriculture, Nutrition, and Forestry"],
    "Dan Crenshaw": ["Energy and Commerce", "Intelligence"],
    "Josh Gottheimer": ["Financial Services", "Intelligence"],
    "Sheldon Whitehouse": ["Environment and Public Works", "Finance", "Budget"],
    "Rick Scott": ["Armed Services", "Commerce, Science, and Transportation", "Homeland Security"],
    "Michael McCaul": ["Foreign Affairs", "Homeland Security"]
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

/**
 * Randomly assigns committees to a politician if they aren't in the hardcoded list.
 */
export const assignMockCommittees = (politicianName: string): string[] => {
    if (mockPoliticianCommittees[politicianName]) {
        return mockPoliticianCommittees[politicianName];
    }

    // Random assignment for demo so we have data
    const allCommittees = Object.keys(committeeSectorMap);
    const numCommittees = Math.floor(Math.random() * 3) + 1; // 1 to 3 committees
    const assigned = new Set<string>();

    while (assigned.size < numCommittees) {
        const randomIdx = Math.floor(Math.random() * allCommittees.length);
        assigned.add(allCommittees[randomIdx]);
    }

    return Array.from(assigned);
};
