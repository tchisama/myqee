"use client"

import { motion } from "framer-motion"
import { LogIn, KeyRound, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp"

interface GoogleSignInStepProps {
  onVerificationComplete?: () => void;
}

export function GoogleSignInStep({ onVerificationComplete }: GoogleSignInStepProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    // This would normally trigger Google OAuth
    // For now, we'll just simulate a loading state
    setTimeout(() => {
      setIsLoading(false)
      setShowOTP(true)
    }, 1500)
  }

  const handleVerifyOTP = () => {
    if (otp.length !== 6) return

    setIsVerifying(true)
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
      if (onVerificationComplete) {
        onVerificationComplete()
      }
    }, 1000)
  }

  return (
    <motion.div
      key="step0-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-2"
    >
      {!showOTP ? (
        // Google Sign-in Button
        <>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button
              className={cn(
                "w-full bg-white text-slate-800 hover:bg-slate-50 border border-slate-200",
                "flex items-center gap-2 shadow-sm transition-all duration-300 hover:shadow px-6 py-3",
                "relative overflow-hidden group"
              )}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-3 text-base">
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                ) : (
                  <LogIn className="h-5 w-5 text-primary" />
                )}
                Sign in with Google
              </span>
            </Button>
          </motion.div>
        </>
      ) : (
        // OTP Verification
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {!isVerified ? (
            <>
              <div className="text-center mb-3">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <KeyRound className="h-6 w-6 text-primary mx-auto mb-2" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="text-slate-500 text-sm"
                >
                  Enter verification code
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mb-3"
              >
                <div className="flex justify-center mb-2">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    containerClassName="gap-2 sm:gap-3"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="text-center"
                >
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6 || isVerifying}
                    className="w-full sm:w-auto px-8"
                  >
                    {isVerifying ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    ) : null}
                    Verify Code
                  </Button>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="text-center text-sm text-slate-500"
              >
                Didn{"'"}t receive a code?{" "}
                <button className="text-primary font-medium hover:underline">
                  Resend
                </button>
              </motion.p>
            </>
          ) : (
            // Verification Success
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-2"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-base font-semibold mb-1"
              >
                Verification Successful
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-slate-500 text-sm"
              >
                Your email has been verified successfully
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export function GoogleSignInStepHeader() {
  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <LogIn className="h-5 w-5 text-primary" />
      Sign In
    </motion.div>
  )
}

export function GoogleSignInStepDescription() {
  return (
    <motion.span
      key="desc0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      Connect with your Google account
    </motion.span>
  )
}
