import { CreditCard, Users, Star, BarChart, Clock, Zap, Lock } from "lucide-react"

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  icon: React.ElementType
  color: string
  features: {
    text: string
    icon: React.ElementType
  }[]
  popular: boolean
}

// Subscription plans
export const plans: Plan[] = [
  {
    id: "standard",
    name: "Standard",
    description: "All features included",
    price: 100,
    icon: Star,
    color: "#3435FF",
    features: [
      { text: "Unlimited invoices", icon: CreditCard },
      { text: "Advanced reporting", icon: BarChart },
      { text: "Unlimited team members", icon: Users },
      { text: "Priority support", icon: Clock },
      { text: "Custom templates", icon: Zap },
      { text: "API access", icon: Lock },
    ],
    popular: true,
  }
]

// Function to get plan details by ID
export function getPlanById(planId: string): Plan | undefined {
  return plans.find(plan => plan.id === planId)
}

// Function to get plan price by ID
export function getPlanPrice(planId: string): number {
  const plan = getPlanById(planId)
  return plan ? plan.price : 100 // Default to Standard plan price if not found
}

// Subscription duration options (in days)
export const durationOptions = [
  { id: "30", name: "1 Month", days: 30 },
  { id: "90", name: "3 Months", days: 90 },
  { id: "180", name: "6 Months", days: 180 },
  { id: "365", name: "1 Year", days: 365 },
]

// Function to get duration days by ID
export function getDurationDays(durationId: string): number {
  const duration = durationOptions.find(d => d.id === durationId)
  return duration ? duration.days : 30 // Default to 30 days if not found
}
