import { Router, Request, Response } from 'express';
import { Trade, ITrade } from '../models/Trade';

const router = Router();

const MS_PER_DAY = 1000 * 60 * 60 * 24;

interface ComplianceRecord {
    id: string;
    politicianName: string;
    ticker: string;
    tradeDate: string;
    reportDate: string;
    daysLate: number;
    status: "on-time" | "late" | "violation";
}

/**
 * GET /api/ethics/summary
 * Returns ethics score, risk level, and compliance records.
 */
router.get('/summary', async (req: Request, res: Response) => {
    try {
        // Fetch recent trades (last 12 months, or just last 1000)
        // We need trades that have both transactionDate and filedDate
        const trades = await Trade.find({
            transactionDate: { $exists: true },
            filedDate: { $exists: true }
        })
            .sort({ transactionDate: -1 })
            .limit(2000);

        const complianceRecords: ComplianceRecord[] = [];
        let violationCount = 0;
        let lateCount = 0;

        for (const trade of trades) {
            if (!trade.transactionDate || !trade.filedDate) continue;

            const tDate = new Date(trade.transactionDate);
            const fDate = new Date(trade.filedDate);

            // Calculate difference in days
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

            // Only add to the list if it's late/violation or just recent ones?
            // Let's return only the "problematic" ones for the table to keep payload small?
            // Or return all and let frontend decide?
            // For now, let's return ALL problematic ones, and maybe top 20 recent "good" ones if needed.
            // Actually, the UI shows a "Delay Violation Checker", so it should probably list violations.

            if (status !== 'on-time') {
                complianceRecords.push({
                    id: (trade._id as unknown as string),
                    politicianName: trade.politicianName,
                    ticker: trade.ticker,
                    tradeDate: tDate.toISOString().split('T')[0],
                    reportDate: fDate.toISOString().split('T')[0],
                    daysLate: daysDiff,
                    status
                });
            }
        }

        // Calculate Score (Simple Algorithm)
        // Start at 100. Deduct 5 for violation, 2 for late.
        // Normalize based on trade volume? No, let's keep it absolute for now or per-politician?
        // The dashboard shows a GLOBAL score.
        // Let's say: 100 - (violationCount * 0.5) - (lateCount * 0.1). Min 0.
        // This might plummet if there are many.
        // Let's try: Percentage of clean trades.
        const totalTrades = trades.length;
        const cleanTrades = totalTrades - violationCount - lateCount;
        let score = totalTrades > 0 ? Math.round((cleanTrades / totalTrades) * 100) : 100;

        let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
        if (score < 70) riskLevel = "HIGH";
        else if (score < 85) riskLevel = "MEDIUM";

        // Sort records by days late (descending)
        complianceRecords.sort((a, b) => b.daysLate - a.daysLate);

        res.json({
            score,
            riskLevel,
            totalTrades,
            violationCount,
            lateCount,
            complianceRecords: complianceRecords.slice(0, 100) // Top 100 worst offenders
        });

    } catch (error) {
        console.error('Error fetching ethics summary:', error);
        res.status(500).json({ error: 'Failed to fetch ethics summary' });
    }
});

export default router;
