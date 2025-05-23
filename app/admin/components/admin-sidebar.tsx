"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Database, LayoutDashboard, CreditCard, Settings, Server } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const sidebarItems = [
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
    name: "Pools",
    href: "/admin/pools",
    icon: Server,
  },
  {
    name: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-screen w-[280px] flex-col border-r bg-sidebar text-sidebar-foreground sticky top-0 overflow-hidden">
      {/* Header with logo */}
      <div className="relative text-primary-foreground">
        <div className="flex h-16 items-center px-6 py-4 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/qee-nano.png"
              alt="QEE Logo"
              width={300}
              height={200}
              className="h-8 w-fit"
            />
            <span className="text-xl font-bold">Admin</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-6 relative z-10">
        <div className="px-4 pb-4">
          <nav className="grid gap-2">
            {sidebarItems.map((item) => {
              // Special case for dashboard to avoid it being active on all admin pages
              const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "h-11 justify-start px-3 transition-all duration-200",
                    isActive
                      ? "bg-primary/10 dark:text-white text-primary font-medium border-l-4 border-primary rounded-l-none"
                      : "hover:bg-primary/5 hover:text-primary/90"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", isActive ? "text-primary dark:text-white" : "")} />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t p-6 bg-sidebar/80 backdrop-blur-sm relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary">QEE Admin</p>
            <p className="text-xs text-sidebar-foreground/60">
              © {new Date().getFullYear()} QEE Inc.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
