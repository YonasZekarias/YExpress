"use client"

import { User, BadgeCheck,Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef, ChangeEvent } from "react"

interface ProfileCardProps {
  name?: string
  email?: string
  memberSince?: string
  avatarUrl?: string
  onNameChange?: (name: string) => void
  onAvatarChange?: (file: File) => void
}

export function ProfileCard({
  name,
  email,
  memberSince,
  avatarUrl,
  onNameChange,
  onAvatarChange
}: ProfileCardProps) {
  const [profileName, setProfileName] = useState(name)
  const [profileImage, setProfileImage] = useState<string | undefined>(avatarUrl)
  const [isEditingName, setIsEditingName] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
  
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      onAvatarChange?.(file)
    }
  }

  const handleNameClick = () => {
    setIsEditingName(true)
  }

  const handleNameChange = (newName: string) => {
    setProfileName(newName)
    onNameChange?.(newName)
  }

  const handleNameBlur = () => {
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditingName(false)
    } else if (e.key === "Escape") {
      setProfileName(name)
      setIsEditingName(false)
    }
  }

  return (
    <div className="bg-background rounded-xl p-6 border border-border">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar 
            className="w-24 h-24 border-4 border-[#d4a574] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleAvatarClick}
          >
            <AvatarImage src={profileImage || "/profile-avatar.png"} alt={profileName} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <button
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#16a34a] transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <input
                type="text"
                value={profileName}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                className="text-2xl font-bold text-foreground border-b-2 border-[#f48c25] outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <h2
                onClick={handleNameClick}
                className="text-2xl font-bold text-foreground cursor-pointer hover:text-[#f48c25] transition-colors"
              >
                {profileName}
              </h2>
            )}
            <BadgeCheck className="w-6 h-6 text-[#22c55e] fill-[#22c55e]" />
          </div>
          <p className="text-[#f48c25] mt-1">{email}</p>
          <span className="inline-block mt-2 px-3 py-1 border border-[#d5ce07] text-[#d5ce07] text-[7px] font-medium rounded-full">
            MEMBER SINCE {memberSince}
          </span>
        </div>
      </div>
    </div>
  )
}
