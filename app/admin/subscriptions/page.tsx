"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, differenceInDays } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateSubscriptionDialog } from "./components/CreateSubscriptionDialog"
import { SubscriptionActions } from "./components/SubscriptionActions"
import { Toaster } from "sonner"

interface Subscription {
  id: number
  instance_id: number
  owner_id: number
  plan_name: string
  amount: number
  status: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  instance?: {
    name: string
  }
  owner?: {
    name: string
    email: string
    img_url: string
  }
}

export default function SubscriptionsPage() {
  const supabase = useSupabase()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])

  const fetchSubscriptions = async () => {
    setLoading(true)

    // Get subscriptions with instance and owner information
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        instance:instances(name),
        owner:users(name, email, img_url)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscriptions:', error)
    } else {
      setSubscriptions(data || [])
      setFilteredSubscriptions(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [supabase])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubscriptions(subscriptions)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = subscriptions.filter(
        sub =>
          (sub.owner?.name && sub.owner.name.toLowerCase().includes(query)) ||
          (sub.owner?.email && sub.owner.email.toLowerCase().includes(query)) ||
          (sub.instance?.name && sub.instance.name.toLowerCase().includes(query)) ||
          (sub.plan_name && sub.plan_name.toLowerCase().includes(query)) ||
          (sub.status && sub.status.toLowerCase().includes(query))
      )
      setFilteredSubscriptions(filtered)
    }
  }, [searchQuery, subscriptions])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDaysRemaining = (endDate: string) => {
    if (!endDate) return null

    // Calculate days from now to end date
    const end = parseISO(endDate)
    const now = new Date()
    const days = differenceInDays(end, now)

    if (days < 0) return <span className="text-destructive">Expired</span>
    if (days === 0) return <span className="text-orange-500">Today</span>
    return <span className="text-green-500">{days} days</span>
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage and view all subscriptions in the system.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>
              A list of all subscriptions in the application.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CreateSubscriptionDialog onSubscriptionCreated={fetchSubscriptions} />
            <Button
              variant="outline"
              size="icon"
              onClick={fetchSubscriptions}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <p>Loading subscriptions...</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-2">
                {filteredSubscriptions.length} {filteredSubscriptions.length === 1 ? 'subscription' : 'subscriptions'} found
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Instance</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={subscription.owner?.img_url || ""} alt={subscription.owner?.name || "User"} />
                          <AvatarFallback className="text-xs">
                            {subscription.owner?.name
                              ? subscription.owner.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{subscription.owner?.name || "Unnamed User"}</span>
                          <span className="text-xs text-muted-foreground">{subscription.owner?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{subscription.instance?.name || `Instance #${subscription.instance_id}`}</TableCell>
                      <TableCell className="capitalize">{subscription.plan_name}</TableCell>
                      <TableCell>{subscription.amount?.toFixed(2)} dh</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        {subscription.start_date ? (
                          <span>{format(parseISO(subscription.start_date), "MMM d, yyyy")}</span>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {subscription.end_date
                          ? format(parseISO(subscription.end_date), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {subscription.end_date ?
                          getDaysRemaining(
                            subscription.end_date,
                          ) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <SubscriptionActions
                          subscription={subscription}
                          onActionComplete={fetchSubscriptions}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSubscriptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6">
                        No subscriptions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
