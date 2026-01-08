"use client";

import { Settings } from "lucide-react";
import { useUsers } from "./useUsers";
import UserRow from "./UserRow";

export default function UsersTable() {
  const { users, loading, next, prev, hasNext, hasPrev } = useUsers(undefined);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-slate-400 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Customer Management
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 dark:bg-gray-700 text-xs uppercase text-slate-500 dark:text-gray-300 border-b border-slate-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Verified</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow
                key={u._id}
                user={u}
                onBanToggle={(id: string) => {}}
                canBan={true}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-slate-500 mt-3 dark:text-gray-300">Loading...</p>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={!hasPrev}
          onClick={prev}
          className="px-4 py-2 rounded bg-slate-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={!hasNext}
          onClick={next}
          className="px-4 py-2 rounded bg-indigo-600 text-white dark:bg-indigo-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
