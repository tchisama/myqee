"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle,  ArrowRight } from "lucide-react"
import Image from "next/image"
import { useSubscription } from "@/hooks/use-subscription"
import { useEffect, useState } from "react"

export function SubscriptionExpiredContent() {
  const router = useRouter()
  const { activeSubscriptions, loading } = useSubscription()
  const [showPage, setShowPage] = useState(true)

  // Check if we should show this page
  useEffect(() => {
    // If there are active subscriptions with days remaining > 0, redirect to dashboard
    if (!loading && activeSubscriptions.some(sub => {
      const endDate = sub.end_date ? new Date(sub.end_date) : null
      const now = new Date()

      // Calculate days remaining
      const daysRemaining = endDate && endDate > now
        ? Math.max(0, Math.round((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0

      console.log(`Subscription check in expired page: ID ${sub.id}, days: ${daysRemaining}`)

      // Only redirect if there are more than 0 days remaining
      return daysRemaining > 0
    })) {
      console.log('Active subscription with days > 0 found, redirecting to dashboard')
      router.push("/dashboard")
      setShowPage(false)
    }
  }, [activeSubscriptions, loading, router])

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
            {/* <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button> */}
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Need help? Contact <a href="mailto:support@qee.com" className="underline hover:text-primary">support@qee.com</a>
        </p>
      </div>
    </div>
  )
}
