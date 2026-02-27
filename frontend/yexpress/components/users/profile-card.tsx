"use client"

import { BadgeCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileCardProps {
  firstName?: string
  lastName?: string
  email?: string
  memberSince?: string
}

export function ProfileCard({
  firstName = "",
  lastName = "",
  email,
  memberSince,
}: ProfileCardProps) {
  
  // Calculate initials
  const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="bg-white dark:bg-slate-850 rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-[#d4a574]">
            {/* No src, so it falls back immediately */}
            <AvatarImage src="" alt={fullName} />
            <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl font-bold">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground truncate">
              {fullName || "User"}
            </h2>
            <BadgeCheck className="w-5 h-5 text-[#22c55e] fill-[#22c55e] shrink-0" />
          </div>
          <p className="text-[#f48c25] mt-1 text-sm truncate" title={email}>{email}</p>
          <span className="inline-block mt-2 px-3 py-1 border border-[#d5ce07] text-[#d5ce07] text-[10px] font-bold rounded-full tracking-wider">
            MEMBER SINCE {memberSince}
          </span>
        </div>
      </div>
    </div>
  )
}