"use client"

import { SessionProvider } from "next-auth/react"
import { InstanceProvider } from "./providers/instance-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

// Re-export InstanceProvider for direct imports
export { InstanceProvider }
