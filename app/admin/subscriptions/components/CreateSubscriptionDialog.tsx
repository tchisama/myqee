"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, addDays } from "date-fns"
import { CreditCard, Plus, Loader2  } from "lucide-react"

import { useSupabase } from "@/hooks/use-supabase"
import { plans, durationOptions, getPlanById } from "@/lib/plans"
import { createSubscription } from "@/lib/subscription"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define the form schema with Zod
const formSchema = z.object({
  instanceId: z.string({
    required_error: "Please select an instance",
  }),
  planId: z.string({
    required_error: "Please select a plan",
  }),
  durationId: z.string({
    required_error: "Please select a duration",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface Instance {
  id: number
  name: string
  logo_url: string
  owner_id: number
  owner?: {
    id: number
    name: string
    email: string
    img_url: string
  }
}

export function CreateSubscriptionDialog({ onSubscriptionCreated }: { onSubscriptionCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingInstances, setFetchingInstances] = useState(true)
  const supabase = useSupabase()

  // State to track if the selected instance already has an active subscription
  const [activeSubscription, setActiveSubscription] = useState<any>(null)

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planId: "standard",
      durationId: "30",
    },
  })

  // Watch for changes to calculate preview
  const selectedPlanId = form.watch("planId")
  const selectedDurationId = form.watch("durationId")
  const selectedInstanceId = form.watch("instanceId")

  // Get selected instance details
  const selectedInstance = instances.find(
    (instance) => instance.id.toString() === selectedInstanceId
  )

  // Get selected plan details
  const selectedPlan = getPlanById(selectedPlanId)

  // Check if the selected instance has an active subscription
  useEffect(() => {
    if (selectedInstanceId) {
      const checkActiveSubscription = async () => {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('instance_id', selectedInstanceId)
          .eq('status', 'active')
          .order('end_date', { ascending: false })

        if (error) {
          console.error('Error checking active subscriptions:', error)
          return
        }

        if (data && data.length > 0) {
          // Find the subscription with the latest end date that's still in the future
          const now = new Date();
          const activeSubscriptions = data.filter(sub => {
            if (!sub.end_date) return false;

            const endDate = new Date(sub.end_date);
            // Check if end date is valid and in the future
            return !isNaN(endDate.getTime()) && endDate > now;
          });

          if (activeSubscriptions.length > 0) {
            // Sort by end date (descending) to get the one that ends last
            const sortedActive = [...activeSubscriptions].sort((a, b) => {
              const dateA = new Date(a.end_date).getTime();
              const dateB = new Date(b.end_date).getTime();
              return dateB - dateA; // Descending order
            });

            // Store the active subscription with the latest end date
            setActiveSubscription(sortedActive[0]);
            console.log('Found active subscription with future end date:', sortedActive[0].end_date);
          } else {
            console.log('No active subscriptions with future end dates found');
            setActiveSubscription(null);
          }
        } else {
          setActiveSubscription(null);
        }
      }

      checkActiveSubscription()
    } else {
      setActiveSubscription(null)
    }
  }, [selectedInstanceId, supabase])

  // Calculate end date based on duration and active subscription
  const calculateEndDate = () => {
    const duration = durationOptions.find((d) => d.id === selectedDurationId)
    if (!duration) return "N/A"

    // If there's an active subscription, calculate from its end date
    if (activeSubscription && activeSubscription.end_date) {
      const startDate = new Date(activeSubscription.end_date)
      return format(addDays(startDate, duration.days), "MMMM d, yyyy")
    }

    // Otherwise calculate from today
    return format(addDays(new Date(), duration.days), "MMMM d, yyyy")
  }

  // Calculate total amount based on plan price and duration
  const calculateTotalAmount = () => {
    if (!selectedPlan) return 0

    const duration = durationOptions.find((d) => d.id === selectedDurationId)
    if (!duration) return selectedPlan.price

    // Calculate months (rounded up)
    const months = Math.ceil(duration.days / 30)
    return selectedPlan.price * months
  }

  // Fetch instances from Supabase
  useEffect(() => {
    const fetchInstances = async () => {
      setFetchingInstances(true)

      // Get instances with owner information
      const { data, error } = await supabase
        .from('instances')
        .select(`
          *,
          owner:users(id, name, email, img_url)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching instances:', error)
        toast.error("Failed to load instances. Please try again.")
      } else {
        setInstances(data || [])
      }

      setFetchingInstances(false)
    }

    if (open) {
      fetchInstances()
    }
  }, [supabase, open])

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setLoading(true)

    try {
      const instance = instances.find(i => i.id.toString() === values.instanceId)
      if (!instance || !instance.owner) {
        throw new Error("Instance or owner information not found")
      }

      // Call the createSubscription function from lib
      const result = await createSubscription({
        instanceId: instance.id,
        ownerId: instance.owner.id,
        planId: values.planId,
        durationId: values.durationId,
        supabase
      });

      if (!result.success) {
        throw result.error || new Error(result.message);
      }

      // Get plan for display purposes
      const plan = getPlanById(values.planId);

      // Show success message
      if (result.subscription?.hasActiveSubscription) {
        const activeEndDate = format(new Date(result.subscription.startDate), "MMM d, yyyy");
        toast.success(`Created an active ${plan?.name} subscription for ${instance.name} (${result.subscription.amount} dh). Will start on ${activeEndDate} when the current subscription ends.`)
      } else {
        toast.success(`Successfully created an active ${plan?.name} subscription for ${instance.name} (${result.subscription?.amount} dh). Starting today.`)
      }

      // Reset form and close dialog
      form.reset({
        planId: "standard",
        durationId: "30",
      })
      setOpen(false)

      // Refresh subscriptions list
      onSubscriptionCreated()
    } catch (error) {
      console.error('Error creating subscription:', error)
      toast.error("Failed to create subscription. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Subscription</DialogTitle>
          <DialogDescription>
            Add a new subscription for an existing instance.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="instanceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instance</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={fetchingInstances}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an instance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fetchingInstances ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : instances.length > 0 ? (
                        instances.map((instance) => (
                          <SelectItem
                            key={instance.id}
                            value={instance.id.toString()}
                            className="py-3"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={instance.logo_url || ""} alt={instance.name} />
                                <AvatarFallback className="text-xs">
                                  {instance.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span>{instance.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {instance.owner?.email || "Unknown owner"}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                          No instances found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Plan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem
                          key={plan.id}
                          value={plan.id}
                          className="py-3"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-6 w-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: plan.color }}
                            >
                              <plan.icon className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span>{plan.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {plan.price} dh/month
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {durationOptions.map((duration) => (
                        <SelectItem
                          key={duration.id}
                          value={duration.id}
                        >
                          {duration.name} ({duration.days} days)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedInstance && selectedPlan && (
              <div className="rounded-lg border p-4 bg-muted/30">
                <h4 className="font-medium mb-2 text-sm">Subscription Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instance:</span>
                    <span className="font-medium">{selectedInstance.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-medium">{selectedInstance.owner?.name || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Price:</span>
                    <span className="font-medium">{selectedPlan.price} dh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {durationOptions.find(d => d.id === selectedDurationId)?.name || "1 Month"}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span className="text-primary">{calculateTotalAmount()} dh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">
                      {activeSubscription && activeSubscription.end_date
                        ? format(new Date(activeSubscription.end_date), "MMMM d, yyyy")
                        : format(new Date(), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">{calculateEndDate()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-green-500">
                      Active
                    </span>
                  </div>

                  {activeSubscription && (
                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                      <p>This instance already has an active subscription until {format(new Date(activeSubscription.end_date), "MMMM d, yyyy")}.</p>
                      <p>The new subscription will:</p>
                      <ul className="list-disc ml-4 mt-1">
                        <li>Be created with an &quot;active&quot; status</li>
                        <li>Start automatically when the current subscription ends</li>
                        <li>Have its duration calculated from the current subscription&apos;s end date</li>
                      </ul>
                    </div>
                  )}

                  {/* Show message for expired subscriptions */}
                  {selectedInstanceId && !activeSubscription && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      <p>This instance has no active subscriptions or all subscriptions have expired.</p>
                      <p>The new subscription will:</p>
                      <ul className="list-disc ml-4 mt-1">
                        <li>Be created with an &quot;active&quot; status</li>
                        <li>Start immediately (today)</li>
                        <li>Have its duration calculated from today&apos;s date</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !form.formState.isValid}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Create Subscription
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
