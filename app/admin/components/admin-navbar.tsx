"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Database, LayoutDashboard, CreditCard } from "lucide-react"

export function AdminNavbar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Instances",
      href: "/admin/instances",
      icon: Database,
    },
    {
      name: "Subscriptions",
      href: "/admin/subscriptions",
      icon: CreditCard,
    },
  ]

  return (
    <div className="container mx-auto flex h-14 items-center">
      <nav className="flex items-center space-x-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary border-b-2 border-transparent py-3",
                isActive
                  ? "text-primary border-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  )
}
