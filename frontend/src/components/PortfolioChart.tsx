"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  date: string;
  portfolio: number;
  sp500: number;
}

// Mock data generator for the chart
const generateChartData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let portVal = 100;
  let spVal = 100;

  for (let i = 0; i < 12; i++) {
    // Random fluctuation
    portVal = portVal * (1 + (Math.random() * 0.1 - 0.02)); // bias upwards
    spVal = spVal * (1 + (Math.random() * 0.05 - 0.01));

    data.push({
      date: months[i],
      portfolio: parseFloat(portVal.toFixed(2)),
      sp500: parseFloat(spVal.toFixed(2)),
    });
  }
  return data;
};

const DATA = generateChartData();

export const PortfolioChart = () => {
  return (
    <div className="w-full h-[400px] bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 rounded-[2rem] p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            Performance Alpha
          </h3>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
            Portfolio vs S&P 500 (YTD)
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400">
            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
            Portfolio
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500">
            <span className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-600"></span>
            S&P 500
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={DATA}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            vertical={false}
            opacity={0.2}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 10 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 10 }}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b", // zinc-900
              borderColor: "#27272a", // zinc-800
              borderRadius: "1rem",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="portfolio"
            stroke="#06b6d4" // cyan-500
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#06b6d4", strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="sp500"
            stroke="#71717a" // zinc-500
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
