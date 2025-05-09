"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { useSession } from "next-auth/react"
import { calculateSubscriptionInfo, type SubscriptionInfo } from "@/lib/subscription"

export interface Subscription {
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
}

interface UseSubscriptionResult {
  subscriptionInfo: SubscriptionInfo
  activeSubscriptions: Subscription[]
  pendingSubscriptions: Subscription[]
  loading: boolean
  error: Error | null
}

/**
 * Custom hook to fetch and calculate subscription information
 *
 * @returns Subscription information, active and pending subscriptions, loading state, and any errors
 */
export function useSubscription(): UseSubscriptionResult {
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([])
  const [pendingSubscriptions, setPendingSubscriptions] = useState<Subscription[]>([])
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    daysRemaining: 0,
    status: 'inactive',
    endDate: null,
    isExpiring: false,
    isExpired: true, // Default to expired when no subscription
    urgencyLevel: 'none'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = useSupabase()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

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

        if (instanceError && instanceError.code !== 'PGRST116') {
          throw new Error(`Error fetching instance: ${instanceError.message}`)
        }

        if (!instanceData) {
          setLoading(false)
          return
        }

        // Get all subscriptions for this instance
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('instance_id', instanceData.id)
          .order('created_at', { ascending: false })

        if (subscriptionsError) {
          throw new Error(`Error fetching subscriptions: ${subscriptionsError.message}`)
        }

        if (subscriptionsData && subscriptionsData.length > 0) {
          // Find all active subscriptions
          const activeSubsList = subscriptionsData.filter(sub => sub.status === 'active')
          setActiveSubscriptions(activeSubsList)

          // Find all pending subscriptions
          const pendingSubsList = subscriptionsData.filter(sub => sub.status === 'pending')
          setPendingSubscriptions(pendingSubsList)

          // Calculate total days remaining from all active subscriptions
          if (activeSubsList.length > 0) {
            // Sort active subscriptions by end date (ascending)
            const sortedActive = [...activeSubsList].sort((a, b) =>
              new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
            )

            // Get the earliest ending subscription for status display
            const earliestEnding = sortedActive[0]

            // Find the subscription with the latest end date
            const now = new Date()

            // Sort subscriptions by end date (descending)
            const sortedByEndDate = [...activeSubsList].sort((a, b) => {
              const dateA = a.end_date ? new Date(a.end_date).getTime() : 0
              const dateB = b.end_date ? new Date(b.end_date).getTime() : 0
              return dateB - dateA // Descending order (latest first)
            })

            // Get the subscription with the latest end date
            const latestSubscription = sortedByEndDate[0]

            // Calculate days remaining until the latest end date
            let totalDaysRemaining = 0
            if (latestSubscription && latestSubscription.end_date) {
              const latestEndDate = new Date(latestSubscription.end_date)

              // Only calculate if the end date is in the future
              if (latestEndDate > now) {
                totalDaysRemaining = Math.max(0, Math.round((latestEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                console.log(`Using latest subscription end date: ${latestSubscription.end_date}, days remaining: ${totalDaysRemaining}`)
              }
            }

            // Use the latest subscription with days remaining > 0 for status calculation
            // This ensures that if there's any valid subscription, we won't show as expired

            // Find any active subscription with days remaining > 0
            const activeValidSubscriptions = activeSubsList.filter(sub => {
              const endDate = new Date(sub.end_date)
              return endDate > now && sub.status === 'active'
            })

            // If we have any valid active subscriptions, use the latest one for status
            // Otherwise, fall back to the earliest ending subscription
            const subscriptionForStatus = activeValidSubscriptions.length > 0
              ? activeValidSubscriptions.sort((a, b) =>
                  new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
                )[0] // Latest end date
              : earliestEnding

            // Create subscription info based on the appropriate subscription for status
            const baseInfo = calculateSubscriptionInfo(
              subscriptionForStatus.end_date,
              subscriptionForStatus.status
            )

            // Override days remaining with total from all subscriptions
            setSubscriptionInfo({
              ...baseInfo,
              daysRemaining: totalDaysRemaining,
              // Recalculate urgency based on total days
              urgencyLevel:
                totalDaysRemaining <= 1 ? 'high' :
                totalDaysRemaining <= 5 ? 'medium' :
                totalDaysRemaining <= 7 ? 'low' : 'none',
              isExpiring: totalDaysRemaining <= 7,
              // Set isExpired flag based on total days remaining
              // If we have any days remaining > 0, we're not expired
              isExpired: totalDaysRemaining <= 0
            })
          } else {
            // No active subscriptions
            setSubscriptionInfo({
              daysRemaining: 0,
              status: 'inactive',
              endDate: null,
              isExpiring: false,
              isExpired: true, // No active subscriptions means it's expired
              urgencyLevel: 'none'
            })
          }
        }
      } catch (err) {
        console.error('Error in useSubscription hook:', err)
        setError(err instanceof Error ? err : new Error('Unknown error in useSubscription hook'))
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [supabase, session])

  return {
    subscriptionInfo,
    activeSubscriptions,
    pendingSubscriptions,
    loading,
    error
  }
}
