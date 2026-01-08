"use client";
import { TrendingUp } from "lucide-react";

const StatsCard = ({
  title,
  value,
  change,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}) => (
  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-foreground">{value}</h4>
      </div>
      <div className="p-3 bg-muted rounded-xl text-muted-foreground">{icon}</div>
    </div>
    <div
      className={`text-sm font-medium flex items-center ${
        trend === "up"
          ? "text-green-600 dark:text-green-300"
          : "text-destructive dark:text-destructive"
      }`}
    >
      <TrendingUp
        className={`w-4 h-4 mr-1 ${trend === "down" ? "rotate-180" : ""}`}
      />
      <span>{change}</span>
      <span className="text-muted-foreground font-normal ml-2">vs last month</span>
    </div>
  </div>
);

export default StatsCard;
