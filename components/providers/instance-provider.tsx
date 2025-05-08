"use client"

import { useEffect, useState, createContext, useContext } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useSupabase } from "@/hooks/use-supabase"
import { Loader2, AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSubscription } from "@/hooks/use-subscription"
import { type SubscriptionInfo } from "@/lib/subscription"

interface InstanceContextType {
  subscriptionInfo: SubscriptionInfo
}

const InstanceContext = createContext<InstanceContextType>({
  subscriptionInfo: {
    daysRemaining: 0,
    status: 'inactive',
    endDate: null,
    isExpiring: false,
    isExpired: true, // Default to expired
    urgencyLevel: 'none'
  }
})

export const useInstance = () => useContext(InstanceContext)

interface InstanceProviderProps {
  children: React.ReactNode
}

export function InstanceProvider({ children }: InstanceProviderProps) {
  const { data: session, status } = useSession()
  const supabase = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasInstance, setHasInstance] = useState(false)
  const { subscriptionInfo, loading: subscriptionLoading } = useSubscription()

  // Calculate if subscription is expired or inactive - do this before any conditional returns
  // Check both the days remaining and the actual end date to determine if expired
  const isSubscriptionExpired = !loading && !subscriptionLoading && hasInstance && (
    // Check if days remaining is 0 or less
    subscriptionInfo.daysRemaining <= 0 ||
    // Check if end date is in the past
    (subscriptionInfo.endDate && new Date(subscriptionInfo.endDate) < new Date()) ||
    // Check status
    subscriptionInfo.status === 'inactive' ||
    subscriptionInfo.status === 'expired'
  )

  // Debug log to help troubleshoot
  console.log('Subscription status:', {
    daysRemaining: subscriptionInfo.daysRemaining,
    status: subscriptionInfo.status,
    endDate: subscriptionInfo.endDate,
    endDatePassed: subscriptionInfo.endDate ? new Date(subscriptionInfo.endDate) < new Date() : null,
    isExpiring: subscriptionInfo.isExpiring,
    urgencyLevel: subscriptionInfo.urgencyLevel,
    isSubscriptionExpired
  })

  // First useEffect - check if user has instances
  useEffect(() => {
    const checkUserInstance = async () => {
      // If not authenticated or still loading session, don't do anything yet
      if (status === "loading") return

      // If not authenticated, redirect to signin
      if (status === "unauthenticated") {
        router.push("/signin")
        return
      }

      // If authenticated, check if user has instances
      if (session?.user?.email) {
        try {
          setLoading(true)

          // First get the user ID
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single()

          if (userError || !userData) {
            console.error("Error fetching user:", userError)
            setLoading(false)
            return
          }

          // Then check if user has any instances
          const { data: instanceData, error: instanceError } = await supabase
            .from('instances')
            .select('id')
            .eq('owner_id', userData.id)
            .single()

          if (instanceError && instanceError.code !== 'PGRST116') {
            // PGRST116 is the error code for "no rows returned" which is expected if no instance exists
            console.error("Error fetching instance:", instanceError)
          }

          // If no instance found, redirect to signup
          if (!instanceData) {
            console.log("No instance found, redirecting to signup")
            router.push("/signup")
            return
          }

          // User has an instance, allow access to dashboard
          setHasInstance(true)
        } catch (error) {
          console.error("Error in instance check:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    checkUserInstance()
  }, [session, status, supabase, router])

  // Get current pathname using Next.js hook for reliable route change detection
  const pathname = usePathname();

  // Second useEffect - handle subscription expiration
  useEffect(() => {
    // Only proceed if we're done loading and the user has an instance
    if (loading || subscriptionLoading || !hasInstance) {
      return
    }

    // Force redirect for expired subscriptions based on:
    // 1. The isSubscriptionExpired flag (which checks days, end date, and status)
    // 2. Explicitly check end date is in the past (as a backup)
    const endDateExpired = subscriptionInfo.endDate && new Date(subscriptionInfo.endDate) < new Date();

    const shouldRedirect =
      // Either the calculated flag is true
      isSubscriptionExpired ||
      // Or explicitly check if end date is in the past
      endDateExpired;

    // If subscription is expired, redirect to subscription expired page
    // But only if we're not already on the subscription expired page or billing page
    if (shouldRedirect && typeof window !== 'undefined') {
      if (!pathname?.includes('/subscription-expired') && !pathname?.includes('/dashboard/billing')) {
        console.log('Redirecting to subscription expired page - End date expired:', endDateExpired, 'Current path:', pathname);
        router.push('/subscription-expired');
      }
    }
  }, [
    isSubscriptionExpired,
    subscriptionInfo.endDate,
    subscriptionInfo.daysRemaining,
    hasInstance,
    loading,
    subscriptionLoading,
    router,
    pathname // Add pathname to dependencies to recheck on navigation
  ])

  // Show loading state while checking
  if (loading || subscriptionLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If user has no instance, return null (will be redirected to signup by the earlier code)
  if (!hasInstance) {
    return null
  }

  // If subscription is expired (by any criteria), immediately redirect to subscription expired page
  // But only if we're not already on the subscription expired page or billing page
  const endDateExpired = subscriptionInfo.endDate && new Date(subscriptionInfo.endDate) < new Date();
  const immediateRedirectNeeded = (isSubscriptionExpired || endDateExpired) && typeof window !== 'undefined';

  if (immediateRedirectNeeded) {
    if (!pathname?.includes('/subscription-expired') && !pathname?.includes('/dashboard/billing')) {
      console.log('Immediate redirect to subscription expired page - End date expired:', endDateExpired, 'Current path:', pathname);

      // Use window.location for a hard redirect instead of router.push
      window.location.href = '/subscription-expired';

      // Show loading while redirecting
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  }

  // Render subscription notice and children if user has an instance
  return (
    <InstanceContext.Provider value={{ subscriptionInfo }}>
      {/* Show notice for expiring (but not yet expired) subscriptions */}
      {subscriptionInfo.isExpiring && !subscriptionInfo.isExpired && (
        <div className={cn(
          "sticky top-0 z-50 w-full p-2 text-center text-sm font-medium text-white",
          subscriptionInfo.urgencyLevel === 'high' ? "bg-red-500" :
          subscriptionInfo.urgencyLevel === 'medium' ? "bg-orange-500" :
          "bg-amber-500"
        )}>
          {subscriptionInfo.urgencyLevel === 'high' ? (
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Your subscription expires today! Visit the billing page to renew.</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Your subscription expires in {subscriptionInfo.daysRemaining} days. Visit the billing page to renew.</span>
            </div>
          )}
        </div>
      )}

      {/* Show notice for expired subscriptions */}
      {subscriptionInfo.isExpired && pathname?.includes('/dashboard/billing') && (
        <div className="sticky top-0 z-50 w-full p-2 text-center text-sm font-medium text-white bg-red-600">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Your subscription has expired! Please renew to continue using all features.</span>
          </div>
        </div>
      )}
      {children}
    </InstanceContext.Provider>
  )
}
