"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useUsers } from "@/components/users/useUsers";
import UserRow from "@/components/users/UserRow";
import useAuthStore from "@/store/authStore";
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
        <div className="h-3 w-48 bg-slate-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-12 bg-slate-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </td>
      <td className="px-4 py-3" />
    </tr>
  );
}

export default function UsersTable() {
  const role = useAuthStore((state) => state.user?.role);
  const {
    users,
    loading,
    filters,
    setFilters,
    next,
    prev,
    hasNext,
    hasPrev,
    toggleBan,
  } = useUsers(role);

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            placeholder="Search users..."
            className="pl-9 pr-3 py-2 border rounded-md text-sm"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <select
          className="border rounded-md px-3 text-sm"
          value={filters.role} // IMPORTANT: Keep the UI in sync with state
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : users.map((u) => (
                <UserRow
                  key={u._id}
                  user={u}
                  canBan={role === "admin"}
                  onBanToggle={toggleBan}
                />
              ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={!hasPrev}
          onClick={prev}
          className="p-2 border rounded disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          disabled={!hasNext}
          onClick={next}
          className="p-2 border rounded disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
