"use client"

import { useState } from "react"
import { CreditCard, Receipt  } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionInfo } from "./SubscriptionInfo"
import { BillingHistory } from "./BillingHistory"


export function BillingDashboard() {
  const [, setActiveTab] = useState("subscription")

  return (
    <div className="space-y-8">


      <Tabs defaultValue="subscription" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-fit  grid grid-cols-2 md:inline-flex">
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span>Billing History</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionInfo />
        </TabsContent>
        <TabsContent value="history" className="space-y-6">
          <BillingHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
