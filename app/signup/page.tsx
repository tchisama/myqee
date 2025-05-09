"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Toaster } from "sonner"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"

import { signupSchema, SignupFormValues } from "./types"
import {
  BackgroundEffects,
  SignupHeader,
  SignupStepper,
  StepContent,
  StepNavigation,
  SignupFooter
} from "./components"
import { useSupabase } from "@/hooks/use-supabase"
import { createSubscription } from "@/lib/subscription"
import { useSession } from "next-auth/react"

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  // const [paymentMethod] = useState("cmi")
  const [isGoogleVerified, setIsGoogleVerified] = useState(false)

  // Initialize form with default values
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      companyName: "",
      // No credit card fields as we're using CMI payment button
    },
  });

  // Fixed price for the service
  const servicePrice = 100;
  const supabase = useSupabase();
  const {data:session} = useSession()

  // Handle form submission
  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);

    const userEmail = session?.user?.email;
    const user = await supabase.from('users').select('id').eq('email', userEmail).single();

    const createInstance = async () => {
      if(!userEmail) return;
      if(!user?.data) return;

      // Insert directly into the instances table
      const { data, error } = await supabase
        .from('instances')
        .insert({
          name: values.companyName,
          logo_url: logoPreview,
          language: 'en',
          owner_id: user.data?.id
        })
        .select();

      if (error) {
        console.error('Error creating instance:', error);
        setIsSubmitting(false);
        toast.error("Failed to create instance");
        return;
      }

      // Create a subscription for the new instance (30 days)
      if (data && data.length > 0) {
        const instanceId = data[0].id;

        // Create or get a pool and assign the instance to it
        try {
          // First check if any pools exist
          const { data: existingPools, error: poolsError } = await supabase
            .from('pools')
            .select('id, instances_number, max_instances')
            .eq('status', 'active')
            .order('instances_number', { ascending: true })
            .limit(1);

          if (poolsError) {
            console.error('Error checking for existing pools:', poolsError);
          }

          let poolId;

          // Check if we need to create a new pool
          let needNewPool = true;

          if (existingPools && existingPools.length > 0) {
            // Check if the existing pool has capacity
            if (existingPools[0].instances_number < existingPools[0].max_instances) {
              // Use existing pool if it has capacity
              poolId = existingPools[0].id;
              console.log('Using existing pool with ID:', poolId,
                'Current capacity:', existingPools[0].instances_number, '/', existingPools[0].max_instances);
              needNewPool = false;
            } else {
              console.log('Existing pool is at capacity:',
                existingPools[0].instances_number, '/', existingPools[0].max_instances);
            }
          } else {
            console.log('No existing pools found');
          }

          // Create a new pool if needed
          if (needNewPool) {
            // Count existing pools to name the new one appropriately
            const { count: poolCount, error: countError } = await supabase
              .from('pools')
              .select('*', { count: 'exact', head: true });

            if (countError) {
              console.error('Error counting pools:', countError);
            }

            const poolNumber = (poolCount || 0) + 1;

            // Create a new pool
            const { data: newPool, error: newPoolError } = await supabase
              .from('pools')
              .insert({
                name: `Production Pool ${poolNumber}`,
                description: 'Automatically created pool',
                server_url: `https://odoo-server-1.example.com`,
                max_instances: 10,
                instances_number: 0,
                status: 'active'
              })
              .select();

            if (newPoolError) {
              console.error('Error creating new pool:', newPoolError);
            } else {
              poolId = newPool[0].id;
              console.log('Created new pool with ID:', poolId, 'Pool number:', poolNumber);
            }
          }

          // Assign instance to pool if we have a pool ID
          if (poolId) {
            // Update the instance with the pool ID
            const { error: updateError } = await supabase
              .from('instances')
              .update({ pool_id: poolId })
              .eq('id', instanceId);

            if (updateError) {
              console.error('Error assigning instance to pool:', updateError);
            } else {
              console.log(`Assigned instance ${instanceId} to pool ${poolId}`);

              // Get the current instances_number for the pool
              const { data: currentPool, error: getPoolError } = await supabase
                .from('pools')
                .select('instances_number, max_instances')
                .eq('id', poolId)
                .single();

              if (getPoolError) {
                console.error('Error getting current pool data:', getPoolError);
              } else {
                // Make sure we don't exceed max_instances
                if (currentPool.instances_number < currentPool.max_instances) {
                  // Update the instances_number in the pool
                  const { error: updatePoolError } = await supabase
                    .from('pools')
                    .update({
                      instances_number: currentPool.instances_number + 1,
                      updated_at: new Date().toISOString()
                    })
                    .eq('id', poolId);

                  if (updatePoolError) {
                    console.error('Error updating pool instances_number:', updatePoolError);
                  } else {
                    console.log(`Updated pool ${poolId} instances_number to ${currentPool.instances_number + 1}`);
                  }
                } else {
                  console.error(`Pool ${poolId} is already at maximum capacity (${currentPool.max_instances}). This should not happen.`);
                }
              }
            }
          }
        } catch (poolError) {
          console.error('Error in pool assignment process:', poolError);
          // Continue anyway, as the instance was created successfully
        }

        // Create subscription using the reusable function
        const result = await createSubscription({
          instanceId: instanceId,
          ownerId: user.data?.id,
          planId: 'standard', // Use standard plan for new signups
          durationId: '30',   // 30 days duration
          supabase
        });

        if (!result.success) {
          console.error('Error creating subscription:', result.error);
          // Continue anyway, as the instance was created successfully
        }
      }

      return data;
    };
      createInstance().then(()=>{
        setIsSubmitting(false);
        toast.success("Account created successfully!", {
          description: "Redirecting you to your dashboard...",
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      })

  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep === 0) {
      // Google sign-in step with OTP verification is handled within the component
      // The Next button will be disabled until OTP verification is complete
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Validate company name before proceeding
      form.trigger("companyName").then((isValid) => {
        if (isValid) setCurrentStep(2);
      });
    } else if (currentStep === 2) {
      // Logo is optional, so we can proceed regardless
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Submit the form on the final step
      form.handleSubmit(onSubmit)();
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 relative">
      {/* Background effects - with lower z-index to ensure it doesn't interfere with inputs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundEffects />
      </div>

      {/* Main content container with higher z-index */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Toaster for notifications */}
        <Toaster position="top-center" />

        {/* Header with logo */}
        <SignupHeader />

        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="pb-2 space-y-2">
            {/* Step indicator */}
            <SignupStepper currentStep={currentStep} />

            {/* Removed titles and descriptions as requested */}
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-2 pt-2">
                {/* Step content */}
                <StepContent
                  currentStep={currentStep}
                  form={form}
                  logoPreview={logoPreview}
                  setLogoPreview={setLogoPreview}
                  servicePrice={servicePrice}
                  onGoogleVerificationComplete={() => setIsGoogleVerified(true)}
                />
              </CardContent>

              <CardFooter>
                {/* Navigation buttons */}
                <StepNavigation
                  currentStep={currentStep}
                  isSubmitting={isSubmitting}
                  goToPreviousStep={goToPreviousStep}
                  goToNextStep={goToNextStep}
                  isGoogleVerified={isGoogleVerified}
                />
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Footer with sign in link */}
        <SignupFooter />
      </div>
    </div>
  )
}