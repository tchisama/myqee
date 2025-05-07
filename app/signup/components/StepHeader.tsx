"use client"

import { AnimatePresence } from "framer-motion"
import { GoogleSignInStepHeader } from "./GoogleSignInStep"
import { CompanyInfoStepHeader } from "./CompanyInfoStep"
import { LogoUploadStepHeader } from "./LogoUploadStep"
import { PaymentDetailsStepHeader } from "./PaymentDetailsStep"

interface StepHeaderProps {
  currentStep: number
}

export function StepHeader({ currentStep }: StepHeaderProps) {
  return (
    <AnimatePresence mode="wait">
      {currentStep === 0 && <GoogleSignInStepHeader />}
      {currentStep === 1 && <CompanyInfoStepHeader />}
      {currentStep === 2 && <LogoUploadStepHeader />}
      {currentStep === 3 && <PaymentDetailsStepHeader />}
    </AnimatePresence>
  )
}
