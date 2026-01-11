"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import LogoutAlert from "../common/logoutAlert";
import UserInfoDialog from "./userInfoDialgo";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
interface ProfileDropdownProps {
  avatar: string;
  username?: string;
  email?: string;
  phone?: string | null;
  role?: string | null;
  createdAt?: string;
}

const ProfileDropdown = ({
  avatar,
  username,
  email,
  phone,
  role,
  createdAt,
}: ProfileDropdownProps) => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger asChild>
        <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center cursor-pointer">
          <img src={avatar} alt="Profile" className="w-7 h-7 rounded-full" />
        </div>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent align="end" className="w-64 p-0">
        {/* User Info */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <img src={avatar} alt="Profile" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold text-slate-550">
                {username || "User"}
              </p>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            {role && (
              <p className="text-xs text-slate-400">Role: {role}</p>
            )}
            {phone && (
              <p className="text-xs text-slate-400">Phone: {phone}</p>
            )}
            <p className="text-xs text-slate-400">
              Member since: {memberSince}
            </p>
          </div>
        </div>

        <DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer">
          View Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <div className="px-2 py-1">
          <LogoutAlert />
        </div>
      </DropdownMenuContent>
      <UserInfoDialog open={open} userId={user} onOpenChange={setOpen} />
    </DropdownMenu>
  );
};

export default ProfileDropdown;
