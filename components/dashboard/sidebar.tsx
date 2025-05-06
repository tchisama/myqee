"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, CreditCard, Layers, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const sidebarItems = [
  {
    title: "QEE Academy",
    href: "/dashboard/academy",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[280px] flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight">QEE</span>
        </Link>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto py-6">
        <div className="px-4 pb-4">
          <h3 className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Main
          </h3>
          <nav className="grid gap-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "h-10 justify-start px-2",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="border-t p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">QEE Dashboard</p>
            <p className="text-xs text-sidebar-foreground/60">
              © {new Date().getFullYear()} QEE Inc.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
