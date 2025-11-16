"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import type { Order } from "@/types";

/**
 * SalesChart Component
 * 
 * UPDATED: Uses real order data to display sales trends
 * Supports daily/weekly/monthly views
 * 
 * DESIGN: Clean, minimal, mobile-responsive
 * LIBRARY: Recharts
 */

interface SalesChartProps {
  period: "daily" | "weekly" | "monthly";
  orders: Order[];
}

export default function SalesChart({ period, orders }: SalesChartProps) {
  // Calculate sales data from real orders
  const data = useMemo(() => {
    if (orders.length === 0) {
      return null;
    }

    // Filter out cancelled and refunded orders
    const validOrders = orders.filter(
      (o) => o.status !== "cancelled" && o.status !== "refunded"
    );

    const now = new Date();

    switch (period) {
      case "daily": {
        // Last 7 days
        const dailyData: { name: string; sales: number }[] = [];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);

          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const daySales = validOrders
            .filter((order) => {
              const orderDate = new Date(order.createdAt);
              return orderDate >= date && orderDate < nextDate;
            })
            .reduce((sum, order) => sum + order.total, 0);

          dailyData.push({
            name: days[date.getDay()],
            sales: parseFloat(daySales.toFixed(2)),
          });
        }

        return dailyData;
      }

      case "weekly": {
        // Last 4 weeks
        const weeklyData: { name: string; sales: number }[] = [];

        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (i * 7 + now.getDay()));
          weekStart.setHours(0, 0, 0, 0);

          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);

          const weekSales = validOrders
            .filter((order) => {
              const orderDate = new Date(order.createdAt);
              return orderDate >= weekStart && orderDate < weekEnd;
            })
            .reduce((sum, order) => sum + order.total, 0);

          weeklyData.push({
            name: `Week ${4 - i}`,
            sales: parseFloat(weekSales.toFixed(2)),
          });
        }

        return weeklyData;
      }

      case "monthly": {
        // Last 6 months
        const monthlyData: { name: string; sales: number }[] = [];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

          const monthSales = validOrders
            .filter((order) => {
              const orderDate = new Date(order.createdAt);
              return orderDate >= monthStart && orderDate <= monthEnd;
            })
            .reduce((sum, order) => sum + order.total, 0);

          monthlyData.push({
            name: months[monthStart.getMonth()],
            sales: parseFloat(monthSales.toFixed(2)),
          });
        }

        return monthlyData;
      }
    }
  }, [period, orders]);

  // Empty state when no orders
  if (!data || data.every(d => d.sales === 0)) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: 300 }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            No Sales Data Yet
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Sales trends will appear here once you have orders
          </p>
          <p className="text-xs text-gray-500">
            Chart will display {period} sales data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis
            dataKey="name"
            stroke="#A3A3A3"
            style={{
              fontSize: "12px",
              fontFamily: "IBM Plex Mono, monospace",
            }}
          />
          <YAxis
            stroke="#A3A3A3"
            style={{
              fontSize: "12px",
              fontFamily: "IBM Plex Mono, monospace",
            }}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `$${(value / 1000).toFixed(1)}k`;
              }
              return `$${value}`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: "8px",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Sales"]}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#000000"
            strokeWidth={2}
            dot={{ fill: "#000000", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}