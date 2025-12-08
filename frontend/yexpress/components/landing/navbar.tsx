"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b bg-background flex items-center px-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop search */}
        <div className="hidden md:flex items-center relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            placeholder="Search…"
            className="pl-9 w-64 bg-muted/50"
          />
        </div>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        <Avatar className="cursor-pointer">
          <AvatarFallback>YZ</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
