"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { AdminSidebar } from "./components/admin-sidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { data: session } = useSession()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user is admin but don't redirect - let middleware handle that
    console.log("Admin layout - Current user email:", session?.user?.email);
    if (session?.user?.email === 'pro.tchisama@gmail.com') {
      setIsAuthorized(true);
    } else if (session) {
      // Only set to false if we have session data and know it's not admin
      console.log("User is not admin, but letting middleware handle redirect");
      setIsAuthorized(false);
    }
  }, [session])

  if (!isAuthorized && session) {
    return <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">You don{"'"}t have admin privileges</p>
    </div>
  }

  if (!session) {
    return <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Loading session...</p>
    </div>
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/admin" className="flex items-center gap-2 md:hidden">
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

            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Back to Dashboard
                </Link>
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
                        <p className="text-sm font-medium leading-none">{session?.user?.name || "Admin"}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{session?.user?.email || "admin@qee.com"}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>Admin Account</span>
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
