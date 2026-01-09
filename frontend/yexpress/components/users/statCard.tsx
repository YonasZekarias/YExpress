import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <div
    className="group relative rounded-2xl border
      bg-white dark:bg-slate-900
      border-slate-200 dark:border-slate-700
      p-6 shadow-sm transition-all duration-300
      hover:shadow-lg hover:-translate-y-1"
  >
    {/* Subtle accent glow */}
    <div
      className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
    <div className="relative flex items-center space-x-4">
      {/* Icon */}
      <div
        className={`p-4 rounded-xl ${color} ring-1 ring-black/5 dark:ring-white/10 shadow-inner`}>
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h4 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </h4>
      </div>
    </div>
  </div>
);

export default StatCard;
