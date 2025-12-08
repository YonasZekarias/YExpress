"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Users,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react";

const nav = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: Users,
    children: [
      { name: "All Users", path: "/dashboard/users" },
      { name: "Invites", path: "/dashboard/users/invites" },
    ],
  },
  { name: "Reports", path: "/dashboard/reports", icon: FileText },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <aside
      className={`border-r bg-background h-screen sticky top-0 transition-all duration-200
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <span className="font-semibold text-lg">Admin Panel</span>}

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-muted transition"
          aria-label="Toggle sidebar"
        >
          <ChevronRight
            size={18}
            className={`${collapsed ? "-rotate-180" : ""} transition-transform`}
          />
        </button>
      </div>

      {/* Nav List */}
      <nav className="p-3">
        <ul className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const activeParent = isActive(item.path);

            return (
              <li key={item.path}>
                {/* Main nav link */}
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                    ${
                      activeParent
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>

                {/* Children */}
                {!collapsed && item.children && activeParent && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <Link
                          href={child.path}
                          className={`block px-3 py-1.5 rounded-md text-sm transition
                          ${
                            pathname === child.path
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
