"use client"

import { useState } from "react"
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
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: "Data Upload",
    href: "/dashboard/upload",
    icon: Upload,
    current: false,
  },
  {
    name: "Pollution Maps",
    href: "/dashboard/maps",
    icon: Map,
    current: false,
    badge: "Live",
  },
  {
    name: "HMPI Analysis",
    href: "/dashboard/analysis",
    icon: BarChart3,
    current: false,
  },
  {
    name: "AI Forecasting",
    href: "/dashboard/forecasting",
    icon: TrendingUp,
    current: false,
    badge: "Beta",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    current: true,
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
    current: false,
    badge: "3",
  },
]

const adminNavigation = [
  {
    name: "Data Management",
    href: "/dashboard/admin/data",
    icon: Database,
    current: false,
  },
  {
    name: "User Management",
    href: "/dashboard/admin/users",
    icon: Users,
    current: false,
  },
  {
    name: "System Settings",
    href: "/dashboard/admin/settings",
    icon: Shield,
    current: false,
  },
]

export function DashboardSidebar() {
  const [currentPath, setCurrentPath] = useState("/dashboard/reports")
  const userRole = "researcher" // This would come from auth context

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  item.current && "bg-secondary text-secondary-foreground",
                )}
                onClick={() => setCurrentPath(item.href)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <Badge variant={item.badge === "Live" ? "default" : "secondary"} className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {userRole === "admin" && (
            <>
              <div className="pt-6">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Administration
                </h3>
                <div className="mt-2 space-y-1">
                  {adminNavigation.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-10"
                      onClick={() => setCurrentPath(item.href)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.name}</span>
                    </Button>
                  ))}
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
