"use client"

import { useState } from "react"

interface UpdateSubscriptionOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Custom hook to update subscription status
 */
export function useUpdateSubscription(options?: UpdateSubscriptionOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Update a subscription's status
   * 
   * @param subscriptionId - The ID of the subscription to update
   * @param newStatus - The new status to set (e.g., 'active', 'expired')
   */
  const updateSubscriptionStatus = async (subscriptionId: number, newStatus: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscriptions/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update subscription status')
      }

      if (options?.onSuccess) {
        options.onSuccess()
      }

      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error updating subscription')
      setError(error)
      
      if (options?.onError) {
        options.onError(error)
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    updateSubscriptionStatus,
    loading,
    error,
  }
}
