"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/hooks/use-supabase"
import { useEffect, useState } from "react"
import { Users, Database, LayoutDashboard, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const supabase = useSupabase()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstances: 0,
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

      if (!userError && !instanceError && !recentUserError && !recentInstanceError &&
          !totalSubscriptionsError && !activeSubscriptionsError) {
        setStats({
          totalUsers: userCount || 0,
          totalInstances: instanceCount || 0,
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}! You have admin privileges.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <Database className="h-5 w-5 text-muted-foreground" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/instances">
                <Database className="mr-2 h-4 w-4" />
                Manage Instances
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/subscriptions">
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscriptions
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
