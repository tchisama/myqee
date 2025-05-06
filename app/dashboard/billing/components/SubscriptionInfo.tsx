"use client"

import { useState } from "react"
import {  CreditCard, Shield, Zap, Users, BarChart, Clock, Star, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Mock subscription plans
const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential features for small businesses",
    price: 29,
    icon: Users,
    color: "#6366F1",
    features: [
      { text: "Up to 100 invoices per month", icon: CreditCard },
      { text: "Basic reporting", icon: BarChart },
      { text: "2 team members", icon: Users },
      { text: "Email support", icon: Clock },
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Professional",
    description: "Advanced features for growing businesses",
    price: 79,
    icon: Star,
    color: "#3435FF",
    features: [
      { text: "Unlimited invoices", icon: CreditCard },
      { text: "Advanced reporting", icon: BarChart },
      { text: "10 team members", icon: Users },
      { text: "Priority email support", icon: Clock },
      { text: "Custom templates", icon: Zap },
      { text: "API access", icon: Lock },
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete solution for large organizations",
    price: 199,
    icon: Shield,
    color: "#0F172A",
    features: [
      { text: "Unlimited everything", icon: Zap },
      { text: "24/7 phone support", icon: Clock },
      { text: "Unlimited team members", icon: Users },
      { text: "Custom development", icon: Lock },
      { text: "Dedicated account manager", icon: Users },
      { text: "On-premise deployment option", icon: Shield },
      { text: "Advanced security features", icon: Shield },
    ],
    popular: false,
  },
]

export function SubscriptionInfo() {
  const [currentPlan, setCurrentPlan] = useState("pro")
  const [isChangingPlan, setIsChangingPlan] = useState(false)

  const handleChangePlan = (planId: string) => {
    setIsChangingPlan(true)

    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planId)
      setIsChangingPlan(false)
      toast.success(`Successfully switched to ${plans.find(p => p.id === planId)?.name} plan`)
    }, 1000)
  }

  const currentPlanDetails = plans.find(p => p.id === currentPlan)

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <Card className="overflow-hidden py-0 border-[#3435FF]/10">
        <div className="bg-gradient-to-r from-[#3435FF]/5 to-transparent px-6 py-3 border-b">
          <h3 className="text-lg font-semibold text-[#3435FF]">Current Subscription</h3>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: currentPlanDetails?.color || '#3435FF' }}>
                {currentPlanDetails?.icon && <currentPlanDetails.icon className="h-6 w-6 text-white" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">
                    {currentPlanDetails?.name} Plan
                  </h3>
                  <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Billed monthly at ${currentPlanDetails?.price}/month
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2 border-[#3435FF] text-[#3435FF] hover:bg-[#3435FF]/5"
              onClick={() => setIsChangingPlan(!isChangingPlan)}
            >
              {isChangingPlan ? "Cancel" : "Change Plan"}
            </Button>
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
                  <span className="font-medium">June 15, 2023</span>
                </p>
                <p className="text-sm flex justify-between">
                  <span className="text-muted-foreground">Billing email:</span>
                  <span className="font-medium">billing@yourcompany.com</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex flex-col items-start border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-[#3435FF]" />
            <p>
              Your subscription will automatically renew on June 15, 2023. You can cancel anytime before the renewal date.
            </p>
          </div>
        </CardFooter>
      </Card>

      {/* Plan Selection */}
      {isChangingPlan && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 bg-[#3435FF] rounded-full"></div>
            <h3 className="text-xl font-semibold">Choose a Plan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  plan.id === currentPlan
                    ? 'border-green-500 ring-1 ring-green-500/20'
                    : plan.popular
                      ? 'border-[#3435FF] ring-1 ring-[#3435FF]/20'
                      : 'hover:border-[#3435FF]/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#3435FF] text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: plan.color }}>
                      <plan.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="mb-4">{plan.description}</CardDescription>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3435FF]/10 mt-0.5">
                          <feature.icon className="h-3 w-3 text-[#3435FF]" />
                        </div>
                        <span className="text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.id === currentPlan
                        ? 'bg-green-500 hover:bg-green-600'
                        : plan.popular
                          ? 'bg-[#3435FF] hover:bg-[#3435FF]/90'
                          : 'border-[#3435FF] text-[#3435FF] hover:bg-[#3435FF]/5'
                    }`}
                    variant={plan.id === currentPlan ? "default" : plan.popular ? "default" : "outline"}
                    onClick={() => handleChangePlan(plan.id)}
                    disabled={plan.id === currentPlan || isChangingPlan}
                  >
                    {plan.id === currentPlan ? (
                      <>Current Plan</>
                    ) : (
                      <>Select Plan</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
