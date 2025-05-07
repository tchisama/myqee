"use client"

import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepNavigationProps {
  currentStep: number
  isSubmitting: boolean
  goToPreviousStep: () => void
  goToNextStep: () => void
  isGoogleVerified?: boolean
}

export function StepNavigation({
  currentStep,
  isSubmitting,
  goToPreviousStep,
  goToNextStep,
  isGoogleVerified = false
}: StepNavigationProps) {
  return (
    <div className="flex w-full justify-between border-t border-slate-100 bg-slate-50/50 mt-2 p-2">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 0 || isSubmitting}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          type="button"
          onClick={goToNextStep}
          disabled={isSubmitting || (currentStep === 0 && !isGoogleVerified)}
          className="gap-2"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : currentStep === 3 ? (
            <>
              Complete <Rocket className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Next <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
