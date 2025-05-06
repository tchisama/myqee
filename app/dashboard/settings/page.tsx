"use client"

import { Toaster } from "sonner"

import { SettingsForm } from "@/app/dashboard/settings/components/SettingsForm"


export default function SettingsPage() {
  return (
    <div className="container mx-auto pb-6">
      <SettingsForm />
      <Toaster />
    </div>
  )
}

