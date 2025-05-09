"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle,  ArrowRight } from "lucide-react"
import Image from "next/image"
import { useSubscription } from "@/hooks/use-subscription"
import { useUpdateSubscription } from "@/hooks/use-update-subscription"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function SubscriptionExpiredContent() {
  const router = useRouter()
  const { subscriptionInfo, activeSubscriptions, loading } = useSubscription()
  const { updateSubscriptionStatus, loading: updateLoading } = useUpdateSubscription({
    onSuccess: () => {
      toast.success("Subscription status updated to expired")
    },
    onError: (error) => {
      toast.error(`Failed to update subscription: ${error.message}`)
    }
  })
  const [showPage, ] = useState(true)
  const [statusUpdated, setStatusUpdated] = useState(false)

  // Check if we should show this page
  useEffect(() => {
    // Only redirect if we have subscription info and it's not expired
    if (!loading) {
      console.log('Subscription check in expired page:', {
        daysRemaining: subscriptionInfo.daysRemaining,
        status: subscriptionInfo.status,
        isExpired: subscriptionInfo.isExpired,
        endDate: subscriptionInfo.endDate
      })

      // If days remaining is >= 0, redirect to dashboard
      // This matches the logic in instance-provider.tsx which redirects to expired page only when days < 0
      // if (subscriptionInfo.daysRemaining >= 0 && !subscriptionInfo.isExpired) {
      //   console.log('Subscription has days >= 0 and is not expired, redirecting to dashboard')
      //   router.push("/dashboard")
      //   setShowPage(false)
      // }
    }
  }, [subscriptionInfo, loading, router])

  // Update subscription status to expired when days remaining is 0
  useEffect(() => {
    // Only proceed if we have subscription info and we haven't already updated the status
    if (!loading && !statusUpdated && !updateLoading) {
      // Check if there are active subscriptions with exactly 0 days remaining
      const subscriptionsToUpdate = activeSubscriptions.filter(sub => {
        // Calculate days remaining for this subscription
        const endDate = new Date(sub.end_date)
        const now = new Date()
        const daysRemaining = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        // Return true if days remaining is 0 and status is still active
        return daysRemaining === 0 && sub.status === 'active'
      })

      // Update each subscription that needs to be updated
      if (subscriptionsToUpdate.length > 0) {
        console.log('Updating subscription status to expired for subscriptions:', subscriptionsToUpdate)

        // Update each subscription one by one
        Promise.all(
          subscriptionsToUpdate.map(sub =>
            updateSubscriptionStatus(sub.id, 'expired')
          )
        )
        .then(() => {
          setStatusUpdated(true)
          console.log('All subscriptions updated to expired')
        })
        .catch(error => {
          console.error('Error updating subscriptions:', error)
        })
      }
    }
  }, [activeSubscriptions, loading, statusUpdated, updateLoading, updateSubscriptionStatus])

  if (!showPage) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="space-y-1 pb-4 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/qee-nano.png"
                alt="QEE Logo"
                width={180}
                height={80}
                className="h-14 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Subscription Expired
            </CardTitle>
            <CardDescription>
              Your QEE subscription has expired or is inactive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              <p className="flex items-start gap-2">
                <Clock className="h-5 w-5 flex-shrink-0" />
                <span>
                  <strong>Your access has been limited.</strong> To continue using all features of QEE, please renew your subscription.
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Why renew?</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Continue managing your business without interruption</li>
                <li>Access to all premium features and updates</li>
              </ul>
            </div>

            {/* <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p className="flex items-start gap-2">
                <CreditCard className="h-5 w-5 flex-shrink-0" />
                <span>
                  <strong>Special offer:</strong> Renew now and get an additional 7 days free with any subscription plan.
                </span>
              </p>
            </div> */}

          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full py-6 bg-[#3435FF] hover:bg-[#2829CC]"
              onClick={() => router.push("/dashboard/billing")}
            >
              Renew Subscription
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/billing")}
            >
              Go to Billing Page
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Need help? Contact <a href="mailto:support@qee.com" className="underline hover:text-primary">support@qee.com</a>
        </p>
      </div>
    </div>
  )
}
