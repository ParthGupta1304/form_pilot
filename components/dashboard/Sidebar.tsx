"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface SidebarProps {
  orgName?: string;
  userName?: string;
  userEmail?: string;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Forms", href: "/dashboard/forms", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ orgName, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  console.log(`[Sidebar] Rendering — path: ${pathname}, collapsed: ${collapsed}`);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 h-screen sticky top-0",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo & Org Switcher */}
        <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <OrganizationSwitcher
                hidePersonal
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    organizationSwitcherTrigger:
                      "w-full justify-start px-0 py-0 text-sm font-semibold text-sidebar-foreground hover:bg-transparent",
                  },
                }}
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <div className={cn(
          "border-t border-sidebar-border px-3 py-2",
          collapsed ? "flex justify-center" : ""
        )}>
          <ThemeToggle compact={collapsed} />
        </div>

        {/* User section at bottom */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <div className="flex items-center gap-2.5">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {userName || "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {userEmail || ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card px-2 py-2" aria-label="Mobile navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <div className="flex flex-col items-center gap-0.5 px-3 py-1.5">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-6 w-6",
              },
            }}
          />
          <span className="text-xs text-muted-foreground">Account</span>
        </div>
      </nav>
    </>
  );
}
