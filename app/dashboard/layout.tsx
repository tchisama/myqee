import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { InstanceProvider } from "@/components/providers/instance-provider"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <InstanceProvider>
      <div className="flex min-h-screen flex-col bg-muted/20">
        <div className="flex flex-1 relative">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </InstanceProvider>
  )
}
