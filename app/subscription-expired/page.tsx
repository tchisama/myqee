import { SubscriptionExpiredContent } from "./components/subscription-expired-content"

export const metadata = {
  title: "Subscription Expired | QEE",
  description: "Your QEE subscription has expired. Renew now to continue using the service.",
}

export default function SubscriptionExpiredPage() {
  return <SubscriptionExpiredContent />
}
