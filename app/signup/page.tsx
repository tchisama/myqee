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
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      cardName: "",
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
      const { data, error } = await supabase
        .from('instances')
        .insert({
          owner_id: user.data?.id,
          name: values.companyName,
          logo_url: logoPreview,
          language: 'en',
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

        // Calculate end date (30 days from now)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        // Insert subscription directly
        const { error: directInsertError } = await supabase
          .from('subscriptions')
          .insert({
            instance_id: instanceId,
            owner_id: user.data?.id,
            plan_name: 'pro',
            amount: servicePrice,
            status: 'active',
            start_date: new Date(),
            end_date: endDate
          });

        if (directInsertError) {
          console.error('Error creating subscription:', directInsertError);
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