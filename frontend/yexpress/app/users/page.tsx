"use client";

import OverviewTab from "@/components/users/overviewTab";
import { mockUser } from "@/data/mockUser";
export default function UserDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Welcome back, {mockUser.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Here's what's happening with your account today.
        </p>
      </div>
      <OverviewTab />
    </div>
  );
}
