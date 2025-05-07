"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

interface SignupStepperProps {
  currentStep: number
}

export function SignupStepper({ currentStep }: SignupStepperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <div className="flex justify-between">
        {[0, 1, 2, 3].map((step) => (
          <motion.div
            key={step}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * step }}
          >
            <motion.div
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2
                ${currentStep === step
                  ? 'border-primary bg-primary text-white'
                  : currentStep > step
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-300 bg-white text-slate-400'}`}
              animate={{
                scale: currentStep === step ? [1, 1.1, 1] : 1,
                backgroundColor: currentStep === step
                  ? 'rgb(52, 53, 255)'
                  : currentStep > step
                    ? 'rgba(52, 53, 255, 0.1)'
                    : 'rgb(255, 255, 255)',
                borderColor: currentStep >= step ? 'rgb(52, 53, 255)' : 'rgb(203, 213, 225)'
              }}
              transition={{
                duration: 0.4,
                scale: { duration: 0.3 }
              }}
            >
              <AnimatePresence mode="wait">
                {currentStep > step ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="number"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.span
              className={`mt-1 text-xs font-medium`}
              animate={{
                color: currentStep >= step ? 'rgb(52, 53, 255)' : 'rgb(148, 163, 184)'
              }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 ? 'Sign In' : step === 1 ? 'Company' : step === 2 ? 'Logo' : 'Payment'}
            </motion.span>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 rounded"></div>
        <motion.div
          className="absolute top-0 left-0 h-1 bg-primary rounded"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>
    </motion.div>
  )
}
