"use client"

import { Bell, Moon, Search, Sun } from "lucide-react"
import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    if (pathname.includes("/academy")) return "QEE Academy"
    if (pathname.includes("/settings")) return "Settings"
    if (pathname.includes("/billing")) return "Billing"
    return "Dashboard"
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // Toggle dark class on document
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <div className="flex-1">
        </div>
        {/* <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h1>
        </div> */}

        {/* <div className="relative hidden md:flex w-full max-w-sm items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-full bg-background pl-8 md:w-[240px] lg:w-[320px]"
          />
        </div> */}

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>


          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="text-xs">QE</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-none">QEE Admin</p>
              <p className="text-xs text-muted-foreground">admin@qee.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
