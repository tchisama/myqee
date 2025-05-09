"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/hooks/use-supabase"
import { useEffect, useState } from "react"
import { Users, Database, LayoutDashboard, Clock, CreditCard, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const supabase = useSupabase()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstances: 0,
    totalPools: 0,
    recentUsers: 0,
    recentInstances: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0
  })
  const [loading, setLoading] = useState(true)

  // Log when admin dashboard is rendered
  useEffect(() => {
    console.log("Admin dashboard rendered - User email:", session?.user?.email);
  }, [session?.user?.email])

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)

      // Fetch total users
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Fetch total instances
      const { count: instanceCount, error: instanceError } = await supabase
        .from('instances')
        .select('*', { count: 'exact', head: true })

      // Fetch recent users (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: recentUserCount, error: recentUserError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Fetch recent instances (last 30 days)
      const { count: recentInstanceCount, error: recentInstanceError } = await supabase
        .from('instances')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Fetch total subscriptions
      const { count: totalSubscriptionsCount, error: totalSubscriptionsError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })

      // Fetch active subscriptions
      const { count: activeSubscriptionsCount, error: activeSubscriptionsError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Fetch total pools
      const { count: totalPoolsCount, error: totalPoolsError } = await supabase
        .from('pools')
        .select('*', { count: 'exact', head: true })

      if (!userError && !instanceError && !recentUserError && !recentInstanceError &&
          !totalSubscriptionsError && !activeSubscriptionsError && !totalPoolsError) {
        setStats({
          totalUsers: userCount || 0,
          totalInstances: instanceCount || 0,
          totalPools: totalPoolsCount || 0,
          recentUsers: recentUserCount || 0,
          recentInstances: recentInstanceCount || 0,
          totalSubscriptions: totalSubscriptionsCount || 0,
          activeSubscriptions: activeSubscriptionsCount || 0
        })
      }

      setLoading(false)
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-medium">{session?.user?.name}</span>! You have admin privileges.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered users in the system
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/users">View All Users</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Database className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : stats.totalInstances}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active instances created
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/instances">View All Instances</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Odoo Pools</CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Server className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : stats.totalPools}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active Odoo server pools
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/pools">Manage Pools</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active subscriptions
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/subscriptions">View All Subscriptions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : stats.recentUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              New users in the last 30 days
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/users">View Recent Activity</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" className="justify-start h-10 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" asChild>
              <Link href="/admin/users">
                <div className="h-7 w-7 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                </div>
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-10 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors" asChild>
              <Link href="/admin/instances">
                <div className="h-7 w-7 rounded-md bg-emerald-100 flex items-center justify-center mr-3">
                  <Database className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                Manage Instances
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-10 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors" asChild>
              <Link href="/admin/pools">
                <div className="h-7 w-7 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                  <Server className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                Manage Pools
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-10 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors" asChild>
              <Link href="/admin/subscriptions">
                <div className="h-7 w-7 rounded-md bg-purple-100 flex items-center justify-center mr-3">
                  <CreditCard className="h-3.5 w-3.5 text-purple-600" />
                </div>
                Manage Subscriptions
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-10 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-200 transition-colors" asChild>
              <Link href="/dashboard">
                <div className="h-7 w-7 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                  <LayoutDashboard className="h-3.5 w-3.5 text-gray-600" />
                </div>
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
