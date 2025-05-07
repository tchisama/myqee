"use client"

import { LogOut, Moon, Sun, ChevronDown, User } from "lucide-react"
import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function Header() {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { data: session } = useSession()

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
        {/* <div className="flex-1">
        </div> */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h1>
        </div>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                  <AvatarFallback className="text-xs">
                    {session?.user?.name
                      ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                      : "QE"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name || "QEE Admin"}</p>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">{session?.user?.email || "admin@qee.com"}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>My Account</span>
                <span className="text-xs font-normal text-muted-foreground mt-1">{session?.user?.email || "admin@qee.com"}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
