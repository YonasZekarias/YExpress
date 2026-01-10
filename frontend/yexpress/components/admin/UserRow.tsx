"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { User } from "./useUsers";
import UserInfoDialgo from "../common/userInfoDialgo";
import { banUnbanUser } from "@/services/admin.service";
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UserRow({
  user,
  onBanToggle,
}: {
  user: User;
  onBanToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const ref = useRef<HTMLTableCellElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-gray-600">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {user.username}
        </p>
        <p className="text-xs text-slate-500 dark:text-gray-400">
          {user.email}
        </p>
      </td>

      <td className="px-4 py-3 text-xs text-gray-900 dark:text-gray-100">
        {user.role}
      </td>

      <td className="px-4 py-3">
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            user.isBanned
              ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
              : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
          }`}
        >
          {user.isBanned ? "Banned" : "Active/Not Banned"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            user.verified
              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
          }`}
        >
          {user.verified ? "Verified" : "Not Verified"}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-gray-900 dark:text-gray-100">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-4 py-3 text-right relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded hover:bg-slate-100 dark:hover:bg-gray-700"
        >
          <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-200" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow z-20">
            <button
              onClick={() => {
                setOpen(false);
                setOpenDialog(true);
              }}
              className="w-full px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-gray-700 text-left text-gray-900 dark:text-gray-100"
            >
              View profile
            </button>
            <button
              onClick={() => onBanToggle(user._id)}
              className="w-full px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-gray-700 text-left text-gray-900 dark:text-gray-100"
            >
              {user.isBanned ? "Unban user" : "Ban user"}
            </button>
          </div>
        )}
        <UserInfoDialgo
          userId={user._id}
          open={openDialog}
          onOpenChange={setOpenDialog}
        />
      </td>
    </tr>
  );
}
