"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import Link from "next/link"

export function SignupFooter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-6 text-center text-sm text-slate-500"
    >
      <motion.p
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-primary hover:underline transition-colors">
          Sign in
        </Link>
      </motion.p>
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="flex items-center justify-center gap-2 mt-4 text-xs"
      >
        <Shield className="h-3 w-3 text-primary/70" />
        <span>Your payment information is secure and encrypted</span>
      </motion.div>
    </motion.div>
  )
}
