"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Upload,
  Map,
  BarChart3,
  FileText,
  Bell,
  Database,
  TrendingUp,
  Shield,
  Users,
  Brain,
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Data Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    name: "Pollution Maps",
    href: "/dashboard/maps",
    icon: Map,
    badge: "Live",
  },
  {
    name: "HMPI Analysis",
    href: "/dashboard/analysis",
    icon: BarChart3,
  },
  {
    name: "AI Forecasting",
    href: "/dashboard/forecasting",
    icon: TrendingUp,
    badge: "Beta",
  },
  {
    name: "ML Laboratory",
    href: "/dashboard/ml",
    icon: Brain,
    badge: "New",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
    badge: "3",
  },
]

const adminNavigation = [
  {
    name: "Data Management",
    href: "/dashboard/admin/data",
    icon: Database,
  },
  {
    name: "User Management",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "System Settings",
    href: "/dashboard/admin/settings",
    icon: Shield,
  },
]

export function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const userRole = "admin" // This would come from auth context - set to admin for testing

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Button
                  key={item.name}
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    active && "bg-secondary text-secondary-foreground",
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge variant={item.badge === "Live" ? "default" : "secondary"} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          {userRole === "admin" && (
            <>
              <div className="pt-6">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Administration
                </h3>
                <div className="mt-2 space-y-1">
                  {adminNavigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Button
                        key={item.name}
                        variant={active ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-10",
                          active && "bg-secondary text-secondary-foreground",
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{item.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>HMPI Monitor v2.1</p>
            <p>SIH 2025 Edition</p>
          </div>
        </div>
      </div>
    </div>
  )
}
