"use client"

import { Toaster } from "sonner"

import { BillingDashboard } from "@/app/dashboard/billing/components/BillingDashboard"

export default function BillingPage() {
  return (
    <div className="container mx-auto pb-6">
      <BillingDashboard />
      <Toaster />
    </div>
  )
}
