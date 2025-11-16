"use client";

/**
 * StatsCard Component
 * 
 * Displays a single metric with trend indicator
 * Used in admin dashboard for KPIs
 * 
 * DESIGN: Minimal, clean, mobile-optimized
 */

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon?: React.ComponentType<{ className?: string }>;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon
}: StatsCardProps) {
  const isPositive = changeType === "increase";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header with Icon */}
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
        )}

        {/* Trend Badge */}
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${isPositive
              ? "text-green-700 bg-green-50"
              : "text-red-700 bg-red-50"
            }`}
        >
          {isPositive ? "+" : ""}{change}%
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 mb-1">
        {title}
      </h3>

      {/* Value */}
      <p className="text-2xl font-bold text-gray-900">
        {value}
      </p>

      {/* Comparison Text */}
      <p className="text-xs text-gray-500 mt-2">
        vs last period
      </p>
    </div>
  );
}