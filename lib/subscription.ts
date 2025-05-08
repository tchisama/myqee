import { differenceInDays, parseISO } from "date-fns"

export interface SubscriptionInfo {
  daysRemaining: number
  status: string
  endDate: string | null
  isExpiring: boolean
  isExpired: boolean
  urgencyLevel: 'none' | 'low' | 'medium' | 'high'
}

/**
 * Calculate subscription information including days remaining and urgency level
 *
 * @param endDate - The subscription end date as an ISO string
 * @param status - The subscription status (active, pending, etc.)
 * @returns Subscription information with days remaining and urgency level
 */
export function calculateSubscriptionInfo(
  endDate: string | null,
  status: string = 'inactive'
): SubscriptionInfo {
  // Default values for no subscription
  if (!endDate) {
    return {
      daysRemaining: 0,
      status,
      endDate: null,
      isExpiring: false,
      isExpired: true, // No end date means it's expired
      urgencyLevel: 'none'
    }
  }

  // Calculate days remaining
  const end = parseISO(endDate)
  const now = new Date()
  const daysRemaining = differenceInDays(end, now)

  // Determine urgency level based on days remaining
  let urgencyLevel: 'none' | 'low' | 'medium' | 'high' = 'none'
  let isExpiring = false

  if (daysRemaining <= 1) {
    urgencyLevel = 'high'
    isExpiring = true
  } else if (daysRemaining <= 5) {
    urgencyLevel = 'medium'
    isExpiring = true
  } else if (daysRemaining <= 7) {
    urgencyLevel = 'low'
    isExpiring = true
  }

  // Check if subscription is expired (days <= 0)
  const isExpired = daysRemaining <= 0;

  return {
    daysRemaining,
    status: isExpired ? 'expired' : status, // Override status to 'expired' if days <= 0
    endDate,
    isExpiring,
    isExpired,
    urgencyLevel
  }
}

/**
 * Get CSS classes for subscription status based on urgency level
 *
 * @param urgencyLevel - The urgency level of the subscription
 * @param type - The type of UI element (background, text, border)
 * @returns CSS classes for the specified element type
 */
export function getSubscriptionStatusClasses(
  urgencyLevel: 'none' | 'low' | 'medium' | 'high',
  type: 'bg' | 'text' | 'border' | 'all'
): string {
  const classes = {
    high: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800/30"
    },
    medium: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800/30"
    },
    low: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800/30"
    },
    none: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800/30"
    }
  }

  if (type === 'all') {
    return `${classes[urgencyLevel].bg} ${classes[urgencyLevel].text} ${classes[urgencyLevel].border}`
  }

  return classes[urgencyLevel][type]
}
