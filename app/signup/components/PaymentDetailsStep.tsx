"use client"

import { motion } from "framer-motion"
import { CreditCard, Lock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentDetailsStepProps {
  servicePrice: number
}

export function PaymentDetailsStep({ servicePrice }: PaymentDetailsStepProps) {
  return (
    <motion.div
      key="step3-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-slate-50 p-2 rounded-lg border border-slate-200"
      >
        <div className="flex justify-between items-center ">
          <h3 className="text-sm font-medium">Service Subscription</h3>
          <div className="text-lg font-bold text-primary">{servicePrice} Dh</div>
        </div>
        <p className="text-xs text-slate-600">
          Access to all features of Qee-nano platform with unlimited usage.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-2 pt-2"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Payment Method</h3>
          <div className="flex items-center gap-2">
            <div className="h-6 w-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-[10px] text-white font-bold flex items-center justify-center">
              CMI
            </div>
            <span className="text-sm font-medium">Centre Monétique Interbancaire</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="border rounded-lg p-4 bg-white"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md text-white font-bold text-xs flex items-center justify-center">
              CMI
            </div>
            <div>
              <p className="text-sm font-medium">CMI Payment Gateway</p>
              <p className="text-xs text-slate-500">Secure payment processing</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <p className="text-sm text-center text-slate-600">
              Click the button below to complete your payment securely through the CMI payment gateway.
            </p>

            <Button
              type="button"
              className="w-full md:w-2/3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Pay with CMI
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>

            <p className="text-xs text-center text-slate-500">
              You will be redirected to the secure CMI payment page to complete your transaction.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded"
          >
            <Lock className="h-3 w-3 text-primary/70" />
            <span>Your payment is processed securely through CMI{"'"}s encrypted gateway</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function PaymentDetailsStepHeader() {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <CreditCard className="h-5 w-5 text-primary" />
      Payment Details
    </motion.div>
  )
}

export function PaymentDetailsStepDescription() {
  return (
    <motion.span
      key="desc3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      Choose a plan and enter your payment details
    </motion.span>
  )
}
