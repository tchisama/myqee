import { differenceInDays, parseISO, addDays } from "date-fns"
import { SupabaseClient } from '@supabase/supabase-js'
import { getPlanById, getDurationDays } from './plans'

export interface SubscriptionInfo {
  daysRemaining: number
  status: string
  endDate: string | null
  isExpiring: boolean
  isExpired: boolean
  urgencyLevel: 'none' | 'low' | 'medium' | 'high'
}

export interface CreateSubscriptionParams {
  instanceId: number
  ownerId: number
  planId: string
  durationId: string
  supabase: SupabaseClient
}

export interface SubscriptionResult {
  success: boolean
  message: string
  error?: any
  subscription?: {
    instanceId: number
    planName: string
    amount: number
    startDate: string
    endDate: string
    status: string
    hasActiveSubscription: boolean
  }
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
  // Note: We now consider a subscription with exactly 0 days remaining as expired
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

/**
 * Create a new subscription for an instance
 *
 * This function handles:
 * - Checking for existing active subscriptions
 * - Calculating start and end dates based on existing subscriptions
 * - Calculating the total amount based on plan price and duration
 * - Creating the subscription record in the database
 *
 * @param params - Parameters for creating a subscription
 * @returns Result object with success status, message, and subscription details
 */
export async function createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult> {
  const { instanceId, ownerId, planId, durationId, supabase } = params;

  try {
    // Get plan details
    const plan = getPlanById(planId);
    if (!plan) {
      return {
        success: false,
        message: "Plan not found",
        error: new Error("Plan not found")
      };
    }

    // Get duration in days
    const durationDays = getDurationDays(durationId);

    // Calculate end date (initially from today)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // Calculate total amount based on duration (months)
    const months = Math.ceil(durationDays / 30);
    const totalAmount = plan.price * months;

    // Check if the instance already has an active subscription
    const { data: existingSubscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('instance_id', instanceId)
      .eq('status', 'active');

    if (fetchError) {
      return {
        success: false,
        message: "Error checking existing subscriptions",
        error: fetchError
      };
    }

    // Always set status to active
    const subscriptionStatus = 'active';
    let startDate = new Date();
    let calculatedEndDate = endDate;
    let hasActiveSubscription = false;

    if (existingSubscriptions && existingSubscriptions.length > 0) {
      // Get the subscription with the latest end date
      const latestSubscription = existingSubscriptions.reduce((latest, current) => {
        const latestEndDate = latest.end_date ? new Date(latest.end_date) : new Date();
        const currentEndDate = current.end_date ? new Date(current.end_date) : new Date();
        return currentEndDate > latestEndDate ? current : latest;
      }, existingSubscriptions[0]);

      // Check if the latest subscription is still active (end date is in the future)
      if (latestSubscription.end_date) {
        const latestEndDate = new Date(latestSubscription.end_date);
        const now = new Date();

        // Check if the end date is valid and in the future
        if (!isNaN(latestEndDate.getTime())) {
          // If the end date is in the future, consider it active
          if (latestEndDate > now) {
            hasActiveSubscription = true;
            startDate = latestEndDate;

            // Recalculate end date based on the new start date
            calculatedEndDate = new Date(startDate);
            calculatedEndDate.setDate(calculatedEndDate.getDate() + durationDays);
          }
        }
      }
    }

    // Format dates to ISO strings for database storage
    const startDateISO = startDate.toISOString();
    const endDateISO = calculatedEndDate.toISOString();

    // Create subscription
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        instance_id: instanceId,
        owner_id: ownerId,
        plan_name: planId,
        amount: totalAmount,
        status: subscriptionStatus,
        start_date: startDateISO,
        end_date: endDateISO
      });

    if (error) {
      return {
        success: false,
        message: "Failed to create subscription",
        error
      };
    }

    // Return success with subscription details
    return {
      success: true,
      message: hasActiveSubscription
        ? `Created a new ${plan.name} subscription that will start when the current subscription ends.`
        : `Created a new ${plan.name} subscription starting today.`,
      subscription: {
        instanceId,
        planName: planId,
        amount: totalAmount,
        startDate: startDateISO,
        endDate: endDateISO,
        status: subscriptionStatus,
        hasActiveSubscription
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred",
      error
    };
  }
}
