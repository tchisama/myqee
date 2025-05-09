"use client"

import { AnimatePresence } from "framer-motion"
import { UseFormReturn } from "react-hook-form"
import { SignupFormValues } from "../types"
import { GoogleSignInStep } from "./GoogleSignInStep"
import { CompanyInfoStep } from "./CompanyInfoStep"
import { LogoUploadStep } from "./LogoUploadStep"
import { PaymentDetailsStep } from "./PaymentDetailsStep"

interface StepContentProps {
  currentStep: number
  form: UseFormReturn<SignupFormValues>
  logoPreview: string | null
  setLogoPreview: (logo: string | null) => void
  servicePrice: number
  onGoogleVerificationComplete?: () => void
}

export function StepContent({
  currentStep,
  form,
  logoPreview,
  setLogoPreview,
  servicePrice,
  onGoogleVerificationComplete
}: StepContentProps) {
  return (
    <AnimatePresence mode="wait">
      {/* Step 0: Google Sign In */}
      {currentStep === 0 && <GoogleSignInStep onVerificationComplete={onGoogleVerificationComplete} />}

      {/* Step 1: Company Information */}
      {currentStep === 1 && <CompanyInfoStep form={form} />}

      {/* Step 2: Logo Upload */}
      {currentStep === 2 && <LogoUploadStep logoPreview={logoPreview} setLogoPreview={setLogoPreview} />}

      {/* Step 3: Payment Details */}
      {currentStep === 3 && <PaymentDetailsStep servicePrice={servicePrice} />}
    </AnimatePresence>
  )
}
