"use client"

import { AnimatePresence } from "framer-motion"
import { GoogleSignInStepDescription } from "./GoogleSignInStep"
import { CompanyInfoStepDescription } from "./CompanyInfoStep"
import { LogoUploadStepDescription } from "./LogoUploadStep"
import { PaymentDetailsStepDescription } from "./PaymentDetailsStep"

interface StepDescriptionProps {
  currentStep: number
}

export function StepDescription({ currentStep }: StepDescriptionProps) {
  return (
    <AnimatePresence mode="wait">
      {currentStep === 0 && <GoogleSignInStepDescription />}
      {currentStep === 1 && <CompanyInfoStepDescription />}
      {currentStep === 2 && <LogoUploadStepDescription />}
      {currentStep === 3 && <PaymentDetailsStepDescription />}
    </AnimatePresence>
  )
}
