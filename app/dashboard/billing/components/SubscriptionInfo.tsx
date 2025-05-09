"use client"

import React, { useState } from "react"
import { CreditCard, Shield, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { useSubscription } from "@/hooks/use-subscription"
import { getSubscriptionStatusClasses, createSubscription } from "@/lib/subscription"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "sonner"
import { useSupabase } from "@/hooks/use-supabase"

export function SubscriptionInfo() {
  const { data: session } = useSession()
  const supabase = useSupabase()
  const [isRenewing, setIsRenewing] = useState(false)
  const {
    subscriptionInfo,
    activeSubscriptions,
    pendingSubscriptions,
    loading
  } = useSubscription()

  // Get the first active and pending subscription for display
  const activeSubscription = activeSubscriptions.length > 0 ? activeSubscriptions[0] : null
  const pendingSubscription = pendingSubscriptions.length > 0 ? pendingSubscriptions[0] : null

  // Function to handle subscription renewal
  const handleRenewSubscription = async () => {
    if (!session?.user?.email) {
      toast.error("You must be logged in to renew your subscription")
      return
    }

    try {
      setIsRenewing(true)

      // First get the user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (userError || !userData) {
        throw new Error(`Error fetching user: ${userError?.message || 'User not found'}`)
      }

      // Get the instance for this user
      const { data: instanceData, error: instanceError } = await supabase
        .from('instances')
        .select('id')
        .eq('owner_id', userData.id)
        .single()

      if (instanceError || !instanceData) {
        throw new Error(`Error fetching instance: ${instanceError?.message || 'Instance not found'}`)
      }

      // Create a new subscription
      const result = await createSubscription({
        instanceId: instanceData.id,
        ownerId: userData.id,
        planId: 'standard', // Standard plan
        durationId: '30',   // 30 days
        supabase
      })

      if (!result.success) {
        throw new Error(result.message || 'Failed to create subscription')
      }

      toast.success("Subscription renewed successfully! Your subscription has been extended by 30 days.")

      // Refresh the page to update subscription info
      window.location.reload()

    } catch (error) {
      console.error('Error renewing subscription:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to renew subscription')
    } finally {
      setIsRenewing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Toaster for notifications */}
      <Toaster position="top-center" />

      {/* Current Subscription */}
      <Card className="overflow-hidden py-0 border-[#3435FF]/10 shadow-md">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#3435FF]/10 to-transparent px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#3435FF] text-white p-1.5 rounded-md">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#3435FF]">Current Subscription</h3>
          </div>

          {/* Renew Subscription Button - Only show when 7 or fewer days remaining */}
          {!loading && subscriptionInfo.isExpiring && (
            <Button
              onClick={handleRenewSubscription}
              disabled={isRenewing}
              size="sm"
              className={cn(
                "bg-gradient-to-r shadow-md hover:shadow-lg transition-all duration-200 text-white font-medium flex items-center gap-1.5 rounded-full px-4",
                subscriptionInfo.urgencyLevel === 'high'
                  ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse"
                  : subscriptionInfo.urgencyLevel === 'medium'
                    ? "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    : "from-[#3435FF] to-[#2526DD] hover:from-[#2526DD] hover:to-[#1a1bcc]"
              )}
            >
              {isRenewing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Renewing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Renew Now • 100 dh
                </>
              )}
            </Button>
          )}
        </div>

        {/* Main content with improved layout */}
        <CardContent className="p-6 space-y-8">
          {/* Subscription Status Card */}
          <div className="flex flex-col md:flex-row items-stretch gap-6">
            {/* Days Remaining Counter */}
            <div className={cn(
              "flex-1 border rounded-xl p-5 flex flex-col items-center justify-center transition-all duration-300",
              getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'bg'),
              getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'border'),
              subscriptionInfo.urgencyLevel === 'high' && "shadow-md shadow-red-100 dark:shadow-red-900/10"
            )}>
              <div className="text-center">
                <div className={cn(
                  "text-6xl font-bold mb-1",
                  getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'text')
                )}>
                  {loading ? "..." :
                    subscriptionInfo.isExpired ? "Expired" : subscriptionInfo.daysRemaining
                  }
                </div>
                <p className={cn(
                  "text-sm font-medium",
                  getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'text').replace('text-', 'text-opacity-80 text-')
                )}>
                  {subscriptionInfo.isExpired ? "Subscription Status" : "Days Remaining"}
                </p>

                {subscriptionInfo.isExpiring && (
                  <div className="mt-3 text-sm flex items-center justify-center gap-1.5 bg-white/50 dark:bg-black/10 py-1.5 px-3 rounded-full">
                    {subscriptionInfo.urgencyLevel === 'high' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={cn("font-medium", getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'text'))}>
                      {subscriptionInfo.daysRemaining <= 1 ? "Expires today!" : `Expires in ${subscriptionInfo.daysRemaining} days`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Details */}
            <div className="flex-[2] bg-white dark:bg-slate-800/50 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 border-b border-slate-100 dark:border-slate-700">
                <h4 className="font-medium text-[#3435FF]">Subscription Details</h4>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plan Information */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Plan</p>
                    <p className="font-medium flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#3435FF]"></span>
                      Standard Plan
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      {loading ? (
                        "Loading..."
                      ) : activeSubscription?.amount ? (
                        `${activeSubscription.amount.toFixed(2)} Dh`
                      ) : (
                        "Not available"
                      )}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "inline-block w-2 h-2 rounded-full",
                        subscriptionInfo.isExpired ? "bg-red-500" : "bg-green-500"
                      )}></span>
                      <p className={cn(
                        "font-medium",
                        subscriptionInfo.isExpired ? "text-red-600" : "text-green-600"
                      )}>
                        {loading ? (
                          "Loading..."
                        ) : subscriptionInfo.isExpired ? (
                          "Expired"
                        ) : subscriptionInfo.status ? (
                          subscriptionInfo.status.charAt(0).toUpperCase() + subscriptionInfo.status.slice(1)
                        ) : (
                          "Not available"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Next Billing Date */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Next Billing Date</p>
                    <p className="font-medium">
                      {loading ? (
                        "Loading..."
                      ) : subscriptionInfo.endDate ? (
                        format(parseISO(subscriptionInfo.endDate), "MMMM d, yyyy")
                      ) : (
                        "Not available"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 border-b border-slate-100 dark:border-slate-700">
              <h4 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#3435FF]" />
                Payment Method
              </h4>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-20 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-sm">
                  VISA
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer with subscription info */}
        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex flex-col items-start gap-4 border-t">
          <div className="flex items-start gap-3 text-sm">
            <Shield className="h-5 w-5 text-[#3435FF] mt-0.5" />
            <div>
              {loading ? (
                "Loading subscription information..."
              ) : subscriptionInfo.endDate ? (
                <>
                  <p className="mb-1">
                    Your subscription will {subscriptionInfo.isExpiring ? "expire" : "automatically renew"} on <span className="font-medium">{format(parseISO(subscriptionInfo.endDate), "MMMM d, yyyy")}</span>.
                  </p>

                  {subscriptionInfo.isExpiring && (
                    <p className={cn(
                      "font-medium",
                      getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'text')
                    )}>
                      {subscriptionInfo.urgencyLevel === 'high' ? "Please renew today!" : `Please renew within ${subscriptionInfo.daysRemaining} days.`}
                    </p>
                  )}

                  {pendingSubscription && (
                    <p className="text-blue-600 dark:text-blue-400 mt-1">
                      A pending subscription is scheduled to start after the current one ends, adding {pendingSubscription.end_date && pendingSubscription.start_date ?
                        Math.max(0, Math.round((parseISO(pendingSubscription.end_date).getTime() - parseISO(pendingSubscription.start_date).getTime()) / (1000 * 60 * 60 * 24))) : 0} more days.
                    </p>
                  )}

                  {!pendingSubscription && !subscriptionInfo.isExpiring && (
                    <p className="text-muted-foreground">
                      You can cancel anytime before the renewal date.
                    </p>
                  )}
                </>
              ) : (
                "Your subscription information is not available."
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
