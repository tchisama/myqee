"use client"

import { motion } from "framer-motion"
import { Building2 } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupFormValues } from "../types"

interface CompanyInfoStepProps {
  form: UseFormReturn<SignupFormValues>
}

export function CompanyInfoStep({ form }: CompanyInfoStepProps) {
  return (
    <motion.div
      key="step1-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-sm font-medium">Company Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your company name"
                {...field}
                className="h-9"
              />
            </FormControl>
            <FormDescription className="text-xs">
              This will be displayed on your invoices and documents.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  )
}

export function CompanyInfoStepHeader() {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <Building2 className="h-5 w-5 text-primary" />
      Company Information
    </motion.div>
  )
}

export function CompanyInfoStepDescription() {
  return (
    <motion.span
      key="desc1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      Enter your company details to get started
    </motion.span>
  )
}
