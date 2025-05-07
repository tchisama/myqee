"use client"

import { motion } from "framer-motion"
import { CreditCard, Lock } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupFormValues } from "../types"

interface PaymentDetailsStepProps {
  form: UseFormReturn<SignupFormValues>
  servicePrice: number
}

export function PaymentDetailsStep({ form, servicePrice }: PaymentDetailsStepProps) {
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
        className="bg-slate-50 p-4 rounded-lg border border-slate-200"
      >
        <div className="flex justify-between items-center ">
          <h3 className="text-base font-medium">Service Subscription</h3>
          <div className="text-2xl font-bold text-primary">{servicePrice} Dh</div>
        </div>
        <p className="text-sm text-slate-600">
          Access to all features of QEE platform with unlimited usage.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-4 pt-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Payment Method</h3>
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
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md text-white font-bold text-xs flex items-center justify-center">
              CMI PAY
            </div>
            <div>
              <p className="font-medium">CMI Payment Gateway</p>
              <p className="text-xs text-slate-500">Secure payment processing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "cardName" as const, label: "Name on Card", placeholder: "John Smith" },
              { name: "cardNumber" as const, label: "Card Number", placeholder: "4242 4242 4242 4242" },
              { name: "cardExpiry" as const, label: "Expiry Date", placeholder: "MM/YY" },
              { name: "cardCvc" as const, label: "CVC", placeholder: "123" }
            ].map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
              >
                <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={field.placeholder} {...formField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded"
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
