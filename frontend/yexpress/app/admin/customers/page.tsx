"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useUsers } from "@/components/admin/useUsers";
import UserRow from "@/components/admin/UserRow";
import useAuthStore from "@/store/authStore";

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 w-32 bg-slate-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-3 w-48 bg-slate-200 dark:bg-gray-700 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-12 bg-slate-200 dark:bg-gray-700 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-slate-200 dark:bg-gray-700 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-slate-200 dark:bg-gray-700 rounded" />
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
      {/* Search & Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-gray-400" />
          <input
            placeholder="Search users..."
            className="pl-9 pr-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </div>

        <select
          className="border rounded-md px-3 text-sm bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-gray-700 text-xs uppercase text-slate-500 dark:text-gray-300 border-b border-slate-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verified</th>
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
                    onBanToggle={toggleBan}
                  />
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={!hasPrev}
          onClick={prev}
          className="p-2 border rounded border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          disabled={!hasNext}
          onClick={next}
          className="p-2 border rounded border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
