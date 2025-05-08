"use client"

import React from "react"
import { CreditCard, Shield, Clock, AlertTriangle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { useSubscription } from "@/hooks/use-subscription"
import { getSubscriptionStatusClasses } from "@/lib/subscription"

export function SubscriptionInfo() {
  const { data: session } = useSession()
  const {
    subscriptionInfo,
    activeSubscriptions,
    pendingSubscriptions,
    loading
  } = useSubscription()

  // Get the first active and pending subscription for display
  const activeSubscription = activeSubscriptions.length > 0 ? activeSubscriptions[0] : null
  const pendingSubscription = pendingSubscriptions.length > 0 ? pendingSubscriptions[0] : null

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <Card className="overflow-hidden py-0 border-[#3435FF]/10">
        <div className="bg-gradient-to-r from-[#3435FF]/5 to-transparent px-6 py-3 border-b">
          <h3 className="text-lg font-semibold text-[#3435FF]">Current Subscription</h3>
        </div>
        <CardContent className="p-6 py-0 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className={cn(
              "border rounded-lg p-3 flex flex-col items-center",
              getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'bg'),
              getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'border')
            )}>
              <div className={cn(
                "text-2xl font-bold",
                getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'text')
              )}>
                {loading ? "..." :
                  subscriptionInfo.isExpired ? "Expired" : subscriptionInfo.daysRemaining
                }
              </div>
              <p className={cn(
                "text-xs",
                getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'text').replace('text-', 'text-opacity-70 text-')
              )}>
                {subscriptionInfo.isExpired ? "Subscription Status" : "Total Days Remaining"}
              </p>


              {subscriptionInfo.isExpiring && (
                <div className="mt-2 text-xs flex items-center gap-1">
                  {subscriptionInfo.urgencyLevel === 'high' ? (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                  )}
                  <span className={getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'text')}>
                    {subscriptionInfo.daysRemaining <= 1 ? "Expires today!" : `Expires in ${subscriptionInfo.daysRemaining} days`}
                  </span>
                </div>
              )}

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#3435FF]" />
                Payment Method
              </h4>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm">
                <div className="flex h-10 w-16 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-xs">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#3435FF]" />
                Billing Information
              </h4>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm space-y-2">
                <p className="text-sm flex justify-between">
                  <span className="text-muted-foreground">Next billing date:</span>
                  <span className="font-medium">
                    {loading ? (
                      "Loading..."
                    ) : subscriptionInfo.endDate ? (
                      format(parseISO(subscriptionInfo.endDate), "MMMM d, yyyy")
                    ) : (
                      "Not available"
                    )}
                  </span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="text-muted-foreground">Subscription status:</span>
                  <span className={cn(
                    "font-medium",
                    subscriptionInfo.isExpired ? "text-red-600" : ""
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
                  </span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="text-muted-foreground">Subscription amount:</span>
                  <span className="font-medium">
                    {loading ? (
                      "Loading..."
                    ) : activeSubscription?.amount ? (
                      `${activeSubscription.amount.toFixed(2)} Dh`
                    ) : (
                      "Not available"
                    )}
                  </span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="text-muted-foreground">Billing email:</span>
                  <span className="font-medium">{session?.user?.email || "Not available"}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex flex-col items-start border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-[#3435FF]" />
            <p>
              {loading ? (
                "Loading subscription information..."
              ) : subscriptionInfo.endDate ? (
                <>
                  Your subscription will {subscriptionInfo.isExpiring ? "expire" : "automatically renew"} on {format(parseISO(subscriptionInfo.endDate), "MMMM d, yyyy")}.
                  {subscriptionInfo.isExpiring && (
                    <span className={cn(
                      "ml-1 font-medium",
                      getSubscriptionStatusClasses(subscriptionInfo.urgencyLevel, 'text')
                    )}>
                      {subscriptionInfo.urgencyLevel === 'high' ? "Please renew today!" : `Please renew within ${subscriptionInfo.daysRemaining} days.`}
                    </span>
                  )}
                  {pendingSubscription && (
                    <> A pending subscription is scheduled to start after the current one ends, adding {pendingSubscription.end_date && pendingSubscription.start_date ?
                      Math.max(0, Math.round((parseISO(pendingSubscription.end_date).getTime() - parseISO(pendingSubscription.start_date).getTime()) / (1000 * 60 * 60 * 24))) : 0} more days.</>
                  )}
                  {!pendingSubscription && !subscriptionInfo.isExpiring && " You can cancel anytime before the renewal date."}
                </>
              ) : (
                "Your subscription information is not available."
              )}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
