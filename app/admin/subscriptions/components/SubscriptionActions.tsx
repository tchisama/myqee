"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  RefreshCw,
  Calendar,
  Trash2,
  Loader2,
  CalendarIcon
} from "lucide-react"
import { format, addDays } from "date-fns"
import { toast } from "sonner"

import { useSupabase } from "@/hooks/use-supabase"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { durationOptions, getPlanPrice } from "@/lib/plans"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Subscription {
  id: number
  instance_id: number
  owner_id: number
  plan_name: string
  amount: number
  status: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  instance?: {
    name: string
  }
  owner?: {
    name: string
    email: string
    img_url: string
  }
}

interface SubscriptionActionsProps {
  subscription: Subscription
  onActionComplete: () => void
}

export function SubscriptionActions({ subscription, onActionComplete }: SubscriptionActionsProps) {
  const supabase = useSupabase()
  const [loading, setLoading] = useState(false)
  const [extendDialogOpen, setExtendDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState("30")
  const [extensionMode, setExtensionMode] = useState<"preset" | "custom" | "debug">("preset")
  const [debugDaysLeft, setDebugDaysLeft] = useState<number>(30)
  // Initialize custom date with the current subscription end date plus one month
  // This makes it easier to understand the extension logic by starting from the current end date
  const [customDate, setCustomDate] = useState<Date | undefined>(() => {
    // If there's a valid end date in the future, use it as the base
    if (subscription.end_date && new Date(subscription.end_date) > new Date()) {
      const endDate = new Date(subscription.end_date);
      // Add one month to the current end date as default
      endDate.setMonth(endDate.getMonth() + 1);
      return endDate;
    }
    // Otherwise use current date + 1 month
    else {
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 1);
      return defaultDate;
    }
  })

  // Calculate new end date based on selected mode (preset, custom, or debug)
  const calculateNewEndDate = () => {
    // For custom date mode: use the exact date selected
    if (extensionMode === "custom" && customDate) {
      return format(customDate, "MMMM d, yyyy")
    }

    // For debug mode: set end date to today + debug days left
    if (extensionMode === "debug") {
      const debugEndDate = addDays(new Date(), debugDaysLeft)
      return format(debugEndDate, "MMMM d, yyyy")
    }

    // For preset duration mode: add selected duration to current end date
    const duration = durationOptions.find(d => d.id === selectedDuration)
    if (!duration) return "N/A"

    // If there's an existing end date and it's in the future, extend from that date
    const baseDate = subscription.end_date && new Date(subscription.end_date) > new Date()
      ? new Date(subscription.end_date)
      : new Date()

    return format(addDays(baseDate, duration.days), "MMMM d, yyyy")
  }

  // Simple DatePicker component using standard HTML date input
  function DatePicker() {
    // Format date to YYYY-MM-DD for the input value (HTML date input format)
    const formatDateForInput = (date: Date | undefined) => {
      if (!date) return "";
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    // Get tomorrow's date as the minimum selectable date
    // This prevents selecting dates in the past
    const getTomorrowDate = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDateForInput(tomorrow);
    };

    // Get current subscription end date for display
    const getCurrentEndDate = () => {
      if (subscription.end_date) {
        const endDate = new Date(subscription.end_date);
        if (endDate > new Date()) {
          return format(endDate, "MMM d, yyyy");
        }
      }
      return "No active end date";
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={formatDateForInput(customDate)}
            min={getTomorrowDate()}
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (selectedDate) {
                setCustomDate(new Date(selectedDate));
              }
            }}
            className="w-full"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          <span>Current end date: </span>
          <span className="font-medium">{getCurrentEndDate()}</span>
        </div>
      </div>
    );
  }

  // Calculate amount for extension based on selected method (preset duration, custom date, or debug)
  const calculateExtensionAmount = () => {
    // Get the plan price from the plans.ts file using the plan name from the subscription
    const planPrice = getPlanPrice(subscription.plan_name);

    // Step 1: Calculate the extension period based on selected method

    // For debug mode: calculate based on debug days left
    if (extensionMode === "debug") {
      // Convert debug days to months (rounded up)
      const months = Math.ceil(debugDaysLeft / 30);

      // Calculate extension amount based on plan price and debug days
      return Math.round(planPrice * months);
    }

    // For custom date mode: calculate time between current end date and selected date
    if (extensionMode === "custom" && customDate) {
      // Determine base date (current end date if valid, otherwise today)
      const baseDate = subscription.end_date && new Date(subscription.end_date) > new Date()
        ? new Date(subscription.end_date)
        : new Date();

      // Calculate difference in days between base date and custom date
      const diffTimeMs = customDate.getTime() - baseDate.getTime();
      const diffDays = diffTimeMs / (1000 * 60 * 60 * 24);

      // Convert days to months (rounded up)
      const months = Math.ceil(diffDays / 30);

      // Calculate extension amount based on plan price
      return Math.round(planPrice * months);
    }

    // For preset duration mode: use the selected duration option
    const duration = durationOptions.find(d => d.id === selectedDuration);
    if (!duration) return 0;

    // Convert duration days to months (rounded up)
    const months = Math.ceil(duration.days / 30);

    // Calculate extension amount based on plan price and duration
    return Math.round(planPrice * months);
  }

  // Handle status change
  // const handleStatusChange = async (newStatus: string) => {
    // setLoading(true)
    // try {
    //   // Update the subscription status
    //   const { error } = await supabase
    //     .from('subscriptions')
    //     .update({ status: newStatus })
    //     .eq('id', subscription.id)

    //   if (error) throw error

    //   // Show success message
    //   toast.success(`Subscription status changed to ${newStatus}`)

    //   onActionComplete()
    // } catch (error) {
    //   console.error('Error updating subscription status:', error)
    //   toast.error("Failed to update subscription status")
    // } finally {
    //   setLoading(false)
    // }
  // }

  // Handle subscription extension - extends the subscription based on selected method
  const handleExtendSubscription = async () => {
    setLoading(true)
    try {
      let newEndDate: Date;

      // STEP 1: Determine the new end date based on selected extension method

      // Option 1: Debug mode - set end date to today + debug days left
      if (extensionMode === "debug") {
        // Set the end date to today + debug days left
        newEndDate = addDays(new Date(), debugDaysLeft)
      }
      // Option 2: Custom date mode - use the exact date selected by the user
      else if (extensionMode === "custom") {
        if (!customDate) throw new Error("No custom date selected")
        newEndDate = new Date(customDate)
      }
      // Option 3: Preset duration mode - add the selected duration to the current end date
      else {
        const duration = durationOptions.find(d => d.id === selectedDuration)
        if (!duration) throw new Error("Invalid duration selected")

        // Use current end date as base if it's in the future, otherwise use today
        const baseDate = subscription.end_date && new Date(subscription.end_date) > new Date()
          ? new Date(subscription.end_date)
          : new Date()

        // Add the selected duration (in days) to the base date
        newEndDate = new Date(baseDate)
        newEndDate.setDate(newEndDate.getDate() + duration.days)
      }

      // STEP 2: Calculate the additional amount for the extension period
      const extensionAmount = calculateExtensionAmount()

      // STEP 3: Update the subscription in the database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          end_date: newEndDate.toISOString(),  // Set the new end date
          status: 'active',                     // Ensure the subscription is active
          amount: subscription.amount + extensionAmount,  // Add the extension amount to the original amount
          plan_name: subscription.plan_name     // Keep the same plan
        })
        .eq('id', subscription.id)

      if (error) throw error

      // STEP 4: Show success message and refresh the subscriptions list
      toast.success(`Subscription extended until ${format(newEndDate, "MMMM d, yyyy")}`)
      setExtendDialogOpen(false)
      onActionComplete()
    } catch (error) {
      console.error('Error extending subscription:', error)
      toast.error("Failed to extend subscription")
    } finally {
      setLoading(false)
    }
  }

  // Handle subscription deletion
  const handleDeleteSubscription = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscription.id)

      if (error) throw error

      toast.success("Subscription deleted successfully")
      setDeleteDialogOpen(false)
      onActionComplete()
    } catch (error) {
      console.error('Error deleting subscription:', error)
      toast.error("Failed to delete subscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* {subscription.status !== 'active' && (
            <DropdownMenuItem
              onClick={() => handleStatusChange('active')}
              disabled={loading}
            >
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Activate
            </DropdownMenuItem>
          )} */}

          {/* {subscription.status !== 'cancelled' && (
            <DropdownMenuItem
              onClick={() => handleStatusChange('cancelled')}
              disabled={loading}
            >
              <Ban className="mr-2 h-4 w-4 text-orange-500" />
              Cancel
            </DropdownMenuItem>
          )} */}

          <DropdownMenuItem
            onClick={() => setExtendDialogOpen(true)}
            disabled={loading}
          >
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            Extend
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            disabled={loading}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-400" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Extend Subscription Dialog */}
      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Subscription</DialogTitle>
            <DialogDescription>
              Extend the subscription for {subscription.instance?.name || `Instance #${subscription.instance_id}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Tabs
              defaultValue="preset"
              value={extensionMode}
              onValueChange={(value) => setExtensionMode(value as "preset" | "custom" | "debug")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preset">Preset</TabsTrigger>
                <TabsTrigger value="custom">Custom Date</TabsTrigger>
                <TabsTrigger value="debug">Debug</TabsTrigger>
              </TabsList>

              <TabsContent value="preset" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Select
                    value={selectedDuration}
                    onValueChange={setSelectedDuration}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((duration) => (
                        <SelectItem key={duration.id} value={duration.id}>
                          {duration.name} ({duration.days} days)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select End Date</label>
                  <DatePicker />
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p>
                      Choose a specific date when the subscription should end.
                    </p>
                    <p>
                      The extension amount will be calculated based on the time between the
                      current end date and your selected date.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="debug" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Days Left for Subscription</label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="number"
                        step="1"
                        value={debugDaysLeft}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                          setDebugDaysLeft(value);
                        }}
                        className="w-full"
                      />
                      <span className="text-sm">days</span>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 bg-amber-50 text-amber-900">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <span>Debug Mode</span>
                    </h4>
                    <div className="text-xs mt-1 space-y-1">
                      <p>
                        This mode allows you to set exactly how many days are left for the subscription.
                      </p>
                      <p>
                        The new end date will be calculated as: <span className="font-medium">Today + Days Left</span>
                      </p>
                      <p>
                        You can use negative values to set an expired subscription in the past.
                      </p>
                      <p>
                        This is useful for testing different subscription scenarios.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="rounded-lg border p-4 bg-muted/30">
              <h4 className="font-medium mb-2 text-sm">Extension Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">
                    {subscription.plan_name} ({getPlanPrice(subscription.plan_name)} dh/month)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current End Date:</span>
                  <span className="font-medium">
                    {subscription.end_date
                      ? format(new Date(subscription.end_date), "MMM d, yyyy")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New End Date:</span>
                  <span className="font-medium">{calculateNewEndDate()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Extension Amount:</span>
                  <span className="text-primary">{calculateExtensionAmount()} dh</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExtendDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExtendSubscription}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Extend Subscription
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the subscription for {subscription.instance?.name || `Instance #${subscription.instance_id}`}.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubscription}
              disabled={loading}
              variant="destructive"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
