import { Router, Request, Response } from 'express';
import { Trade, ITrade } from '../models/Trade';
import { Politician } from '../models/Politician';
import { getConflictingSectors } from '../utils/committeeSectors';
import { checkSuspiciousTiming } from '../utils/marketEvents';
import { protect } from '../middleware/authMiddleware';
import { requireSubscription } from '../middleware/subscriptionMiddleware';

import YahooFinance from 'yahoo-finance2';

const router = Router();
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Cache for SPY YTD return (could extract to shared util, but inline for now to avoid refactor scope)
let cachedSpyYtd: number | null = null;
let lastSpyUpdate: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const getSpyYtdReturn = async (): Promise<number> => {
    const currentYear = new Date().getFullYear();
    const now = Date.now();

    if (cachedSpyYtd !== null && (now - lastSpyUpdate) < CACHE_DURATION) {
        return cachedSpyYtd;
    }

    try {
        const startOfYear = new Date(`${currentYear}-01-01`);
        const queryOptions = {
            period1: startOfYear,
            period2: new Date(),
            interval: '1d' as const
        };
        const history = await yahooFinance.historical('SPY', queryOptions) as any[];

        if (history && history.length > 0) {
            const startPrice = history[0].close;
            const quote = await yahooFinance.quote('SPY') as any;
            const currentPrice = quote.regularMarketPrice;
            const ytd = ((currentPrice - startPrice) / startPrice) * 100;
            cachedSpyYtd = parseFloat(ytd.toFixed(2));
            lastSpyUpdate = now;
            return cachedSpyYtd;
        }
    } catch (error) {
        console.error('Error fetching SPY YTD in ethics:', error);
    }
    return cachedSpyYtd || 0;
};

interface ComplianceRecord {
    id: string;
    politicianName: string;
    ticker: string;
    tradeDate: string;
    reportDate: string;
    daysLate: number;
    status: "on-time" | "late" | "violation";
}

export interface SuspiciousTrade {
    id: string;
    politicianName: string;
    ticker: string;
    type: "Buy" | "Sell";
    date: string;
    event: string;
    daysDiff: number;
}

export interface EthicsConflict {
    id: string;
    politicianName: string;
    committee: string;
    ticker: string;
    sector: string;
    date: string;
    severity: "high" | "medium" | "low";
}

/**
 * GET /api/ethics/summary
 * Returns ethics score, risk level, and compliance records.
 */
router.get('/summary', protect, requireSubscription, async (req: Request, res: Response) => {
    try {
        const trades = await Trade.find({
            transactionDate: { $exists: true },
            filedDate: { $exists: true }
        })
            .sort({ transactionDate: -1 })
            .limit(2000)
            .lean();

        const politicians = await Politician.find({}).lean();
        const politicianMap = new Map(politicians.map(p => [p._id?.toString(), p]));

        const complianceRecords: ComplianceRecord[] = [];
        const conflicts: EthicsConflict[] = [];
        const suspiciousTrades: SuspiciousTrade[] = [];
        let violationCount = 0;
        let lateCount = 0;

        // For Sector Focus
        const sectorCounts: Record<string, number> = {};

        for (const trade of trades) {
            if (!trade.transactionDate || !trade.filedDate) continue;

            if (trade.sector && trade.sector !== 'Unknown') {
                sectorCounts[trade.sector] = (sectorCounts[trade.sector] || 0) + 1;
            }

            const tDate = new Date(trade.transactionDate);
            const fDate = new Date(trade.filedDate);

            // Calculate difference in days for delay checking
            const diffTime = fDate.getTime() - tDate.getTime();
            const daysDiff = Math.ceil(diffTime / MS_PER_DAY);

            let status: "on-time" | "late" | "violation" = "on-time";

            if (daysDiff > 45) {
                status = "violation";
                violationCount++;
            } else if (daysDiff > 30) {
                status = "late";
                lateCount++;
            }

            // --- 1. Conflict of Interest Check ---
            if (trade.politicianId && trade.sector) {
                const politician = politicianMap.get(trade.politicianId.toString());
                if (politician && politician.committees && politician.committees.length > 0) {
                    for (const committee of politician.committees) {
                        const conflictingSectors = getConflictingSectors([committee]);
                        if (conflictingSectors.includes(trade.sector)) {
                            let dateStr = "Recently";
                            if (daysDiff >= 0) {
                                const daysAgo = Math.ceil((new Date().getTime() - tDate.getTime()) / MS_PER_DAY);
                                if (daysAgo === 0) dateStr = "Today";
                                else if (daysAgo === 1) dateStr = "Yesterday";
                                else if (daysAgo < 7) dateStr = `${daysAgo} days ago`;
                                else if (daysAgo < 30) dateStr = `${Math.floor(daysAgo / 7)} wks ago`;
                                else dateStr = `${Math.floor(daysAgo / 30)} mos ago`;
                            }

                            conflicts.push({
                                id: trade._id ? trade._id.toString() : Math.random().toString(),
                                politicianName: trade.politicianName,
                                committee: committee,
                                ticker: trade.ticker,
                                sector: trade.sector,
                                date: dateStr,
                                severity: trade.transactionType === "Buy" ? "high" : "medium"
                            });
                            break;
                        }
                    }
                }
            }

            // --- 2. Suspicious Timing Check ---
            const timingCheck = checkSuspiciousTiming(tDate, trade.ticker, trade.sector, 14); // 14 day window
            if (timingCheck) {
                suspiciousTrades.push({
                    id: trade._id ? trade._id.toString() : Math.random().toString(),
                    politicianName: trade.politicianName,
                    ticker: trade.ticker,
                    type: trade.transactionType as "Buy" | "Sell",
                    date: tDate.toISOString().split('T')[0],
                    event: timingCheck.event.name,
                    daysDiff: timingCheck.daysDiff
                });
            }

            // --- 3. Delay Violation Records ---
            if (status !== 'on-time') {
                complianceRecords.push({
                    id: trade._id ? trade._id.toString() : Math.random().toString(),
                    politicianName: trade.politicianName,
                    ticker: trade.ticker,
                    tradeDate: tDate.toISOString().split('T')[0],
                    reportDate: fDate.toISOString().split('T')[0],
                    daysLate: daysDiff,
                    status
                });
            }
        }

        // Calculate Score
        const totalTrades = trades.length;
        const cleanTrades = totalTrades - violationCount - lateCount;
        let score = totalTrades > 0 ? Math.round((cleanTrades / totalTrades) * 100) : 100;

        // Optionally deduct more for suspicious timing and conflicts if we want
        score -= (conflicts.length * 2) + (suspiciousTrades.length * 2);
        if (score < 0) score = 0;

        let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
        if (score < 70) riskLevel = "HIGH";
        else if (score < 85) riskLevel = "MEDIUM";

        // Sort records
        complianceRecords.sort((a, b) => b.daysLate - a.daysLate);
        suspiciousTrades.sort((a, b) => Math.abs(a.daysDiff) - Math.abs(b.daysDiff)); // Sort by closest to event

        // --- Calculate Behavior Stats ---

        // 1. Sector Focus
        let topSector = 'Diversified';
        let topSectorTradeCount = 0;
        for (const [sector, count] of Object.entries(sectorCounts)) {
            if (count > topSectorTradeCount) {
                topSector = sector;
                topSectorTradeCount = count;
            }
        }

        // 2. Unusual Win Rate (Win Rate = % of politicians with > 0% YTD)
        // vs Market (Average Politician YTD - SPY YTD)
        let positiveReturnCount = 0;
        let totalReturn = 0;
        let validReturnPoliticians = 0;

        for (const p of politicians) {
            if (p.stats && typeof p.stats.ytdReturn === 'number') {
                validReturnPoliticians++;
                totalReturn += p.stats.ytdReturn;
                if (p.stats.ytdReturn > 0) {
                    positiveReturnCount++;
                }
            }
        }

        const winRate = validReturnPoliticians > 0
            ? Math.round((positiveReturnCount / validReturnPoliticians) * 100)
            : 0;

        const avgPoliticianYtd = validReturnPoliticians > 0
            ? totalReturn / validReturnPoliticians
            : 0;

        const spyYtd = await getSpyYtdReturn();
        const winRateVsMarket = parseFloat((avgPoliticianYtd - spyYtd).toFixed(2));

        // 3. Lucky Timing Score
        // Base 50. Add points for high ratio of suspicious trades or conflicts relative to total trades.
        let luckyTimingScore = 50;
        if (totalTrades > 0) {
            const suspiciousRatio = suspiciousTrades.length / totalTrades;
            const conflictRatio = conflicts.length / totalTrades;
            luckyTimingScore += (suspiciousRatio * 500) + (conflictRatio * 300); // arbitrary weights for demo
        }
        luckyTimingScore = Math.min(Math.round(luckyTimingScore), 100);

        const behavior = {
            winRate,
            winRateVsMarket,
            topSector,
            topSectorTradeCount,
            luckyTimingScore
        };

        res.json({
            score,
            riskLevel,
            totalTrades,
            violationCount,
            lateCount,
            behavior,
            complianceRecords: complianceRecords.slice(0, 100),
            conflicts: conflicts.slice(0, 50),
            suspiciousTrades: suspiciousTrades.slice(0, 50)
        });

    } catch (error) {
        console.error('Error fetching ethics summary:', error);
        res.status(500).json({ error: 'Failed to fetch ethics summary' });
    }
});

export default router;
