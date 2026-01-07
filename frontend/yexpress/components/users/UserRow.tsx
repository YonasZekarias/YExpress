"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { User } from "./useUsers";

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
  canBan,
}: {
  user: User;
  onBanToggle: (id: string) => void;
  canBan: boolean;
}) {
  const [open, setOpen] = useState(false);
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
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <p className="font-medium">{user.username}</p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </td>

      <td className="px-4 py-3 text-xs">{user.role}</td>

      <td className="px-4 py-3">
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            user.isBanned
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {user.isBanned ? "Banned" : "Active"}
        </span>
      </td>

      <td className="px-4 py-3 text-xs">
        {formatDate(user.createdAt)}
      </td>

      <td className="px-4 py-3 text-right relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded hover:bg-slate-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-20">
            <button className="w-full px-4 py-2 text-sm hover:bg-slate-50 text-left">
              View profile
            </button>

            {canBan && (
              <button
                onClick={() => onBanToggle(user._id)}
                className="w-full px-4 py-2 text-sm hover:bg-slate-50 text-left"
              >
                {user.isBanned ? "Unban user" : "Ban user"}
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
